import type { Point } from "./types";

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Moves `value` toward `target` by at most `step`. */
export function approach(value: number, target: number, step: number): number {
  if (Math.abs(target - value) <= step) return target;
  return value + Math.sign(target - value) * step;
}

export interface Jump {
  from: Point;
  /** Where the landing point was when the jump was planned. */
  to: Point;
  /** Initial vertical velocity in px/s; negative is up. */
  velocity: number;
  gravity: number;
  duration: number;
}

/**
 * A ballistic jump from `from` to `to` that peaks `height` pixels above the
 * higher of the two. Horizontal speed is constant, so it reads as a hop
 * rather than a tween.
 */
export function planJump(from: Point, to: Point, height: number, gravity: number): Jump {
  const apex = Math.min(from.y, to.y) - Math.max(height, 1);
  const rise = from.y - apex;
  const fall = to.y - apex;
  const seconds = Math.sqrt((2 * rise) / gravity) + Math.sqrt((2 * fall) / gravity);

  return {
    from: { ...from },
    to: { ...to },
    velocity: -Math.sqrt(2 * gravity * rise),
    gravity,
    duration: seconds * 1000,
  };
}

/**
 * Where the jump is `elapsed` ms in. `target` is where the landing point is
 * now: if the surface moved since the jump was planned (scrolling, the dock
 * sliding away) the drift is blended in as the jump progresses, so it still
 * lands exactly on it without a correction at the end.
 */
export function sampleJump(jump: Jump, elapsed: number, target: Point): Point {
  const t = clamp(elapsed / jump.duration, 0, 1);
  const seconds = (t * jump.duration) / 1000;
  const x = lerp(jump.from.x, jump.to.x, t);
  const y = jump.from.y + jump.velocity * seconds + 0.5 * jump.gravity * seconds * seconds;

  return {
    x: x + (target.x - jump.to.x) * t,
    y: y + (target.y - jump.to.y) * t,
  };
}
