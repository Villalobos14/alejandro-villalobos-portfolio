import type { MotifType } from "./types";

export const MONO = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

/** Motifs each organism alternates between. Lily, Yuta and DATA stay registered in `motifs/` but are out of the hero. */
export const SEQUENCE: readonly MotifType[] = ["manta", "jelly"];

export const GLYPHS: readonly string[] = [".", "·", "+", "*", "#", "×"];

/** Glyph indices for density levels 1–5; each glyph slowly steps through its own row. */
export const FAMILIES: readonly (readonly number[])[] = [
  [0, 1, 2, 1],
  [2, 1, 2, 3],
  [3, 2, 3, 3],
  [4, 3, 4, 4],
  [5, 5, 4, 5],
];

const DEG = Math.PI / 180;

export type Vec2 = readonly [number, number];
type Opacity = readonly [number, number, number, number, number];

export interface PathConfig {
  /** What the path is for in the choreography: a crossing, an arc, a pass through depth. */
  name: string;
  /** Cubic Bézier control points as fractions of the hero; ends past 0–1 lie offscreen. */
  points: readonly [Vec2, Vec2, Vec2, Vec2];
  /** Depth keys spread evenly along the path, 0 near and 1 far: a creature can approach, hold and recede. */
  depth: readonly number[];
  /** Seconds to swim it as a manta; jellyfish drift slower. */
  duration: number;
  /**
   * Bias of the camera's elevation on this path, −1 (seen from below) to 1
   * (seen from above). Height on screen adds to it, as in an aquarium.
   */
  view: number;
  /** Crosses the headline. Only one creature at a time may be on such a path. */
  center: boolean;
}

export interface StillConfig {
  /** Fractions of the hero, read against the headline like path points. */
  x: number;
  y: number;
  depth: number;
  /** Index into SEQUENCE. */
  motif: number;
  /** Degrees: in the screen plane, about the motif's x axis, about its y axis. */
  spin: number;
  tiltX: number;
  tiltY: number;
}

export interface EntityConfig {
  name: string;
  /** Glyphs in the full-detail point cloud; depth thins what is drawn by importance. */
  glyphs: number;
  /** Size before depth, relative to the mode's base radius. */
  scale: number;
  /** Index into SEQUENCE the entity starts as. */
  motif: number;
  /** Seconds before its first morph; entities are staggered so the hero never switches state at once. */
  firstMorph: number;
  /** Visited in order and looped, skipping a crossing while another creature holds the centre. */
  paths: readonly PathConfig[];
  /** Where along its first path the entity starts, so the hero is composed on load. */
  start: number;
  /** Pose for reduced motion; entities without one are left out. */
  still?: StillConfig;
}

export interface ModeConfig {
  /** Base radius: min(width * width, height * height), clamped. Entities scale from it. */
  radius: { width: number; height: number; min: number; max: number };
  /**
   * Where the headline sat, as fractions of the hero height, when the paths
   * were drawn. Path heights are remapped so a path drawn under the headline
   * stays under it on every viewport.
   */
  textRef: { top: number; bottom: number };
  timing: { hold: Vec2; morph: Vec2; intro: number };
  motion: number;
  /** Scales how far creatures roll and tilt, including the viewing angles they show. */
  rotation: number;
  ambient: number;
  entities: readonly EntityConfig[];
}

/*
 * Desktop choreography. The lead alternates hero crossings, diagonals that
 * pass behind "Product Designer creating", come closer on the way and recede
 * as they leave, with quiet passes deep in the open right column, so the
 * typography has the stage most of the time. A mid-depth creature keeps to
 * the band below the headline; a far one drifts along the top and only
 * crosses the centre when nothing else is there.
 */
const WIDE: ModeConfig = {
  radius: { width: 0.105, height: 0.2, min: 110, max: 210 },
  textRef: { top: 0.29, bottom: 0.64 },
  timing: { hold: [8, 12], morph: [2.5, 3.5], intro: 1.8 },
  motion: 1,
  rotation: 1,
  ambient: 1,
  entities: [
    {
      name: "lead",
      glyphs: 720,
      scale: 1,
      motif: 0,
      firstMorph: 10,
      start: 0.1,
      paths: [
        {
          name: "diagonal-ascend",
          points: [
            [-0.05, 0.86],
            [0.32, 0.84],
            [0.56, 0.4],
            [1.05, 0.3],
          ],
          depth: [0.4, 0.18, 0.22, 0.62],
          duration: 18,
          view: 0.3,
          center: true,
        },
        {
          name: "depth-pass",
          points: [
            [1.05, 0.08],
            [0.8, 0.2],
            [0.84, 0.64],
            [1.05, 0.9],
          ],
          depth: [0.72, 0.84, 0.76],
          duration: 12,
          view: 0.25,
          center: false,
        },
        {
          name: "diagonal-descend",
          points: [
            [1.05, 0.22],
            [0.72, 0.28],
            [0.4, 0.76],
            [-0.05, 0.68],
          ],
          depth: [0.5, 0.2, 0.28, 0.66],
          duration: 18,
          view: 0.25,
          center: true,
        },
        {
          name: "column-rise",
          points: [
            [1.05, 0.94],
            [0.86, 0.76],
            [0.8, 0.38],
            [1.05, 0.12],
          ],
          depth: [0.8, 0.7, 0.82],
          duration: 12,
          view: 0.3,
          center: false,
        },
      ],
      still: { x: 0.85, y: 0.5, depth: 0.25, motif: 1, spin: 8, tiltX: 16, tiltY: 20 },
    },
    {
      name: "mid",
      glyphs: 560,
      scale: 1,
      motif: 1,
      firstMorph: 15,
      start: 0.2,
      paths: [
        {
          name: "lower-arc",
          points: [
            [-0.05, 0.83],
            [0.3, 0.89],
            [0.6, 0.71],
            [1.05, 0.81],
          ],
          depth: [0.62, 0.46, 0.56],
          duration: 26,
          view: -0.15,
          center: false,
        },
        {
          name: "lower-drift",
          points: [
            [1.05, 0.74],
            [0.7, 0.68],
            [0.36, 0.89],
            [-0.05, 0.78],
          ],
          depth: [0.5, 0.64],
          duration: 27,
          view: -0.1,
          center: false,
        },
        {
          name: "lower-sweep",
          points: [
            [-0.05, 0.72],
            [0.32, 0.8],
            [0.68, 0.9],
            [1.05, 0.76],
          ],
          depth: [0.68, 0.5, 0.6],
          duration: 28,
          view: -0.2,
          center: false,
        },
      ],
      still: { x: 0.14, y: 0.82, depth: 0.5, motif: 0, spin: 64, tiltX: -10, tiltY: 46 },
    },
    {
      name: "far",
      glyphs: 520,
      scale: 1,
      motif: 0,
      firstMorph: 21,
      start: 0.3,
      paths: [
        {
          name: "upper-arc",
          points: [
            [-0.05, 0.12],
            [0.3, 0.2],
            [0.65, 0.05],
            [1.05, 0.14],
          ],
          depth: [0.92, 0.8],
          duration: 34,
          view: -0.15,
          center: false,
        },
        {
          name: "upper-arc-return",
          points: [
            [1.05, 0.2],
            [0.7, 0.08],
            [0.35, 0.18],
            [-0.05, 0.1],
          ],
          depth: [0.84, 0.94],
          duration: 34,
          view: -0.1,
          center: false,
        },
        {
          name: "depth-pass-diagonal",
          points: [
            [1.05, 0.1],
            [0.7, 0.3],
            [0.35, 0.55],
            [-0.05, 0.78],
          ],
          depth: [0.95, 0.86],
          duration: 38,
          view: 0.3,
          center: true,
        },
      ],
    },
  ],
};

/*
 * Phones and tablets: one mid-depth creature and one far one, both in the
 * open space above the headline, which sits low in the hero below the lg
 * breakpoint. Nothing comes close enough to cover the headline.
 */
const COMPACT: ModeConfig = {
  radius: { width: 0.24, height: 0.19, min: 60, max: 150 },
  textRef: { top: 0.78, bottom: 0.94 },
  timing: { hold: [9, 12], morph: [2.8, 3.5], intro: 1.9 },
  motion: 0.65,
  rotation: 0.6,
  ambient: 0.55,
  entities: [
    {
      name: "lead",
      glyphs: 380,
      scale: 0.9,
      motif: 0,
      firstMorph: 9,
      start: 0.3,
      paths: [
        {
          name: "cross-ascend",
          points: [
            [-0.1, 0.5],
            [0.3, 0.4],
            [0.7, 0.24],
            [1.1, 0.3],
          ],
          depth: [0.5, 0.36, 0.5],
          duration: 18,
          view: 0.4,
          center: false,
        },
        {
          name: "cross-descend",
          points: [
            [1.1, 0.2],
            [0.72, 0.18],
            [0.3, 0.5],
            [-0.1, 0.44],
          ],
          depth: [0.55, 0.4, 0.5],
          duration: 19,
          view: 0.45,
          center: false,
        },
      ],
      still: { x: 0.7, y: 0.34, depth: 0.4, motif: 1, spin: 8, tiltX: 16, tiltY: 20 },
    },
    {
      name: "far",
      glyphs: 240,
      scale: 0.9,
      motif: 1,
      firstMorph: 15,
      start: 0.25,
      paths: [
        {
          name: "upper-drift",
          points: [
            [1.05, 0.28],
            [0.65, 0.36],
            [0.35, 0.22],
            [-0.05, 0.3],
          ],
          depth: [0.75, 0.86],
          duration: 28,
          view: 0.1,
          center: false,
        },
        {
          name: "mid-drift",
          points: [
            [-0.05, 0.6],
            [0.3, 0.5],
            [0.7, 0.66],
            [1.05, 0.56],
          ],
          depth: [0.86, 0.74],
          duration: 28,
          view: 0,
          center: false,
        },
      ],
      still: { x: 0.26, y: 0.6, depth: 0.75, motif: 0, spin: 60, tiltX: -8, tiltY: 42 },
    },
  ],
};

interface TravelConfig {
  /** Path speed relative to the path's duration. */
  speed: number;
  /** 1 turns the body to face along the path; 0 leaves it upright. */
  heading: number;
  /** How quickly the body turns toward the path, per second: a manta steers, a jellyfish comes round slowly. */
  follow: number;
  /** How quickly trailing parts catch up with a change of drift, per second; lower means tentacles follow later. */
  inertia: number;
  /** Share of the path's direction an upright drifter leans into, leading with its top. */
  lean: number;
  /** Radians of bank per rad/s of turning, and its cap. */
  bank: number;
  bankMax: number;
  /** Radians of pitch per unit of depth change along the path, and its cap. */
  climb: number;
  climbMax: number;
  /**
   * How the camera's elevation shows on this body: `roll` turns a swimmer
   * from its back (seen from above) through its side to its belly (seen from
   * below); `tilt` tips a drifter's axis toward or away from the camera.
   */
  view: { roll: number; tilt: number };
  /** Resting orientation in radians: screen plane, about the motif's x axis, about its y axis. */
  rest: readonly [number, number, number];
  /** Idle rotation around the rest, same axes. */
  sway: readonly [number, number, number];
  swaySpeed: readonly [number, number, number];
  /** Bob in radii (y) and depth units (z). */
  bob: { y: number; z: number; speed: number };
  /** Pace swing with each bell contraction, as a share of the pace. */
  surge: number;
  /** Roll in radians that rides on each wing stroke. */
  flapRoll: number;
}

/** A lily floats upright in three-quarter view. Kept for the inactive lily motif. */
const DRIFT: TravelConfig = {
  speed: 0.62,
  heading: 0,
  follow: 1,
  inertia: 2,
  lean: 0,
  bank: 0,
  bankMax: 0,
  climb: 0,
  climbMax: 0,
  view: { roll: 0, tilt: 0 },
  rest: [0, -36 * DEG, 16 * DEG],
  sway: [5 * DEG, 8 * DEG, 8 * DEG],
  swaySpeed: [0.13, 0.17, 0.11],
  bob: { y: 0.07, z: 0.05, speed: 0.42 },
  surge: 0,
  flapRoll: 0,
};

/**
 * A manta swims: it faces where it goes, rolls onto its side or shows its
 * belly depending on where it is relative to the camera, banks into turns and
 * noses down as it heads deeper.
 */
const SWIM: TravelConfig = {
  speed: 1,
  heading: 1,
  follow: 1.6,
  inertia: 2.5,
  lean: 0,
  bank: 1.1,
  bankMax: 30 * DEG,
  climb: 0.9,
  climbMax: 20 * DEG,
  view: { roll: 1, tilt: 0 },
  rest: [0, 0, 0],
  sway: [0, 5 * DEG, 10 * DEG],
  swaySpeed: [0, 0.21, 0.17],
  bob: { y: 0.025, z: 0.015, speed: 0.5 },
  surge: 0,
  flapRoll: 3 * DEG,
};

/**
 * A jellyfish drifts: slower, leaning its bell into the drift, surging a
 * little with each pulse, its axis tipped toward or away from the camera by
 * where it floats, and turning slowly about its own axis. It has more inertia
 * than a manta: the bell comes round to a new drift slowly and the tentacles
 * later still.
 */
const FLOAT: TravelConfig = {
  speed: 0.55,
  heading: 0,
  follow: 0.5,
  inertia: 0.9,
  lean: 0.3,
  bank: 0,
  bankMax: 0,
  climb: 0.6,
  climbMax: 15 * DEG,
  view: { roll: 0, tilt: 34 * DEG },
  rest: [0, 0, 0],
  sway: [4 * DEG, 6 * DEG, 24 * DEG],
  swaySpeed: [0.11, 0.15, 0.06],
  bob: { y: 0.08, z: 0.04, speed: 0.33 },
  surge: 0.35,
  flapRoll: 0,
};

/* Detail, not brightness, separates near from far: a near creature has far more structure but stays behind the headline. */
const NEAR: Opacity = [0.22, 0.25, 0.28, 0.305, 0.32];
const MID: Opacity = [0.13, 0.155, 0.18, 0.2, 0.22];
const FAR: Opacity = [0.065, 0.08, 0.095, 0.115, 0.13];

export const HERO_FIELD_CONFIG = {
  modes: { wide: WIDE, compact: COMPACT },
  camera: {
    /** Distance from the camera to an organism's centre, in motif radii. Sets how strong per-point perspective is. */
    distance: 3.2,
    /**
     * The viewer's eye sits level with the middle of the headline. A creature
     * below it is seen from above, one above it from below: elevation changes
     * by this much per hero height, plus a slow wander, within `range`.
     */
    elevation: 1.6,
    /** Where the eye line may sit, so a headline low in a phone hero doesn't put every creature above the viewer. */
    horizon: [0.35, 0.6] as const,
    wander: 0.15,
    wanderSpeed: 0.11,
    range: [-0.6, 1] as const,
    /** Most a swimmer rolls toward its belly, in radians. */
    rollMax: 130 * DEG,
  },
  /** Organism depth 0 (near) → 0.5 → 1 (far). */
  depth: {
    scale: [1.15, 0.75, 0.4] as const,
    /** Alpha by density level 1–5 at each depth. */
    opacity: [NEAR, MID, FAR] as const,
    motion: [1.15, 0.85, 0.6] as const,
    /** Density shift with distance: near organisms lean on `* #`, mid ones on `+ *`, far ones on `· +`. */
    thin: [-0.2, 0.25, 1.1] as const,
    /** Level of detail at each depth, read by `lod`: near draws nearly everything, far only the silhouette. */
    detail: [1, 0.42, 0.15] as const,
    /** Pointer parallax in px: base plus extra for near organisms. */
    parallax: [1.2, 2.4] as const,
  },
  /** Depth cue inside one organism: glyphs nearer the camera read a touch larger and brighter. */
  relief: { size: 0.05, alpha: 0.12, step: 0.07 },
  /** Organisms dim slightly behind the headline; the opaque text does the rest. */
  veil: 0.9,
  /** Path ends are pushed this many radii past the edge, so a creature is gone before it reappears. */
  offscreen: 1.6,
  /**
   * Glyph size follows the spacing between glyphs, so denser creatures get a
   * finer grain instead of a heavier blur. `area` is a motif's rough area in
   * radii², `fill` the glyph size per spacing.
   */
  font: { fill: 1.5, area: 1.15, min: 7.5, max: 13, buckets: [0.86, 1, 1.16], depth: [1, 0.92, 0.8] as const },
  /**
   * Level of detail by importance. A glyph class appears once detail passes
   * `reach × (1 − importance) − offset` and is complete `width` later, so the
   * silhouette survives to the farthest depth and interior fill only shows up
   * close. Glyphs fade over `fade` instead of popping.
   */
  lod: { reach: 0.75, offset: 0.2, width: 0.55, fade: 0.06 },
  /** Thin surfaces seen edge-on keep at least this share of their alpha; marks on one side show only when it faces the camera. */
  sheet: { floor: 0.5 },
  face: { from: -0.1, to: 0.5 },
  morph: {
    releaseSpan: 0.3,
    resolveSpan: 0.36,
    /**
     * When each anatomical role (core, left, right, edge, trail, fine) lets go
     * as a source and settles as a target: edges loosen first and the body
     * holds on longest; the core lands first, the tentacles or tail last.
     */
    roles: {
      release: [0.16, 0.08, 0.08, 0, 0.04, 0] as const,
      resolve: [0.3, 0.38, 0.38, 0.5, 0.48, 0.46] as const,
    },
    jitter: 0.05,
    swirl: 0.22,
    contract: 0.1,
    wobble: 0.04,
    currentX: 0.05,
    currentY: -0.035,
    thin: 0.6,
    dim: 0.1,
    settle: 0.18,
    introFrom: 0.4,
    /**
     * How the cloud reshapes on its way to each motif: width, height, how far
     * matter bound for low parts sinks early, and how much earlier x and y
     * settle. Toward a jellyfish the wings fold in before they hang and what
     * will be tentacles starts to fall; toward a manta the bell flattens
     * before it spreads into wings.
     */
    cloud: {
      manta: [1.3, 0.8, 0, 0, 0.12],
      jelly: [0.82, 1.12, 0.16, 0.12, 0],
      lily: [0.92, 1.05, 0, 0, 0],
      yuta: [1, 1, 0, 0, 0],
      data: [1, 1, 0, 0, 0],
    } as Record<MotifType, readonly [number, number, number, number, number]>,
    /** A morph only starts while the organism is this far inside the hero, in radii. */
    inset: 0.4,
  },
  intro: { delay: 0.3, stagger: 0.35 },
  glyph: { cycle: 0.4, breathe: 0.1, maxAlpha: 0.5 },
  green: { every: 130, minPeriod: 10, maxPeriod: 16, sharpness: 28, gain: 1.8, maxAlpha: 0.55, color: "#3DD964" },
  pointer: { radius: 90, push: 3, stiffness: 0.12, damping: 0.8 },
  attraction: { reach: 1.7, pull: 7 },
  /** Keeps the background water at roughly 0.04–0.12 perceived opacity, under the organisms. */
  ambient: {
    alpha: 0.6,
    wake: { reach: 1.25, push: 2.6, speed: 60 },
    /**
     * Background specks thin softly around each creature so its silhouette
     * doesn't merge with the water: alpha drops by up to `near`–`far` (more
     * for far, faint creatures) within `reach` radii, with no visible edge.
     */
    clear: { reach: 1.25, near: 0.2, far: 0.36 },
  },
  travel: {
    motifs: { manta: SWIM, jelly: FLOAT, lily: DRIFT, yuta: DRIFT, data: DRIFT } as Record<MotifType, TravelConfig>,
    /** Smoothing of the measured turn rate, per second. */
    turnSmooth: 2.5,
    /** Pace multiplier while a creature is wholly offscreen, so the gap between its crossings stays short. */
    offscreenPace: 2.5,
  },
  motion: {
    jelly: {
      /** Seconds per bell contraction. */
      pulsePeriod: 3.8,
      /** How far the margin draws in, and how much the bell lengthens, at full contraction. */
      squeeze: 0.2,
      stretch: 0.07,
      core: 0.07,
      coreLag: 0.25,
      /** Seconds the pulse takes to reach a tentacle tip. */
      lag: 0.9,
      armFollow: 0.1,
      sway: 0.05,
      swaySpeed: 0.7,
      wave: 3.2,
      /** How far tentacle tips drag behind the drift, per radius per second of travel. */
      trail: 0.22,
      dust: 0.02,
      /** Bell outline: extra density and alpha where the surface turns edge-on to the eye, from face-on to edge-on. */
      rim: { density: 1.4, alpha: [0.6, 1.35] as const },
    },
    lily: {
      breathSpeed: 0.7,
      expand: 0.03,
      /** Petals open and close about their base, in radians at the tip. */
      open: 0.08,
      swaySpeed: 0.43,
      twist: 0.035,
      lift: 0.014,
      liftSpeed: 0.9,
      stamenLag: 0.6,
      stamenGain: 0.65,
      pollenReach: 0.12,
    },
    manta: {
      flapPeriod: 3.2,
      /** Wing tip stroke angle in radians; the wing bends progressively toward it. */
      flapAngle: 0.75,
      bend: 0.7,
      wingLag: 0.9,
      chordLag: 0.8,
      sidePhase: 0.1,
      /** Fore-aft travel of the tips, so they trace a loop rather than a line. */
      sweep: 0.035,
      /** Strokes come in bouts between glides. */
      glideSpeed: 0.42,
      glideDepth: 0.45,
      heave: 0.03,
      undulate: 0.025,
      bodyWave: 1.8,
      tailSpeed: 1.7,
      tailWave: 4.4,
      tailAmp: 0.07,
      tailDepth: 0.05,
      /** Tail swing per rad/s of turning, so it lags the body through a turn. */
      tailTurn: 0.45,
      wakeLife: [0.4, 0.9] as const,
      wakeDrift: 0.22,
    },
    yuta: {
      drift: 0.007,
      driftSpeed: 0.3,
      hairLag: 0.7,
      hairGain: 1.6,
      strand: 0.006,
      edgeNoise: 0.005,
      pulse: 0.5,
      scanPeriod: 9,
      scanWidth: 0.09,
    },
    data: {
      waveSpeed: 1.1,
      waveLength: 5,
      waveAmp: 0.022,
      tensionSpeed: 0.27,
      sag: 0.02,
      pulseTravel: 1.4,
      pulseEvery: 7,
      pulseWidth: 0.14,
      scanRate: 2.2,
      scanChance: 0.05,
      scanShift: 0.008,
    },
  },
} as const;
