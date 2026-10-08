"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { LINE_DURATION_MS, LINE_EASE, prefersReducedMotion } from "@/lib/motion";

interface RevealHeadingProps {
  as?: "h2" | "h3";
  className?: string;
  children: ReactNode;
  delayMs?: number;
}

/**
 * Scroll-triggered cousin of MaskedLines: the whole heading slides up out of a
 * mask once it is on screen, rather than animating when the page mounts.
 */
export default function RevealHeading({
  as: Tag = "h3",
  className = "",
  children,
  delayMs = 0,
}: RevealHeadingProps) {
  const maskRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const mask = maskRef.current;
    const inner = innerRef.current;

    if (!mask || !inner || prefersReducedMotion()) return;

    inner.style.transform = "translateY(110%)";

    let animation: Animation | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        observer.disconnect();

        animation = inner.animate(
          [{ transform: "translateY(110%)" }, { transform: "translateY(0)" }],
          { duration: LINE_DURATION_MS * 0.8, delay: delayMs, easing: LINE_EASE, fill: "both" },
        );

        void animation.finished
          .catch(() => undefined)
          .finally(() => {
            inner.style.transform = "";
          });
      },
      { threshold: 0.4 },
    );

    // The mask is observed: the clipped inner line would never count as visible.
    observer.observe(mask);

    return () => {
      observer.disconnect();
      animation?.cancel();
      inner.style.transform = "";
    };
  }, [delayMs]);

  return (
    <Tag className={className}>
      <span ref={maskRef} className="block overflow-hidden py-[0.12em] -my-[0.12em]">
        <span ref={innerRef} className="block">
          {children}
        </span>
      </span>
    </Tag>
  );
}
