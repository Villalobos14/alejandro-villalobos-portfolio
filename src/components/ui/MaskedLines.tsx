"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import {
  LINE_DURATION_MS,
  LINE_EASE,
  LINE_STAGGER_MS,
  LINE_START_OFFSET,
  prefersReducedMotion,
} from "@/lib/motion";

type MaskedTag = "h1" | "h2" | "h3" | "p" | "div" | "span";

interface MaskedLinesProps {
  lines: ReactNode[];
  as?: MaskedTag;
  className?: string;
  lineClassName?: string;
}

interface MaskedLineProps {
  children: ReactNode;
  delayMs: number;
  className: string;
}

/**
 * The mask keeps 0.16em of breathing room on both sides so descenders and accents
 * of the SF faces never get cut, and pulls it back with a negative margin so the
 * surrounding rhythm stays identical.
 */
function MaskedLine({ children, delayMs, className }: MaskedLineProps) {
  const lineRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const line = lineRef.current;

    if (!line || prefersReducedMotion()) return;

    const animation = line.animate(
      [
        { transform: `translateY(${LINE_START_OFFSET})` },
        { transform: "translateY(0)" },
      ],
      {
        duration: LINE_DURATION_MS,
        delay: delayMs,
        easing: LINE_EASE,
        fill: "backwards",
      },
    );

    return () => animation.cancel();
  }, [delayMs]);

  return (
    <span className="block overflow-hidden py-[0.16em] -my-[0.16em]">
      <span ref={lineRef} className={`block ${className}`}>
        {children}
      </span>
    </span>
  );
}

export default function MaskedLines({
  lines,
  as: Tag = "h2",
  className = "",
  lineClassName = "",
}: MaskedLinesProps) {
  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <MaskedLine
          key={index}
          delayMs={index * LINE_STAGGER_MS}
          className={lineClassName}
        >
          {line}
        </MaskedLine>
      ))}
    </Tag>
  );
}
