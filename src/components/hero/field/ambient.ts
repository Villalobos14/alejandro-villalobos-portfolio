import { HERO_FIELD_CONFIG as CONFIG, MONO } from "./config";
import { random, smoothstep, TAU } from "./math";
import type { Organism } from "./organism";

type Mark = "dot" | "cross" | "block";

interface DriftSpeck {
  x: number;
  y: number;
  speed: number;
  phase: number;
  wave: number;
  mark: Mark;
  size: number;
  alpha: number;
  band: number;
}

interface WavePoint {
  u: number;
  phase: number;
  mark: Mark;
  size: number;
  alpha: number;
}

interface WaveBand {
  base: number;
  amp: number;
  speed: number;
  turns: number;
  phase: number;
  points: WavePoint[];
}

interface CrossMember {
  dx: number;
  dy: number;
  phase: number;
}

interface CrossCluster {
  x: number;
  y: number;
  phase: number;
  drift: number;
  members: CrossMember[];
}

/** The sparse water the organisms are made from: drifting bands, slow waves and small cross clusters. */
export interface Ambient {
  drifts: DriftSpeck[];
  waves: WaveBand[];
  clusters: CrossCluster[];
}

const DOTS = [".", "·", "+", "·"];
const CROSSES = ["+", "·", "+", "*"];

function wrap(index: number, length: number): number {
  return ((index % length) + length) % length;
}

function buildDrifts(density: number): DriftSpeck[] {
  const next = random(11);
  const bands: readonly { y: number; count: number; speed: number; wave: number; mark: Mark; alpha: number }[] = [
    { y: 0.06, count: 64, speed: 0.014, wave: 3.2, mark: "dot", alpha: 0.34 },
    { y: 0.11, count: 28, speed: -0.01, wave: 4.2, mark: "cross", alpha: 0.28 },
    { y: 0.17, count: 48, speed: 0.018, wave: 2.6, mark: "dot", alpha: 0.26 },
    { y: 0.23, count: 18, speed: -0.012, wave: 3, mark: "block", alpha: 0.22 },
    { y: 0.76, count: 56, speed: 0.016, wave: 3.4, mark: "dot", alpha: 0.3 },
    { y: 0.83, count: 24, speed: -0.013, wave: 4, mark: "cross", alpha: 0.26 },
    { y: 0.9, count: 52, speed: 0.011, wave: 2.8, mark: "dot", alpha: 0.28 },
    { y: 0.96, count: 20, speed: -0.009, wave: 2.2, mark: "block", alpha: 0.22 },
  ];
  const specks: DriftSpeck[] = [];

  bands.forEach((row, band) => {
    const count = Math.max(4, Math.round(row.count * density));
    for (let index = 0; index < count; index += 1) {
      specks.push({
        x: (index + 0.5) / count + (next() - 0.5) * 0.004,
        y: row.y + (next() - 0.5) * 0.004,
        speed: row.speed,
        phase: next() * TAU,
        wave: row.wave,
        mark: row.mark,
        size: row.mark === "block" ? 4 + next() * 2.5 : 13,
        alpha: row.alpha,
        band,
      });
    }
  });

  return specks;
}

function buildWaves(density: number): WaveBand[] {
  const bands: readonly { base: number; amp: number; speed: number; turns: number; phase: number; count: number; mark: Mark }[] = [
    { base: 0.14, amp: 16, speed: 0.42, turns: 1.5, phase: 0.4, count: 54, mark: "dot" },
    { base: 0.8, amp: 18, speed: -0.33, turns: 1.2, phase: 2.1, count: 48, mark: "cross" },
    { base: 0.93, amp: 10, speed: 0.5, turns: 1.7, phase: 3.4, count: 40, mark: "dot" },
  ];

  return bands.map((band) => {
    const count = Math.max(8, Math.round(band.count * density));
    const points: WavePoint[] = [];
    for (let index = 0; index < count; index += 1) {
      points.push({
        u: index / (count - 1),
        phase: index * 0.35,
        mark: index % 9 === 0 ? "block" : band.mark,
        size: index % 9 === 0 ? 3.5 : 11,
        alpha: 0.2 + (index % 5) * 0.025,
      });
    }
    return { ...band, points };
  });
}

function buildClusters(density: number): CrossCluster[] {
  const seeds = [
    { x: 0.08, y: 0.18, phase: 0.2, drift: 0.006 },
    { x: 0.18, y: 0.84, phase: 1.4, drift: -0.008 },
    { x: 0.62, y: 0.9, phase: 2.6, drift: 0.01 },
    { x: 0.9, y: 0.22, phase: 3.8, drift: -0.007 },
    { x: 0.84, y: 0.72, phase: 5.1, drift: 0.009 },
  ].slice(0, Math.max(2, Math.round(5 * density)));

  return seeds.map((seed, index) => {
    const members: CrossMember[] = [];
    const next = random(80 + index * 17);
    for (let member = 0; member < 7; member += 1) {
      const angle = next() * TAU;
      const radius = 8 + next() * 18;
      members.push({ dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius * 0.65, phase: next() * TAU });
    }
    return { ...seed, members };
  });
}

export function createAmbient(density: number): Ambient {
  return { drifts: buildDrifts(density), waves: buildWaves(density), clusters: buildClusters(density) };
}

function paintMark(
  ctx: CanvasRenderingContext2D,
  mark: Mark,
  x: number,
  y: number,
  size: number,
  phase: number,
  time: number,
): void {
  if (mark === "block") {
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
    return;
  }
  const family = mark === "cross" ? CROSSES : DOTS;
  ctx.fillText(family[wrap(Math.floor(time * 0.22 + phase), family.length)] ?? "·", x, y);
}

export interface AmbientFrame {
  time: number;
  width: number;
  height: number;
  shiftX: number;
  shiftY: number;
  pointerX: number;
  pointerY: number;
  fade: (x: number, y: number) => number;
  organisms: readonly Organism[];
}

/**
 * The water thins softly around each creature so its silhouette doesn't merge
 * with the background: most for far, faint creatures, fading to nothing at the
 * edge of their reach, so it is felt as a cleaner outline, never seen as a halo.
 */
function clearing(organisms: readonly Organism[], x: number, y: number): number {
  const c = CONFIG.ambient.clear;
  let keep = 1;
  for (const o of organisms) {
    if (!o.visible) continue;
    const limit = o.radius * c.reach;
    const dx = x - o.cx;
    const dy = y - o.cy;
    const d2 = dx * dx + dy * dy;
    if (d2 >= limit * limit) continue;
    const inside = 1 - smoothstep(0.45, 1, Math.sqrt(d2) / limit);
    keep *= 1 - (c.near + (c.far - c.near) * o.depth) * inside;
  }
  return keep;
}

export function drawAmbient(ctx: CanvasRenderingContext2D, field: Ambient, frame: AmbientFrame): void {
  const { time, width, height, shiftX, shiftY, pointerX, pointerY, fade, organisms } = frame;
  const scale = CONFIG.ambient.alpha;
  const { reach, pull } = CONFIG.attraction;
  const wake = CONFIG.ambient.wake;

  ctx.font = `11px ${MONO}`;
  ctx.fillStyle = "rgb(140,140,140)";

  for (const band of field.waves) {
    for (const point of band.points) {
      const x = point.u * width + shiftX;
      const y =
        band.base * height + Math.sin(point.u * TAU * band.turns + time * band.speed + band.phase) * band.amp + shiftY;
      const pulse = 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(time * 0.31 + band.phase + point.phase));
      ctx.globalAlpha = point.alpha * fade(x, y) * pulse * scale * clearing(organisms, x, y);
      paintMark(ctx, point.mark, x, y, point.size, point.phase, time);
    }
  }

  for (const speck of field.drifts) {
    const nx = speck.x + time * speck.speed;
    const wrapped = nx - Math.floor(nx);
    let edge = 1;
    if (wrapped < 0.035) edge = wrapped / 0.035;
    else if (wrapped > 0.965) edge = (1 - wrapped) / 0.035;
    const x = wrapped * width + shiftX;
    const y = speck.y * height + Math.sin(time * 0.45 + speck.phase + speck.band) * speck.wave + shiftY;
    let pushX = 0;
    let pushY = 0;

    const cdx = x - pointerX;
    const cdy = y - pointerY;
    const distance = Math.hypot(cdx, cdy);
    if (distance > 1 && distance < 150) {
      const push = (1 - distance / 150) * 5;
      pushX = (cdx / distance) * push;
      pushY = (cdy / distance) * push;
    }

    for (const o of organisms) {
      if (!o.visible) continue;
      const dx = o.cx - x;
      const dy = o.cy - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 1) continue;

      // While an organism is unformed, nearby specks lean toward it as if it were drawing on the same matter.
      if (o.flow > 0.01) {
        const limit = o.radius * reach;
        if (d2 < limit * limit) {
          const d = Math.sqrt(d2);
          const f = (1 - d / limit) * o.flow * pull;
          pushX += (dx / d) * f;
          pushY += (dy / d) * f;
        }
      }

      // A passing creature disturbs the water: specks are nudged along with it and slightly aside.
      const pace = Math.hypot(o.vx, o.vy);
      const limit = o.radius * wake.reach;
      if (pace > 1 && d2 < limit * limit) {
        const d = Math.sqrt(d2);
        const k = 1 - d / limit;
        const f = k * k * wake.push * Math.min(1, pace / wake.speed) * (1 - 0.6 * o.depth);
        pushX += (o.vx / pace) * f * 0.7 - (dx / d) * f * 0.5;
        pushY += (o.vy / pace) * f * 0.7 - (dy / d) * f * 0.5;
      }
    }

    const group = 0.58 + 0.42 * (0.5 + 0.5 * Math.sin(time * 0.27 + speck.band * 1.7 + speck.x * 6));
    ctx.globalAlpha = speck.alpha * fade(x, y) * edge * group * scale * clearing(organisms, x, y);
    paintMark(ctx, speck.mark, x + pushX, y + pushY, speck.size, speck.phase, time);
  }

  ctx.fillStyle = "rgb(168,168,168)";
  for (const cluster of field.clusters) {
    const nx = cluster.x + time * cluster.drift;
    const wrapped = nx - Math.floor(nx);
    const cx = wrapped * width + shiftX;
    const cy = cluster.y * height + Math.sin(time * 0.36 + cluster.phase) * 5 + shiftY;
    for (const member of cluster.members) {
      const x = cx + member.dx + Math.sin(time * 0.5 + member.phase) * 7;
      const y = cy + member.dy + Math.cos(time * 0.44 + member.phase) * 5;
      ctx.globalAlpha = 0.2 * fade(x, y) * scale * clearing(organisms, x, y);
      ctx.fillText("+", x, y);
    }
  }
}
