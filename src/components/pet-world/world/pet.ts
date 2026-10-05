import { PETWORLD, type TierConfig } from "./config";
import type { PetEvents } from "./events";
import { ANIMATIONS, ATTENTIVE, FOLLOWS, GROUNDED, chooseNext, durationFor } from "./machine";
import { approach, clamp, lerp, planJump, sampleJump, smoothstep, type Jump } from "./motion";
import type { PointerState } from "./pointer";
import { createRng, shuffle, type Rng } from "./random";
import {
  advanceAnimation,
  animationLength,
  currentFrame,
  currentStride,
  playAnimation,
  type AnimationState,
} from "./sprites";
import type { SurfaceRegistry } from "./surfaces";
import type {
  Behavior,
  Ledge,
  PetDefinition,
  PetSurface,
  Point,
  ScriptStep,
  SurfaceAllow,
  SurfaceType,
  Tier,
} from "./types";
import { snapScale, type PetView } from "./view";

export interface PetJump {
  plan: Jump;
  start: number;
  /** Where it lands; null falls off the bottom of the screen and vanishes. */
  surface: PetSurface | null;
  u: number;
}

export interface PetRuntime {
  def: PetDefinition;
  rng: Rng;
  behavior: Behavior;
  since: number;
  until: number;
  script: ScriptStep[];
  /** The anchor (feet), in viewport pixels. */
  x: number;
  y: number;
  scale: number;
  facing: 1 | -1;
  /** 0–1: how far it has sunk behind the edge it stands on. */
  sink: number;
  fade: number;
  /** Pixels above the anchor: the startle hop, or hovering while materialising. */
  lift: number;
  /** The surface underfoot and the anchor's offset along its ledge. */
  attach: { surface: PetSurface; u: number } | null;
  walkTarget: number;
  jump: PetJump | null;
  hideBy: "sink" | "fade" | "teleport";
  lookAt: Point | null;
  lookFlipAt: number;
  anim: AnimationState;
  cooldownUntil: Partial<Record<Behavior, number>>;
  visibleSince: number;
  /** How long it means to stay out this time. */
  budget: number;
  hiddenUntil: number;
  offscreenSince: number | null;
  /** Its last exit was the surface's doing, not its own: it comes back sooner. */
  evicted: boolean;
  /** Has been out in the world, or had its letter used up. */
  appeared: boolean;
  view: PetView | null;
}

/** Everything a pet may read while it updates, rebuilt once per tick. */
export interface Frame {
  now: number;
  dt: number;
  tier: Tier;
  tierConfig: TierConfig;
  width: number;
  height: number;
  surfaces: SurfaceRegistry;
  /** Null while pointer awareness is off: touch, small screens. */
  pointer: PointerState | null;
  events: PetEvents;
  pets: readonly PetRuntime[];
}

const NOTHING_ALLOWED: SurfaceAllow = { walk: false, sit: false, sleep: false, hide: false, land: false };

export function createPetRuntime(def: PetDefinition, salt: number): PetRuntime {
  return {
    def,
    rng: createRng(def.seed ^ salt),
    behavior: "hidden",
    since: 0,
    until: Number.POSITIVE_INFINITY,
    script: [],
    x: 0,
    y: 0,
    scale: def.scale.desktop,
    facing: 1,
    sink: 0,
    fade: 1,
    lift: 0,
    attach: null,
    walkTarget: 0,
    jump: null,
    hideBy: "sink",
    lookAt: null,
    lookFlipAt: Number.POSITIVE_INFINITY,
    anim: { name: "idle", index: 0, elapsed: 0 },
    cooldownUntil: {},
    visibleSince: 0,
    budget: Number.POSITIVE_INFINITY,
    hiddenUntil: Number.POSITIVE_INFINITY,
    offscreenSince: null,
    evicted: false,
    appeared: false,
    view: null,
  };
}

/* ---------- geometry ---------- */

export const worldScale = (pet: PetRuntime, tier: Tier) => snapScale(pet.def.scale[tier]);

const spriteHeight = (pet: PetRuntime) => pet.def.sprite.frameHeight * pet.scale;

/** Anchor offsets along a ledge that keep the sprite on it. Art rarely fills its frame, so a little overhang is allowed. */
function bounds(pet: PetRuntime, ledge: Ledge, scale = pet.scale): [number, number] {
  const half = pet.def.sprite.frameWidth * scale * 0.4;
  const length = ledge.right - ledge.left;
  return length > half * 2 ? [half, length - half] : [length / 2, length / 2];
}

function usableLedge(ledge: Ledge, frame: Frame, spriteWidth: number): boolean {
  const { band, minLength } = PETWORLD.surfaces;
  return (
    ledge.right - ledge.left >= spriteWidth * minLength &&
    ledge.y >= band[0] * frame.height &&
    ledge.y <= band[1] * frame.height &&
    ledge.left >= 0 &&
    ledge.right <= frame.width
  );
}

/** A spot on `surface` clear of other pets, as close to `preferred` as it can be. */
function freeSpot(
  pet: PetRuntime,
  surface: PetSurface,
  ledge: Ledge,
  frame: Frame,
  preferred: number | null,
  scale: number,
): number | null {
  const [min, max] = bounds(pet, ledge, scale);
  const gap = PETWORLD.surfaces.spacing * pet.def.sprite.frameWidth * scale;
  const taken: number[] = [];

  frame.pets.forEach((other) => {
    if (other === pet) return;
    if (other.attach?.surface === surface) taken.push(other.attach.u);
    else if (other.jump?.surface === surface) taken.push(other.jump.u);
  });

  const tries = preferred === null ? [] : [clamp(preferred, min, max)];
  for (let index = 0; index < 6; index += 1) tries.push(lerp(min, max, pet.rng.next()));

  return tries.find((u) => taken.every((other) => Math.abs(other - u) >= gap)) ?? null;
}

export interface Spot {
  surface: PetSurface;
  ledge: Ledge;
  u: number;
}

/**
 * A free place on a visible surface of one of `types`, preferring earlier
 * types and, if given, a point near `nearX` but at least `inset` (a share of
 * the surface's length) in from either end.
 */
export function findSpot(
  pet: PetRuntime,
  frame: Frame,
  types: readonly SurfaceType[],
  nearX?: number,
  inset = 0,
): Spot | null {
  const scale = worldScale(pet, frame.tier);
  const width = pet.def.sprite.frameWidth * scale;
  const candidates = shuffle(pet.rng, frame.surfaces.visible(types)).sort(
    (a, b) => types.indexOf(a.type) - types.indexOf(b.type),
  );

  for (const surface of candidates) {
    const ledge = frame.surfaces.ledge(surface);
    if (!ledge || !usableLedge(ledge, frame, width)) continue;
    const length = ledge.right - ledge.left;
    const near = nearX === undefined ? null : clamp(nearX - ledge.left, length * inset, length * (1 - inset));
    const u = freeSpot(pet, surface, ledge, frame, near, scale);
    if (u !== null) return { surface, ledge, u };
  }

  return null;
}

/* ---------- transitions ---------- */

function face(pet: PetRuntime, x: number) {
  if (Math.abs(x - pet.x) > 6) pet.facing = x > pet.x ? 1 : -1;
}

const ready = (pet: PetRuntime, behavior: Behavior, now: number) => (pet.cooldownUntil[behavior] ?? 0) <= now;

function startJump(pet: PetRuntime, now: number, to: Point, surface: PetSurface, u: number, height: number): void {
  pet.jump = {
    plan: planJump({ x: pet.x, y: pet.y }, to, height, PETWORLD.motion.gravity),
    start: now,
    surface,
    u,
  };
  pet.attach = null;
  face(pet, to.x);
}

function planWalk(pet: PetRuntime, frame: Frame, running: boolean, distance?: ScriptStep["distance"]) {
  const attach = pet.attach;
  const ledge = attach && frame.surfaces.ledge(attach.surface);

  if (!attach || !ledge) {
    pet.walkTarget = attach?.u ?? 0;
    return;
  }

  const [min, max] = bounds(pet, ledge);
  const range = distance ?? (running ? frame.tierConfig.runDistance : null) ?? frame.tierConfig.walkDistance;
  const length = pet.rng.range(range) * (0.75 + 0.25 * pet.def.personality.movementSpeed);
  const room = { left: attach.u - min, right: max - attach.u };

  // Usually toward the side with more room, sometimes not; never into a wall.
  let direction: 1 | -1 = room.right >= room.left ? 1 : -1;
  if (pet.rng.chance(0.25)) direction = direction === 1 ? -1 : 1;
  if ((direction === 1 ? room.right : room.left) < length * 0.4) direction = direction === 1 ? -1 : 1;

  let target = clamp(attach.u + direction * length, min, max);
  const gap = PETWORLD.surfaces.spacing * pet.def.sprite.frameWidth * pet.scale;

  frame.pets.forEach((other) => {
    if (other === pet || other.attach?.surface !== attach.surface) return;
    const ahead = (other.attach.u - attach.u) * direction > 0;
    if (ahead && (target - other.attach.u) * direction > -gap) target = other.attach.u - direction * gap;
  });

  if ((target - attach.u) * direction < 0) target = attach.u;
  pet.walkTarget = target;
  if (target !== attach.u) pet.facing = direction;
}

function planHop(pet: PetRuntime, frame: Frame): boolean {
  if (!pet.attach || !frame.tierConfig.hop) return false;

  const scale = worldScale(pet, frame.tier);
  const width = pet.def.sprite.frameWidth * scale;

  for (const surface of shuffle(pet.rng, frame.surfaces.visible(pet.def.surfaces))) {
    if (surface === pet.attach.surface || !surface.allow.land) continue;
    const ledge = frame.surfaces.ledge(surface);
    if (!ledge || !usableLedge(ledge, frame, width)) continue;
    const u = freeSpot(pet, surface, ledge, frame, pet.x - ledge.left, scale);
    if (u === null) continue;
    const to = { x: ledge.left + u, y: ledge.y };
    if (Math.hypot(to.x - pet.x, to.y - pet.y) > PETWORLD.motion.maxHop) continue;
    startJump(pet, frame.now, to, surface, u, PETWORLD.motion.hopHeight);
    return true;
  }

  return false;
}

/** Starts `behavior` now. Scripted steps may fix its duration or distance. */
export function enter(pet: PetRuntime, behavior: Behavior, frame: Frame, step?: ScriptStep): void {
  const { now } = frame;
  const { sprite } = pet.def;
  pet.behavior = behavior;
  pet.since = now;
  pet.until = now + (step?.ms ? pet.rng.range(step.ms) : durationFor(behavior, pet.def.personality, pet.rng));
  pet.lift = 0;
  pet.lookAt = null;
  playAnimation(pet.anim, ANIMATIONS[behavior]);

  // States drawn as a single take last exactly as long as their animation.
  if (behavior === "arriving" || behavior === "landing") pet.until = now + animationLength(sprite, pet.anim.name);

  const cooldown = PETWORLD.cooldowns[behavior];
  if (cooldown) pet.cooldownUntil[behavior] = now + cooldown;

  switch (behavior) {
    case "walking":
    case "running":
      planWalk(pet, frame, behavior === "running", step?.distance);
      break;
    case "looking":
      pet.lookFlipAt = now + (pet.until - now) * pet.rng.range([0.35, 0.6]);
      break;
    case "hopping":
      if (!planHop(pet, frame)) enter(pet, "idle", frame);
      break;
    case "arriving":
      pet.lift = PETWORLD.motion.arrivalLift * pet.scale;
      break;
    case "hiding":
      pet.hideBy =
        pet.def.appearance === "teleport" ? "teleport" : pet.attach?.surface.allow.hide ? "sink" : "fade";
      if (pet.hideBy === "teleport") {
        playAnimation(pet.anim, "teleportOut");
        pet.until = now + animationLength(sprite, "teleportOut");
      }
      break;
    case "peeking":
      pet.hideBy = pet.attach?.surface.allow.hide ? "sink" : "fade";
      if (pet.hideBy === "sink") pet.sink = 1;
      else pet.fade = 0;
      break;
    case "hidden":
      pet.attach = null;
      pet.jump = null;
      pet.sink = 0;
      pet.fade = 1;
      pet.script = [];
      pet.offscreenSince = null;
      pet.hiddenUntil = now + pet.rng.range(pet.evicted ? PETWORLD.surfaces.returnMs : pet.def.presence.awayMs);
      pet.evicted = false;
      break;
  }
}

function next(pet: PetRuntime, frame: Frame): void {
  const follows = FOLLOWS[pet.behavior];

  if (follows) {
    enter(pet, follows, frame);
    return;
  }

  const step = pet.script.shift();

  if (step) {
    enter(pet, step.behavior, frame, step);
    return;
  }

  const surface = pet.attach?.surface;
  const behavior = chooseNext(pet.behavior, {
    personality: pet.def.personality,
    rng: pet.rng,
    now: frame.now,
    cooldownUntil: pet.cooldownUntil,
    allow: surface?.allow ?? NOTHING_ALLOWED,
    canRun: frame.tierConfig.runDistance !== null,
    canHop:
      frame.tierConfig.hop &&
      frame.surfaces.visible(pet.def.surfaces).some((other) => other !== surface && other.allow.land),
    overstayed: frame.now - pet.visibleSince > pet.budget,
  });

  enter(pet, behavior, frame);
}

/**
 * Brings the pet onto `spot`: teleporting in just above it and dropping into
 * a landing squash, or rising from behind its edge, as the pet's appearance
 * says. It faces the side with more room, where it is likelier to wander.
 * `script` plays once it has arrived.
 */
export function appearOn(
  pet: PetRuntime,
  frame: Frame,
  spot: Spot,
  script: readonly ScriptStep[] = [{ behavior: "looking", ms: [1200, 2000] }],
): void {
  pet.scale = worldScale(pet, frame.tier);
  pet.attach = { surface: spot.surface, u: spot.u };
  pet.x = spot.ledge.left + spot.u;
  pet.y = spot.ledge.y;
  pet.facing = spot.u < (spot.ledge.right - spot.ledge.left) / 2 ? 1 : -1;
  pet.appeared = true;
  pet.visibleSince = frame.now;
  pet.budget = pet.rng.range(pet.def.presence.visibleMs);
  enter(pet, pet.def.appearance === "teleport" ? "arriving" : "peeking", frame);
  pet.script = [...script];
  pet.y += pet.sink * spriteHeight(pet);
}

/* ---------- per-frame ---------- */

function watchPointer(pet: PetRuntime, frame: Frame): void {
  const pointer = frame.pointer;
  if (!pointer || frame.now - pointer.movedAt > PETWORLD.pointer.freshMs) return;

  const distance = Math.hypot(pointer.x - pet.x, pointer.y - (pet.y - spriteHeight(pet) * 0.55));
  const { lookRadius, reactRadius } = PETWORLD.pointer;

  if (distance < reactRadius && pet.behavior !== "reacting" && ready(pet, "reacting", frame.now)) {
    face(pet, pointer.x);
    frame.events.emit({ type: "POINTER_NEAR", pet: pet.def.id, distance });
    enter(pet, "reacting", frame);
    return;
  }

  if (distance >= lookRadius || !ATTENTIVE.has(pet.behavior)) return;

  if (pet.behavior === "looking") {
    pet.until = Math.max(pet.until, frame.now + 700);
  } else if (ready(pet, "looking", frame.now)) {
    frame.events.emit({ type: "POINTER_NEAR", pet: pet.def.id, distance });
    enter(pet, "looking", frame);
  } else {
    return;
  }

  pet.lookAt = pointer;
}

/** Turns toward `point` if the pet is settled enough to notice it. */
export function notice(pet: PetRuntime, frame: Frame, point: Point): void {
  if (!ATTENTIVE.has(pet.behavior) || !ready(pet, "looking", frame.now)) return;
  enter(pet, "looking", frame);
  pet.lookAt = { ...point };
}

/** Advances the current behaviour; true once it has run its course. */
function stepBehavior(pet: PetRuntime, frame: Frame): boolean {
  const { now } = frame;
  const elapsed = now - pet.since;

  switch (pet.behavior) {
    case "walking":
    case "running": {
      if (!pet.attach) return true;
      const base = pet.behavior === "running" ? PETWORLD.motion.runSpeed : PETWORLD.motion.walkSpeed;
      // Code moves the pet; the sprite's hop rhythm says how fast on each frame.
      const speed = base * pet.scale * pet.def.personality.movementSpeed * currentStride(pet.anim, pet.def.sprite);
      pet.attach.u = approach(pet.attach.u, pet.walkTarget, (speed * frame.dt) / 1000);
      return pet.attach.u === pet.walkTarget;
    }
    case "looking":
      if (pet.lookAt) face(pet, pet.lookAt.x);
      else if (now >= pet.lookFlipAt) {
        pet.facing = pet.facing === 1 ? -1 : 1;
        pet.lookFlipAt = Number.POSITIVE_INFINITY;
      }
      return now >= pet.until;
    case "reacting": {
      const t = clamp(elapsed / (pet.until - pet.since), 0, 1);
      pet.lift = Math.sin(Math.PI * t) * PETWORLD.motion.reactLift * pet.scale;
      return t >= 1;
    }
    case "arriving": {
      // Hovers while it takes shape, then drops the last stretch onto the surface.
      const t = clamp(elapsed / (pet.until - pet.since), 0, 1);
      const { arrivalLift, arrivalFall } = PETWORLD.motion;
      const fall = clamp((t - (1 - arrivalFall)) / arrivalFall, 0, 1);
      pet.lift = arrivalLift * pet.scale * (1 - fall * fall);
      return t >= 1;
    }
    case "hiding": {
      if (pet.hideBy === "teleport") return now >= pet.until;
      const t = clamp(elapsed / PETWORLD.motion.sinkMs, 0, 1);
      if (pet.hideBy === "sink") pet.sink = smoothstep(t);
      else pet.fade = 1 - t;
      return t >= 1;
    }
    case "peeking": {
      const t = clamp(elapsed / PETWORLD.motion.sinkMs, 0, 1);
      if (pet.hideBy === "sink") pet.sink = 1 - smoothstep(t);
      else pet.fade = t;
      return t >= 1;
    }
    default:
      return now >= pet.until;
  }
}

/** Moves a jumping pet; true once it has landed. */
function stepJump(pet: PetRuntime, jump: PetJump, frame: Frame): boolean {
  let target = jump.plan.to;

  if (jump.surface) {
    const ledge = frame.surfaces.ledge(jump.surface);
    if (ledge) target = { x: ledge.left + jump.u, y: ledge.y };
    else jump.surface = null;
  }

  const elapsed = frame.now - jump.start;
  const t = clamp(elapsed / jump.plan.duration, 0, 1);
  const point = sampleJump(jump.plan, elapsed, target);
  pet.x = point.x;
  pet.y = point.y;

  return t >= 1;
}

function land(pet: PetRuntime, jump: PetJump, frame: Frame): void {
  pet.jump = null;

  if (!jump.surface) {
    enter(pet, "hidden", frame);
    return;
  }

  pet.attach = { surface: jump.surface, u: jump.u };
  frame.events.emit({ type: "PET_REACHED_SURFACE", pet: pet.def.id, surface: jump.surface.id });
  next(pet, frame);
}

function pin(pet: PetRuntime, ledge: Ledge): void {
  if (!pet.attach) return;
  pet.x = ledge.left + pet.attach.u;
  pet.y = ledge.y + pet.sink * spriteHeight(pet);
}

export function update(pet: PetRuntime, frame: Frame): void {
  if (pet.behavior === "hidden" || pet.behavior === "inline") return;

  if (pet.jump) {
    const jump = pet.jump;
    if (stepJump(pet, jump, frame)) land(pet, jump, frame);
    advanceAnimation(pet.anim, pet.def.sprite, frame.dt, pet.facing);
    return;
  }

  const ledge = pet.attach && frame.surfaces.ledge(pet.attach.surface);

  // The surface left the document (a route change) or collapsed.
  if (!pet.attach || !ledge) {
    pet.evicted = true;
    enter(pet, "hidden", frame);
    return;
  }

  pet.scale = worldScale(pet, frame.tier);

  // The surface's edge has left the viewport (the dock sliding away, a card
  // scrolled past) or a page surface is nearing the top: the pet ducks out
  // with it instead of hanging at the edge of the screen.
  const gone = ledge.y < 0 || ledge.y > frame.height || ledge.right < 0 || ledge.left > frame.width;
  const crowded = !pet.attach.surface.fixed && ledge.y < PETWORLD.surfaces.band[0] * frame.height;

  if (gone) {
    pet.offscreenSince ??= frame.now;
    if (frame.now - pet.offscreenSince > PETWORLD.surfaces.offscreenGraceMs) {
      pet.evicted = true;
      enter(pet, "hidden", frame);
      return;
    }
  } else {
    pet.offscreenSince = null;
  }

  if ((gone || crowded) && GROUNDED.has(pet.behavior)) {
    pet.evicted = true;
    enter(pet, "hiding", frame);
  }

  const [min, max] = bounds(pet, ledge);
  pet.attach.u = clamp(pet.attach.u, min, max);
  pin(pet, ledge);

  if (GROUNDED.has(pet.behavior)) watchPointer(pet, frame);

  const done = stepBehavior(pet, frame);
  pin(pet, ledge);
  if (done) next(pet, frame);

  advanceAnimation(pet.anim, pet.def.sprite, frame.dt, pet.facing);
}

/** Re-pins a standing pet to its surface; used the moment the page scrolls. */
export function follow(pet: PetRuntime, surfaces: SurfaceRegistry): void {
  if (!pet.attach || pet.jump || pet.behavior === "hidden") return;
  const ledge = surfaces.ledge(pet.attach.surface);
  if (!ledge) return;
  pin(pet, ledge);
  render(pet);
}

export function render(pet: PetRuntime): void {
  const view = pet.view;
  if (!view) return;

  const out = pet.behavior !== "hidden" && pet.behavior !== "inline";
  view.show(out);
  if (!out) return;

  const { sprite } = pet.def;
  const below = (sprite.frameHeight - sprite.anchor.y) * pet.scale;
  view.place(pet.x - sprite.anchor.x * pet.scale, pet.y - sprite.anchor.y * pet.scale - pet.lift);
  view.clip(pet.sink > 0 ? pet.sink * spriteHeight(pet) + below : 0);
  view.opacity(pet.fade);
  view.sprite.paint(currentFrame(pet.anim, sprite, pet.facing), pet.scale);
}

/** Where the pet is heading, for the debug overlay. */
export function targetOf(pet: PetRuntime): Point | null {
  if (pet.jump) return pet.jump.plan.to;
  if ((pet.behavior === "walking" || pet.behavior === "running") && pet.attach) {
    return { x: pet.x + (pet.walkTarget - pet.attach.u), y: pet.y };
  }
  return null;
}
