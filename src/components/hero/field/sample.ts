import { IMPORTANCE, ROLE } from "./anatomy";
import { clamp } from "./math";
import type { Anchor } from "./types";

export interface Point {
  x: number;
  y: number;
}

export type Draft = Omit<Anchor, "release" | "resolve">;

export type Curve = (u: number) => Point;

interface DraftInit {
  density: number;
  weight: number;
  group: number;
  part?: number;
  t?: number;
  z?: number;
  px?: number;
  py?: number;
  pz?: number;
  face?: number;
  importance?: number;
  role?: number;
  reach?: number;
  size?: Draft["size"];
}

export function draft(x: number, y: number, init: DraftInit): Draft {
  return {
    x,
    y,
    z: init.z ?? 0,
    px: init.px ?? 0,
    py: init.py ?? 0,
    pz: init.pz ?? 0,
    density: init.density,
    weight: init.weight,
    group: init.group,
    part: init.part ?? 0,
    t: init.t ?? 0,
    size: init.size ?? 1,
    face: init.face ?? 0,
    importance: init.importance ?? IMPORTANCE.secondary,
    role: init.role ?? ROLE.fine,
    reach: init.reach ?? init.t ?? 0,
  };
}

/** Splits `total` by `shares` with the largest-remainder method, so the parts always sum to `total`. */
export function allocate(total: number, shares: readonly number[]): number[] {
  const sum = shares.reduce((acc, share) => acc + share, 0) || 1;
  const raw = shares.map((share) => (share / sum) * Math.max(0, total));
  const out = raw.map(Math.floor);
  let rest = Math.max(0, total) - out.reduce((acc, value) => acc + value, 0);
  const order = raw.map((value, index) => ({ index, remainder: value - Math.floor(value) }));
  order.sort((a, b) => b.remainder - a.remainder);

  for (let index = 0; rest > 0; index += 1, rest -= 1) {
    const slot = order[index % order.length];
    if (slot) out[slot.index] = (out[slot.index] ?? 0) + 1;
  }

  return out;
}

export function cubic(a: Point, b: Point, c: Point, d: Point): Curve {
  return (u) => {
    const v = 1 - u;
    const k0 = v * v * v;
    const k1 = 3 * v * v * u;
    const k2 = 3 * v * u * u;
    const k3 = u * u * u;
    return {
      x: a.x * k0 + b.x * k1 + c.x * k2 + d.x * k3,
      y: a.y * k0 + b.y * k1 + c.y * k2 + d.y * k3,
    };
  };
}

export function polyline(points: readonly Point[], closed = false): Curve {
  const path = closed && points[0] ? [...points, points[0]] : points;
  const segments = Math.max(1, path.length - 1);

  return (u) => {
    const f = clamp(u, 0, 1) * segments;
    const index = Math.min(segments - 1, Math.floor(f));
    const k = f - index;
    const a = path[index] ?? { x: 0, y: 0 };
    const b = path[index + 1] ?? a;
    return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
  };
}

export function trace(curve: Curve, steps: number): Point[] {
  const points: Point[] = [];
  for (let step = 0; step <= steps; step += 1) points.push(curve(step / steps));
  return points;
}

/** `count` points at even arc-length intervals between `from` and `to`, half a step in from each end. */
export function alongCurve(
  curve: Curve,
  count: number,
  make: (point: Point, u: number, index: number) => Draft,
  from = 0,
  to = 1,
): Draft[] {
  const out: Draft[] = [];
  if (count <= 0) return out;

  const steps = 160;
  const us: number[] = [];
  const xs: number[] = [];
  const ys: number[] = [];
  const lengths: number[] = [];
  let total = 0;

  for (let step = 0; step <= steps; step += 1) {
    const u = from + ((to - from) * step) / steps;
    const point = curve(u);
    if (step > 0) total += Math.hypot(point.x - (xs[step - 1] ?? 0), point.y - (ys[step - 1] ?? 0));
    us.push(u);
    xs.push(point.x);
    ys.push(point.y);
    lengths.push(total);
  }

  let segment = 0;
  for (let index = 0; index < count; index += 1) {
    const target = ((index + 0.5) / count) * total;
    while (segment < steps - 1 && (lengths[segment + 1] ?? 0) < target) segment += 1;
    const start = lengths[segment] ?? 0;
    const span = (lengths[segment + 1] ?? start) - start || 1;
    const k = clamp((target - start) / span, 0, 1);
    const u = (us[segment] ?? 0) + ((us[segment + 1] ?? 0) - (us[segment] ?? 0)) * k;
    const x = (xs[segment] ?? 0) + ((xs[segment + 1] ?? 0) - (xs[segment] ?? 0)) * k;
    const y = (ys[segment] ?? 0) + ((ys[segment + 1] ?? 0) - (ys[segment] ?? 0)) * k;
    out.push(make({ x, y }, u, index));
  }

  return out;
}

export function pickEven<T>(items: readonly T[], count: number): T[] {
  if (items.length <= count) return [...items];
  const out: T[] = [];
  for (let index = 0; index < count; index += 1) {
    const item = items[Math.floor(((index + 0.5) * items.length) / count)];
    if (item !== undefined) out.push(item);
  }
  return out;
}

export function contains(polygon: readonly Point[], x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    if (!a || !b) continue;
    if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

export function bounds(points: readonly Point[]) {
  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;
  for (const point of points) {
    if (point.x < left) left = point.x;
    if (point.y < top) top = point.y;
    if (point.x > right) right = point.x;
    if (point.y > bottom) bottom = point.y;
  }
  return { left, top, right, bottom };
}

/** Uniform hash grid answering "how far is the closest glyph already placed?". */
export class Spacing {
  private readonly cells = new Map<number, number[]>();

  constructor(private readonly size: number) {}

  private key(ix: number, iy: number): number {
    return (ix + 2048) * 8192 + (iy + 2048);
  }

  add(x: number, y: number): void {
    const key = this.key(Math.floor(x / this.size), Math.floor(y / this.size));
    const cell = this.cells.get(key);
    if (cell) cell.push(x, y);
    else this.cells.set(key, [x, y]);
  }

  /** Squared distance to the nearest placed point, capped two cells out. */
  clearance(x: number, y: number): number {
    const ix = Math.floor(x / this.size);
    const iy = Math.floor(y / this.size);
    let best = 4 * this.size * this.size;

    for (let gx = ix - 2; gx <= ix + 2; gx += 1) {
      for (let gy = iy - 2; gy <= iy + 2; gy += 1) {
        const cell = this.cells.get(this.key(gx, gy));
        if (!cell) continue;
        for (let index = 0; index < cell.length; index += 2) {
          const dx = (cell[index] ?? 0) - x;
          const dy = (cell[index + 1] ?? 0) - y;
          const d2 = dx * dx + dy * dy;
          if (d2 < best) best = d2;
        }
      }
    }

    return best;
  }
}

/** Moves drafts into `out` unless they crowd an already placed glyph; returns how many were dropped. */
export function keepSpaced(list: readonly Draft[], spacing: Spacing, min: number, out: Draft[]): number {
  const min2 = min * min;
  let dropped = 0;
  for (const item of list) {
    if (spacing.clearance(item.x, item.y) < min2) {
      dropped += 1;
      continue;
    }
    out.push(item);
    spacing.add(item.x, item.y);
  }
  return dropped;
}

/** Mitchell's best-candidate fill: each glyph takes the proposal furthest from its neighbours. */
export function fillRegion(count: number, spacing: Spacing, propose: () => Draft | null, tries = 10): Draft[] {
  const out: Draft[] = [];
  let guard = 0;

  while (out.length < count && guard < count * 40 + 40) {
    let best: Draft | null = null;
    let bestScore = -1;

    for (let attempt = 0; attempt < tries; attempt += 1) {
      guard += 1;
      const candidate = propose();
      if (!candidate) continue;
      const score = spacing.clearance(candidate.x, candidate.y);
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    }

    if (best) {
      out.push(best);
      spacing.add(best.x, best.y);
    }
  }

  return out;
}

/** Retries `make` until it lands inside the region or gives up. */
export function propose(next: () => number, attempts: number, make: (next: () => number) => Draft | null): Draft | null {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const candidate = make(next);
    if (candidate) return candidate;
  }
  return null;
}

/**
 * Pads or trims to exactly `count`, then centres the motif and scales it so
 * max |x|, |y| = 1. `origin` overrides the centre, for motifs that should turn
 * around their body rather than their bounding box.
 */
export function finalize(drafts: Draft[], count: number, next: () => number, origin?: Point): Anchor[] {
  const list = drafts.slice(0, count);

  while (list.length < count && list.length > 0) {
    const source = list[Math.floor(next() * list.length)];
    if (!source) break;
    list.push({
      ...source,
      x: source.x + (next() - 0.5) * 0.03,
      y: source.y + (next() - 0.5) * 0.03,
      weight: 0.05,
      importance: IMPORTANCE.atmosphere,
    });
  }

  const box = bounds(list);
  let near = Number.POSITIVE_INFINITY;
  let far = Number.NEGATIVE_INFINITY;
  for (const item of list) {
    if (item.z < near) near = item.z;
    if (item.z > far) far = item.z;
  }
  const cx = origin ? origin.x : (box.left + box.right) / 2;
  const cy = origin ? origin.y : (box.top + box.bottom) / 2;
  const cz = list.length ? (near + far) / 2 : 0;
  const scale = 1 / Math.max((box.right - box.left) / 2, (box.bottom - box.top) / 2, 1e-6);

  return list.map((item) => ({
    ...item,
    x: (item.x - cx) * scale,
    y: (item.y - cy) * scale,
    z: (item.z - cz) * scale,
    px: (item.px - cx) * scale,
    py: (item.py - cy) * scale,
    pz: (item.pz - cz) * scale,
    release: 0,
    resolve: 0,
  }));
}
