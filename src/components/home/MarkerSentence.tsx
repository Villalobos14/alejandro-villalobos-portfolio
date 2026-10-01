"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { NarrativeSegment } from "@/lib/home-narrative";
import { LINE_EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "./desktop-motion";

const REVEAL_MS = 700;
const MARK_MS = 560;
const MARK_STAGGER_MS = 150;

interface LineBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface MarkerSentenceProps {
  segments: NarrativeSegment[];
  textClassName: string;
  as?: "p" | "div";
  meme?: ReactNode;
}

type Phase = "idle" | "shown" | "marked";

function sameLines(current: Record<string, LineBox[]>, next: Record<string, LineBox[]>): boolean {
  const currentKeys = Object.keys(current);
  const nextKeys = Object.keys(next);

  if (currentKeys.length !== nextKeys.length) return false;

  return nextKeys.every((key) => {
    const left = current[key];
    const right = next[key];

    if (!left || !right || left.length !== right.length) return false;

    return left.every((line, index) => {
      const other = right[index];

      return (
        other !== undefined &&
        Math.abs(line.left - other.left) < 0.5 &&
        Math.abs(line.top - other.top) < 0.5 &&
        Math.abs(line.width - other.width) < 0.5 &&
        Math.abs(line.height - other.height) < 0.5
      );
    });
  });
}

export function MarkerSentence({
  segments,
  textClassName,
  as = "p",
  meme,
}: MarkerSentenceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);
  const [linesByIndex, setLinesByIndex] = useState<Record<string, LineBox[]>>({});
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduced ? "marked" : "idle");
  const Tag = as;

  useEffect(() => {
    if (reduced) {
      setPhase("marked");
      return;
    }

    const section = sectionRef.current;

    if (!section || playedRef.current) return;

    const play = () => {
      if (playedRef.current) return;

      playedRef.current = true;
      setPhase("shown");
      window.setTimeout(() => setPhase("marked"), REVEAL_MS);
    };

    const ready = () => {
      const rect = section.getBoundingClientRect();
      const center = rect.top + rect.height / 2;

      if (rect.bottom > 0 && center <= window.innerHeight * 0.65) play();
    };

    ready();
    const observer = new IntersectionObserver(ready, {
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
    });
    observer.observe(section);

    return () => observer.disconnect();
  }, [reduced]);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const measure = () => {
      const next: Record<string, LineBox[]> = {};
      const sentence = section.querySelector<HTMLElement>("[data-sentence]");
      const phrases = section.querySelectorAll<HTMLElement>("[data-highlight]");

      phrases.forEach((phrase) => {
        const index = phrase.dataset.highlight;
        const text = phrase.querySelector<HTMLElement>("[data-highlight-text]");

        if (!index || !text || !sentence) return;

        const box = sentence.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(text);
        const rects = range.getClientRects();
        const lines: LineBox[] = [];

        for (let lineIndex = 0; lineIndex < rects.length; lineIndex += 1) {
          const rect = rects[lineIndex];

          if (!rect || rect.width < 1) continue;

          lines.push({
            left: rect.left - box.left - 2,
            top: rect.top - box.top + rect.height * 0.52,
            width: rect.width + 4,
            height: Math.max(rect.height * 0.42, 1),
          });
        }

        next[index] = lines;
      });

      setLinesByIndex((current) => (sameLines(current, next) ? current : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    window.addEventListener("resize", measure);
    const fonts = document.fonts.ready.then(measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      void fonts.then(() => undefined);
    };
  }, [segments]);

  let highlightIndex = -1;
  const revealed = phase !== "idle";
  const marked = phase === "marked";

  return (
    <div ref={sectionRef} className="px-[var(--page-gutter)] py-[clamp(4rem,10vh,7rem)]">
      <div className="overflow-hidden">
        <Tag
          data-sentence
          className={`relative w-full max-w-[90vw] text-left lg:max-w-[86vw] ${textClassName}`}
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(14%)",
            transition: reduced ? "none" : `opacity ${REVEAL_MS}ms ${LINE_EASE}, transform ${REVEAL_MS}ms ${LINE_EASE}`,
          }}
        >
          {segments.map((segment) => {
            if (!segment.highlight) {
              return (
                <span key={segment.text} className="text-white">
                  {segment.text}
                </span>
              );
            }

            highlightIndex += 1;
            const index = highlightIndex;
            const lines = linesByIndex[String(index)] ?? [];

            return (
              <span key={segment.text} className="inline">
                <span data-highlight={index} className="inline">
                  {lines.map((line, lineIndex) => (
                    <span
                      key={`${index}-${lineIndex}`}
                      data-marker
                      aria-hidden="true"
                      className="pointer-events-none absolute block bg-secondary/35"
                      style={{
                        left: line.left,
                        top: line.top,
                        width: line.width,
                        height: line.height,
                        transformOrigin: "left center",
                        transform: marked || reduced ? "scaleX(1)" : "scaleX(0)",
                        transition: reduced
                          ? "none"
                          : `transform ${MARK_MS}ms ${LINE_EASE} ${120 + index * MARK_STAGGER_MS}ms`,
                      }}
                    />
                  ))}
                  <span
                    data-highlight-text
                    className={`relative z-[1] transition-colors duration-300 ${
                      marked || reduced ? "text-secondary" : "text-white"
                    }`}
                  >
                    {segment.text}
                  </span>
                </span>
                {segment.meme ? meme : null}
              </span>
            );
          })}
        </Tag>
      </div>
    </div>
  );
}
