/**
 * Text tones for /about on the page background.
 * Text is never animated in from transparent here: it is readable on the
 * first render, and only the sketches draw themselves in.
 */
export const tone = {
  /** Supporting paragraphs. */
  secondary: "text-ink/70",
  /** Dates, indices and spec labels. */
  meta: "text-ink/60",
} as const;

/** Uppercase labels: tighter tracking on small screens so long ones wrap cleanly. */
export const labelCase = "text-body uppercase leading-5 tracking-[0.1em] sm:tracking-[0.16em]";

export const focusRing =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";
