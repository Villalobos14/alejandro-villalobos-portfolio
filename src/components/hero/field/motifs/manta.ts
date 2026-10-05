import { IMPORTANCE, ROLE } from "../anatomy";
import { HERO_FIELD_CONFIG } from "../config";
import { clamp, fract, random, smoothstep, TAU } from "../math";
import {
  allocate,
  alongCurve,
  bounds,
  contains,
  cubic,
  draft,
  fillRegion,
  finalize,
  keepSpaced,
  polyline,
  propose,
  Spacing,
  trace,
  type Curve,
  type Draft,
  type Point,
} from "../sample";
import type { MotifDefinition } from "../types";

const BODY = 0;
const WING = 1;
const TAIL = 2;
const WAKE = 3;

const LEFT = 0;
const RIGHT = 1;

const BACK = 1;
const BELLY = -1;

const BODY_HALF = 0.2;
const WING_TIP = 1;
/** The animal turns around its body, not around the middle of body plus tail. */
const ORIGIN: Point = { x: 0, y: 0.02 };
/** Head-to-tail position of the snout, so waves can travel from it. */
const SNOUT = -0.53;

const P = (x: number, y: number): Point => ({ x, y });

/*
 * Right half of the outline in the animal's own plane: from the mouth between
 * the cephalic fins, along a leading edge that sweeps back into a pointed tip,
 * forward along the concave trailing edge, then the pelvic fin and the root of
 * the tail. The left half mirrors it with a little asymmetry so the animal
 * never looks stamped.
 */
const RIGHT_OUTLINE: readonly Curve[] = [
  cubic(P(0, -0.33), P(0.03, -0.34), P(0.05, -0.37), P(0.065, -0.42)),
  cubic(P(0.065, -0.42), P(0.075, -0.5), P(0.1, -0.55), P(0.125, -0.53)),
  cubic(P(0.125, -0.53), P(0.15, -0.49), P(0.17, -0.42), P(0.18, -0.36)),
  cubic(P(0.18, -0.36), P(0.45, -0.33), P(0.82, -0.15), P(1, 0.1)),
  cubic(P(1, 0.1), P(0.8, 0), P(0.45, -0.03), P(0.27, 0.27)),
  cubic(P(0.27, 0.27), P(0.23, 0.34), P(0.19, 0.39), P(0.13, 0.4)),
  cubic(P(0.13, 0.4), P(0.13, 0.47), P(0.09, 0.5), P(0.04, 0.45)),
  cubic(P(0.04, 0.45), P(0.03, 0.44), P(0.01, 0.44), P(0, 0.44)),
];

const TRAILING_EDGE = RIGHT_OUTLINE[4] ?? RIGHT_OUTLINE[0];

const TAIL_CURVE = cubic(P(0, 0.45), P(0.01, 0.75), P(-0.05, 1.05), P(0.02, 1.38));

function mirror(point: Point): Point {
  const reach = Math.abs(point.x);
  return { x: -point.x * (1 - 0.03 * reach), y: point.y + 0.035 * Math.max(0, reach - 0.4) };
}

const OUTLINE: readonly Point[] = (() => {
  const right: Point[] = [];
  for (const curve of RIGHT_OUTLINE) right.push(...trace(curve, 10).slice(right.length ? 1 : 0));
  const left = right.slice(1, -1).reverse().map(mirror);
  return [...right, ...left];
})();

const BOX = bounds(OUTLINE);

/** Height of an edge at a given span, read off densely traced curves. */
function edgeTable(curves: readonly Curve[]): (x: number) => number {
  const points = curves.flatMap((curve) => trace(curve, 60)).sort((a, b) => a.x - b.x);
  return (x) => {
    let index = 1;
    while (index < points.length - 1 && (points[index]?.x ?? 0) < x) index += 1;
    const a = points[index - 1] ?? { x: 0, y: 0 };
    const b = points[index] ?? a;
    const k = b.x === a.x ? 0 : clamp((x - a.x) / (b.x - a.x), 0, 1);
    return a.y + (b.y - a.y) * k;
  };
}

const LEADING_Y = edgeTable([RIGHT_OUTLINE[3] ?? RIGHT_OUTLINE[0] ?? TAIL_CURVE]);
const TRAILING_Y = edgeTable([RIGHT_OUTLINE[4] ?? TAIL_CURVE, RIGHT_OUTLINE[5] ?? TAIL_CURVE]);

function wingDistance(x: number): number {
  return clamp((Math.abs(x) - BODY_HALF) / (WING_TIP - BODY_HALF), 0, 1);
}

/** Right-wing point at span `d` (root → tip) and chord `c` (leading → trailing edge). */
function wingAt(d: number, c: number): Point {
  const x = BODY_HALF + d * (WING_TIP - BODY_HALF);
  const lead = LEADING_Y(x);
  return { x, y: lead + c * (TRAILING_Y(x) - lead) };
}

/** Chord position of a right-wing point, 0 on the leading edge and 1 on the trailing edge. */
function chordOf(x: number, y: number): number {
  const ax = Math.max(BODY_HALF, Math.abs(x));
  const lead = LEADING_Y(ax);
  const span = TRAILING_Y(ax) - lead;
  return span > 1e-4 ? clamp((y - lead) / span, 0, 1) : 0.5;
}

/*
 * The animal's volume, with the back facing −z. The body is a lens, thickest
 * just behind the eyes. The wings are thin cambered sheets that droop toward
 * their tips, so the silhouette bends when it is seen edge-on.
 */
function thickness(x: number, y: number): number {
  const across = Math.max(0, 1 - (x / (BODY_HALF + 0.02)) ** 2);
  const along = smoothstep(-0.46, -0.22, y) * (1 - smoothstep(0.1, 0.44, y));
  return 0.085 * across * along;
}

function wingZ(x: number, y: number): number {
  const d = wingDistance(x);
  const c = chordOf(x, y);
  return 0.13 * d * d - 0.035 * Math.sin(Math.PI * c) * (1 - 0.6 * d);
}

function surfaceZ(x: number, y: number): number {
  if (Math.abs(x) <= BODY_HALF) return y < -0.38 ? 0.05 : 0;
  return wingZ(x, y);
}

/**
 * Where a point sits in the shared anatomy. The body is the core; the front of
 * each wing is that side; the trailing third of a wing and its tip are edge,
 * which a jellyfish turns into its margin and fine filaments.
 */
function anatomy(x: number, y: number) {
  const part = x < 0 ? LEFT : RIGHT;
  const t = wingDistance(x);
  if (t <= 0) return { group: BODY, part, t, role: ROLE.core, reach: clamp(y + 0.55, 0, 1) };
  const edge = chordOf(x, y) > 0.58 || t > 0.86;
  return { group: WING, part, t, role: edge ? ROLE.edge : part === LEFT ? ROLE.left : ROLE.right, reach: t };
}

/** Wings bend about the line where they meet the body. */
function hinge(item: Draft): void {
  if (item.group !== WING && item.group !== WAKE) {
    item.px = 0;
    item.py = item.y;
    return;
  }
  const root = item.x < 0 ? -BODY_HALF : BODY_HALF;
  item.px = root;
  item.py = item.y;
  item.pz = surfaceZ(root, item.y);
}

/** A line traced on the right wing in (span, chord) coordinates, mirrored for the left wing. */
function wingLine(
  side: number,
  count: number,
  at: (u: number) => Point,
  make: (point: Point, u: number) => Draft,
): Draft[] {
  return alongCurve(
    (u) => {
      const point = at(u);
      return side < 0 ? mirror(point) : point;
    },
    count,
    make,
  );
}

/*
 * Glyphs are spent where the anatomy is: a clean outline, a doubled leading
 * edge, the line where each wing meets the body, the head and cephalic fins,
 * a dense body and tail root. The wing interior stays sparse, carried by two
 * chord lines, so near mantas read as refined rather than noisy.
 */
function build(count: number, seed: number) {
  const next = random(seed);
  const cell = Math.sqrt(0.85 / count);
  const spacing = new Spacing(cell);
  const [
    contourCount = 0,
    leadingCount = 0,
    rootCount = 0,
    headCount = 0,
    arcCount = 0,
    bodyCount = 0,
    gillCount = 0,
    ridgeCount = 0,
    tailCount = 0,
    fillCount = 0,
    wakeCount = 0,
  ] = allocate(Math.max(0, count - 2), [0.19, 0.08, 0.04, 0.03, 0.1, 0.15, 0.035, 0.025, 0.09, 0.23, 0.03]);
  const drafts: Draft[] = [];
  const keep = (list: Draft[]) => {
    for (const item of list) {
      drafts.push(item);
      spacing.add(item.x, item.y);
    }
  };
  const sides = [1, -1] as const;

  for (const side of sides) {
    const x = 0.165 * side;
    keep([
      draft(x, -0.31, {
        group: BODY,
        part: side < 0 ? LEFT : RIGHT,
        density: 5,
        weight: 1,
        z: -0.02,
        importance: IMPORTANCE.primary,
        role: ROLE.core,
        reach: 0.24,
      }),
    ]);
  }

  const contour = alongCurve(polyline(OUTLINE, true), contourCount, (point) => {
    const at = anatomy(point.x, point.y);
    const horn = point.y < -0.38 && Math.abs(point.x) < 0.2;
    return draft(point.x, point.y, {
      ...at,
      z: surfaceZ(point.x, point.y),
      density: horn ? 4 : at.t < 0.5 ? 3 : 2,
      weight: 0.95 - 0.4 * at.t,
      importance: IMPORTANCE.silhouette,
    });
  });
  let dropped = keepSpaced(contour, spacing, cell * 0.45, drafts);

  // A second and third line just behind each leading edge: the wing's thick, strong front.
  const [leadRight = 0, leadLeft = 0] = allocate(leadingCount, [1, 1]);
  for (const [side, total] of [
    [1, leadRight],
    [-1, leadLeft],
  ] as const) {
    const [outer = 0, inner = 0] = allocate(total, [1.1, 1]);
    for (const [c, lineCount] of [
      [0.06, outer],
      [0.13, inner],
    ] as const) {
      const line = wingLine(side, lineCount, (u) => wingAt(0.02 + 0.9 * u, c), (point) => {
        const at = anatomy(point.x, point.y);
        return draft(point.x, point.y, {
          ...at,
          z: wingZ(point.x, point.y),
          density: at.t < 0.55 ? 3 : 2,
          weight: 0.8 - 0.3 * at.t,
          importance: IMPORTANCE.primary,
        });
      });
      dropped += keepSpaced(line, spacing, cell * 0.4, drafts);
    }
  }

  // Where each wing leaves the body.
  const [rootRight = 0, rootLeft = 0] = allocate(rootCount, [1, 1]);
  for (const [side, total] of [
    [1, rootRight],
    [-1, rootLeft],
  ] as const) {
    const line = wingLine(side, total, (u) => wingAt(0.012, 0.04 + 0.9 * u), (point) => {
      const at = anatomy(point.x, point.y);
      return draft(point.x, point.y, {
        ...at,
        z: wingZ(point.x, point.y),
        density: 3,
        weight: 0.85,
        importance: IMPORTANCE.primary,
        reach: 0,
      });
    });
    dropped += keepSpaced(line, spacing, cell * 0.4, drafts);
  }

  // Head: the inner line of each cephalic fin and the mouth between them.
  const [finRight = 0, finLeft = 0, mouth = 0] = allocate(headCount, [1, 1, 0.8]);
  for (const [side, total] of [
    [1, finRight],
    [-1, finLeft],
  ] as const) {
    const fin = cubic(P(0.06 * side, -0.35), P(0.075 * side, -0.42), P(0.09 * side, -0.47), P(0.115 * side, -0.5));
    keep(
      alongCurve(fin, total, (point) =>
        draft(point.x, point.y, {
          group: BODY,
          z: 0.04,
          density: 3,
          weight: 0.9,
          importance: IMPORTANCE.primary,
          role: ROLE.core,
          reach: 0.05,
        }),
      ),
    );
  }
  for (let i = 0; i < mouth; i += 1) {
    const x = -0.06 + (0.12 * (i + 0.5)) / mouth;
    keep([
      draft(x, -0.335, { group: BODY, z: 0.01, density: 3, weight: 0.85, importance: IMPORTANCE.primary, role: ROLE.core, reach: 0.2 }),
    ]);
  }

  // Chord lines across each wing: they bend with the surface and carry its perspective.
  const [arcRight = 0, arcLeft = 0] = allocate(arcCount, [1, 1]);
  for (const [side, total] of [
    [1, arcRight],
    [-1, arcLeft],
  ] as const) {
    const [front = 0, back = 0] = allocate(total, [1.1, 1]);
    for (const [c, lineCount] of [
      [0.34, front],
      [0.66, back],
    ] as const) {
      const line = wingLine(side, lineCount, (u) => wingAt(0.04 + 0.9 * u, c), (point) => {
        const at = anatomy(point.x, point.y);
        return draft(point.x, point.y, {
          ...at,
          z: wingZ(point.x, point.y),
          density: 2,
          weight: 0.6,
          importance: IMPORTANCE.secondary,
        });
      });
      dropped += keepSpaced(line, spacing, cell * 0.45, drafts);
    }
  }

  // Gill slits on the belly and a ridge with shoulder marks on the back: they say which side is showing.
  const [gillRight = 0, gillLeft = 0] = allocate(gillCount, [1, 1]);
  for (const [side, total] of [
    [1, gillRight],
    [-1, gillLeft],
  ] as const) {
    allocate(total, [1, 1, 1, 1, 1]).forEach((slitCount, k) => {
      const y = -0.17 + k * 0.062;
      for (let i = 0; i < slitCount; i += 1) {
        const u = (i + 0.5) / slitCount;
        const x = side * (0.075 + 0.075 * u);
        const yy = y + 0.012 * Math.sin(Math.PI * u);
        drafts.push(
          draft(x, yy, {
            group: BODY,
            z: thickness(x, yy) + 0.004,
            face: BELLY,
            density: 3,
            weight: 0.72,
            size: 0,
            importance: IMPORTANCE.secondary,
            role: ROLE.core,
            reach: clamp(yy + 0.55, 0, 1),
          }),
        );
      }
    });
  }

  const [spine = 0, shoulders = 0] = allocate(ridgeCount, [1, 1.2]);
  for (let i = 0; i < spine; i += 1) {
    const y = -0.27 + (0.62 * (i + 0.5)) / spine;
    drafts.push(
      draft(0, y, {
        group: BODY,
        z: -thickness(0, y) - 0.004,
        face: BACK,
        density: 3,
        weight: 0.7,
        importance: IMPORTANCE.secondary,
        role: ROLE.core,
        reach: clamp(y + 0.55, 0, 1),
      }),
    );
  }
  const [shoulderRight = 0, shoulderLeft = 0] = allocate(shoulders, [1, 1]);
  for (const [side, total] of [
    [1, shoulderRight],
    [-1, shoulderLeft],
  ] as const) {
    for (let i = 0; i < total; i += 1) {
      const u = (i + 0.5) / total;
      const x = side * (0.07 + 0.24 * u);
      const y = -0.25 + 0.07 * u + 0.025 * Math.sin(Math.PI * u);
      const z = Math.abs(x) > BODY_HALF ? wingZ(x, y) - 0.01 : -thickness(x, y) - 0.004;
      drafts.push(draft(x, y, { ...anatomy(x, y), z, face: BACK, density: 3, weight: 0.66, importance: IMPORTANCE.secondary }));
    }
  }

  // The tail: dense and strong at its root, thinning to a filament.
  const [rootTail = 0, restTail = 0] = allocate(tailCount, [0.55, 0.45]);
  const tailDraft = (point: Point, u: number) =>
    draft(point.x, point.y, {
      group: TAIL,
      t: u,
      z: 0.06 * u * u,
      density: u < 0.3 ? 3 : u < 0.65 ? 2 : 1,
      weight: 0.6 - 0.4 * u,
      size: u > 0.55 ? 0 : 1,
      importance: u < 0.35 ? 0.9 : IMPORTANCE.primary - 0.25 * u,
      role: ROLE.trail,
      reach: u,
    });
  dropped += keepSpaced(alongCurve(TAIL_CURVE, rootTail, tailDraft, 0, 0.32), spacing, cell * 0.3, drafts);
  dropped += keepSpaced(alongCurve(TAIL_CURVE, restTail, tailDraft, 0.32, 1), spacing, cell * 0.3, drafts);

  // The body is filled on two layers, back and belly, so it has thickness from the side; its centre is its mass.
  const body = fillRegion(bodyCount, spacing, () =>
    propose(next, 40, (rand) => {
      const x = (rand() * 2 - 1) * BODY_HALF;
      const y = -0.36 + rand() * 0.78;
      if (!contains(OUTLINE, x, y)) return null;
      const centre = Math.abs(x) < 0.08;
      return draft(x, y, {
        group: BODY,
        part: x < 0 ? LEFT : RIGHT,
        density: centre ? 3 : 2,
        weight: 0.8,
        importance: centre ? IMPORTANCE.primary : IMPORTANCE.secondary,
        role: ROLE.core,
        reach: clamp(y + 0.55, 0, 1),
      });
    }),
  );
  body.forEach((item, index) => {
    item.z = (index % 2 === 0 ? -1 : 1) * thickness(item.x, item.y);
    drafts.push(item);
  });

  drafts.push(
    ...fillRegion(fillCount + dropped, spacing, () =>
      propose(next, 40, (rand) => {
        const x = BOX.left + rand() * (BOX.right - BOX.left);
        const y = BOX.top + rand() * (BOX.bottom - BOX.top);
        if (Math.abs(x) <= BODY_HALF || !contains(OUTLINE, x, y)) return null;
        const at = anatomy(x, y);
        // A light interior, a touch darker toward the leading edge and the root where a wing carries its mass.
        const density = chordOf(x, y) < 0.25 || at.t < 0.25 ? 2 : 1;
        return draft(x, y, { ...at, z: wingZ(x, y), density, weight: 0.55 - 0.3 * at.t, importance: IMPORTANCE.fill });
      }),
    ),
  );

  drafts.push(
    ...fillRegion(wakeCount, spacing, () =>
      propose(next, 10, (rand) => {
        const side = rand() < 0.5 ? -1 : 1;
        const edge = TRAILING_EDGE ? TRAILING_EDGE(0.15 + 0.7 * rand()) : P(0.5, 0.1);
        const point = { x: edge.x + (rand() - 0.5) * 0.05, y: edge.y + 0.03 + rand() * 0.05 };
        const placed = side < 0 ? mirror(point) : point;
        if (contains(OUTLINE, placed.x, placed.y)) return null;
        return draft(placed.x, placed.y, {
          group: WAKE,
          part: side < 0 ? LEFT : RIGHT,
          t: wingDistance(placed.x),
          z: wingZ(placed.x, placed.y),
          density: 1,
          weight: 0.03,
          size: 0,
          importance: IMPORTANCE.atmosphere,
          role: ROLE.fine,
        });
      }),
    ),
  );

  drafts.forEach(hinge);
  return finalize(drafts, count, next, ORIGIN);
}

export const manta: MotifDefinition = {
  type: "manta",
  sheet: true,
  build,
  animate(anchor, frame, phase, out) {
    const m = HERO_FIELD_CONFIG.motion.manta;
    const { time, vigor } = frame;
    const omega = TAU / m.flapPeriod;
    // Strokes come in bouts; between them the animal glides on nearly still wings.
    const glide = 1 - m.glideDepth * (0.5 + 0.5 * Math.sin(time * m.glideSpeed));
    const stroke = m.flapAngle * vigor * glide;
    const along = anchor.y - SNOUT;
    // A slow wave runs from the head down the body, so the animal reads as elastic.
    let dz = m.undulate * vigor * Math.sin(time * omega - along * m.bodyWave);
    let dx = 0;
    let dy = 0;

    if (anchor.group === WING || anchor.group === WAKE) {
      const side = anchor.part === LEFT ? -1 : 1;
      const wave = time * omega + side * m.sidePhase - anchor.t * m.wingLag - along * m.chordLag;
      // The wing bends progressively: almost still at the body, the full stroke at the tip.
      const angle = stroke * Math.sin(wave) * Math.pow(anchor.t, m.bend);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const reach = Math.abs(anchor.x - anchor.px);
      const rise = anchor.z - anchor.pz;
      dx += side * (reach * cos + rise * sin - reach);
      dz += rise * cos - reach * sin - rise;
      dy += m.sweep * vigor * anchor.t * anchor.t * Math.cos(wave);

      if (anchor.group === WAKE) {
        // Each wake glyph lives a fraction of a second, slipping back off the trailing edge as it fades.
        const life = m.wakeLife[0] + (m.wakeLife[1] - m.wakeLife[0]) * fract(phase * 0.618);
        const age = fract(time / life + phase / TAU);
        dy += age * life * frame.speed * m.wakeDrift * 2.5;
        out.alpha = Math.sin(Math.PI * age) * vigor;
      }
    } else if (anchor.group === TAIL) {
      const u = anchor.t;
      dx = Math.sin(time * m.tailSpeed - u * m.tailWave) * m.tailAmp * u + frame.turn * m.tailTurn * u * u;
      dz += Math.sin(time * m.tailSpeed * 0.7 - u * 3) * m.tailDepth * u;
    }

    // The body heaves against each downstroke.
    dz -= m.heave * vigor * glide * Math.sin(time * omega + 0.4) * (anchor.group === WING ? 1 - anchor.t : 1);

    out.dx = dx;
    out.dy = dy;
    out.dz = dz;
  },
};
