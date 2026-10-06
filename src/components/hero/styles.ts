/** Working-file annotations: the same system monospace the field draws with. */
export const heroMeta = "font-mono text-[0.6875rem] uppercase leading-4 tracking-[0.14em] text-gray";

/** Section labels in the right column: the same monospace, a step larger and lighter so they hold their place. */
export const heroColumnLabel = "font-mono text-xs uppercase leading-4 tracking-[0.16em] text-white/60";

/** Secondary copy in the right column, on the supporting paragraph's scale. */
export const heroColumnText = "text-[clamp(1rem,1.2vw,1.125rem)]";

/**
 * A tight halo in the page colour, inherited by small text, so a creature
 * passing behind still shows but its glyphs never merge with letter strokes.
 * The headline needs none: HeroField veils the field under it.
 */
export const heroHalo = "[text-shadow:0_0_2px_rgb(var(--bg)),0_0_6px_rgb(var(--bg))]";
