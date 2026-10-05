import { REDUCED_MOTION_QUERY } from "@/lib/motion";
import { PETWORLD, PETWORLD_DEBUG, TIER_QUERIES } from "./config";
import type { DebugOverlay } from "./debug";
import { ASCII_CREATURE_EVENT, createEvents, type AsciiCreatureDetail, type PetEvents } from "./events";
import { GROUNDED } from "./machine";
import { fitGlyph, type GlyphFit, type GlyphMode, type GlyphOrigin } from "./origin";
import {
  appearOn,
  createPetRuntime,
  enter,
  findSpot,
  follow,
  notice,
  render,
  targetOf,
  update,
  type Frame,
  type PetRuntime,
} from "./pet";
import { PETS } from "./pets";
import { createPointerTracker } from "./pointer";
import { advanceAnimation, animationLength, currentFrame, playAnimation } from "./sprites";
import { createSurfaceRegistry } from "./surfaces";
import type { AnimationName, Behavior, HeroOriginConfig, PetId, Point, ScriptStep, SurfaceType, Tier } from "./types";
import { createPetView, createSpriteView, type SpriteView } from "./view";

/*
 * The world owns every pet and one requestAnimationFrame loop. The loop runs
 * only while something is on screen (a pet in the world, or in a letter that
 * is in view); when there is nothing to draw it stops and a single timer
 * wakes it for the next pet due back. Positions live here and are written
 * straight to the DOM: React renders the layer once and never re-renders for
 * a pet.
 *
 * Each tick reads (surface rects), then decides, then writes, so it never
 * forces a layout in the middle of its own writes.
 */

interface OriginState {
  origin: GlyphOrigin;
  view: SpriteView;
  fit: GlyphFit | null;
  /** When its line finished entering; null while it still is. */
  readyAt: number | null;
  step: number;
  /** The letter has started coming back. */
  revealing: boolean;
  /** The sequence only runs while the letter is in view, so nobody misses it. */
  onScreen: boolean;
  pausedAt: number | null;
  observer: IntersectionObserver | null;
}

/** Where a pet that just left its letter should turn up. */
interface Arrival {
  nearX: number;
  types: readonly SurfaceType[];
  script: readonly ScriptStep[];
}

export interface WorldSnapshot {
  tier: Tier;
  reduced: boolean;
  pets: {
    id: PetId;
    behavior: Behavior;
    animation: AnimationName;
    x: number;
    y: number;
    scale: number;
    facing: 1 | -1;
    surface: string | null;
    target: Point | null;
    script: Behavior[];
  }[];
  origins: { id: PetId; rect: DOMRect; step: string; onScreen: boolean; scale: number | null }[];
  surfaces: { id: string; type: string; visible: boolean; rect: DOMRect }[];
}

export interface PetWorld {
  events: PetEvents;
  /** Starts listening and animating. Returns the teardown. */
  mount: () => () => void;
  /** The page scrolled: re-pin standing pets in the same frame. */
  scrolled: () => void;
  routeChanged: () => void;
  bindLayer: (element: HTMLElement | null) => void;
  bindPet: (id: PetId, element: HTMLElement | null) => void;
  /** A letter that may hold a pet mounted. Decides, before first paint, whether it shows the pet or the letter. */
  claimOrigin: (origin: GlyphOrigin) => void;
  /** The letter's line has finished its entrance. */
  originReady: (origin: GlyphOrigin) => void;
  refitOrigin: (origin: GlyphOrigin) => void;
  releaseOrigin: (origin: GlyphOrigin) => void;
}

declare global {
  interface Window {
    /**
     * Development only. `config` and `pets` are the live tuning objects:
     * change a value, then `replay("calcifer")` to watch the hero moment again
     * with it, without reloading.
     */
    __petworld?: {
      snapshot: () => WorldSnapshot;
      force: (id: PetId, behavior: Behavior) => boolean;
      summon: (id: PetId) => void;
      replay: (id: PetId) => boolean;
      config: typeof PETWORLD;
      pets: typeof PETS;
    };
  }
}

function debugRequested(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  if (PETWORLD_DEBUG) return true;
  try {
    return (
      new URLSearchParams(window.location.search).get("petworld") === "debug" ||
      window.localStorage.getItem("petworld:debug") === "1"
    );
  } catch {
    return false;
  }
}

function readTier(): Tier {
  for (const [tier, query] of TIER_QUERIES) {
    if (window.matchMedia(query).matches) return tier;
  }
  return "desktop";
}

/** How long a step of the letter sequence lasts: as given, or one pass of its animation. */
function stepLength(config: HeroOriginConfig, index: number): number {
  const step = config.sequence[index];
  return step.ms ?? animationLength(config.sprite, step.animation);
}

export function createPetWorld(): PetWorld {
  const events = createEvents();
  const surfaces = createSurfaceRegistry(events);
  const pointer = createPointerTracker();
  const salt = (Date.now() ^ 0x5eed) >>> 0;
  const pets = PETS.filter((def) => def.enabled).map((def) => createPetRuntime(def, salt));
  const byId = new Map(pets.map((pet) => [pet.def.id, pet]));
  /** Letters currently holding a pet. */
  const origins = new Map<PetId, OriginState>();
  /** Every mounted letter, holding its pet or not; used to replay. */
  const letters = new Map<PetId, GlyphOrigin>();
  const arrivals = new Map<PetId, Arrival>();
  /** Letter changes to write in the commit, after the pets, so a swap lands in one paint. */
  const releases: [GlyphOrigin, GlyphMode, number][] = [];

  let mounted = false;
  let raf = 0;
  let wake = 0;
  let last = 0;
  let tier: Tier = "desktop";
  let reduced = false;
  let lastScan = Number.NEGATIVE_INFINITY;
  let layer: HTMLElement | null = null;
  let debug: DebugOverlay | null = null;

  const frameAt = (now: number, dt: number): Frame => {
    const tierConfig = PETWORLD.tiers[tier];
    return {
      now,
      dt,
      tier,
      tierConfig,
      width: window.innerWidth,
      height: window.innerHeight,
      surfaces,
      pointer: tierConfig.pointer && pointer.state.fine ? pointer.state : null,
      events,
      pets,
    };
  };

  const isOut = (pet: PetRuntime) => pet.behavior !== "hidden";

  /* ---------- the hero letter ---------- */

  const retire = (state: OriginState) => {
    state.observer?.disconnect();
    if (origins.get(state.origin.petId) === state) origins.delete(state.origin.petId);
  };

  /** Inside the letter he watches a nearby pointer; with none, a look step glances one way, then the other. */
  const watchFromLetter = (
    pet: PetRuntime,
    state: OriginState,
    frame: Frame,
    animation: AnimationName,
    progress: number,
  ) => {
    const pointerState = frame.pointer;

    if (pointerState && frame.now - pointerState.movedAt < PETWORLD.pointer.freshMs) {
      const rect = state.origin.sprite.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      if (Math.hypot(pointerState.x - x, pointerState.y - y) < PETWORLD.pointer.glyphRadius) {
        playAnimation(pet.anim, "look");
        if (Math.abs(pointerState.x - x) > 8) pet.facing = pointerState.x > x ? 1 : -1;
        return;
      }
    }

    playAnimation(pet.anim, animation);
    if (animation === "look") pet.facing = progress < 0.5 ? 1 : -1;
  };

  /**
   * The end of the letter sequence. By now the exit animation has run down
   * to nothing and the letter has faded back in beneath it, so the sprite
   * goes without a trace. After a breath the pet materialises on a surface
   * near where the letter was.
   */
  const vanish = (pet: PetRuntime, state: OriginState, frame: Frame) => {
    const config = pet.def.heroOrigin;
    const rect = state.origin.sprite.getBoundingClientRect();
    retire(state);
    pet.appeared = true;
    pet.behavior = "hidden";
    if (reduced || !config) {
      // No teleport: the still sprite crossfades back into the letter, and he stays away.
      releases.push([state.origin, "released", PETWORLD.hero.revealMs]);
      pet.hiddenUntil = Number.POSITIVE_INFINITY;
      return;
    }

    // The exit animation has run down to nothing and the letter is already on its way back.
    releases.push([state.origin, "released", 0]);

    pet.hiddenUntil = frame.now + PETWORLD.hero.teleportGapMs;
    arrivals.set(pet.def.id, {
      nearX: rect.left + rect.width / 2,
      types: config.landOn,
      script: config.afterLanding,
    });
    events.emit({ type: "PET_DETACHED", pet: pet.def.id, x: rect.left + rect.width / 2, y: rect.bottom });
  };

  const stepInline = (pet: PetRuntime, frame: Frame) => {
    const state = origins.get(pet.def.id);
    const config = pet.def.heroOrigin;
    if (!state || !config) return;

    if (!reduced) advanceAnimation(pet.anim, config.sprite, frame.dt, pet.facing);
    if (state.readyAt === null || !state.onScreen) return;

    const { sequence } = config;
    let elapsed = frame.now - state.readyAt;
    let index = 0;
    while (index < sequence.length && elapsed >= stepLength(config, index)) {
      elapsed -= stepLength(config, index);
      index += 1;
    }

    if (index !== state.step) {
      state.step = index;
      // Reduced motion keeps one still frame inside the letter.
      if (index < sequence.length && !reduced) playAnimation(pet.anim, sequence[index].animation);
    }

    if (index >= sequence.length) {
      vanish(pet, state, frame);
      return;
    }

    const step = sequence[index];
    const length = stepLength(config, index);

    if (!reduced && (step.animation === "idle" || step.animation === "look")) {
      watchFromLetter(pet, state, frame, step.animation, elapsed / length);
    }

    // The letter starts back just before he is gone, so the word is whole the moment he is.
    if (!reduced && !state.revealing && index === sequence.length - 1 && elapsed >= length - PETWORLD.hero.revealLeadMs) {
      state.revealing = true;
      releases.push([state.origin, "dissolving", PETWORLD.hero.revealMs]);
    }
  };

  /* ---------- presence ---------- */

  /** Brings back pets that are due, within the tier's limit, and sends extras away. */
  const direct = (frame: Frame) => {
    if (reduced) return;

    const limit = frame.tierConfig.maxVisible;
    // Pets already on their way out still count against new arrivals, but not toward sending more away.
    let staying = pets.filter((pet) => isOut(pet) && pet.behavior !== "hiding").length;
    let out = pets.filter(isOut).length;

    for (let index = pets.length - 1; index >= 0 && staying > limit; index -= 1) {
      const pet = pets[index];
      if (!GROUNDED.has(pet.behavior)) continue;
      enter(pet, "hiding", frame);
      staying -= 1;
    }

    pets.forEach((pet) => {
      if (GROUNDED.has(pet.behavior) && !pet.def.tiers.includes(frame.tier)) enter(pet, "hiding", frame);
    });

    for (const pet of pets) {
      if (pet.behavior !== "hidden" || frame.now < pet.hiddenUntil) continue;

      if (out >= limit || !pet.def.tiers.includes(frame.tier)) {
        pet.hiddenUntil = frame.now + PETWORLD.retryMs;
        continue;
      }

      if (frame.now - lastScan > PETWORLD.retryMs) {
        surfaces.scan();
        lastScan = frame.now;
      }

      const arrival = arrivals.get(pet.def.id);
      const spot =
        (arrival && findSpot(pet, frame, arrival.types, arrival.nearX, PETWORLD.hero.arrivalInset)) ??
        findSpot(pet, frame, pet.def.surfaces);

      if (!spot) {
        pet.hiddenUntil = frame.now + PETWORLD.retryMs;
        continue;
      }

      arrivals.delete(pet.def.id);
      appearOn(pet, frame, spot, arrival?.script);
      out += 1;
    }
  };

  /* ---------- loop ---------- */

  const commit = () => {
    pets.forEach(render);

    origins.forEach((state, id) => {
      const pet = byId.get(id);
      const sprite = pet?.def.heroOrigin?.sprite;
      if (pet?.behavior !== "inline" || !state.fit || !sprite) return;
      state.view.paint(currentFrame(pet.anim, sprite, pet.facing), state.fit.scale);
    });

    releases.splice(0).forEach(([origin, mode, fadeMs]) => origin.setMode(mode, fadeMs));
  };

  const snapshot = (): WorldSnapshot => ({
    tier,
    reduced,
    pets: pets.map((pet) => ({
      id: pet.def.id,
      behavior: pet.behavior,
      animation: pet.anim.name,
      x: Math.round(pet.x * 10) / 10,
      y: Math.round(pet.y * 10) / 10,
      scale: Math.round(pet.scale * 100) / 100,
      facing: pet.facing,
      surface: pet.attach?.surface.id ?? pet.jump?.surface?.id ?? null,
      target: targetOf(pet),
      script: pet.script.map((step) => step.behavior),
    })),
    origins: Array.from(origins.values()).map((state) => ({
      id: state.origin.petId,
      rect: state.origin.sprite.getBoundingClientRect(),
      step: byId.get(state.origin.petId)?.def.heroOrigin?.sequence[state.step]?.animation ?? "entering",
      onScreen: state.onScreen,
      scale: state.fit?.scale ?? null,
    })),
    surfaces: surfaces.all().map((surface) => ({
      id: surface.id,
      type: surface.type,
      visible: surface.visible,
      rect: surface.element.getBoundingClientRect(),
    })),
  });

  /** Something on screen needs frames: a pet out in the world, or one in a letter that is in view. */
  const active = () =>
    debug !== null ||
    pets.some((pet) => (pet.behavior === "inline" ? (origins.get(pet.def.id)?.onScreen ?? false) : isOut(pet)));

  const schedule = () => {
    if (!mounted || document.visibilityState !== "visible") return;

    if (active()) {
      if (!raf) {
        last = performance.now();
        raf = window.requestAnimationFrame(tick);
      }
      return;
    }

    // Nothing to draw: sleep until the next pet is due back.
    if (wake) return;
    const due = Math.min(...pets.map((pet) => pet.hiddenUntil));
    if (!Number.isFinite(due)) return;
    wake = window.setTimeout(wakeUp, Math.max(16, due - performance.now()));
  };

  function tick(now: number) {
    raf = 0;
    const frame = frameAt(now, Math.min(now - last, 64));
    last = now;

    pets.forEach((pet) => {
      if (pet.behavior === "inline") stepInline(pet, frame);
      else update(pet, frame);
    });
    direct(frame);
    commit();
    debug?.draw(snapshot());
    schedule();
  }

  function wakeUp() {
    wake = 0;
    if (!mounted || document.visibilityState !== "visible") return;
    direct(frameAt(performance.now(), 0));
    commit();
    schedule();
  }

  const stop = () => {
    if (raf) window.cancelAnimationFrame(raf);
    if (wake) window.clearTimeout(wake);
    raf = 0;
    wake = 0;
  };

  /** Reduced motion turned on mid-visit: every pet out in the world leaves at once. */
  const putAway = () => {
    const frame = frameAt(performance.now(), 0);
    pets.forEach((pet) => {
      if (pet.behavior === "inline") return;
      if (isOut(pet)) enter(pet, "hidden", frame);
      pet.hiddenUntil = Number.POSITIVE_INFINITY;
    });
    commit();
  };

  const scrolled = () => {
    if (raf) pets.forEach((pet) => follow(pet, surfaces));
  };

  const refitOrigin = (origin: GlyphOrigin) => {
    const state = origins.get(origin.petId);
    const pet = byId.get(origin.petId);
    const config = pet?.def.heroOrigin;
    if (!state || state.origin !== origin || !pet || !config) return;

    const fit = fitGlyph(origin, config.sprite, config.fit);
    if (!fit) return;

    state.fit = fit;
    origin.sprite.style.left = `${fit.left}px`;
    origin.sprite.style.top = `${fit.top}px`;
    state.view.paint(currentFrame(pet.anim, config.sprite, pet.facing), fit.scale);
  };

  const claimOrigin = (origin: GlyphOrigin) => {
    letters.set(origin.petId, origin);
    const pet = byId.get(origin.petId);
    const config = pet?.def.heroOrigin;
    // A letter holds its pet until the pet first leaves it; from then on it is just a letter.
    const available =
      pet !== undefined &&
      config?.enabled === true &&
      pet.def.tiers.includes(readTier()) &&
      (pet.behavior === "inline" || (!pet.appeared && !isOut(pet)));

    if (!pet || !config || !available) {
      origin.setMode("text");
      return;
    }

    if (pet.behavior !== "inline") {
      pet.behavior = "inline";
      pet.facing = 1;
      playAnimation(pet.anim, "idle");
    }

    const state: OriginState = {
      origin,
      view: createSpriteView(origin.sprite, config.sprite),
      fit: null,
      readyAt: null,
      step: -1,
      revealing: false,
      onScreen: true,
      pausedAt: null,
      observer: null,
    };

    state.observer = new IntersectionObserver(([entry]) => {
      const now = performance.now();
      state.onScreen = entry.isIntersecting;
      if (!state.onScreen) {
        state.pausedAt = now;
      } else if (state.pausedAt !== null) {
        if (state.readyAt !== null) state.readyAt += now - state.pausedAt;
        state.pausedAt = null;
      }
      schedule();
    });
    state.observer.observe(origin.glyph);

    origins.set(pet.def.id, state);
    origin.setMode("mascot");
    refitOrigin(origin);
    schedule();
  };

  const originReady = (origin: GlyphOrigin) => {
    const state = origins.get(origin.petId);
    if (!state || state.origin !== origin || state.readyAt !== null) return;
    state.readyAt = performance.now();
    if (!state.onScreen) state.pausedAt = state.readyAt;
    events.emit({ type: "HERO_PET_READY", pet: origin.petId });
    schedule();
  };

  /* ---------- API ---------- */

  return {
    events,

    mount() {
      mounted = true;
      const now = performance.now();
      const reducedQuery = window.matchMedia(REDUCED_MOTION_QUERY);
      const tierQueries = TIER_QUERIES.map(([, query]) => window.matchMedia(query));
      tier = readTier();
      reduced = reducedQuery.matches;

      pets.forEach((pet) => {
        if (pet.behavior !== "hidden" || pet.appeared || Number.isFinite(pet.hiddenUntil)) return;
        pet.hiddenUntil = pet.def.heroOrigin?.enabled
          ? now + PETWORLD.hero.originGraceMs
          : now + pet.rng.range(pet.def.spawn?.firstDelayMs ?? pet.def.presence.awayMs);
      });

      const onTier = () => {
        tier = readTier();
      };
      const onReduced = () => {
        reduced = reducedQuery.matches;
        if (reduced) {
          putAway();
          return;
        }
        const frame = frameAt(performance.now(), 0);
        pets.forEach((pet) => {
          if (pet.behavior === "hidden" && !Number.isFinite(pet.hiddenUntil)) {
            pet.hiddenUntil = frame.now + PETWORLD.retryMs;
          }
        });
        schedule();
      };
      const onVisibility = () => {
        if (document.visibilityState === "visible") schedule();
        else stop();
      };
      const onCreature = (event: Event) => {
        const detail = (event as CustomEvent<AsciiCreatureDetail>).detail;
        if (detail) events.emit({ type: "ASCII_CREATURE_PASS", ...detail });
      };
      const offCreature = events.on("ASCII_CREATURE_PASS", (event) => {
        const frame = frameAt(performance.now(), 0);
        pets.forEach((pet) => {
          if (Math.hypot(event.x - pet.x, event.y - pet.y) <= PETWORLD.creatureRadius) notice(pet, frame, event);
        });
      });

      surfaces.connect();
      pointer.connect();
      lastScan = now;
      reducedQuery.addEventListener("change", onReduced);
      tierQueries.forEach((query) => query.addEventListener("change", onTier));
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("scroll", scrolled, { passive: true });
      window.addEventListener(ASCII_CREATURE_EVENT, onCreature);

      if (debugRequested()) {
        void import("./debug").then(({ createDebugOverlay }) => {
          if (!mounted || !layer || debug) return;
          debug = createDebugOverlay(layer);
          schedule();
        });
      }

      if (process.env.NODE_ENV !== "production") {
        window.__petworld = {
          snapshot,
          config: PETWORLD,
          pets: PETS,
          force: (id, behavior) => {
            const pet = byId.get(id);
            if (!pet || !pet.attach || pet.jump) return false;
            enter(pet, behavior, frameAt(performance.now(), 0));
            schedule();
            return true;
          },
          summon: (id) => {
            const pet = byId.get(id);
            if (!pet || pet.behavior !== "hidden") return;
            pet.hiddenUntil = 0;
            if (wake) window.clearTimeout(wake);
            wakeUp();
          },
          replay: (id) => {
            const pet = byId.get(id);
            const origin = letters.get(id);
            if (!pet || !origin) return false;
            // Back into the letter as if the page had just loaded, minus the entrance.
            if (isOut(pet)) enter(pet, "hidden", frameAt(performance.now(), 0));
            arrivals.delete(id);
            pet.appeared = false;
            pet.behavior = "hidden";
            claimOrigin(origin);
            originReady(origin);
            return true;
          },
        };
      }

      schedule();

      return () => {
        mounted = false;
        stop();
        surfaces.disconnect();
        pointer.disconnect();
        offCreature();
        reducedQuery.removeEventListener("change", onReduced);
        tierQueries.forEach((query) => query.removeEventListener("change", onTier));
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("scroll", scrolled);
        window.removeEventListener(ASCII_CREATURE_EVENT, onCreature);
        debug?.destroy();
        debug = null;
        if (process.env.NODE_ENV !== "production") delete window.__petworld;
      };
    },

    scrolled,

    routeChanged() {
      if (!mounted) return;
      surfaces.scan();
      lastScan = performance.now();
    },

    bindLayer(element) {
      layer = element;
    },

    bindPet(id, element) {
      const pet = byId.get(id);
      if (!pet) return;
      const sprite = element?.firstElementChild;
      pet.view = element && sprite instanceof HTMLElement ? createPetView(element, sprite, pet.def.sprite) : null;
    },

    claimOrigin,
    originReady,
    refitOrigin,

    releaseOrigin(origin) {
      if (letters.get(origin.petId) === origin) letters.delete(origin.petId);
      const state = origins.get(origin.petId);
      if (!state || state.origin !== origin) return;
      retire(state);

      // StrictMode and fast refresh unmount and remount in one go; only a
      // letter that stays gone leaves its pet without a home.
      window.setTimeout(() => {
        const pet = byId.get(origin.petId);
        if (!pet || pet.behavior !== "inline" || origins.has(origin.petId)) return;
        pet.behavior = "hidden";
        pet.hiddenUntil = performance.now() + PETWORLD.hero.originGraceMs;
        schedule();
      }, 0);
    },
  };
}
