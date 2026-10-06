"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { BLOCK_EASE, prefersReducedMotion } from "@/lib/motion";

const FADE_MS = 700;
const META_DURATION_MS = 700;
const META_DELAY_MS = 420;
const META_STAGGER_MS = 90;
const META_OFFSET_PX = 8;

interface HeroCompositionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Holds the hero's content on the page grid and runs its entrance. It only
 * fades in: a transform here would move the headline while HeroField
 * measures it. Children marked `data-hero-enter` rise a few pixels after it,
 * in document order. The headline keeps its own MaskedLines entrance, and
 * Calcifer waits for this fade as he does for any ancestor's, since it
 * starts in a layout effect.
 */
export default function HeroComposition({ children, className = "" }: HeroCompositionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root || prefersReducedMotion()) return;

    const animations = [
      root.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: FADE_MS,
        easing: BLOCK_EASE,
        fill: "backwards",
      }),
    ];

    root.querySelectorAll<HTMLElement>("[data-hero-enter]").forEach((node, index) => {
      animations.push(
        node.animate(
          [
            { opacity: 0, transform: `translateY(${META_OFFSET_PX}px)` },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: META_DURATION_MS,
            delay: META_DELAY_MS + index * META_STAGGER_MS,
            easing: BLOCK_EASE,
            fill: "backwards",
          },
        ),
      );
    });

    return () => animations.forEach((animation) => animation.cancel());
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
