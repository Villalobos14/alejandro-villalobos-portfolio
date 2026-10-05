export type MotifType = "manta" | "jelly" | "lily" | "yuta" | "data";

/**
 * One resting place of a glyph inside a motif, in normalized motif space:
 * max |x|, |y| = 1, x right, y down, z away from the camera.
 */
export interface Anchor {
  x: number;
  y: number;
  z: number;
  /** Point the glyph's structure bends around: a petal's base, a cable's root. */
  px: number;
  py: number;
  pz: number;
  /** 1 `·` → 2 `+` → 3 `*` → 4 `#` → 5 `×`. */
  density: number;
  /** Structural importance, 0–1: brighter, breaks last and resolves first. */
  weight: number;
  /** How much the glyph matters to reading the creature, 0–1; distance thins the least important first. */
  importance: number;
  /** Shared anatomical role (see `ROLE`), so a morph maps body to core and wing to bell side. */
  role: number;
  /** Position within its role, 0 at the root and 1 at the farthest tip. */
  reach: number;
  /** Motif-specific structural group (petal, wing, cable…). */
  group: number;
  /** Index inside the group: which petal, which wing, which cable. */
  part: number;
  /** Progress along the structure, 0 at its root. */
  t: number;
  size: 0 | 1 | 2;
  /** Which side of the body carries this mark: 1 the back, −1 the belly, 0 both. */
  face: number;
  /** Morph progress at which the glyph starts leaving this anchor. */
  release: number;
  /** Morph progress at which the glyph starts settling onto this anchor. */
  resolve: number;
}

/** Per-frame displacement a motif applies to one anchor, in normalized units. */
export interface Motion {
  dx: number;
  dy: number;
  dz: number;
  density: number;
  alpha: number;
}

/** What a motif knows about the organism wearing it this frame. */
export interface MotifFrame {
  /** Seconds, offset per organism so two creatures never move in step. */
  time: number;
  /** 0–1: how strongly the motif's own motion plays; it ramps across a morph. */
  vigor: number;
  /** Heading change in rad/s, so trailing parts can lag a turn. */
  turn: number;
  /** Travel speed in motif radii per second. */
  speed: number;
  /** Smoothed travel velocity in the motif's own axes, in radii per second, so trailing parts can drag behind it. */
  flowX: number;
  flowY: number;
  flowZ: number;
  /** The camera's line of sight in the motif's own axes, so a surface can tell where it turns away. */
  viewX: number;
  viewY: number;
  viewZ: number;
}

export interface MotifDefinition {
  type: MotifType;
  /** Its glyphs lie on thin surfaces: seen edge-on they crowd into lines, so they are dimmed to keep brightness even. */
  sheet: boolean;
  build: (count: number, seed: number) => Anchor[];
  /** Writes into `out`, which arrives reset to rest. */
  animate: (anchor: Anchor, frame: MotifFrame, phase: number, out: Motion) => void;
}
