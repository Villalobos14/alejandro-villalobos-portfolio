"use client";

import { useEffect, useState, type RefObject } from "react";
import { FINE_POINTER_QUERY } from "@/lib/fine-pointer";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";

export interface CardActivity {
  /** Some part of the card is on screen. */
  inView: boolean;
  /** The tab is in the foreground. */
  pageVisible: boolean;
  /** A fine pointer rests on the card, or focus is inside it. */
  engaged: boolean;
}

/**
 * What the Everyday cards need to know before they move on their own: an
 * animation only runs while its card is on screen, the tab is visible and the
 * reader is not hovering or tabbing through it.
 */
export function useCardActivity(ref: RefObject<HTMLElement>): CardActivity {
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const card = ref.current;

    if (!card) return;

    const observer = new IntersectionObserver((entries) => {
      setInView(entries.some((entry) => entry.isIntersecting));
    });
    const syncVisibility = () => setPageVisible(document.visibilityState === "visible");
    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && finePointer.matches) setHovered(true);
    };
    const onLeave = () => setHovered(false);
    const onFocusIn = () => setFocused(true);
    const onFocusOut = (event: FocusEvent) => {
      if (!card.contains(event.relatedTarget as Node | null)) setFocused(false);
    };

    observer.observe(card);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("focusin", onFocusIn);
    card.addEventListener("focusout", onFocusOut);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("focusin", onFocusIn);
      card.removeEventListener("focusout", onFocusOut);
    };
  }, [ref]);

  return { inView, pageVisible, engaged: hovered || focused };
}

/** Live reduced-motion preference; false until mounted, so the server renders the animated markup. */
export function useReducedMotionPreference(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setReduced(media.matches);

    sync();
    media.addEventListener("change", sync);

    return () => media.removeEventListener("change", sync);
  }, []);

  return reduced;
}
