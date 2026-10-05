import { HERO_FIELD_CONFIG } from "../config";
import { clamp, random, smoothstep, TAU } from "../math";
import {
  allocate,
  alongCurve,
  draft,
  fillRegion,
  finalize,
  keepSpaced,
  propose,
  Spacing,
  type Draft,
} from "../sample";
import type { MotifDefinition } from "../types";

const PETAL = 0;
const THROAT = 1;
const STAMEN = 2;
const POLLEN = 3;

const RAD = Math.PI / 180;

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Petal {
  angle: number;
  length: number;
  /** Half-width at the widest point. */
  width: number;
  /** How far the tip folds back behind the flower. */
  recurve: number;
  /** Sideways sweep in the flower's plane. */
  sweep: number;
  phase: number;
}

/*
 * The lily is modelled in 3D and projected: tepals leave the throat as a
 * trumpet, flare, then fold back. Tilting the flower is what makes the upper
 * and right petals read larger and the lower ones curl, so the silhouette is
 * organic rather than a six-pointed icon. Wide inner petals alternate with
 * narrow outer tepals.
 */
const PETALS: readonly Petal[] = [
  { angle: -90, length: 1, width: 0.17, recurve: 0.72, sweep: 0.12, phase: 0 },
  { angle: -30, length: 1.04, width: 0.12, recurve: 0.8, sweep: 0.2, phase: 1.9 },
  { angle: 30, length: 0.98, width: 0.17, recurve: 0.86, sweep: 0.1, phase: 3.7 },
  { angle: 90, length: 0.94, width: 0.12, recurve: 1, sweep: -0.14, phase: 5.2 },
  { angle: 150, length: 0.98, width: 0.17, recurve: 0.9, sweep: -0.16, phase: 2.6 },
  { angle: 210, length: 1, width: 0.12, recurve: 0.78, sweep: -0.1, phase: 4.4 },
];

const TRUMPET = 0.55;

interface Stamen {
  angle: number;
  length: number;
  spread: number;
  phase: number;
}

/** Six stamens between the petals; the last entry is the pistil. */
const STAMENS: readonly Stamen[] = [
  { angle: -60, length: 0.74, spread: 0.4, phase: 0.6 },
  { angle: 0, length: 0.8, spread: 0.42, phase: 1.4 },
  { angle: 60, length: 0.76, spread: 0.4, phase: 2.3 },
  { angle: 120, length: 0.7, spread: 0.38, phase: 3.1 },
  { angle: 180, length: 0.72, spread: 0.4, phase: 4.2 },
  { angle: 240, length: 0.7, spread: 0.39, phase: 5 },
  { angle: 25, length: 0.9, spread: 0.16, phase: 2.7 },
];

const PISTIL = STAMENS.length - 1;

/** A nodding bloom: upper and right tepals open toward the viewer, stamens hang below the throat. */
const TILT = { pitch: 0.4, yaw: -0.35, roll: 3.7 };
const COS_P = Math.cos(TILT.pitch);
const SIN_P = Math.sin(TILT.pitch);
const COS_Y = Math.cos(TILT.yaw);
const SIN_Y = Math.sin(TILT.yaw);
const COS_R = Math.cos(TILT.roll);
const SIN_R = Math.sin(TILT.roll);

function project(p: Vec3): Vec3 {
  const y1 = p.y * COS_P - p.z * SIN_P;
  const z1 = p.y * SIN_P + p.z * COS_P;
  const x2 = p.x * COS_Y + z1 * SIN_Y;
  const z2 = -p.x * SIN_Y + z1 * COS_Y;
  return { x: x2 * COS_R - y1 * SIN_R, y: x2 * SIN_R + y1 * COS_R, z: z2 };
}

/** The flower's own axis, from the throat out of the bloom, after the nod. */
const AXIS = project({ x: 0, y: 0, z: 1 });

/** Axis a petal or stamen at `angle` opens and closes about: across its base, square to the flower axis. */
function hinge(angle: number): Vec3 {
  const u = project({ x: Math.cos(angle * RAD), y: Math.sin(angle * RAD), z: 0 });
  return { x: AXIS.y * u.z - AXIS.z * u.y, y: AXIS.z * u.x - AXIS.x * u.z, z: AXIS.x * u.y - AXIS.y * u.x };
}

function halfWidth(petal: Petal, t: number): number {
  const body = Math.max(0, Math.sin(Math.PI * Math.pow(t, 0.85)));
  const claw = 0.3 + 0.7 * smoothstep(0.08, 0.42, t);
  const ruffle = 1 + 0.08 * Math.sin(t * 19 + petal.phase * 3);
  return petal.width * Math.pow(body, 0.8) * claw * ruffle;
}

/** Point on a petal: `t` runs throat → tip, `s` runs edge → midrib → edge (−1…1). */
function petalAt(petal: Petal, t: number, s: number): Vec3 {
  const a = petal.angle * RAD;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const length = petal.length;
  const radial = length * t;
  const side = length * petal.sweep * t * t + halfWidth(petal, t) * s;
  const z = length * (TRUMPET * t - petal.recurve * t * t) - 0.05 * s * s;
  return project({ x: ux * radial - uy * side, y: uy * radial + ux * side, z });
}

function stamenAt(stamen: Stamen, t: number): Vec3 {
  const a = stamen.angle * RAD;
  const out = stamen.spread * t;
  return project({
    x: Math.cos(a) * out,
    y: Math.sin(a) * out - 0.18 * t * t,
    z: stamen.length * t - 0.12 * t * t,
  });
}

const PETAL_HINGES = PETALS.map((petal) => hinge(petal.angle));
const STAMEN_HINGES = STAMENS.map((stamen) => hinge(stamen.angle));

/** Glyphs folded behind the flower lose a density step and some weight. */
function depthShade(z: number, density: number, weight: number) {
  if (z > -0.12) return { density, weight };
  return { density: Math.max(1, density - 1), weight: weight * 0.7 };
}

function throat(count: number): Draft[] {
  const [ringCount = 0, coreCount = 0] = allocate(count, [0.7, 0.3]);
  const out: Draft[] = [];
  for (let index = 0; index < ringCount; index += 1) {
    const a = (index / ringCount) * TAU + 0.3;
    const p = project({ x: Math.cos(a) * 0.08, y: Math.sin(a) * 0.08, z: 0.03 });
    out.push(draft(p.x, p.y, { group: THROAT, z: p.z, density: index % 3 === 0 ? 4 : 3, weight: 1, t: 0.85 }));
  }
  for (let index = 0; index < coreCount; index += 1) {
    const a = (index / coreCount) * TAU + 1.1;
    const p = project({ x: Math.cos(a) * 0.035, y: Math.sin(a) * 0.035, z: -0.02 });
    out.push(draft(p.x, p.y, { group: THROAT, z: p.z, density: 3, weight: 0.95, t: 0.3 }));
  }
  return out;
}

function stamens(total: number, rich: boolean): Draft[] {
  const antherGlyphs = rich ? 2 : 1;
  const stigmaGlyphs = rich ? 3 : 1;
  const tips = PISTIL * antherGlyphs + stigmaGlyphs;
  const filaments = allocate(Math.max(0, total - tips), STAMENS.map((stamen) => stamen.length));
  const out: Draft[] = [];

  STAMENS.forEach((stamen, index) => {
    out.push(
      ...alongCurve(
        (u) => stamenAt(stamen, u),
        filaments[index] ?? 0,
        (point, u) =>
          draft(point.x, point.y, {
            group: STAMEN,
            part: index,
            t: u,
            z: stamenAt(stamen, u).z,
            density: 2,
            weight: 0.6,
            size: 0,
          }),
        0.18,
        0.9,
      ),
    );

    const tip = stamenAt(stamen, 1);
    const before = stamenAt(stamen, 0.94);
    const len = Math.hypot(tip.x - before.x, tip.y - before.y) || 1;
    const nx = -(tip.y - before.y) / len;
    const ny = (tip.x - before.x) / len;

    if (index === PISTIL) {
      const z = tip.z;
      out.push(draft(tip.x, tip.y, { group: STAMEN, part: index, t: 1, z, density: 4, weight: 1 }));
      if (stigmaGlyphs > 1) {
        out.push(
          draft(tip.x + nx * 0.032, tip.y + ny * 0.032, { group: STAMEN, part: index, t: 1, z, density: 3, weight: 0.9 }),
          draft(tip.x - nx * 0.032, tip.y - ny * 0.032, { group: STAMEN, part: index, t: 1, z, density: 3, weight: 0.9 }),
        );
      }
      return;
    }

    out.push(draft(tip.x, tip.y, { group: STAMEN, part: index, t: 1, z: tip.z, density: 5, weight: 1, size: 2 }));
    if (antherGlyphs > 1) {
      out.push(
        draft(tip.x + nx * 0.034, tip.y + ny * 0.034, {
          group: STAMEN,
          part: index,
          t: 1,
          z: tip.z,
          density: 4,
          weight: 0.9,
        }),
      );
    }
  });

  return out;
}

function build(count: number, seed: number) {
  const next = random(seed);
  const spacing = new Spacing(Math.sqrt(1.1 / count));
  const [petalTotal = 0, throatCount = 0, stamenTotal = 0, pollenCount = 0] = allocate(count, [0.71, 0.06, 0.19, 0.04]);
  const drafts: Draft[] = [];

  const keep = (list: Draft[]) => {
    for (const item of list) {
      drafts.push(item);
      spacing.add(item.x, item.y);
    }
  };

  keep(throat(throatCount));
  keep(stamens(stamenTotal, count >= 160));

  const petalCounts = allocate(petalTotal, PETALS.map((petal) => petal.length * (petal.width + 0.05)));

  const minGap = 0.5 * Math.sqrt(1.1 / count);

  PETALS.forEach((petal, index) => {
    const [edgeCount = 0, ribCount = 0, fillCount = 0] = allocate(petalCounts[index] ?? 0, [0.52, 0.14, 0.34]);
    const [leftCount = 0, rightCount = 0] = allocate(edgeCount, [1, 1]);
    let dropped = 0;

    for (const [side, sideCount] of [
      [1, leftCount],
      [-1, rightCount],
    ] as const) {
      dropped += keepSpaced(
        alongCurve(
          (u) => petalAt(petal, 0.12 + 0.88 * u, side),
          sideCount,
          (point, u) => {
            const t = 0.12 + 0.88 * u;
            const z = petalAt(petal, t, side).z;
            const shade = depthShade(z, t > 0.82 ? 2 : 3, 0.85 - 0.3 * t);
            return draft(point.x, point.y, { group: PETAL, part: index, t, z, ...shade });
          },
        ),
        spacing,
        minGap,
        drafts,
      );
    }

    dropped += keepSpaced(
      alongCurve(
        (u) => petalAt(petal, 0.2 + 0.62 * u, 0),
        ribCount,
        (point, u) => {
          const t = 0.2 + 0.62 * u;
          const z = petalAt(petal, t, 0).z;
          const shade = depthShade(z, t < 0.5 ? 3 : 2, 0.6);
          return draft(point.x, point.y, { group: PETAL, part: index, t, z, ...shade });
        },
      ),
      spacing,
      minGap,
      drafts,
    );

    drafts.push(
      ...fillRegion(fillCount + dropped, spacing, () =>
        propose(next, 30, (rand) => {
          const t = 0.12 + 0.86 * rand();
          const s = (rand() * 2 - 1) * 0.7;
          if (rand() > halfWidth(petal, t) / petal.width) return null;
          const point = petalAt(petal, t, s);
          const spot = t > 0.18 && t < 0.42 && Math.abs(s) < 0.5 && rand() < 0.2;
          const shade = depthShade(point.z, spot ? 4 : t < 0.4 ? 2 : 1, spot ? 0.5 : 0.35);
          return draft(point.x, point.y, { group: PETAL, part: index, t, z: point.z, size: spot ? 0 : 1, ...shade });
        }),
      ),
    );
  });

  drafts.push(
    ...fillRegion(pollenCount, spacing, () =>
      propose(next, 10, (rand) => {
        const a = rand() * TAU;
        const r = 0.55 + 0.45 * rand();
        return draft(Math.cos(a) * r, Math.sin(a) * r * 0.85, {
          group: POLLEN,
          z: (rand() - 0.5) * 0.4,
          t: clamp(r, 0, 1),
          density: 1,
          weight: 0.04,
          size: 0,
        });
      }),
    ),
  );

  return finalize(drafts, count, next);
}

export const lily: MotifDefinition = {
  type: "lily",
  sheet: false,
  build,
  animate(anchor, frame, phase, out) {
    const m = HERO_FIELD_CONFIG.motion.lily;
    const { time, vigor } = frame;

    if (anchor.group === PETAL || anchor.group === STAMEN) {
      // Each petal breathes about its own base in 3D: it opens and closes about
      // its hinge, which changes its depth and so its projected length, swells
      // a little and twists about the flower axis. Stamens follow late and softer.
      const stamen = anchor.group === STAMEN;
      const spec = stamen ? STAMENS[anchor.part]?.phase ?? 0 : PETALS[anchor.part]?.phase ?? 0;
      const axis = (stamen ? STAMEN_HINGES : PETAL_HINGES)[anchor.part] ?? AXIS;
      const lag = stamen ? m.stamenLag : 0;
      const gain = (stamen ? m.stamenGain : 1) * vigor;
      const breath = Math.sin(time * m.breathSpeed + spec - lag);
      const sway = Math.sin(time * m.swaySpeed + spec * 1.7 - lag);
      const vx = anchor.x - anchor.px;
      const vy = anchor.y - anchor.py;
      const vz = anchor.z - anchor.pz;
      const grow = m.expand * breath * gain;
      const open = m.open * breath * anchor.t * gain;
      const twist = m.twist * sway * anchor.t * gain;
      out.dx = vx * grow + open * (axis.y * vz - axis.z * vy) + twist * (AXIS.y * vz - AXIS.z * vy);
      out.dy =
        vy * grow +
        open * (axis.z * vx - axis.x * vz) +
        twist * (AXIS.z * vx - AXIS.x * vz) +
        m.lift * Math.sin(time * m.liftSpeed + spec - lag) * anchor.t * gain;
      out.dz = vz * grow + open * (axis.x * vy - axis.y * vx) + twist * (AXIS.x * vy - AXIS.y * vx);
      if (stamen && anchor.t > 0.95) out.alpha = 1 + 0.15 * breath * vigor;
      return;
    }

    if (anchor.group === THROAT) {
      const breath = 0.02 * Math.sin(time * m.breathSpeed) * vigor;
      out.dx = (anchor.x - anchor.px) * breath;
      out.dy = (anchor.y - anchor.py) * breath;
      out.dz = (anchor.z - anchor.pz) * breath;
      return;
    }

    const away = Math.pow(Math.max(0, Math.sin(time * 0.31 + phase * 2)), 3) * vigor;
    out.dx = (anchor.x - anchor.px) * m.pollenReach * away + Math.sin(time * 0.5 + phase) * 0.01;
    out.dy = (anchor.y - anchor.py) * m.pollenReach * away + Math.cos(time * 0.45 + phase) * 0.01;
    out.dz = Math.sin(time * 0.37 + phase * 1.3) * 0.03;
    out.alpha = 1 - 0.5 * away;
  },
};
