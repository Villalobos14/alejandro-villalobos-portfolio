/**
 * Shared anatomy. Every motif tags its glyphs with the same roles, so a morph
 * can turn one creature's body into the other's core, each wing into a side
 * of the bell, the tail into the main tentacle and edges into edges, instead
 * of trading one cloud of points for another.
 */
export const ROLE = { core: 0, left: 1, right: 2, edge: 3, trail: 4, fine: 5 } as const;

export const ROLES = 6;

/**
 * How much a glyph matters to reading the creature. Level of detail drops the
 * least important first, so a far creature keeps its silhouette and loses its
 * interior.
 */
export const IMPORTANCE = { silhouette: 1, primary: 0.8, secondary: 0.55, fill: 0.3, atmosphere: 0.1 } as const;
