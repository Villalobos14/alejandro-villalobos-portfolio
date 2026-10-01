export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const LINE_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
export const LINE_DURATION_MS = 1000;
export const LINE_STAGGER_MS = 120;
export const LINE_START_OFFSET = "115%";

export const BLOCK_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
export const BLOCK_DURATION_MS = 850;
export const BLOCK_OFFSET_PX = 25;
export const BLOCK_THRESHOLD = 0.08;

/** Sticky stack only engages when a card stays usable at full size. */
export const STACK_MIN_WIDTH_PX = 1000;
export const STACK_MIN_HEIGHT_PX = 720;
export const STACK_QUERY = `(min-width: ${STACK_MIN_WIDTH_PX}px) and (min-height: ${STACK_MIN_HEIGHT_PX}px)`;
export const STACK_TOP_OFFSETS_PX = [24, 42, 60] as const;
export const STACK_SCALE_RANGE = 0.04;

export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
