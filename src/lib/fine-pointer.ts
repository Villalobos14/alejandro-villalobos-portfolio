"use client";

import { useLayoutEffect, useState } from "react";

export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

export function useFinePointer(): boolean {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia(FINE_POINTER_QUERY);
    const sync = () => setMatches(media.matches);

    sync();
    media.addEventListener("change", sync);

    return () => media.removeEventListener("change", sync);
  }, []);

  return matches;
}
