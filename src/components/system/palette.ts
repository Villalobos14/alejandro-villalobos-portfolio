/**
 * Pops: blue, orange and teal, used as 8px dots and row tints, never as text
 * or large fills. Class names are spelled out so Tailwind can find them.
 */
export interface Pop {
  /** Fills the 8px dot. */
  dot: string;
  /** Row background on fine-pointer hover and on keyboard focus inside the row; pair with ROW_TINT. */
  rowTint: string;
}

const POPS: readonly Pop[] = [
  {
    dot: "bg-pop-blue",
    rowTint: "fine:hover:before:bg-pop-blue-tint has-[:focus-visible]:before:bg-pop-blue-tint",
  },
  {
    dot: "bg-pop-orange",
    rowTint: "fine:hover:before:bg-pop-orange-tint has-[:focus-visible]:before:bg-pop-orange-tint",
  },
  {
    dot: "bg-pop-teal",
    rowTint: "fine:hover:before:bg-pop-teal-tint has-[:focus-visible]:before:bg-pop-teal-tint",
  },
];

/*
 * Rows and cards show their pop only while hovered or focused: a list shows
 * five rows at once, and a screen carries two pops at most.
 */

/** Marks the row or card whose hover reveals its pop. */
export const POP_GROUP = "group/pop";

/** The tint bleeds 12px past the row so its content keeps its alignment. */
export const ROW_TINT =
  "relative isolate before:pointer-events-none before:absolute before:-inset-x-3 before:inset-y-0 before:-z-10 before:rounded-md before:transition-colors before:duration-200 motion-reduce:before:transition-none";

/** An 8px dot hanging left of a positioned label, shown with its row's hover or focus. */
export const HOVER_DOT =
  "pointer-events-none absolute right-full top-1/2 mr-1.5 size-2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-200 motion-reduce:transition-none fine:group-hover/pop:opacity-100 group-has-[:focus-visible]/pop:opacity-100";

/** The pop for the n-th row or card: blue, orange, teal, then again. */
export function popForIndex(index: number): Pop {
  return POPS[((index % POPS.length) + POPS.length) % POPS.length];
}

/** Section labels add pink as a fourth step: 01 blue, 02 orange, 03 teal, 04 pink, 05 blue… */
const SECTION_DOTS = [...POPS.map((pop) => pop.dot), "bg-accent"] as const;

/** Reads the number in a label such as "02 — Everyday"; unnumbered labels take the first step. */
export function sectionDotForLabel(label: string): string {
  const number = Number.parseInt(label, 10);
  const index = Number.isFinite(number) && number > 0 ? number - 1 : 0;

  return SECTION_DOTS[index % SECTION_DOTS.length];
}

/**
 * An 8px dot that hangs to the left of a label from md up, so the text keeps
 * its alignment, and sits inline before it on phones. The label must be
 * positioned (`relative` or sticky).
 */
export const HANGING_DOT =
  "mr-2 inline-block size-2 shrink-0 rounded-full align-[0.08em] md:absolute md:right-full md:top-1/2 md:-translate-y-1/2";
