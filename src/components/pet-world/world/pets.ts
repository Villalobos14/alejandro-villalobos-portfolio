import { SPRITES } from "./sprites";
import type { PetDefinition } from "./types";

/*
 * The cast. Everything PetWorld knows about a pet is here: swapping a sprite,
 * a size, a temperament or where it first appears is an edit to this file.
 * Order matters: when only so many pets may be out, earlier ones come first.
 */
export const PETS: readonly PetDefinition[] = [
  {
    id: "calcifer",
    enabled: true,
    seed: 0xca1c1f,
    sprite: SPRITES.calcifer,
    // About 42px tall on screen: one CSS pixel per sprite pixel, two device pixels on a 2x screen.
    scale: { desktop: 1, tablet: 1, mobile: 0.75 },
    appearance: "teleport",
    tiers: ["desktop", "tablet", "mobile"],
    // Curious and warm rather than restless: he watches more than he wanders.
    personality: { curiosity: 0.85, energy: 0.6, shyness: 0.15, sleepiness: 0.35, movementSpeed: 1 },
    presence: { visibleMs: [45000, 80000], awayMs: [20000, 40000] },
    surfaces: ["dock", "card"],
    heroOrigin: {
      enabled: true,
      sprite: SPRITES.calciferGlyph,
      // Optical, not geometric: a little wider than the letter and free to rise above the x-height.
      fit: { width: 1.22, height: 1.45 },
      sequence: [
        // Long enough to notice the "o" is burning; it watches a nearby pointer.
        { animation: "idle", ms: 1600 },
        // He realises he can leave: a glance each way, then he gathers himself (about a second).
        { animation: "prepare" },
        // Comes apart into a few warm pixels (half a second); the letter is back before the last of them.
        { animation: "teleportOut" },
      ],
      landOn: ["dock"],
      // Lets the arrival land: a beat of standing, a look one way and the other, then he is his own.
      afterLanding: [
        { behavior: "idle", ms: [500, 800] },
        { behavior: "looking", ms: [1500, 2000] },
      ],
    },
  },
  {
    /*
     * Second mascot, not designed yet. It is meant to get a hero origin of its
     * own: wrap its letter in <PetGlyphOrigin petId="pet02"> and add a
     * heroOrigin block like Calcifer's. Until a letter is chosen it peeks out
     * from behind project cards now and then, on wide screens only, so it
     * never competes with Calcifer.
     */
    id: "pet02",
    enabled: true,
    seed: 0x9e7002,
    sprite: SPRITES.pet02,
    scale: { desktop: 3, tablet: 2, mobile: 2 },
    appearance: "peek",
    tiers: ["desktop"],
    personality: { curiosity: 0.45, energy: 0.3, shyness: 0.55, sleepiness: 0.7, movementSpeed: 0.7 },
    presence: { visibleMs: [10000, 18000], awayMs: [60000, 120000] },
    surfaces: ["card"],
    spawn: { firstDelayMs: [12000, 20000] },
  },
  {
    /*
     * Easter egg, not designed yet. Meant to turn up late in the page, so it
     * lives on the footer; register a surface there before enabling it.
     */
    id: "pet03",
    enabled: false,
    seed: 0x9e7003,
    sprite: SPRITES.pet03,
    scale: { desktop: 3, tablet: 2, mobile: 2 },
    appearance: "peek",
    tiers: ["desktop"],
    personality: { curiosity: 0.6, energy: 0.4, shyness: 0.9, sleepiness: 0.4, movementSpeed: 0.8 },
    presence: { visibleMs: [8000, 14000], awayMs: [90000, 180000] },
    surfaces: ["footer"],
    spawn: { firstDelayMs: [30000, 60000] },
  },
];
