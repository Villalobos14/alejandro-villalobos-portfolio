/*
 * Calcifer, the canonical model. Run `node scripts/calcifer-model.mjs` to
 * rewrite, in design/calcifer/:
 *   calcifer-world-neutral.png     48x48, the source of truth for the world form
 *   calcifer-world-neutral-32.png  the same model at 32x32, for comparison
 *   calcifer-glyph-neutral.png     32x32, the same character compressed into the "o"
 * each with an 8x nearest-neighbour copy for review. Every animation frame
 * (scripts/calcifer-sprites.mjs) is this model drawn in a different pose.
 *
 * The shapes are traced from design/calcifer/calcifer-soft-reference.png:
 * every profile below is that drawing measured row by row (x as a share of
 * the body's half-width from its centre, s from the tip down) and lightly
 * smoothed. The palette and the banding come from
 * calcifer-pixel-reference.png: a thick red-orange shell, an orange band, a
 * one-pixel light-orange band and a pale yellow core, with white eyes and a
 * pink mouth and no outline anywhere. He has no arms: a flame, nothing else.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { encodePng, hex, renderSheet, upscale } from "./lib/png.mjs";

export const PALETTE = {
  R: hex("#f5482b"), // red-orange shell
  O: hex("#f9923a"), // orange
  o: hex("#fbb24e"), // light orange, one pixel between orange and yellow
  Y: hex("#fdd651"), // warm yellow core
  W: hex("#fdfcf5"), // eyes
  K: hex("#1c1012"), // pupils, closed eyes
  P: hex("#f28c9a"), // mouth
};

/* ---------- traced shapes ---------- */

/*
 * The body: [s, left, right]. A narrow spire over the top fifth, then a broad
 * dome that keeps widening to its fullest a little below the middle, and a
 * rounded, slightly right-heavy base. Measured width/height: 0.87.
 */
const BODY = [
  [0.0, -0.03, 0.07],
  [0.04, -0.1, 0.1],
  [0.08, -0.15, 0.14],
  [0.12, -0.21, 0.19],
  [0.16, -0.3, 0.27],
  [0.2, -0.48, 0.5],
  [0.23, -0.57, 0.62],
  [0.27, -0.62, 0.68],
  [0.31, -0.66, 0.73],
  [0.35, -0.74, 0.79],
  [0.39, -0.81, 0.82],
  [0.43, -0.85, 0.87],
  [0.47, -0.91, 0.92],
  [0.51, -0.96, 0.94],
  [0.55, -0.99, 0.98],
  [0.59, -1, 1],
  [0.63, -1, 1],
  [0.67, -0.97, 1],
  [0.71, -0.93, 1],
  [0.75, -0.91, 0.99],
  [0.79, -0.89, 0.96],
  [0.83, -0.84, 0.92],
  [0.87, -0.77, 0.88],
  [0.91, -0.7, 0.82],
  [0.94, -0.62, 0.75],
  [0.97, -0.45, 0.62],
  [1, -0.15, 0.3],
];

/** The secondary flame on the upper right, and the small step on the left shoulder: [x, s, rx, rs]. */
const LOBES = [
  [0.43, 0.19, 0.18, 0.095],
  [-0.48, 0.215, 0.12, 0.045],
];

/** Where the spire ends and the dome begins. */
const SPIRE = 0.2;

/*
 * Where the red shell gives way to orange: nothing above 0.36 (the whole
 * dome is red), then an egg that fills the lower body and reaches the edge
 * at the base. Traced, then widened about 12% so the warm body reads first.
 */
const ORANGE = [
  [0.36, -0.02, 0.1],
  [0.4, -0.18, 0.3],
  [0.44, -0.3, 0.45],
  [0.48, -0.4, 0.55],
  [0.52, -0.48, 0.62],
  [0.56, -0.54, 0.66],
  [0.6, -0.58, 0.7],
  [0.64, -0.6, 0.73],
  [0.7, -0.62, 0.74],
  [0.76, -0.62, 0.72],
  [0.82, -0.63, 0.7],
  [0.88, -0.68, 0.7],
  [0.94, -0.66, 0.72],
  [1, -0.5, 0.6],
];

/** The yellow core: an egg from just below the middle almost to the base, widest at eye level. Widened as above. */
const YELLOW = [
  [0.45, 0, 0.1],
  [0.49, -0.15, 0.25],
  [0.53, -0.25, 0.38],
  [0.57, -0.32, 0.45],
  [0.61, -0.4, 0.52],
  [0.65, -0.48, 0.57],
  [0.69, -0.55, 0.62],
  [0.73, -0.57, 0.66],
  [0.77, -0.54, 0.62],
  [0.81, -0.46, 0.59],
  [0.85, -0.4, 0.55],
  [0.89, -0.36, 0.48],
  [0.93, -0.25, 0.32],
  [0.96, -0.1, 0.12],
];

/*
 * Eyes and mouth: measured at x -0.39 / +0.44, s 0.71, the mouth centred at
 * s 0.90. The eyes sit a little wider here, on the edge of the yellow as in
 * the drawing, because pixel eyes are relatively bigger and would otherwise
 * close the gap between them.
 */
const FACE = { eyes: [-0.46, 0.48], eyeS: 0.71, mouthS: 0.9 };

/* ---------- stamps, per resolution ---------- */

const rows = (lines) => lines.map((line) => [...line]);

/*
 * Eyes by expression. Each has a pupil position (column, row), or none; a
 * look moves the pupil, never the eye. "." is transparent: the body shows.
 */
const STAMPS = {
  large: {
    eyes: {
      // Rounded squares as in the pixel reference; even-sized so the pupil sits dead centre.
      open: { shape: [".WWWW.", "WWWWWW", "WWWWWW", "WWWWWW", "WWWWWW", ".WWWW."], pupil: [2, 2] },
      // Squashed by a landing: one row shorter, still readable.
      squeezed: { shape: [".WWWW.", "WWWWWW", "WWWWWW", "WWWWWW", ".WWWW."], pupil: [2, 2] },
      // Startled: a row taller, the pupil shrunk to a point.
      wide: { shape: [".WWWW.", "WWWWWW", "WWWWWW", "WWWWWW", "WWWWWW", "WWWWWW", ".WWWW."], pupil: [2, 3], dot: true },
      // Resting: the lids half down, so only the lower half shows.
      lidded: { shape: ["......", "......", "WWWWWW", "WWWWWW", "WWWWWW", ".WWWW."], pupil: [2, 2] },
      // Asleep: a soft curve where the eye was.
      closed: { shape: ["......", "......", "......", "K....K", ".KKKK.", "......"] },
      // Losing or finding his form: whites without pupils, then smaller.
      blank: { shape: [".WWWW.", "WWWWWW", "WWWWWW", "WWWWWW", "WWWWWW", ".WWWW."] },
      faint: { shape: ["......", ".WWWW.", ".WWWW.", ".WWWW.", ".WWWW.", "......"] },
    },
    pupil: rows(["KK", "KK"]),
    dot: rows(["K"]),
    mouths: {
      neutral: rows([".PPPP.", "PPPPPP"]),
      small: rows(["PPPP"]),
      oh: rows([".PP.", "PPPP", ".PP."]),
      wide: rows(["PPPPPPPP"]),
    },
  },
  small: {
    eyes: {
      // Odd-sized at this scale, so the pupil is a single centred pixel: small and blank, as drawn.
      open: { shape: [".WWW.", "WWWWW", "WWWWW", "WWWWW", ".WWW."], pupil: [2, 2] },
      squeezed: { shape: [".WWW.", "WWWWW", "WWWWW", ".WWW."], pupil: [2, 1] },
      wide: { shape: [".WWW.", "WWWWW", "WWWWW", "WWWWW", "WWWWW", ".WWW."], pupil: [2, 2] },
      lidded: { shape: [".....", ".....", "WWWWW", "WWWWW", ".WWW."], pupil: [2, 2] },
      closed: { shape: [".....", ".....", "K...K", ".KKK.", "....."] },
      blank: { shape: [".WWW.", "WWWWW", "WWWWW", "WWWWW", ".WWW."] },
      faint: { shape: [".....", ".WWW.", ".WWW.", ".WWW.", "....."] },
    },
    pupil: rows(["K"]),
    dot: rows(["K"]),
    mouths: {
      neutral: rows(["PPPP"]),
      small: rows(["PP"]),
      oh: rows([".P.", "P.P", ".P."]),
      wide: rows(["PPPPPP"]),
    },
  },
};

/* ---------- drawing ---------- */

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const grid = (width, height, fill) => Array.from({ length: height }, () => Array(width).fill(fill));

/** Linear between the traced rows; null outside the shape's height. */
function edges(profile, s) {
  if (s < profile[0][0] || s > profile.at(-1)[0]) return null;
  let i = 0;
  while (i < profile.length - 2 && profile[i + 1][0] < s) i += 1;
  const [s0, l0, r0] = profile[i];
  const [s1, l1, r1] = profile[i + 1];
  const t = clamp((s - s0) / (s1 - s0), 0, 1);
  return [l0 + (l1 - l0) * t, r0 + (r1 - r0) * t];
}

const inside = (profile, u, s) => {
  const e = edges(profile, s);
  return e !== null && u >= e[0] && u <= e[1];
};

/** Fill one-pixel notches, drop strays and one-row side bumps. */
function tidy(mask, width, height) {
  for (let pass = 0; pass < 2; pass += 1) {
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const around = N4.filter(([dx, dy]) => mask[y + dy][x + dx]).length;
        if (!mask[y][x] && around >= 3) mask[y][x] = true;
        else if (mask[y][x] && around === 0) mask[y][x] = false;
        else if (mask[y][x] && around === 1 && !mask[y + 1][x]) mask[y][x] = false;
        else if (mask[y][x] && !mask[y - 1][x] && !mask[y + 1][x] && mask[y][x - 1] !== mask[y][x + 1]) {
          mask[y][x] = false;
        }
      }
    }
  }
  return mask;
}

/**
 * Drops every piece cut off from the main body, so a broken shell leaves
 * bites in the edge rather than confetti; the fragments that fly off are
 * placed by hand as sparks.
 */
function keepLargest(frame) {
  const seen = frame.map((line) => line.map(() => false));
  const pieces = [];
  frame.forEach((line, y) =>
    line.forEach((key, x) => {
      if (!key || seen[y][x]) return;
      const piece = [];
      const stack = [[x, y]];
      seen[y][x] = true;
      while (stack.length > 0) {
        const [px, py] = stack.pop();
        piece.push([px, py]);
        N4.forEach(([dx, dy]) => {
          const nx = px + dx;
          const ny = py + dy;
          if (frame[ny]?.[nx] && !seen[ny][nx]) {
            seen[ny][nx] = true;
            stack.push([nx, ny]);
          }
        });
      }
      pieces.push(piece);
    }),
  );
  pieces
    .sort((a, b) => b.length - a.length)
    .slice(1)
    .forEach((piece) => piece.forEach(([x, y]) => (frame[y][x] = null)));
}

/** Stable per-pixel noise in [0, 1), so a frame always draws the same. */
const hash = (x, y, seed) => {
  let h = (x * 374761393 + y * 668265263 + seed * 2246822519) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

/**
 * Renders the model into one frame.
 *
 * `spec` is the identity, fixed per form, plus the frame it is drawn in:
 *   canvas:  [width, height] of the frame; he stands centred, two rows up
 *            from its bottom on a 48-pixel frame
 *   features: "large" or "small" eyes and mouth
 *   height:  the character's height in pixels; width follows from the trace
 *   ratio:   width/height (0.87 traced)
 *   lobesFrom: the side flames are cut flat above this s
 *   face:    overrides of FACE's measured positions
 *
 * `pose` deforms it, all in pixels unless noted, +x right and +y up:
 *   tip:     [lean, grow] of the top flame, tapering into the dome
 *   lobes:   per lobe (right, left): [dx, dy, grow as a share]
 *   breathe: [width, height] added to the body, the base fixed
 *   squash:  [x, y] multipliers about `pivot` (a share of the height from
 *            the top: 1 the base, about 0.7 the core)
 *   offset:  [dx, dy] for the whole drawing
 *   lean:    the top shears this far sideways, the base fixed
 *   zones:   { orange: [dx, dy], yellow: [dx, dy], scale } moves and sizes
 *            the inner colours; scale < 1 shrinks them toward the base
 *   face:    { eyes, pupil: [dx, dy], mouth, dx, dy } or null for none.
 *            The face is placed from the neutral, so flicker never moves it;
 *            only squash, offset, lean and its own dx/dy do.
 *   tongues: [dx, length, lean] flicks rising off the top contour
 *   sparks:  [dx, dy, key, w, h] loose pixels from the anchor (centre, base)
 *   erode:   share of the outer shell broken away (seeded by `seed`)
 *   body:    false draws only the sparks
 *   remap:   colour substitutions, e.g. { R: "O" } for a core-only flame
 */
export function drawCalcifer(spec, pose = {}) {
  const { canvas, height, ratio = 0.87, lobesFrom = 0, features: scale = "large" } = spec;
  const [width, depth] = canvas;
  const features = { ...FACE, ...spec.face };
  const {
    tip = [0, 0],
    lobes = [],
    breathe = [0, 0],
    squash = [1, 1],
    pivot = 1,
    offset = [0, 0],
    lean = 0,
    zones = {},
    face = {},
    tongues = [],
    sparks = [],
    erode = 0,
    seed = 1,
    remap = {},
    body: solid = true,
  } = pose;
  const stamps = STAMPS[scale];

  // The neutral's frame, which the face is measured against.
  const bottom0 = depth - Math.round(depth / 24);
  const top0 = bottom0 - height;
  const half0 = (height * ratio) / 2;
  const pivotY = top0 + pivot * height;
  const cx = width / 2 + offset[0];

  // This pose's body.
  const bottom = pivotY + (bottom0 - pivotY) * squash[1] - offset[1];
  const tall = height * squash[1] + breathe[1];
  const top = bottom - tall;
  const half = half0 * squash[0] + breathe[0] / 2;

  // The spire is drawn over the rows above the dome, stretched or shortened
  // by tip[1] and leaning by tip[0], the lean easing out into the dome.
  const dome = top + SPIRE * tall;
  const peak = top - tip[1];
  const toS = (y) => {
    const at = y + 0.5;
    if (at < dome) return (SPIRE * (at - peak)) / (dome - peak);
    return SPIRE + ((1 - SPIRE) * (at - dome)) / (bottom - dome);
  };
  const bend = SPIRE + 0.15;
  const shift = (y, s) => (lean * (bottom - (y + 0.5))) / tall + tip[0] * clamp((bend - s) / bend, 0, 1) ** 2;
  const toU = (x, y, s) => (x + 0.5 - cx - shift(y, s)) / half;
  const perS = 1 / tall;

  const body = grid(width, depth, false);
  for (let y = 0; solid && y < depth; y += 1) {
    const s = toS(y);
    if (s < 0) continue;
    for (let x = 0; x < width; x += 1) {
      const u = toU(x, y, s);
      const lobe = s >= lobesFrom && LOBES.some(([lx, ls, rx, rs], index) => {
        const [dx, dy, grow] = lobes[index] ?? [0, 0, 0];
        if (grow <= -1) return false;
        const ox = (u - (lx + dx / half)) / (rx * (1 + grow));
        const os = (s - (ls - dy * perS)) / (rs * (1 + grow));
        return ox * ox + os * os <= 1;
      });
      body[y][x] = inside(BODY, u, s) || lobe;
    }
  }
  tidy(body, width, depth);

  // Flicks rising off the top contour.
  tongues.forEach(([dx, length, tilt = 0]) => {
    const x = Math.round(cx - 0.5 + dx);
    if (x < 0 || x >= width) return;
    const from = body.findIndex((line) => line[x]);
    if (from < 0) return;
    for (let i = 1; i <= length; i += 1) {
      const lx = x + Math.round((tilt * i) / length);
      if (from - i >= 0 && lx >= 0 && lx < width) body[from - i][lx] = true;
    }
  });

  const zoneScale = zones.scale ?? 1;
  const [odx, ody] = zones.orange ?? [0, 0];
  const [ydx, ydy] = zones.yellow ?? [0, 0];
  const frame = grid(width, depth, null);
  for (let y = 0; y < depth; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!body[y][x]) continue;
      const s = toS(y);
      const u = toU(x, y, s);
      const zone = (dx, dy, profile) =>
        inside(profile, (u - dx / half) / zoneScale, 1 - (1 - Math.min(s + dy * perS, 1)) / zoneScale);
      frame[y][x] = zone(ydx, ydy, YELLOW) ? "Y" : zone(odx, ody, ORANGE) ? "O" : "R";
    }
  }

  // The light-orange step: orange pixels touching the core.
  const lit = frame.map((line, y) =>
    line.map((key, x) => key === "O" && N4.some(([dx, dy]) => frame[y + dy]?.[x + dx] === "Y")),
  );
  lit.forEach((line, y) =>
    line.forEach((on, x) => {
      if (on) frame[y][x] = "o";
    }),
  );

  // The shell breaking up: red pixels near the outside fall away.
  if (erode > 0) {
    const outside = (x, y) => !frame[y]?.[x];
    for (let y = 0; y < depth; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (frame[y][x] !== "R") continue;
        const rim = N4.some(([dx, dy]) => outside(x + dx, y + dy) || outside(x + 2 * dx, y + 2 * dy));
        if (rim && hash(x >> 1, y >> 1, seed) < erode) frame[y][x] = null;
      }
    }
    // Hair-thin stalks left between the bites read as noise: trim them back.
    for (let pass = 0; pass < 2; pass += 1) {
      const thin = [];
      frame.forEach((line, y) =>
        line.forEach((key, x) => {
          if (key && N4.filter(([dx, dy]) => frame[y + dy]?.[x + dx]).length <= 1) thin.push([x, y]);
        }),
      );
      thin.forEach(([x, y]) => (frame[y][x] = null));
    }
    keepLargest(frame);
  }

  const stamp = (shape, left, topY, keep = false) =>
    shape.forEach((line, dy) =>
      line.forEach((key, dx) => {
        const y = topY + dy;
        const x = left + dx;
        if (key === "." || y < 0 || y >= depth || x < 0 || x >= width) return;
        if (keep && !frame[y][x]) return;
        frame[y][x] = key;
      }),
    );

  if (face) {
    const { eyes = "open", pupil = [0, 0], mouth = "neutral", dx = 0, dy = 0 } = face;
    // Where the neutral's features are, carried through the squash.
    const rowOf = (s) => top0 + s * height;
    const place = (x0, y0) => {
      const y = pivotY + (y0 - pivotY) * squash[1] - offset[1] - dy;
      const x = width / 2 + (x0 - width / 2) * squash[0] + offset[0] + (lean * (bottom - y)) / tall + dx;
      return [x, y];
    };

    const eye = stamps.eyes[eyes];
    if (eye) {
      const neutral = stamps.eyes.open.shape.length;
      features.eyes.forEach((u) => {
        const [x, y] = place(width / 2 + u * half0, rowOf(features.eyeS));
        const left = Math.round(x - neutral / 2);
        const eyeTop = Math.round(y - neutral / 2) + Math.round((neutral - eye.shape.length) / 2);
        stamp(rows(eye.shape), left, eyeTop, true);
        if (eye.pupil) {
          const dot = eye.dot ? stamps.dot : stamps.pupil;
          const width = eye.shape[0].length;
          const px = clamp(eye.pupil[0] + pupil[0], 0, width - dot[0].length);
          const py = clamp(eye.pupil[1] + pupil[1], 0, eye.shape.length - dot.length);
          stamp(dot, left + px + (eye.dot ? Math.floor(stamps.pupil[0].length / 2) : 0), eyeTop + py, true);
        }
      });
    }

    const shape = stamps.mouths[mouth];
    if (shape) {
      const [x, y] = place(width / 2, rowOf(features.mouthS));
      stamp(shape, Math.round(x - shape[0].length / 2), Math.round(y - shape.length / 2), true);
    }
  }

  // Loose pixels: fragments, or a flick that has broken off.
  sparks.forEach(([dx, dy, key, w = 1, h = 1]) => {
    const left = Math.round(cx - 0.5 + dx);
    const topY = bottom0 - 1 - Math.round(dy) - (h - 1);
    for (let j = 0; j < h; j += 1) {
      for (let i = 0; i < w; i += 1) {
        if (frame[topY + j]?.[left + i] === null) frame[topY + j][left + i] = key;
      }
    }
  });

  if (Object.keys(remap).length > 0) {
    frame.forEach((line) => line.forEach((key, x) => (line[x] = key && (remap[key] ?? key))));
  }

  return frame;
}

/** An empty frame. */
export const blank = ([width, depth]) => grid(width, depth, null);

/* ---------- the neutrals ---------- */

/** World Calcifer: 42 tall and about 37 wide; approved on a 48 x 48 frame. */
export const WORLD = { canvas: [48, 48], height: 42 };
export const WORLD_32 = { canvas: [32, 32], height: 29, features: "small" };

/*
 * Glyph Calcifer, derived rather than redrawn: the same model 30 pixels tall
 * in a 32 x 32 frame, a hair broader, its side flames cut flat on top so the
 * crown stays simple next to the letters, the mouth a pixel higher.
 */
export const GLYPH = { canvas: [32, 32], height: 30, ratio: 0.88, lobesFrom: 0.2, features: "small", face: { mouthS: 0.88 } };

/* ---------- write ---------- */

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const design = join(root, "design", "calcifer");
  mkdirSync(design, { recursive: true });

  const write = (name, spec) => {
    const sheet = renderSheet([[drawCalcifer(spec)]], ...spec.canvas, PALETTE);
    writeFileSync(join(design, `${name}.png`), encodePng(sheet.width, sheet.height, sheet.rgba));
    const large = upscale(sheet, 8);
    writeFileSync(join(design, `${name}@8x.png`), encodePng(large.width, large.height, large.rgba));
    console.log(`${name}.png  ${spec.canvas.join("x")}`);
  };

  write("calcifer-world-neutral", WORLD);
  write("calcifer-world-neutral-32", WORLD_32);
  write("calcifer-glyph-neutral", GLYPH);
}
