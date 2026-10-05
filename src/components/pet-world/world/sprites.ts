import type { AnimationName, SpriteAnimation, SpriteDefinition } from "./types";

/*
 * Every sheet's frame grid lives here and nowhere else. Calcifer's sheets are
 * drawn by scripts/calcifer-sprites.mjs, the others by
 * scripts/pet-sprites.mjs; a row added or reordered there must be reflected
 * here. A repeated frame is a hold: poses are held unevenly so the flame
 * reads as alive rather than mechanical.
 */

/**
 * Calcifer out in the world: the approved neutral in 52x56 cells, roomy
 * enough to stretch, squash and come apart. Every stationary state keeps the
 * flame moving; only the face stays put.
 */
const CALCIFER: SpriteDefinition = {
  image: "/pets/calcifer-world.png",
  frameWidth: 52,
  frameHeight: 56,
  columns: 10,
  rows: 9,
  anchor: { x: 26, y: 54 },
  animations: {
    // Pixels, a core, the shell, the eyes, then all of him, stretched as he drops.
    teleportIn: { row: 0, frames: [0, 0, 1, 2, 3, 4, 5, 6, 7], fps: 18, loop: false },
    // Contact and the deepest squash at once, a slower recovery through a small stretch.
    land: { row: 1, frames: [0, 1, 1, 2, 3, 4, 4, 5], fps: 14, loop: false },
    // Ten flame poses along an uneven path, about 3.4 seconds before it repeats; one glance on the way.
    idle: {
      row: 2,
      frames: [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9, 9, 2, 1, 1, 4, 3, 3, 6, 5, 7, 7, 8],
      fps: 8,
      loop: true,
    },
    look: { row: 3, frames: [0, 1, 1, 2, 3, 3, 1, 2, 4, 5, 5, 4], fps: 7, loop: true },
    // A scoot: slow while gathering and squashing, quick in the air.
    walk: { row: 4, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 10, loop: true, stride: [0.3, 1.5, 2, 1.7, 0.9, 0.2, 0.6, 0.8] },
    run: { row: 4, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 15, loop: true, stride: [0.3, 1.5, 2, 1.7, 0.9, 0.2, 0.6, 0.8] },
    jump: { row: 4, frames: [2, 3], fps: 6, loop: true },
    react: { row: 5, frames: [0, 1, 1, 2, 3, 4, 5], fps: 14, loop: false },
    sit: { row: 6, frames: [0, 0, 1, 2, 2, 3, 3, 4, 5, 5], fps: 4, loop: true },
    sleep: { row: 7, frames: [0, 1, 2, 3, 4, 5, 6, 7], fps: 3, loop: true },
    // Gather, stretch up once, break apart into a few warm pixels.
    teleportOut: { row: 8, frames: [0, 1, 1, 2, 3, 4, 5, 6, 7], fps: 18, loop: false },
  },
};

/**
 * Calcifer standing in for the "o": the same model 30 pixels tall in 40x40
 * cells. `body` is his outline, which is fitted to the letter optically, so
 * he may spill a little past it. He never mirrors inside the word, where his
 * side flame would jump from one side of the letter to the other; he has
 * looks drawn both ways instead.
 */
const CALCIFER_GLYPH: SpriteDefinition = {
  image: "/pets/calcifer-glyph.png",
  frameWidth: 40,
  frameHeight: 40,
  columns: 8,
  rows: 4,
  anchor: { x: 20, y: 38 },
  body: { x: 7, y: 8, width: 26, height: 30 },
  animations: {
    // Quieter than the world form: about a pixel of movement, the baseline and face fixed.
    idle: { row: 0, frames: [0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 1, 0, 3, 3, 7, 7, 6, 5, 4, 2, 1], fps: 6, loop: true },
    look: { row: 1, frames: [0, 1, 1, 2, 1, 0, 2, 2], fps: 6, loop: true },
    // A glance each way, eyes wide for a beat, then he gathers himself.
    prepare: { row: 2, frames: [0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5, 5], fps: 12, loop: false },
    teleportOut: { row: 3, frames: [0, 1, 1, 2, 3, 4, 5, 6, 7], fps: 18, loop: false },
    walk: { row: 0, frames: [0], fps: 1, loop: true },
  },
  left: {
    look: { row: 1, frames: [3, 4, 4, 5, 4, 3, 5, 5], fps: 6, loop: true },
  },
};

/** Placeholder blob shared by the two pets not designed yet. */
function blob(image: string): SpriteDefinition {
  return {
    image,
    frameWidth: 16,
    frameHeight: 16,
    columns: 4,
    rows: 5,
    anchor: { x: 8, y: 16 },
    animations: {
      idle: { row: 0, frames: [0, 1, 2, 3], fps: 3, loop: true },
      walk: { row: 1, frames: [0, 1, 2, 3], fps: 6, loop: true },
      look: { row: 2, frames: [0, 0, 1], fps: 3, loop: true },
      sit: { row: 3, frames: [0, 1], fps: 2, loop: true },
      sleep: { row: 4, frames: [0, 1], fps: 1, loop: true },
    },
  };
}

export const SPRITES = {
  calcifer: CALCIFER,
  calciferGlyph: CALCIFER_GLYPH,
  pet02: blob("/pets/pet02.png"),
  pet03: blob("/pets/pet03.png"),
} satisfies Record<string, SpriteDefinition>;

/** What to play when a sheet has no row for an animation. */
const FALLBACKS: Record<AnimationName, AnimationName | null> = {
  idle: null,
  walk: "idle",
  run: "walk",
  look: "idle",
  lookUp: "look",
  sit: "idle",
  sleep: "sit",
  react: "jump",
  jump: "idle",
  land: "sit",
  prepare: "sit",
  teleportIn: "jump",
  teleportOut: "idle",
};

/**
 * What plays for `name` facing this way: a sheet's own left-facing take if
 * it has one, otherwise the animation (or its fallback) as drawn.
 */
export function resolveAnimation(sprite: SpriteDefinition, name: AnimationName, facing: 1 | -1 = 1): SpriteAnimation {
  const drawn = facing < 0 ? sprite.left?.[name] : undefined;
  if (drawn) return drawn;

  let current: AnimationName | null = name;

  while (current) {
    const animation = sprite.animations[current];
    if (animation) return animation;
    current = FALLBACKS[current];
  }

  return sprite.animations.idle;
}

/** One pass through an animation, in milliseconds. */
export function animationLength(sprite: SpriteDefinition, name: AnimationName): number {
  const animation = resolveAnimation(sprite, name);
  return (animation.frames.length / animation.fps) * 1000;
}

export interface AnimationState {
  name: AnimationName;
  /** Index into the animation's frames. */
  index: number;
  elapsed: number;
}

export function playAnimation(state: AnimationState, name: AnimationName): void {
  if (state.name === name) return;
  state.name = name;
  state.index = 0;
  state.elapsed = 0;
}

export function advanceAnimation(state: AnimationState, sprite: SpriteDefinition, dt: number, facing: 1 | -1): void {
  const animation = resolveAnimation(sprite, state.name, facing);
  const frameMs = 1000 / animation.fps;
  state.elapsed += dt;

  while (state.elapsed >= frameMs) {
    state.elapsed -= frameMs;

    if (state.index < animation.frames.length - 1) {
      state.index += 1;
    } else if (animation.loop) {
      state.index = 0;
    } else {
      state.elapsed = 0;
      break;
    }
  }
}

export interface SpriteFrame {
  row: number;
  column: number;
  /** Mirrored to face left: sheets without left-facing takes of their own. */
  flip: boolean;
}

export function currentFrame(state: AnimationState, sprite: SpriteDefinition, facing: 1 | -1): SpriteFrame {
  const animation = resolveAnimation(sprite, state.name, facing);
  const index = Math.min(state.index, animation.frames.length - 1);
  return { row: animation.row, column: animation.frames[index], flip: facing < 0 && !sprite.left };
}

/** Ground speed on the current frame, relative to the animation's average. */
export function currentStride(state: AnimationState, sprite: SpriteDefinition): number {
  const stride = resolveAnimation(sprite, state.name).stride;
  return stride?.[Math.min(state.index, stride.length - 1)] ?? 1;
}
