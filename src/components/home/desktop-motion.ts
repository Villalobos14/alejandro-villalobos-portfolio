"use client";

import { useLayoutEffect, useState } from "react";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";

export const DESKTOP_MOTION_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

export function useDesktopMotion(): boolean {
  const [enabled, setEnabled] = useState(false);

  useLayoutEffect(() => {
    const query = window.matchMedia(DESKTOP_MOTION_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setEnabled(query.matches && !reduced.matches);

    sync();
    query.addEventListener("change", sync);
    reduced.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return enabled;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setReduced(media.matches);

    sync();
    media.addEventListener("change", sync);

    return () => media.removeEventListener("change", sync);
  }, []);

  return reduced;
}
