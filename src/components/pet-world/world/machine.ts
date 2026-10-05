import { PETWORLD } from "./config";
import { pickWeighted, type Rng } from "./random";
import type { AnimationName, Behavior, PetPersonality, SurfaceAllow } from "./types";

/**
 * Where each state may go when it ends on its own. The scheduler only ever
 * picks from this list. Interruptions sit outside it: a startled pet reacts,
 * a pet whose surface leaves hides or vanishes, and the director brings a
 * hidden pet back by arriving or peeking. A pet leaves its letter through
 * the world (world.ts), not through this table.
 */
export const TRANSITIONS: Readonly<Record<Behavior, readonly Behavior[]>> = {
  inline: [],
  arriving: ["landing"],
  landing: ["idle", "looking"],
  idle: ["walking", "running", "looking", "sitting", "hopping", "hiding"],
  walking: ["idle", "looking", "sitting"],
  running: ["idle", "looking"],
  looking: ["idle", "walking", "sitting"],
  sitting: ["walking", "sleeping", "idle", "hiding"],
  sleeping: ["sitting", "idle"],
  reacting: ["looking", "idle"],
  hopping: ["landing"],
  hiding: ["hidden"],
  hidden: ["arriving", "peeking"],
  peeking: ["looking", "idle"],
};

/** States whose end leads to exactly one other, ahead of any script. */
export const FOLLOWS: Readonly<Partial<Record<Behavior, Behavior>>> = {
  arriving: "landing",
  hopping: "landing",
  hiding: "hidden",
};

/** What each state plays; a pet that teleports plays teleportOut while hiding instead. */
export const ANIMATIONS: Readonly<Record<Behavior, AnimationName>> = {
  inline: "idle",
  arriving: "teleportIn",
  landing: "land",
  idle: "idle",
  walking: "walk",
  running: "run",
  looking: "look",
  sitting: "sit",
  sleeping: "sleep",
  reacting: "react",
  hopping: "jump",
  hiding: "idle",
  hidden: "idle",
  peeking: "look",
};

/** Standing on a surface and free to be interrupted. */
export const GROUNDED: ReadonlySet<Behavior> = new Set<Behavior>([
  "idle",
  "walking",
  "running",
  "looking",
  "sitting",
  "sleeping",
  "reacting",
]);

/** Settled enough to turn and look at something passing. */
export const ATTENTIVE: ReadonlySet<Behavior> = new Set<Behavior>(["idle", "sitting", "looking"]);

export interface ChoiceContext {
  personality: PetPersonality;
  rng: Rng;
  now: number;
  cooldownUntil: Partial<Record<Behavior, number>>;
  /** What the surface underfoot permits. */
  allow: SurfaceAllow;
  canRun: boolean;
  /** Another surface is on screen to hop to. */
  canHop: boolean;
  /** Out longer than its presence budget: leaving becomes by far the likeliest choice. */
  overstayed: boolean;
}

function permitted(behavior: Behavior, ctx: ChoiceContext): boolean {
  if ((ctx.cooldownUntil[behavior] ?? 0) > ctx.now) return false;

  switch (behavior) {
    case "walking":
      return ctx.allow.walk;
    case "running":
      return ctx.allow.walk && ctx.canRun;
    case "sitting":
      return ctx.allow.sit;
    case "sleeping":
      return ctx.allow.sleep;
    case "hopping":
      return ctx.canHop;
    default:
      return true;
  }
}

function weight(behavior: Behavior, ctx: ChoiceContext): number {
  const p = ctx.personality;

  switch (behavior) {
    case "idle":
      return 0.6;
    case "walking":
      return 0.5 + p.energy;
    case "running":
      return Math.max(0, p.energy - 0.55) * 1.6;
    case "looking":
      return 0.35 + p.curiosity;
    case "sitting":
      return (1 - p.energy) * 0.7 + p.sleepiness * 0.5;
    case "sleeping":
      return p.sleepiness * 1.2;
    case "hopping":
      return p.curiosity * 0.45;
    case "hiding":
      return ctx.overstayed ? 8 : p.shyness * 0.3;
    default:
      return 0.5;
  }
}

/** Picks the next state from `from`'s transitions, weighted by personality. */
export function chooseNext(from: Behavior, ctx: ChoiceContext): Behavior {
  const options = TRANSITIONS[from]
    .filter((behavior) => permitted(behavior, ctx))
    .map((behavior) => [behavior, weight(behavior, ctx)] as const);

  return pickWeighted(ctx.rng, options) ?? "idle";
}

/** How long a timed state lasts, stretched by personality. Untimed states end on their own. */
export function durationFor(behavior: Behavior, p: PetPersonality, rng: Rng): number {
  switch (behavior) {
    case "idle":
      return rng.range(PETWORLD.durations.idle) * (1.25 - p.energy * 0.5);
    case "looking":
      return rng.range(PETWORLD.durations.looking) * (0.8 + p.curiosity * 0.4);
    case "sitting":
      return rng.range(PETWORLD.durations.sitting) * (0.75 + p.sleepiness * 0.6);
    case "sleeping":
      return rng.range(PETWORLD.durations.sleeping) * (0.75 + p.sleepiness * 0.6);
    case "reacting":
      return rng.range(PETWORLD.durations.reacting);
    default:
      return Number.POSITIVE_INFINITY;
  }
}
