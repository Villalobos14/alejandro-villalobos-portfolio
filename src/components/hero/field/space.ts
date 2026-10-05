import { HERO_FIELD_CONFIG as CONFIG, MONO } from "./config";
import { clamp, lerp } from "./math";

/**
 * An organism's orientation: it rolls about its own long axis (`tiltY`),
 * pitches about its cross axis (`tiltX`), then turns in the screen plane
 * (`spin`) to face where it is going.
 */
export interface Pose {
  spin: number;
  tiltX: number;
  tiltY: number;
}

/** Row-major Rz(spin) · Rx(tiltX) · Ry(tiltY), written into a reused 3×3. */
export function poseMatrix(pose: Pose, out: Float32Array): void {
  const cz = Math.cos(pose.spin);
  const sz = Math.sin(pose.spin);
  const cx = Math.cos(pose.tiltX);
  const sx = Math.sin(pose.tiltX);
  const cy = Math.cos(pose.tiltY);
  const sy = Math.sin(pose.tiltY);
  out[0] = cz * cy - sz * sx * sy;
  out[1] = -sz * cx;
  out[2] = cz * sy + sz * sx * cy;
  out[3] = sz * cy + cz * sx * sy;
  out[4] = cz * cx;
  out[5] = sz * sy - cz * sx * cy;
  out[6] = -cx * sy;
  out[7] = sx;
  out[8] = cx * cy;
}

/** Perspective factor for a point `z` motif radii behind (positive) or in front of the organism's centre. */
export function perspective(z: number): number {
  const distance = CONFIG.camera.distance;
  return distance / (distance + z);
}

type Across = readonly [number, number, number];

/** Reads a near / middle / far triple at depth `z` (0 near, 1 far). */
function across(values: Across, z: number): number {
  const k = clamp(z, 0, 1) * 2;
  return k < 1 ? lerp(values[0], values[1], k) : lerp(values[1], values[2], k - 1);
}

export function depthScale(z: number): number {
  return across(CONFIG.depth.scale, z);
}

export function depthMotion(z: number): number {
  return across(CONFIG.depth.motion, z);
}

export function depthThin(z: number): number {
  return across(CONFIG.depth.thin, z);
}

export function depthDetail(z: number): number {
  return across(CONFIG.depth.detail, z);
}

/** Alpha by density level 1–5 at depth `z`, written into `out`. */
export function depthOpacity(z: number, out: Float32Array): void {
  const [near, mid, far] = CONFIG.depth.opacity;
  for (let level = 0; level < 5; level += 1) {
    out[level] = across([near[level] ?? 0, mid[level] ?? 0, far[level] ?? 0], z);
  }
}

const fonts = new Map<number, string>();

/** Canvas font strings, quantized to a quarter pixel and cached so the frame loop never builds one. */
export function fontAt(px: number): string {
  const key = Math.round(px * 4);
  let font = fonts.get(key);
  if (!font) {
    font = `${(key / 4).toFixed(2)}px ${MONO}`;
    fonts.set(key, font);
  }
  return font;
}
