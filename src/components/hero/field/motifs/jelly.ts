import { IMPORTANCE, ROLE } from "../anatomy";
import { HERO_FIELD_CONFIG } from "../config";
import { fract, random, smoothstep, TAU } from "../math";
import { allocate, draft, finalize, type Draft, type Point } from "../sample";
import type { MotifDefinition } from "../types";

const BELL = 0;
const CORE = 1;
const MAIN = 2;
const FILAMENT = 3;
const DUST = 4;

/*
 * A jellyfish built around a vertical axis (y down, z away from the camera):
 * a dome of revolution whose margin turns slightly under, scalloped into
 * lobes, with radial canals and rings that read as ellipses once the bell
 * tilts. Inside it float four gonad lobes above the manubrium, which opens
 * beneath the bell where the tentacles begin: four frilled main tentacles, a
 * longer central one, and a ring of fine filaments from the margin.
 */
const CROWN = -0.64;
const RADIUS = 0.54;
const HEIGHT = 0.46;
/** How far past its widest ring the margin curls under, in radians of the profile. */
const CURL = 0.16;
const LOBES = 16;
const CANALS = 12;
const MAINS = 4;
const FILAMENTS = 14;
/** Where the tentacles leave the underside of the bell. */
const MOUTH = -0.12;
/** Centre of the bell's curvature, which its surface normals point away from. */
const BELL_CENTRE = CROWN + HEIGHT * 0.9;
/** The animal turns around its bell. */
const ORIGIN: Point = { x: 0, y: -0.3 };

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Point on the bell: `u` runs crown → margin, `phi` around the axis. */
function bellAt(u: number, phi: number): Vec3 {
  const a = u * (Math.PI / 2 + CURL);
  const lobe = 1 + 0.035 * Math.cos(LOBES * phi) * u * u * u;
  const rho = RADIUS * Math.sin(a) * lobe;
  return { x: rho * Math.cos(phi), y: CROWN + HEIGHT * (1 - Math.cos(a)), z: rho * Math.sin(phi) };
}

/** The bell's crown is the core; below it, each half of the bell belongs to its side. */
function bellRole(x: number, u: number): number {
  if (u < 0.55) return ROLE.core;
  return x < 0 ? ROLE.left : ROLE.right;
}

interface BellMark {
  density: number;
  weight: number;
  importance: number;
  role?: number;
  size?: Draft["size"];
}

function bellDraft(u: number, phi: number, mark: BellMark, inset = 1, drop = 0): Draft {
  const p = bellAt(u, phi);
  const x = p.x * inset;
  return draft(x, p.y + drop, {
    group: BELL,
    t: u,
    z: p.z * inset,
    py: BELL_CENTRE,
    density: mark.density,
    weight: mark.weight,
    importance: mark.importance,
    role: mark.role ?? bellRole(x, u),
    reach: 0.45 * u,
    size: mark.size ?? 1,
  });
}

function ring(count: number, offset: number, make: (phi: number, index: number) => Draft): Draft[] {
  const out: Draft[] = [];
  for (let index = 0; index < count; index += 1) out.push(make(((index + offset) / count) * TAU, index));
  return out;
}

interface TentacleSpec {
  part: number;
  role: number;
  angle: number;
  /** Radians the tentacle winds around the axis from root to tip. */
  spiral: number;
  /** How far from the axis it drifts out as it falls. */
  spread: number;
  length: number;
  /** Half-width of the frilled ribbon. */
  frill: number;
  /** Where along its role the tentacle starts, so morphs pair root with root. */
  reachFrom: number;
  /** Importance of the spine below its root. */
  strong: number;
}

/** A main tentacle: a spine and two frilled edges hanging from the mouth under the bell. */
function tentacle(out: Draft[], count: number, spec: TentacleSpec): void {
  const [spine = 0, edges = 0] = allocate(count, [0.45, 0.55]);
  const [left = 0, right = 0] = allocate(edges, [1, 1]);
  for (const [offset, total] of [
    [0, spine],
    [1, left],
    [-1, right],
  ] as const) {
    for (let i = 0; i < total; i += 1) {
      const s = (i + 0.5) / total;
      const angle = spec.angle + spec.spiral * s;
      const reach = 0.07 + spec.spread * Math.sin((Math.PI / 2) * s) + 0.02 * Math.sin(s * 7 + spec.part);
      const frill = spec.frill * (1 + 0.35 * Math.sin(s * 9 + spec.part)) * (1 - 0.4 * s) * offset;
      const isSpine = offset === 0;
      out.push(
        draft(Math.cos(angle) * reach - Math.sin(angle) * frill, MOUTH + spec.length * s, {
          group: MAIN,
          part: spec.part,
          t: s,
          z: Math.sin(angle) * reach + Math.cos(angle) * frill,
          py: MOUTH,
          density: isSpine ? (s < 0.45 ? 3 : 2) : s < 0.4 ? 2 : 1,
          weight: (isSpine ? 0.65 : 0.45) - 0.3 * s,
          importance: isSpine ? (s < 0.2 ? 0.92 : spec.strong + 0.1 - 0.12 * s) : IMPORTANCE.secondary - 0.25 * s,
          role: spec.role,
          reach: spec.reachFrom + (1 - spec.reachFrom) * s,
          size: isSpine && s < 0.5 ? 1 : 0,
        }),
      );
    }
  }
}

/*
 * Glyphs are spent where the jellyfish reads: the margin and the row just
 * inside it, the canals that hold the dome's shape at any distance, the inner
 * mass, the tentacle origin and the main tentacles. Bell skin and the fine
 * filaments stay sparse, so it reads as a bell with tentacles, not a cloud.
 */
function build(count: number, seed: number) {
  const next = random(seed);
  const [
    rimCount = 0,
    innerCount = 0,
    canalCount = 0,
    ringCount = 0,
    skinCount = 0,
    velumCount = 0,
    gonadCount = 0,
    mouthCount = 0,
    mainCount = 0,
    centralCount = 0,
    filamentCount = 0,
    dustCount = 0,
  ] = allocate(count, [0.085, 0.045, 0.08, 0.03, 0.11, 0.015, 0.06, 0.05, 0.25, 0.07, 0.18, 0.015]);
  const drafts: Draft[] = [];

  // The margin is the strongest line: it is what turns into an ellipse as the bell tilts.
  drafts.push(
    ...ring(rimCount, 0.5, (phi, index) =>
      bellDraft(1, phi, {
        density: index % 5 === 0 ? 4 : 3,
        weight: 0.95,
        importance: IMPORTANCE.silhouette,
        role: ROLE.edge,
      }),
    ),
  );
  // A second row just above it, so the lower edge of the bell reads as a band.
  drafts.push(...ring(innerCount, 0.2, (phi) => bellDraft(0.9, phi, { density: 3, weight: 0.8, importance: 0.85 })));
  drafts.push(
    ...ring(velumCount, 0.25, (phi) =>
      bellDraft(1, phi, { density: 2, weight: 0.6, importance: IMPORTANCE.secondary, size: 0 }, 0.86, 0.03),
    ),
  );
  drafts.push(
    ...ring(ringCount, 0.1, (phi) => bellDraft(0.6, phi, { density: 2, weight: 0.7, importance: IMPORTANCE.secondary })),
  );

  // Radial canals: a light wireframe that keeps the dome a dome even when little else is drawn.
  allocate(canalCount, new Array<number>(CANALS).fill(1)).forEach((n, k) => {
    const phi = ((k + 0.5) / CANALS) * TAU;
    for (let i = 0; i < n; i += 1) {
      drafts.push(bellDraft(0.12 + (0.84 * (i + 0.5)) / n, phi, { density: 2, weight: 0.6, importance: 0.72 }));
    }
  });

  // The rest of the bell skin, weighted toward the lower bell where the dome turns.
  for (let placed = 0, guard = 0; placed < skinCount && guard < skinCount * 40; guard += 1) {
    const u = 0.05 + 0.93 * next();
    if (next() > Math.sin(u * (Math.PI / 2 + CURL)) * (0.45 + 0.55 * u) + 0.06) continue;
    drafts.push(
      bellDraft(u, next() * TAU, { density: next() < 0.3 ? 2 : 1, weight: 0.45, importance: IMPORTANCE.fill, size: 0 }),
    );
    placed += 1;
  }

  // Four soft gonad lobes: an inner mass that stays a mass from any side, denser toward each lobe's heart.
  allocate(gonadCount, [1, 1, 1, 1]).forEach((n, k) => {
    const angle = Math.PI / 4 + (k * Math.PI) / 2;
    const cx = Math.cos(angle) * 0.17;
    const cz = Math.sin(angle) * 0.17;
    for (let i = 0; i < n; i += 1) {
      const a = next() * TAU;
      const b = Math.acos(2 * next() - 1);
      const r = Math.cbrt(next());
      const y = -0.4 + Math.cos(b) * r * 0.055;
      drafts.push(
        draft(cx + Math.sin(b) * Math.cos(a) * r * 0.08, y, {
          group: CORE,
          part: k,
          z: cz + Math.sin(b) * Math.sin(a) * r * 0.08,
          py: y,
          density: r < 0.4 ? 4 : 3,
          weight: 0.85,
          importance: IMPORTANCE.primary,
          role: ROLE.core,
          reach: 0.2,
        }),
      );
    }
  });

  // The manubrium and the mouth under the bell, where every main tentacle visibly starts.
  const [stalk = 0, mouthRing = 0] = allocate(mouthCount, [0.45, 0.55]);
  for (let i = 0; i < stalk; i += 1) {
    const u = (i + 0.5) / stalk;
    const psi = u * TAU * 2.5;
    const y = -0.4 + (MOUTH + 0.42) * u;
    drafts.push(
      draft(Math.cos(psi) * 0.05, y, {
        group: CORE,
        z: Math.sin(psi) * 0.05,
        py: y,
        density: 3,
        weight: 0.8,
        importance: 0.85,
        role: ROLE.core,
        reach: 0.3,
      }),
    );
  }
  drafts.push(
    ...ring(mouthRing, 0, (phi, index) =>
      draft(Math.cos(phi) * 0.075, MOUTH + 0.01, {
        group: CORE,
        z: Math.sin(phi) * 0.075,
        py: MOUTH,
        density: index % 3 === 0 ? 4 : 3,
        weight: 0.85,
        importance: 0.85,
        role: ROLE.core,
        reach: 0.32,
      }),
    ),
  );

  // Four frilled main tentacles, two to each side, spiralling gently out as they fall.
  allocate(mainCount, [1, 1.05, 0.95, 1]).forEach((n, k) => {
    const angle = Math.PI / 4 + (k * Math.PI) / 2;
    tentacle(drafts, n, {
      part: k,
      role: Math.cos(angle) < 0 ? ROLE.left : ROLE.right,
      angle,
      spiral: 0.7,
      spread: 0.17,
      length: 0.84 + 0.08 * Math.sin(k * 2.1),
      frill: 0.035,
      reachFrom: 0.5,
      strong: IMPORTANCE.primary,
    });
  });

  // The longest tentacle hangs from the centre: a manta's tail becomes it, and it becomes the tail again.
  tentacle(drafts, centralCount, {
    part: MAINS,
    role: ROLE.trail,
    angle: 0.3,
    spiral: 1.2,
    spread: 0.05,
    length: 1.08,
    frill: 0.022,
    reachFrom: 0,
    strong: 0.85,
  });

  // Fine filaments from the margin: long and short alternate, each settling into its own slow S-curve.
  const lengths = Array.from({ length: FILAMENTS }, (_, k) => (k % 2 === 0 ? 0.7 : 0.42) + 0.24 * fract(Math.sin(k * 7.3) * 91));
  allocate(filamentCount, lengths).forEach((n, k) => {
    const phi = ((k + 0.5) / FILAMENTS) * TAU;
    const root = bellAt(0.99, phi);
    const length = lengths[k] ?? 0.6;
    const ux = Math.cos(phi);
    const uz = Math.sin(phi);
    for (let i = 0; i < n; i += 1) {
      const s = (i + 0.5) / n;
      const flare = 0.07 * Math.sin(Math.PI * Math.min(1, s * 1.3)) - 0.05 * s * s;
      const curve = 0.06 * Math.sin(Math.PI * 1.5 * s + k * 1.3) * s;
      drafts.push(
        draft(root.x + ux * flare - uz * curve, root.y + length * s, {
          group: FILAMENT,
          part: k,
          t: s,
          z: root.z + uz * flare + ux * curve,
          px: root.x,
          py: root.y,
          pz: root.z,
          density: s < 0.3 ? 2 : 1,
          weight: 0.38 - 0.28 * s,
          size: 0,
          importance: s < 0.25 ? IMPORTANCE.secondary : s < 0.65 ? IMPORTANCE.fill : IMPORTANCE.atmosphere,
          role: ROLE.edge,
          reach: 0.5 + 0.5 * s,
        }),
      );
    }
  });

  for (let i = 0; i < dustCount; i += 1) {
    const phi = next() * TAU;
    const r = 0.2 + 0.55 * next();
    drafts.push(
      draft(Math.cos(phi) * r, -0.5 + 1.2 * next(), {
        group: DUST,
        z: Math.sin(phi) * r,
        density: 1,
        weight: 0.02,
        size: 0,
        importance: IMPORTANCE.atmosphere,
        role: ROLE.fine,
      }),
    );
  }

  return finalize(drafts, count, next, ORIGIN);
}

/** Bell contraction, 0 → 1 → 0: a quick squeeze, then a long relaxation. */
export function bellPulse(time: number): number {
  const c = fract(time / HERO_FIELD_CONFIG.motion.jelly.pulsePeriod);
  return c < 0.3 ? smoothstep(0, 0.3, c) : 1 - smoothstep(0.3, 1, c);
}

export const jelly: MotifDefinition = {
  type: "jelly",
  sheet: false,
  build,
  animate(anchor, frame, phase, out) {
    const m = HERO_FIELD_CONFIG.motion.jelly;
    const { time, vigor } = frame;

    if (anchor.group === BELL) {
      // The margin draws in most, so the bell narrows and lengthens on each squeeze.
      const p = bellPulse(time) * vigor;
      const squeeze = m.squeeze * p * Math.pow(anchor.t, 1.3);
      out.dx = -anchor.x * squeeze;
      out.dz = -anchor.z * squeeze;
      out.dy = m.stretch * p * anchor.t * anchor.t;
      // Translucent bell: where the surface turns away from the eye it gathers into a bright
      // outline, where it faces the eye it thins out, from whichever side it is seen.
      const ny = (anchor.y - anchor.py) * 0.9;
      const length = Math.hypot(anchor.x, ny, anchor.z) || 1;
      const facing = Math.abs(anchor.x * frame.viewX + ny * frame.viewY + anchor.z * frame.viewZ) / length;
      const edge = (1 - facing) * (1 - facing);
      out.density = m.rim.density * edge;
      out.alpha = m.rim.alpha[0] + (m.rim.alpha[1] - m.rim.alpha[0]) * edge;
      return;
    }

    if (anchor.group === CORE) {
      const p = bellPulse(time - m.coreLag) * vigor;
      out.dx = -anchor.x * m.core * p;
      out.dz = -anchor.z * m.core * p;
      out.dy = -0.02 * p;
      return;
    }

    if (anchor.group === MAIN || anchor.group === FILAMENT) {
      // Trailing parts take the pulse late, sway in the current and drag behind the drift.
      const s = anchor.t;
      const p = bellPulse(time - s * m.lag) * vigor;
      const main = anchor.group === MAIN;
      const follow = (main ? m.armFollow : m.squeeze) * p * (1 - 0.5 * s);
      const k = anchor.part;
      const sway = (main ? 0.7 : 1) * m.sway * s * (0.4 + 0.6 * vigor);
      const drag = m.trail * Math.pow(s, 1.4);
      out.dx = -anchor.px * follow + Math.sin(time * m.swaySpeed - s * m.wave + k * 1.7) * sway - frame.flowX * drag;
      out.dy = m.stretch * p * (0.6 + s) - frame.flowY * drag;
      out.dz = -anchor.pz * follow + Math.cos(time * m.swaySpeed * 0.8 - s * m.wave + k * 2.3) * sway - frame.flowZ * drag;
      return;
    }

    out.dx = Math.sin(time * 0.4 + phase) * m.dust;
    out.dy = Math.cos(time * 0.33 + phase * 1.3) * m.dust;
    out.dz = Math.sin(time * 0.29 + phase * 0.7) * m.dust;
    out.alpha = 0.6 + 0.4 * Math.sin(time * 0.5 + phase);
  },
};
