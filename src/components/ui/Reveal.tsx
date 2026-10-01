"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
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
}

/**
 * Hides the block from JavaScript rather than from markup, so the content stays
 * readable when scripts fail or reduced motion is requested.
 */
export default function Reveal({
  children,
  className = "",
  delayMs = 0,
}: RevealProps) {
  const blockRef = useRef<HTMLDivElement>(null);

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
            { opacity: 0, transform: `translateY(${BLOCK_OFFSET_PX}px)` },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: BLOCK_DURATION_MS,
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
  }, [delayMs]);

  return (
    <div ref={blockRef} className={className}>
      {children}
    </div>
  );
}
