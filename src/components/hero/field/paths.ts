import type { PathConfig } from "./config";
import { clamp } from "./math";

const SAMPLES = 48;

/** Maps a height drawn against the reference headline onto where the headline actually is. */
export interface VerticalMap {
  refTop: number;
  refBottom: number;
  top: number;
  bottom: number;
}

export function mapY(map: VerticalMap, y: number): number {
  if (y < map.refTop) return y * (map.top / map.refTop);
  if (y > map.refBottom) return 1 + (y - 1) * ((1 - map.bottom) / (1 - map.refBottom));
  return map.top + ((y - map.refTop) / (map.refBottom - map.refTop)) * (map.bottom - map.top);
}

/** A path fitted to the current hero: control points in px and an arc-length table for even speed. */
export interface FlightPath {
  config: PathConfig;
  /** x0 y0 x1 y1 x2 y2 x3 y3, in px. */
  points: Float64Array;
  /** Arc length from the start at each of the evenly spaced curve parameters. */
  lengths: Float64Array;
  total: number;
}

export interface PathPoint {
  x: number;
  y: number;
  /** Direction of travel, in px per unit of curve parameter. */
  tx: number;
  ty: number;
  depth: number;
  /** Depth gained per unit of travel along the path. */
  slope: number;
}

export function createFlightPath(config: PathConfig): FlightPath {
  return { config, points: new Float64Array(8), lengths: new Float64Array(SAMPLES + 1), total: 0 };
}

/**
 * Converts the path to px for this hero. Ends that lie offscreen are pushed
 * out a further `margin`, so the creature has fully left before it switches
 * to its next path.
 */
export function fitPath(path: FlightPath, width: number, height: number, map: VerticalMap, margin: number): void {
  const { points: source } = path.config;
  const last = source.length - 1;

  source.forEach(([x, y], index) => {
    let px = x * width;
    let py = mapY(map, y) * height;
    if (index === 0 || index === last) {
      if (x < 0) px -= margin;
      else if (x > 1) px += margin;
      if (y < 0) py -= margin;
      else if (y > 1) py += margin;
    }
    path.points[index * 2] = px;
    path.points[index * 2 + 1] = py;
  });

  let total = 0;
  let lastX = path.points[0] ?? 0;
  let lastY = path.points[1] ?? 0;
  const point: PathPoint = { x: 0, y: 0, tx: 0, ty: 0, depth: 0, slope: 0 };
  path.lengths[0] = 0;
  for (let step = 1; step <= SAMPLES; step += 1) {
    evaluate(path.points, step / SAMPLES, point);
    total += Math.hypot(point.x - lastX, point.y - lastY);
    path.lengths[step] = total;
    lastX = point.x;
    lastY = point.y;
  }
  path.total = total;
}

function evaluate(p: Float64Array, t: number, out: PathPoint): void {
  const v = 1 - t;
  const k0 = v * v * v;
  const k1 = 3 * v * v * t;
  const k2 = 3 * v * t * t;
  const k3 = t * t * t;
  const d0 = 3 * v * v;
  const d1 = 6 * v * t;
  const d2 = 3 * t * t;
  const x0 = p[0] ?? 0;
  const y0 = p[1] ?? 0;
  const x1 = p[2] ?? 0;
  const y1 = p[3] ?? 0;
  const x2 = p[4] ?? 0;
  const y2 = p[5] ?? 0;
  const x3 = p[6] ?? 0;
  const y3 = p[7] ?? 0;
  out.x = x0 * k0 + x1 * k1 + x2 * k2 + x3 * k3;
  out.y = y0 * k0 + y1 * k1 + y2 * k2 + y3 * k3;
  out.tx = d0 * (x1 - x0) + d1 * (x2 - x1) + d2 * (x3 - x2);
  out.ty = d0 * (y1 - y0) + d1 * (y2 - y1) + d2 * (y3 - y2);
}

/** Point at fraction `along` of the path's length. */
export function samplePath(path: FlightPath, along: number, out: PathPoint): void {
  const s = clamp(along, 0, 1);
  const target = s * path.total;
  let low = 0;
  let high = SAMPLES;
  while (high - low > 1) {
    const mid = (low + high) >> 1;
    if ((path.lengths[mid] ?? 0) <= target) low = mid;
    else high = mid;
  }
  const start = path.lengths[low] ?? 0;
  const span = (path.lengths[high] ?? start) - start || 1;
  evaluate(path.points, (low + clamp((target - start) / span, 0, 1)) / SAMPLES, out);

  // Depth eases between evenly spaced keys, so a creature can approach, hold and recede along one path.
  const keys = path.config.depth;
  const segments = Math.max(1, keys.length - 1);
  const segment = Math.min(segments - 1, Math.floor(s * segments));
  const u = s * segments - segment;
  const from = keys[segment] ?? 0.5;
  const to = keys[segment + 1] ?? from;
  out.depth = from + (to - from) * u * u * (3 - 2 * u);
  out.slope = (to - from) * 6 * u * (1 - u) * segments;
}
