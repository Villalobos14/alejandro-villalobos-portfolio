/**
 * Shared interaction timing for /fun photos so every frame lifts, settles and
 * zooms the same way. Hover only exists on fine pointers; reduced motion keeps
 * the end state but drops the transition.
 */
export const PHOTO_HOVER =
  "group fine:hover:-translate-y-1.5 fine:hover:rotate-0 motion-reduce:transition-none";

export const PHOTO_IMAGE_HOVER =
  "transition-transform duration-700 ease-out fine:group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:fine:group-hover:scale-100";
