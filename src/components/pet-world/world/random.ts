import type { Range } from "./types";

export interface Rng {
  next: () => number;
  range: (range: Range) => number;
  chance: (probability: number) => boolean;
  sign: () => 1 | -1;
}

/** mulberry32: small, fast and good enough for picking behaviours. */
export function createRng(seed: number): Rng {
  let state = seed >>> 0;

  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next,
    range: ([min, max]) => min + (max - min) * next(),
    chance: (probability) => next() < probability,
    sign: () => (next() < 0.5 ? -1 : 1),
  };
}

export function pickWeighted<T>(rng: Rng, options: readonly (readonly [T, number])[]): T | null {
  let total = 0;
  for (const [, weight] of options) total += Math.max(0, weight);
  if (total <= 0) return null;

  let roll = rng.next() * total;
  for (const [value, weight] of options) {
    roll -= Math.max(0, weight);
    if (roll < 0) return value;
  }

  return options[options.length - 1][0];
}

export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const result = items.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng.next() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}
