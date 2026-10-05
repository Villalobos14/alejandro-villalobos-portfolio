export type PetId = "calcifer" | "pet02" | "pet03";

/** Breakpoint bands PetWorld scales its behaviour to. */
export type Tier = "desktop" | "tablet" | "mobile";

/** A [min, max] pair; a value is drawn from it at a behaviour boundary, never per frame. */
export type Range = readonly [number, number];

export interface Point {
  x: number;
  y: number;
}

/* ---------- sprites ---------- */

export type AnimationName =
  | "idle"
  | "walk"
  | "run"
  | "look"
  | "lookUp"
  | "sit"
  | "sleep"
  | "react"
  | "jump"
  | "land"
  | "prepare"
  | "teleportIn"
  | "teleportOut";

export interface SpriteAnimation {
  /** Row of the sheet the frames sit on. */
  row: number;
  /** Columns to play, in order. Repeat a column to hold it. */
  frames: readonly number[];
  fps: number;
  /** Otherwise the last frame holds. */
  loop: boolean;
  /**
   * Relative ground speed on each frame, for locomotion drawn as hops: slow
   * while gathering and landing, fast in the air. Averages about 1.
   */
  stride?: readonly number[];
}

export interface SpriteDefinition {
  /** Sheet under /public: a grid of equal frames, one animation per row, drawn facing right. */
  image: string;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  rows: number;
  /**
   * The point that stands on a surface, in sheet pixels from the frame's
   * top-left. Every position in PetWorld refers to this point.
   */
  anchor: Point;
  /** For a sheet drawn to stand in for a letter: the part of the frame that is the letter's body. */
  body?: { x: number; y: number; width: number; height: number };
  /** Idle and walk are required; anything missing falls back (see FALLBACKS in sprites.ts). */
  animations: { idle: SpriteAnimation; walk: SpriteAnimation } & Partial<
    Record<AnimationName, SpriteAnimation>
  >;
  /**
   * Takes drawn facing left, for a sheet that must never be mirrored. With
   * them it plays these when facing left and everything else as drawn;
   * without them the whole sheet is flipped.
   */
  left?: Partial<Record<AnimationName, SpriteAnimation>>;
}

/* ---------- behaviour ---------- */

/**
 * inline:   drawn inside the headline, in place of a letter
 * arriving: teleporting in just above a surface and dropping onto it
 * landing:  the squash on contact, after arriving or hopping
 * hopping:  jumping from one surface to another
 * hiding:   leaving: teleporting out, sinking behind the surface, or fading
 * hidden:   off the page; the director brings it back
 * peeking:  rising from behind a surface
 */
export type Behavior =
  | "inline"
  | "arriving"
  | "landing"
  | "idle"
  | "walking"
  | "running"
  | "looking"
  | "sitting"
  | "sleeping"
  | "reacting"
  | "hopping"
  | "hiding"
  | "hidden"
  | "peeking";

/** 0–1 traits that weight which behaviour comes next and how long it lasts. */
export interface PetPersonality {
  curiosity: number;
  energy: number;
  shyness: number;
  sleepiness: number;
  /** Multiplier on walking and running speed. */
  movementSpeed: number;
}

/** A behaviour forced in order before the scheduler takes over again. */
export interface ScriptStep {
  behavior: Behavior;
  ms?: Range;
  /** For walking and running. */
  distance?: Range;
}

export interface HeroOriginConfig {
  enabled: boolean;
  /** The form drawn inside the letter; its `body` box is fitted to the letter's ink. */
  sprite: SpriteDefinition;
  /**
   * How large the body box may grow relative to the letter's ink, by width
   * and by height; the tighter of the two wins, rounded to whole device
   * pixels. Above 1 he spills past the letter, which only the eye notices:
   * the real letter still sets the layout.
   */
  fit: { width: number; height: number };
  /**
   * Played inside the letter once its line has finished its entrance. Idle
   * and look steps turn to watch a nearby pointer. The pet leaves the letter
   * when the last step ends, so the last step is its exit (teleportOut).
   * A step without `ms` lasts as long as its animation.
   */
  sequence: readonly { animation: AnimationName; ms?: number }[];
  /** Surfaces it reappears on once it leaves the word, in order of preference. */
  landOn: readonly SurfaceType[];
  /** Played once it has landed, before the scheduler takes over. */
  afterLanding: readonly ScriptStep[];
}

export interface PetDefinition {
  id: PetId;
  enabled: boolean;
  /** Mixed with a per-load salt, so behaviour varies between visits but never jitters within one. */
  seed: number;
  sprite: SpriteDefinition;
  /** CSS pixels per sprite pixel out in the world, rounded to whole device pixels so pixels stay hard-edged. */
  scale: Record<Tier, number>;
  /** How it comes and goes: rising from behind a surface and sinking back, or teleporting in and out. */
  appearance: "peek" | "teleport";
  /** Sizes the pet appears at all. */
  tiers: readonly Tier[];
  personality: PetPersonality;
  presence: {
    /** How long it stays out before it prefers to go away. */
    visibleMs: Range;
    /** How long it stays away. */
    awayMs: Range;
  };
  /** Surfaces it lives on, in order of preference. */
  surfaces: readonly SurfaceType[];
  /** Starts life as a letter of the headline. */
  heroOrigin?: HeroOriginConfig;
  /** Starts life off the page and first peeks out after this long. */
  spawn?: { firstDelayMs: Range };
}

/* ---------- surfaces ---------- */

export const SURFACE_TYPES = ["dock", "card", "ledge", "frame", "divider", "footer"] as const;

export type SurfaceType = (typeof SURFACE_TYPES)[number];

export interface SurfaceAllow {
  walk: boolean;
  sit: boolean;
  sleep: boolean;
  /** Sink behind the edge to leave, and rise from behind it to arrive. */
  hide: boolean;
  /** Be jumped onto. */
  land: boolean;
}

export interface PetSurface {
  id: string;
  type: SurfaceType;
  element: HTMLElement;
  allow: SurfaceAllow;
  /** Kept clear at both ends of the top edge, for rounded corners. Null: derived from the border radius. */
  inset: number | null;
  /** Border radius read once at registration. */
  radius: number;
  /** Last reported by the IntersectionObserver. */
  visible: boolean;
  /** Fixed surfaces move with the viewport, not the page. */
  fixed: boolean;
}

/** The walkable top edge of a surface, in viewport pixels, insets already applied. */
export interface Ledge {
  left: number;
  right: number;
  y: number;
}
