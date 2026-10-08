"use client";

import { createElement, useLayoutEffect, useRef, type ReactNode } from "react";
import {
  BLOCK_DURATION_MS,
  BLOCK_EASE,
  BLOCK_OFFSET_PX,
  BLOCK_THRESHOLD,
  prefersReducedMotion,
} from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  /** Starting offset and tilt; the block settles at rest. Defaults match the site-wide reveal. */
  offsetY?: number;
  offsetX?: number;
  rotateDeg?: number;
  durationMs?: number;
  /** Lets a caption stay a direct child of its figure. */
  as?: "div" | "figcaption";
}

/**
 * Hides the block from JavaScript rather than from markup, so the content stays
 * readable when scripts fail or reduced motion is requested.
 */
export default function Reveal({
  children,
  className = "",
  delayMs = 0,
  offsetY = BLOCK_OFFSET_PX,
  offsetX = 0,
  rotateDeg = 0,
  durationMs = BLOCK_DURATION_MS,
  as = "div",
}: RevealProps) {
  const blockRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const block = blockRef.current;

    if (!block || prefersReducedMotion()) return;

    block.style.opacity = "0";

    let animation: Animation | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        observer.disconnect();

        animation = block.animate(
          [
            {
              opacity: 0,
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotateDeg}deg)`,
            },
            { opacity: 1, transform: "translate(0, 0) rotate(0deg)" },
          ],
          {
            duration: durationMs,
            delay: delayMs,
            easing: BLOCK_EASE,
            fill: "both",
          },
        );

        void animation.finished
          .catch(() => undefined)
          .finally(() => {
            block.style.opacity = "";
          });
      },
      { threshold: BLOCK_THRESHOLD },
    );

    observer.observe(block);

    return () => {
      observer.disconnect();
      animation?.cancel();
      block.style.opacity = "";
    };
  }, [delayMs, offsetX, offsetY, rotateDeg, durationMs]);

  return createElement(as, { ref: blockRef, className }, children);
}
