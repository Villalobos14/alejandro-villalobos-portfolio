/*
 * Calcifer, the canonical model. Run `node scripts/calcifer-model.mjs` to
 * rewrite, in design/calcifer/:
 *   calcifer-world-neutral.png     48x48, the source of truth for the world form
 *   calcifer-world-neutral-32.png  the same model at 32x32, for comparison
 *   calcifer-glyph-neutral.png     32x32, the same character compressed into the "o"
 * each with an 8x nearest-neighbour copy for review. Every animation frame
 * (scripts/calcifer-sprites.mjs) is this model drawn in a different pose.
 *
 * The character follows design/calcifer/calcifer-pixel-reference.png, with
 * calcifer-soft-reference.png for proportions: a broad, squat flame body
 * carrying most of his mass, and above it a smaller, unsteady crown of three
 * unequal tongues (a dominant central flame, a secondary flame on his right,
 * a smaller answer on his left). The colours are layers: a thick red-orange
 * shell that draws the silhouette, an orange body inside it, a one-pixel
 * light-orange step and a pale yellow core carrying the face. The layers move
 * less the deeper they sit: the shell follows every pose, the orange only the
 * broad ones, the core hardly at all. White eyes, small pupils, a pink mouth,
 * no outline anywhere, and no arms: a flame, nothing else.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { encodePng, hex, renderSheet, upscale } from "./lib/png.mjs";

export const PALETTE = {
  R: hex("#fd4622"), // red-orange shell
  O: hex("#fd9c41"), // orange
  o: hex("#feb650"), // light orange, one pixel between orange and yellow
  Y: hex("#fed96b"), // warm pale yellow core, a touch richer than the reference so the eyes stand out
  W: hex("#fffcf2"), // eyes
  K: hex("#1e1110"), // pupils, closed eyes
  P: hex("#fd8f9d"), // mouth
};

/* ---------- the shapes ----------
 *
 * Everything is measured from the base: v is height as a share of the whole
 * character (0 the base, 1 the top of the central flame), u is across as a
 * share of the body's half-width (+ his right, the viewer's right).
 */

/*
 * The body: [v, left, right]. Round and broad, widest a little below the
 * eyes, flattened where it sits and closing into the shoulders the crown
 * grows out of. A touch heavier on the right, under the secondary flame.
 */
const BODY = [
  [0, -0.42, 0.46],
  [0.02, -0.64, 0.68],
  [0.05, -0.8, 0.84],
  [0.1, -0.92, 0.95],
  [0.16, -0.99, 1],
  [0.27, -1, 1],
  [0.35, -0.96, 0.97],
  [0.43, -0.88, 0.91],
  [0.5, -0.76, 0.8],
  [0.56, -0.58, 0.64],
  [0.6, -0.4, 0.48],
  [0.63, -0.24, 0.3],
  [0.645, -0.04, 0.1],
];

/*
 * The crown: tongues rising out of the shoulders, never three of a kind.
 *   u, from, to: where the tongue stands, where it leaves the body, its tip
 *   w:     half-width where it leaves the body
 *   lean, curl: how far the tip stands sideways of the base (in u), and how
 *          much of that comes late, bending the tongue
 *   taper, round: the tongue's profile; round 0.5 caps it like an egg, higher
 *          draws it out to a point
 *   blunt: the narrowest the tip gets (in u), so it ends in a stub, not a needle
 * The central flame comes first: its pose is `tip`; the others are `lobes`.
 */
const CROWN = [
  { u: 0.0, from: 0.54, to: 1, w: 0.33, lean: -0.04, curl: -0.04, taper: 2.4, round: 0.75, blunt: 0.05 },
  { u: 0.42, from: 0.52, to: 0.85, w: 0.22, lean: 0.26, curl: -0.08, taper: 1.5, round: 0.8, blunt: 0.05 },
  { u: -0.44, from: 0.54, to: 0.76, w: 0.2, lean: -0.14, curl: 0, taper: 1.4, round: 0.6, blunt: 0.06 },
];

/*
 * The red shell is the outer band of the silhouette, this thick (in u) over
 * the upper body, thinning over the bottom fifth so the orange reaches the
 * base, as a flame burns hottest where it sits.
 */
const SHELL = { u: 0.25, from: 0.03, full: 0.24 };

/*
 * The orange's upper edge: a dome peaking under the central flame and
 * reaching up into its root. `follow` is how much of the central flame's
 * lean and growth it takes on by default: about half, so it moves, but less
 * than the shell.
 */
const ORANGE = { top: 0.7, fall: 0.62, follow: [0.5, 0.25] };

/*
 * The yellow core: [v, left, right]. A broad egg from just above the base to
 * a little over the eyes, widest at the mouth. It is drawn from the neutral
 * and moves only when a pose says so, which is rarely and by a pixel.
 */
const YELLOW = [
  [0.06, -0.26, 0.3],
  [0.09, -0.44, 0.47],
  [0.13, -0.54, 0.57],
  [0.19, -0.56, 0.58],
  [0.26, -0.57, 0.59],
  [0.33, -0.53, 0.55],
  [0.39, -0.46, 0.48],
  [0.44, -0.36, 0.38],
  [0.48, -0.14, 0.17],
];

/*
 * The face sits low, in the upper half of the core: the eyes far apart on
 * its shoulders, touching the orange, the mouth well below them.
 */
const FACE = { eyes: [-0.45, 0.47], eyeV: 0.33, mouthV: 0.15 };

/* ---------- stamps, per resolution ---------- */

const rows = (lines) => lines.map((line) => [...line]);

/*
 * Eyes by expression. Each has a pupil position (column, row), or none; a
 * look moves the pupil, never the eye. "." is transparent: the body shows.
 * Every shape is drawn in the open eye's box, so the blink closes in place.
 */
const STAMPS = {
  large: {
    eyes: {
      // Chunky rounded squares, no outline, a small pupil with white all round it.
      open: { shape: [".WWWW.", "WWWWWW", "WWWWWW", "WWWWWW", "WWWWWW", ".WWWW."], pupil: [2, 2] },
      // A blink, in three steps: squeezed, a slit, shut.
      half: { shape: ["......", ".WWWW.", "WWWWWW", "WWWWWW", ".WWWW.", "......"], pupil: [2, 2] },
      slit: { shape: ["......", "......", "......", "WWWWWW", ".WWWW.", "......"], pupil: [2, 3], dot: "bar" },
      shut: { shape: ["......", "......", "......", ".KKKK.", "......", "......"] },
      // Squashed by a landing: one row shorter, still readable.
      squeezed: { shape: [".WWWW.", "WWWWWW", "WWWWWW", "WWWWWW", ".WWWW."], pupil: [2, 2] },
      // Startled: a row taller, the pupil shrunk to a point.
      wide: { shape: [".WWWW.", "WWWWWW", "WWWWWW", "WWWWWW", "WWWWWW", "WWWWWW", ".WWWW."], pupil: [2, 3], dot: "point" },
      // Resting: the lids half down, so only the lower half shows.
      lidded: { shape: ["......", "......", "WWWWWW", "WWWWWW", "WWWWWW", ".WWWW."], pupil: [2, 2] },
      // Asleep: a soft curve where the eye was.
      closed: { shape: ["......", "......", "......", "K....K", ".KKKK.", "......"] },
      // Losing or finding his form: whites without pupils, then smaller.
      blank: { shape: [".WWWW.", "WWWWWW", "WWWWWW", "WWWWWW", "WWWWWW", ".WWWW."] },
      faint: { shape: ["......", ".WWWW.", ".WWWW.", ".WWWW.", ".WWWW.", "......"] },
    },
    pupil: rows(["KK", "KK"]),
    bar: rows(["KK"]),
    point: rows(["K"]),
    mouths: {
      neutral: rows([".PPPP.", "PPPPPP"]),
      small: rows(["PPPP"]),
      oh: rows([".PP.", "PPPP", ".PP."]),
      wide: rows(["PPPPPPPP"]),
    },
  },
  small: {
    eyes: {
      // Odd-sized at this scale, so the pupil is a single centred pixel.
      open: { shape: [".WWW.", "WWWWW", "WWWWW", "WWWWW", ".WWW."], pupil: [2, 2] },
      half: { shape: [".....", ".WWW.", "WWWWW", ".WWW.", "....."], pupil: [2, 2] },
      slit: { shape: [".....", ".....", "WWWWW", ".....", "....."], pupil: [2, 2] },
      shut: { shape: [".....", ".....", ".KKK.", ".....", "....."] },
      squeezed: { shape: [".WWW.", "WWWWW", "WWWWW", ".WWW."], pupil: [2, 1] },
      wide: { shape: [".WWW.", "WWWWW", "WWWWW", "WWWWW", "WWWWW", ".WWW."], pupil: [2, 2] },
      lidded: { shape: [".....", ".....", "WWWWW", "WWWWW", ".WWW."], pupil: [2, 2] },
      closed: { shape: [".....", ".....", "K...K", ".KKK.", "....."] },
      blank: { shape: [".WWW.", "WWWWW", "WWWWW", "WWWWW", ".WWW."] },
      faint: { shape: [".....", ".WWW.", ".WWW.", ".WWW.", "....."] },
    },
    pupil: rows(["K"]),
    bar: rows(["K"]),
    point: rows(["K"]),
    mouths: {
      neutral: rows([".PP.", "PPPP"]),
      small: rows(["PPP"]),
      oh: rows([".P.", "P.P", ".P."]),
      wide: rows(["PPPPPP"]),
    },
  },
};

/* ---------- drawing ---------- */

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const grid = (width, height, fill) => Array.from({ length: height }, () => Array(width).fill(fill));

/** Linear between the profile's rows; null outside its height. */
function edges(profile, v) {
  if (v < profile[0][0] || v > profile.at(-1)[0]) return null;
  let i = 0;
  while (i < profile.length - 2 && profile[i + 1][0] < v) i += 1;
  const [v0, l0, r0] = profile[i];
  const [v1, l1, r1] = profile[i + 1];
  const t = clamp((v - v0) / (v1 - v0), 0, 1);
  return [l0 + (l1 - l0) * t, r0 + (r1 - r0) * t];
}

const inside = (profile, u, v) => {
  const e = edges(profile, v);
  return e !== null && u >= e[0] && u <= e[1];
};

/**
 * One crown tongue, as posed: shifted `dx`, its tip raised `lift`, scaled
 * `grow`, widened `widen`, curled `curl` more, and its tip forked `fork` of
 * its height deep. `pixel` is one pixel in u, so a fork stays chunky.
 */
function inTongue(tongue, u, v, { dx = 0, lift = 0, grow = 0, widen = 0, curl = 0, fork = 0, pixel }) {
  const to = tongue.from + (tongue.to - tongue.from) * (1 + grow) + lift;
  if (v < tongue.from || v > to) return false;
  const f = (v - tongue.from) / (to - tongue.from);
  let half = Math.max(tongue.w * (1 + grow * 0.5) * (1 + widen) * (1 - f ** tongue.taper) ** tongue.round, tongue.blunt * (f < 0.98 ? 1 : 0));
  const centre = tongue.u + dx * f ** 0.6 + tongue.lean * f + (tongue.curl + curl) * f * f;
  const side = u - centre;
  if (fork > 0 && f > 1 - fork) {
    // The tip almost splits: it stays blunt, a one-pixel cleft opens down
    // its middle, and the near prong stops short of the far one.
    half = Math.max(half, 2.6 * pixel);
    if (Math.abs(side) < 0.5 * pixel) return false;
    if (side < 0 && f > 1 - fork * 0.45) return false;
  }
  return Math.abs(side) <= half;
}

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
 * Distance from each pixel of the mask to the nearest pixel outside it, in
 * pixels, close to round (a 3-4 chamfer): what the shell is measured with.
 */
function depthOf(mask, width, height) {
  const far = 1e6;
  const d = mask.map((line) => line.map((on) => (on ? far : 0)));
  const at = (x, y) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : d[y][x]);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (d[y][x]) d[y][x] = Math.min(d[y][x], at(x - 1, y) + 3, at(x, y - 1) + 3, at(x - 1, y - 1) + 4, at(x + 1, y - 1) + 4);
    }
  }
  for (let y = height - 1; y >= 0; y -= 1) {
    for (let x = width - 1; x >= 0; x -= 1) {
      if (d[y][x]) d[y][x] = Math.min(d[y][x], at(x + 1, y) + 3, at(x, y + 1) + 3, at(x + 1, y + 1) + 4, at(x - 1, y + 1) + 4);
    }
  }
  return d.map((line) => line.map((value) => value / 3));
}

/**
 * Inside the body, a colour pixel unlike all four of its neighbours takes
 * theirs: the layers meet in steps, never in specks.
 */
function settle(frame) {
  for (let pass = 0; pass < 2; pass += 1) {
    frame.forEach((line, y) =>
      line.forEach((key, x) => {
        if (!key) return;
        const around = N4.map(([dx, dy]) => frame[y + dy]?.[x + dx]);
        if (around.some((other) => !other || other === key)) return;
        const counts = {};
        around.forEach((other) => (counts[other] = (counts[other] ?? 0) + 1));
        line[x] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      }),
    );
  }
}

/**
 * The warm inside (orange and yellow) never runs thinner than three pixels:
 * a wick or a sliver of orange up a narrow flame goes back to the shell.
 */
function open(frame) {
  const warm = (x, y) => frame[y]?.[x] === "O" || frame[y]?.[x] === "Y";
  const ring = [-1, 0, 1].flatMap((dy) => [-1, 0, 1].map((dx) => [dx, dy]));
  const core = frame.map((line, y) => line.map((_, x) => ring.every(([dx, dy]) => warm(x + dx, y + dy))));
  frame.forEach((line, y) =>
    line.forEach((key, x) => {
      if (warm(x, y) && !ring.some(([dx, dy]) => core[y + dy]?.[x + dx])) line[x] = "R";
    }),
  );
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
 *   height:  the character's height in pixels, base to the central flame's tip
 *   ratio:   body width / height
 *   crown:   [central, sides] scale of the crown's height, for a quieter one
 *   face:    overrides of FACE's measured positions
 *
 * `pose` deforms it, all in pixels unless noted, +x right and +y up:
 *   tip:     [lean, grow, widen, fork] of the central flame: the tip curls
 *            `lean` sideways and rises `grow`; `widen` is a share of its
 *            width; `fork` (a share of its height) splits the tip
 *   lobes:   per side flame (right, left): [dx, dy, grow as a share]
 *   breathe: [width, height] added to the body, the base fixed
 *   squash:  [x, y] multipliers about `pivot` (a share of the height from
 *            the top: 1 the base, about 0.7 the core)
 *   offset:  [dx, dy] for the whole drawing
 *   lean:    the top shears this far sideways, the base fixed
 *   zones:   { orange: [dx, dy], yellow: [dx, dy], scale } moves and sizes
 *            the inner colours; scale < 1 shrinks them toward the base.
 *            Without `orange` it follows the central flame at about half.
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
  const { canvas, height, ratio = 0.93, crown: crownScale = [1, 1], features: scale = "large" } = spec;
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
  const [tipLean = 0, tipGrow = 0, tipWiden = 0, tipFork = 0] = tip;

  // The neutral's frame, which the face is measured against.
  const bottom0 = depth - Math.round(depth / 24);
  const top0 = bottom0 - height;
  const half0 = (height * ratio) / 2;
  const pivotY = top0 + pivot * height;
  const cx = width / 2 + offset[0];

  // This pose's body.
  const bottom = pivotY + (bottom0 - pivotY) * squash[1] - offset[1];
  const tall = height * squash[1] + breathe[1];
  const half = half0 * squash[0] + breathe[0] / 2;

  // The crown, as this pose has it; a quieter form scales its heights.
  const crown = CROWN.map((tongue, index) => {
    const reach = (tongue.to - tongue.from) * crownScale[index === 0 ? 0 : 1];
    return { ...tongue, to: tongue.from + reach };
  });
  const posed = [
    { dx: 0, lift: tipGrow / tall, widen: tipWiden, curl: tipLean / half, fork: tipFork, pixel: 1 / half },
    ...crown.slice(1).map((_, index) => {
      const [dx, dy, grow] = lobes[index] ?? [0, 0, 0];
      return { dx: dx / half, lift: dy / tall, grow, pixel: 1 / half };
    }),
  ];

  // Shoulders give a little toward where the central flame leans.
  const drag = (v) => ((tipLean * 0.3) / half) * clamp((v - 0.42) / 0.25, 0, 1);
  const toV = (y) => (bottom - (y + 0.5)) / tall;
  const toU = (x, y) => (x + 0.5 - cx - (lean * (bottom - (y + 0.5))) / tall) / half;
  // The inner colours are measured without the breath, so breathing moves only the silhouette.
  const still = height * squash[1];
  const toV0 = (y) => (bottom - (y + 0.5)) / still;
  const toU0 = (x, y) => (x + 0.5 - cx - (lean * (bottom - (y + 0.5))) / still) / (half0 * squash[0]);

  const mass = grid(width, depth, false);
  for (let y = 0; solid && y < depth; y += 1) {
    const v = toV(y);
    if (v < 0 || v > 1.4) continue;
    for (let x = 0; x < width; x += 1) {
      const u = toU(x, y);
      const tongue = crown.some((shape, index) => {
        const options = posed[index];
        if (index > 0 && (options.grow ?? 0) <= -1) return false;
        return inTongue(shape, u, v, options);
      });
      mass[y][x] = inside(BODY, u - drag(v), v) || tongue;
    }
  }
  tidy(mass, width, depth);

  // Flicks rising off the top contour.
  tongues.forEach(([dx, length, tilt = 0]) => {
    const x = Math.round(cx - 0.5 + dx);
    if (x < 0 || x >= width) return;
    const from = mass.findIndex((line) => line[x]);
    if (from < 0) return;
    for (let i = 1; i <= length; i += 1) {
      const lx = x + Math.round((tilt * i) / length);
      if (from - i >= 0 && lx >= 0 && lx < width) mass[from - i][lx] = true;
    }
  });

  // The layers. The shell is measured in from the silhouette, so it is
  // always there and always as thick; orange and yellow are shapes of their
  // own, the orange following the central flame at about half, the yellow
  // only when told.
  const inset = depthOf(mass, width, depth);
  const shell = SHELL.u * half0;
  const zoneScale = zones.scale ?? 1;
  const [odx, ody] = zones.orange ?? [Math.round(tipLean * ORANGE.follow[0]), Math.round(tipGrow * ORANGE.follow[1])];
  const [ydx, ydy] = zones.yellow ?? [0, 0];
  const frame = grid(width, depth, null);
  for (let y = 0; y < depth; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!mass[y][x]) continue;
      const v = toV0(y);
      const u = toU0(x, y);
      const rim = shell * clamp((v - SHELL.from) / (SHELL.full - SHELL.from), 0, 1);
      // The orange bends with the flame above the eyes; its base stays put.
      const bend = clamp((v - 0.3) / 0.4, 0, 1);
      const ou = (u - (odx / half0) * bend) / zoneScale;
      const ov = v / zoneScale - (ody / still) * bend;
      const orange = ov <= ORANGE.top - ORANGE.fall * ou * ou && inset[y][x] > rim;
      const yellow = inside(YELLOW, (u - ydx / half0) / zoneScale, (v - ydy / still) / zoneScale) && inset[y][x] > rim + 1;
      frame[y][x] = yellow ? "Y" : orange ? "O" : "R";
    }
  }
  open(frame);
  settle(frame);

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
        const edge = N4.some(([dx, dy]) => outside(x + dx, y + dy) || outside(x + 2 * dx, y + 2 * dy));
        if (edge && hash(x >> 1, y >> 1, seed) < erode) frame[y][x] = null;
      }
    }
    // Stalks and bars left between the bites read as noise, or worse as
    // limbs: whatever is thinner than three pixels goes, so what is left
    // is chunks.
    const ring = [-1, 0, 1].flatMap((dy) => [-1, 0, 1].map((dx) => [dx, dy]));
    const solidAt = frame.map((line, y) => line.map((_, x) => ring.every(([dx, dy]) => frame[y + dy]?.[x + dx])));
    frame.forEach((line, y) =>
      line.forEach((key, x) => {
        if (key && !ring.some(([dx, dy]) => solidAt[y + dy]?.[x + dx])) line[x] = null;
      }),
    );
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
    const rowOf = (v) => bottom0 - v * height;
    const place = (x0, y0) => {
      const y = pivotY + (y0 - pivotY) * squash[1] - offset[1] - dy;
      const x = width / 2 + (x0 - width / 2) * squash[0] + offset[0] + (lean * (bottom - y)) / tall + dx;
      return [x, y];
    };

    const eye = stamps.eyes[eyes];
    if (eye) {
      const neutral = stamps.eyes.open.shape.length;
      features.eyes.forEach((u) => {
        const [x, y] = place(width / 2 + u * half0, rowOf(features.eyeV));
        const left = Math.round(x - neutral / 2);
        const eyeTop = Math.round(y - neutral / 2) + Math.round((neutral - eye.shape.length) / 2);
        stamp(rows(eye.shape), left, eyeTop, true);
        if (eye.pupil) {
          const dot = stamps[eye.dot ?? "pupil"];
          const across = eye.shape[0].length;
          const px = clamp(eye.pupil[0] + pupil[0], 0, across - dot[0].length);
          const py = clamp(eye.pupil[1] + (eye.dot === "bar" ? 0 : pupil[1]), 0, eye.shape.length - dot.length);
          const centre = eye.dot === "point" ? Math.floor(stamps.pupil[0].length / 2) : 0;
          stamp(dot, left + px + centre, eyeTop + py, true);
        }
      });
    }

    const shape = stamps.mouths[mouth];
    if (shape) {
      const [x, y] = place(width / 2, rowOf(features.mouthV));
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

/** World Calcifer: 42 tall and about 39 wide, on a 48 x 48 frame. */
export const WORLD = { canvas: [48, 48], height: 42 };
export const WORLD_32 = { canvas: [32, 32], height: 29, features: "small" };

/*
 * Glyph Calcifer, derived rather than redrawn: the same model 30 pixels tall
 * and 26 wide in a 32 x 32 frame, its crown lower and its side flames
 * smaller, so his body reads as the letter's bowl and the crown stays quiet
 * next to the letters.
 */
export const GLYPH = { canvas: [32, 32], height: 32.5, ratio: 0.8, crown: [0.83, 0.62], features: "small" };

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
