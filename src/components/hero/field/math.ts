export const TAU = Math.PI * 2;

export function random(seed: number): () => number {
  let value = seed;

  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function smoothstep(edge0: number, edge1: number, value: number): number {
  const u = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return u * u * (3 - 2 * u);
}

export function smootherstep(edge0: number, edge1: number, value: number): number {
  const u = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return u * u * u * (u * (u * 6 - 15) + 10);
}

export function lerp(a: number, b: number, k: number): number {
  return a + (b - a) * k;
}

/** Wraps an angle into −π…π. */
export function wrapAngle(angle: number): number {
  return angle - TAU * Math.floor((angle + Math.PI) / TAU);
}

export function fract(value: number): number {
  return value - Math.floor(value);
}

export function hash(a: number, b: number): number {
  return fract(Math.sin(a * 12.9898 + b * 78.233) * 43758.5453);
}
