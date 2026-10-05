import type { Behavior, Range, Tier } from "./types";

/**
 * Draws surfaces, anchors, states and targets over the page. Development
 * builds only; it can also be switched on per browser with `?petworld=debug`
 * or `localStorage.setItem("petworld:debug", "1")`.
 */
export const PETWORLD_DEBUG = false;

/** Checked narrowest first; anything wider is desktop. */
export const TIER_QUERIES: readonly (readonly [Tier, string])[] = [
  ["mobile", "(max-width: 639px)"],
  ["tablet", "(max-width: 1023px)"],
];

export interface TierConfig {
  /** Pets out in the world at once, counting one still inside the headline. */
  maxVisible: number;
  walkDistance: Range;
  /** Null: no running at this size. */
  runDistance: Range | null;
  /** May jump from one surface to another. */
  hop: boolean;
  /** Looks at and reacts to a fine pointer. */
  pointer: boolean;
}

type TimedBehavior = "idle" | "looking" | "sitting" | "sleeping" | "reacting";

export interface PetWorldConfig {
  zIndex: number;
  tiers: Record<Tier, TierConfig>;
  /** Base length of each timed state; personality stretches it. */
  durations: Record<TimedBehavior, Range>;
  /** Minimum gap, from the moment a state starts, before the scheduler may pick it again. */
  cooldowns: Partial<Record<Behavior, number>>;
  motion: {
    /** Sprite pixels per second at movementSpeed 1, so a pet's stride keeps to its size. */
    walkSpeed: number;
    runSpeed: number;
    /** Pixels per second squared, for every jump. */
    gravity: number;
    /** Height of a hop between surfaces above the higher end. */
    hopHeight: number;
    /** Hops longer than this are not attempted. */
    maxHop: number;
    /** Sinking behind a surface, or rising from behind it. */
    sinkMs: number;
    /** How high a startled pet hops, in sprite pixels. */
    reactLift: number;
    /** A teleporting pet materialises this many sprite pixels above the surface, then drops onto it. */
    arrivalLift: number;
    /** The last share of the materialising animation spent falling. */
    arrivalFall: number;
  };
  pointer: {
    /** Pointer within this many pixels of a pet's head: it looks at it. */
    lookRadius: number;
    /** A pet still inside its letter watches a pointer this close. */
    glyphRadius: number;
    /** Closer than this: it startles. */
    reactRadius: number;
    /** A pointer that has not moved for this long is ignored. */
    freshMs: number;
  };
  surfaces: {
    /** A ledge is chosen only while its top edge sits in this share of the viewport height. */
    band: Range;
    /** Room a pet needs along a ledge, in sprite widths. */
    minLength: number;
    /** Kept between two pets on one surface, in sprite widths. */
    spacing: number;
    /** A pet still on a surface that has left the viewport is put away after this long. */
    offscreenGraceMs: number;
    /** A pet that left because its surface did comes back this soon, rather than after its usual time away. */
    returnMs: Range;
    /** Padding added to the rounded-corner inset. */
    edgePadding: number;
  };
  hero: {
    /** The real letter fades back in over this long. */
    revealMs: number;
    /** It starts fading in this long before the pet's exit animation ends, so the word is whole the moment he is gone. */
    revealLeadMs: number;
    /** Between vanishing from the letter and materialising on a surface. */
    teleportGapMs: number;
    /** He reappears this far in from the end of the surface nearest the letter, as a share of its length. */
    arrivalInset: number;
    /** A pet with a hero origin that finds none on the page spawns elsewhere after this long. */
    originGraceMs: number;
  };
  /** How often a pet waiting to come back retries when no surface suits it. */
  retryMs: number;
  /** Ambient creatures this close to a pet catch its eye. */
  creatureRadius: number;
}

export const PETWORLD: PetWorldConfig = {
  zIndex: 45,
  tiers: {
    desktop: { maxVisible: 2, walkDistance: [70, 170], runDistance: [170, 280], hop: true, pointer: true },
    tablet: { maxVisible: 2, walkDistance: [50, 120], runDistance: null, hop: true, pointer: true },
    mobile: { maxVisible: 1, walkDistance: [30, 70], runDistance: null, hop: false, pointer: false },
  },
  durations: {
    idle: [2600, 5200],
    looking: [1600, 2800],
    sitting: [4500, 8000],
    sleeping: [8000, 14000],
    reacting: [480, 480],
  },
  cooldowns: {
    looking: 2500,
    sitting: 9000,
    sleeping: 25000,
    running: 14000,
    hopping: 18000,
    reacting: 2500,
  },
  motion: {
    walkSpeed: 20,
    runSpeed: 52,
    gravity: 2000,
    hopHeight: 36,
    maxHop: 520,
    sinkMs: 560,
    reactLift: 4,
    arrivalLift: 9,
    arrivalFall: 0.4,
  },
  pointer: {
    lookRadius: 240,
    glyphRadius: 420,
    reactRadius: 56,
    freshMs: 3000,
  },
  surfaces: {
    band: [0.12, 0.97],
    minLength: 3,
    spacing: 2.5,
    offscreenGraceMs: 1200,
    returnMs: [3000, 6000],
    edgePadding: 4,
  },
  hero: {
    // Starts as his shell breaks up and is complete as his body goes, ahead of the last fragments.
    revealMs: 130,
    revealLeadMs: 320,
    teleportGapMs: 220,
    arrivalInset: 0.18,
    originGraceMs: 1500,
  },
  retryMs: 1500,
  creatureRadius: 420,
};
