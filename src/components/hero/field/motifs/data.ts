import { HERO_FIELD_CONFIG } from "../config";
import { clamp, fract, hash, random, TAU } from "../math";
import {
  allocate,
  alongCurve,
  cubic,
  draft,
  fillRegion,
  finalize,
  keepSpaced,
  polyline,
  propose,
  Spacing,
  type Curve,
  type Draft,
  type Point,
} from "../sample";
import type { MotifDefinition } from "../types";

const HEAD = 0;
const FACE = 1;
const NECK = 2;
const CABLE = 3;
const STRUCTURE = 4;
const NOISE = 5;

const RAD = Math.PI / 180;
const P = (x: number, y: number): Point => ({ x, y });

const SKULL = { x: 0, y: -0.18, rx: 0.22, ry: 0.29 };

/** Egg-shaped head, narrower toward the jaw. */
function skull(theta: number, grow = 0): Point {
  const s = Math.sin(theta);
  const taper = 1 - 0.18 * Math.max(0, s);
  return { x: SKULL.x + Math.cos(theta) * (SKULL.rx + grow) * taper, y: SKULL.y + s * (SKULL.ry + grow) };
}

function insideSkull(x: number, y: number, grow = 0): boolean {
  const ny = (y - SKULL.y) / (SKULL.ry + grow);
  const taper = 1 - 0.18 * Math.max(0, ny);
  const nx = (x - SKULL.x) / ((SKULL.rx + grow) * taper);
  return nx * nx + ny * ny < 1;
}

interface Cable {
  /** Where the cable plugs into the skull, screen degrees (−90 is the crown). */
  root: number;
  end: Point;
  /** How far the cable leaves the skull along its normal before turning. */
  reach: number;
  /** Offset of the second control point from the end: the droop. */
  bend: Point;
  strands: 1 | 2;
  pulse: boolean;
}

/** Ordered by importance, so smaller organisms keep the cables that define the silhouette. */
const CABLES: readonly Cable[] = [
  { root: -96, end: P(-0.3, -1), reach: 0.3, bend: P(0.1, 0.36), strands: 1, pulse: true },
  { root: -40, end: P(0.98, -0.64), reach: 0.22, bend: P(-0.36, 0.34), strands: 2, pulse: true },
  { root: -150, end: P(-1, -0.34), reach: 0.24, bend: P(0.36, 0.34), strands: 2, pulse: true },
  { root: 14, end: P(0.98, 0.4), reach: 0.24, bend: P(-0.34, 0.24), strands: 1, pulse: true },
  { root: 172, end: P(-0.98, 0.3), reach: 0.24, bend: P(0.34, 0.26), strands: 1, pulse: false },
  { root: -70, end: P(0.36, -0.98), reach: 0.24, bend: P(-0.04, 0.32), strands: 1, pulse: false },
  { root: -12, end: P(1, -0.1), reach: 0.22, bend: P(-0.42, 0.36), strands: 1, pulse: false },
  { root: -124, end: P(-0.86, -0.86), reach: 0.24, bend: P(0.32, 0.32), strands: 1, pulse: true },
  { root: 42, end: P(0.6, 0.62), reach: 0.22, bend: P(0.02, -0.3), strands: 1, pulse: false },
  { root: 138, end: P(-0.6, 0.62), reach: 0.22, bend: P(-0.02, -0.32), strands: 1, pulse: true },
];

function cableCurve(cable: Cable, shift = 0): Curve {
  const a = (cable.root + shift * 7) * RAD;
  const root = skull(a);
  const lead = P(root.x + Math.cos(a) * cable.reach, root.y + Math.sin(a) * cable.reach);
  const end = P(cable.end.x + shift * 0.035 * Math.sin(a), cable.end.y - shift * 0.035 * Math.cos(a));
  return cubic(root, lead, P(end.x + cable.bend.x, end.y + cable.bend.y), end);
}

function curveLength(curve: Curve): number {
  let total = 0;
  let prev = curve(0);
  for (let step = 1; step <= 32; step += 1) {
    const point = curve(step / 32);
    total += Math.hypot(point.x - prev.x, point.y - prev.y);
    prev = point;
  }
  return total;
}

/** Lines and boxes of the machine bed the head rests on. */
const STRUCTURES: readonly (readonly Point[])[] = [
  [P(-0.92, 0.66), P(-0.2, 0.66)],
  [P(0.2, 0.66), P(0.92, 0.66)],
  [P(-0.78, 0.84), P(0.78, 0.84)],
  [P(-0.66, 0.7), P(-0.4, 0.7), P(-0.4, 0.79), P(-0.66, 0.79), P(-0.66, 0.7)],
  [P(0.38, 0.7), P(0.64, 0.7), P(0.64, 0.79), P(0.38, 0.79), P(0.38, 0.7)],
  [P(-0.16, 0.57), P(0.16, 0.57), P(0.16, 0.66), P(-0.16, 0.66), P(-0.16, 0.57)],
  [P(-0.9, 0.42), P(-0.9, 0.66)],
  [P(0.9, 0.42), P(0.9, 0.66)],
];

function polylineLength(points: readonly Point[]): number {
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1];
    const b = points[index];
    if (a && b) total += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return total;
}

function face(count: number): Draft[] {
  const [eyes = 0, seam = 0, nose = 0, mouth = 0] = allocate(count, [0.4, 0.3, 0.1, 0.2]);
  const out: Draft[] = [];
  const [left = 0, right = 0] = allocate(eyes, [1, 1]);

  for (const [side, n] of [
    [-1, left],
    [1, right],
  ] as const) {
    for (let index = 0; index < n; index += 1) {
      const u = n === 1 ? 0.5 : index / (n - 1);
      out.push(
        draft(side * (0.045 + 0.08 * u), SKULL.y + 0.02 + 0.012 * Math.sin(Math.PI * u), {
          group: FACE,
          density: 3,
          weight: 0.95,
        }),
      );
    }
  }

  out.push(
    ...alongCurve(
      (u) => skull(-150 * RAD + u * 120 * RAD, -0.07),
      seam,
      (point) => draft(point.x, point.y, { group: FACE, density: 2, weight: 0.7, size: 0 }),
    ),
  );

  for (let index = 0; index < nose; index += 1) {
    out.push(draft(0.004 * index, SKULL.y + 0.09 + index * 0.03, { group: FACE, density: 2, weight: 0.6, size: 0 }));
  }
  for (let index = 0; index < mouth; index += 1) {
    const u = mouth === 1 ? 0.5 : index / (mouth - 1);
    out.push(draft(-0.045 + 0.09 * u, SKULL.y + 0.19, { group: FACE, density: 2, weight: 0.75 }));
  }

  return out;
}

function build(count: number, seed: number) {
  const next = random(seed);
  const cell = 1.7 / Math.sqrt(count);
  const spacing = new Spacing(cell);
  const drafts: Draft[] = [];
  const [
    contourCount = 0,
    headFill = 0,
    faceCount = 0,
    neckCount = 0,
    cableTotal = 0,
    structureTotal = 0,
    noiseCount = 0,
  ] = allocate(count, [0.12, 0.06, 0.07, 0.05, 0.42, 0.2, 0.08]);

  for (const item of face(faceCount)) {
    drafts.push(item);
    spacing.add(item.x, item.y);
  }

  const roots = CABLES.map((cable) => cable.root * RAD);
  let dropped = keepSpaced(
    alongCurve(
      (u) => skull(u * TAU),
      contourCount,
      (point, u) => {
        const theta = u * TAU;
        const port = roots.some((root) => Math.abs(Math.atan2(Math.sin(theta - root), Math.cos(theta - root))) < 0.12);
        return draft(point.x, point.y, { group: HEAD, part: 1, density: port ? 4 : 3, weight: 0.9 });
      },
    ),
    spacing,
    cell * 0.4,
    drafts,
  );

  const rings = Math.max(1, Math.round(neckCount / 2.4));
  const neck: Draft[] = [];
  for (let ring = 0; ring < rings; ring += 1) {
    const y = 0.13 + ((ring + 0.5) / rings) * 0.42;
    const perRing = Math.max(1, Math.round(neckCount / rings));
    for (let index = 0; index < perRing && neck.length < neckCount; index += 1) {
      const x = perRing === 1 ? 0 : -0.06 + (0.12 * index) / (perRing - 1);
      neck.push(draft(x, y, { group: NECK, density: index === Math.floor(perRing / 2) ? 3 : 2, weight: 0.7 }));
    }
  }
  dropped += keepSpaced(neck, spacing, cell * 0.25, drafts);

  const cableCount = clamp(Math.round(cableTotal / 6), 5, CABLES.length);
  const strands: { cable: Cable; index: number; curve: Curve; second: boolean }[] = [];
  CABLES.slice(0, cableCount).forEach((cable, index) => {
    strands.push({ cable, index, curve: cableCurve(cable), second: false });
    if (cable.strands === 2 && count >= 140) strands.push({ cable, index, curve: cableCurve(cable, 1), second: true });
  });
  const strandCounts = allocate(cableTotal, strands.map((strand) => curveLength(strand.curve) * (strand.second ? 0.6 : 1)));

  strands.forEach((strand, order) => {
    const n = strandCounts[order] ?? 0;
    const root = strand.curve(0);
    const points = alongCurve(strand.curve, n, (point, u, index) => {
      const last = index === n - 1;
      const density = strand.second ? (index % 3 === 1 ? 2 : 1) : last ? 5 : u < 0.08 ? 4 : index % 4 === 2 ? 3 : 2;
      return draft(point.x, point.y, {
        group: CABLE,
        part: strand.index,
        t: u,
        px: root.x,
        py: root.y,
        density,
        weight: last && !strand.second ? 0.75 : 0.5,
        size: strand.second ? 0 : last ? 2 : 1,
      });
    });
    dropped += keepSpaced(points, spacing, cell * 0.3, drafts);
  });

  const structureCounts = allocate(structureTotal - 2, STRUCTURES.map(polylineLength));
  const structure: Draft[] = [
    draft(-0.53, 0.745, { group: STRUCTURE, density: 5, weight: 0.7 }),
    draft(0.51, 0.745, { group: STRUCTURE, density: 5, weight: 0.7 }),
  ];
  STRUCTURES.forEach((line, index) => {
    const box = line.length > 2;
    structure.push(
      ...alongCurve(polyline(line), structureCounts[index] ?? 0, (point) =>
        draft(point.x, point.y, { group: STRUCTURE, part: index, density: box ? 3 : 2, weight: box ? 0.65 : 0.5 }),
      ),
    );
  });
  dropped += keepSpaced(structure, spacing, cell * 0.3, drafts);

  drafts.push(
    ...fillRegion(headFill + dropped, spacing, () =>
      propose(next, 40, (rand) => {
        const x = SKULL.x + (rand() * 2 - 1) * SKULL.rx;
        const y = SKULL.y + (rand() * 2 - 1) * SKULL.ry;
        if (!insideSkull(x, y, -0.03)) return null;
        return draft(x, y, { group: HEAD, part: 0, density: 1, weight: 0.35, size: 0 });
      }),
    ),
  );

  drafts.push(
    ...fillRegion(noiseCount, spacing, () =>
      propose(next, 20, (rand) => {
        const x = rand() * 2 - 1;
        const y = -1 + rand() * 1.9;
        if (insideSkull(x, y, 0.1)) return null;
        return draft(x, y, { group: NOISE, density: 1, weight: 0.02, size: 0 });
      }),
    ),
  );

  return finalize(drafts, count, next);
}

export const data: MotifDefinition = {
  type: "data",
  sheet: false,
  build,
  animate(anchor, frame, phase, out) {
    const time = frame.time;
    const m = HERO_FIELD_CONFIG.motion.data;

    if (anchor.group === CABLE) {
      const cable = CABLES[anchor.part];
      const cablePhase = anchor.part * 1.7;
      const tension = 0.55 + 0.45 * Math.sin(time * m.tensionSpeed + cablePhase);
      const wave =
        Math.sin(time * m.waveSpeed - anchor.t * m.waveLength + cablePhase) * m.waveAmp * tension * Math.pow(anchor.t, 1.2);
      const vx = anchor.x - anchor.px;
      const vy = anchor.y - anchor.py;
      const len = Math.hypot(vx, vy) || 1;
      out.dx = (-vy / len) * wave;
      out.dy = (vx / len) * wave + m.sag * anchor.t * anchor.t * (tension - 0.55);

      if (cable?.pulse) {
        // A signal travels from the far end into the head, then the cable rests until its next one.
        const period = m.pulseEvery + (anchor.part % 4) * 1.3;
        const travel = fract((time + cablePhase * 2.3) / period) * (period / m.pulseTravel);
        const head = 1.15 - travel * 1.3;
        const d = Math.abs(anchor.t - head);
        if (d < m.pulseWidth) {
          const k = 1 - d / m.pulseWidth;
          out.density += 2.4 * k;
          out.alpha *= 1 + 0.6 * k;
        }
      }
      return;
    }

    if (anchor.group === HEAD || anchor.group === FACE) {
      const row = Math.floor((anchor.y + 2) * 18);
      const tick = Math.floor(time * m.scanRate);
      const roll = hash(row, tick);
      if (roll > 1 - m.scanChance) out.dx = (roll > 1 - m.scanChance / 2 ? 1 : -1) * m.scanShift;
      out.dy = Math.sin(time * 0.35) * 0.004;
      return;
    }

    if (anchor.group === NECK) {
      out.dy = Math.sin(time * 0.35 - 0.4) * 0.003;
      return;
    }

    if (anchor.group === STRUCTURE) {
      if (Math.sin(time * 0.9 + phase * 3) > 0.94) out.density += 1;
      return;
    }

    out.dx = Math.sin(time * 0.21 + phase) * 0.018;
    out.dy = Math.cos(time * 0.17 + phase * 1.3) * 0.014;
    out.alpha = 0.6 + 0.4 * Math.sin(time * 0.5 + phase * 2);
  },
};
