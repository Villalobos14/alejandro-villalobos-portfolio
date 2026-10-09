"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./sketch.module.css";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const NARROW = "(max-width: 1023px)";

/**
 * Frames that have already drawn during this page load, so returning to the
 * page through client-side navigation shows them finished instead of replaying.
 */
const played = new Set<string>();

function frameKey(frame: HTMLElement): string {
  const index = Array.from(document.querySelectorAll("[data-sketch]")).indexOf(frame);
  return `${window.location.pathname}#${index}`;
}

interface SketchFrameProps {
  /** viewBox size; the frame keeps this aspect ratio. */
  width?: number;
  height?: number;
  /** What the sketch says, for people who cannot see it. Omit for pure decoration. */
  label?: string;
  /** "load" plays right away (above the fold); "view" waits until it is on screen. */
  trigger?: "load" | "view";
  /** Offset added to every mark's own delay. */
  delayMs?: number;
  /** Lets fine pointers emphasise the regions marked with data-hit/data-region. */
  interactive?: boolean;
  /**
   * Sized by its content instead of a viewBox, for marks that sit on real text
   * (a circled word, a margin note). Width and height are then ignored.
   */
  fluid?: boolean;
  as?: "div" | "span";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Container for one sketch: an SVG of strokes plus HTML annotations laid over
 * it in the same coordinate space. Words are always shown; strokes are
 * server-rendered "armed" so they never flash in before they are drawn. CSS
 * ignores that state when motion is reduced, a failsafe draws them if the page
 * never hydrates, and the page ships a <noscript> override for no-JS visitors.
 */
export default function SketchFrame({
  width = 1,
  height = 1,
  label,
  trigger = "view",
  delayMs = 0,
  interactive = false,
  fluid = false,
  as: Tag = "div",
  className = "",
  style,
  children,
}: SketchFrameProps) {
  const frameRef = useRef<HTMLElement>(null);

  // Before paint: frames that will not animate are shown finished straight away.
  useLayoutEffect(() => {
    const frame = frameRef.current;

    if (!frame) return;

    // Hydrated: the CSS failsafe for script-less pages is no longer needed.
    frame.dataset.ready = "";

    if (prefersReducedMotion() || played.has(frameKey(frame))) {
      frame.dataset.sketch = "static";
    }
  }, []);

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame || frame.dataset.sketch === "static") return;

    const key = frameKey(frame);
    let frameId = 0;

    const play = () => {
      played.add(key);
      // Two frames: the armed state has to be painted before the transition starts.
      frameId = window.requestAnimationFrame(() => {
        frameId = window.requestAnimationFrame(() => {
          frame.dataset.sketch = "play";
        });
      });
    };

    if (trigger === "load") {
      play();
      return () => window.cancelAnimationFrame(frameId);
    }

    // Below lg the dock spans most of the width: wait until the frame is clear
    // of it, so nothing is drawn where it cannot be seen. On wider screens the
    // dock is a small centred pill and the whole viewport counts.
    const dock = window.matchMedia(NARROW).matches
      ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bottom-nav-height")) || 0
      : 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        play();
      },
      { threshold: 0.15, rootMargin: dock ? `0px 0px -${Math.round(dock + 24)}px 0px` : "0px" },
    );

    observer.observe(frame);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [trigger]);

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame || !interactive) return;

    const media = window.matchMedia(FINE_POINTER);

    const onOver = (event: PointerEvent) => {
      if (!media.matches) return;
      const target = event.target instanceof Element ? event.target.closest("[data-hit]") : null;
      const region = target?.getAttribute("data-hit");

      if (region) frame.dataset.focus = region;
      else delete frame.dataset.focus;
    };

    const onLeave = () => {
      delete frame.dataset.focus;
    };

    frame.addEventListener("pointerover", onOver);
    frame.addEventListener("pointerleave", onLeave);

    return () => {
      frame.removeEventListener("pointerover", onOver);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive]);

  return (
    <Tag
      ref={frameRef as never}
      data-sketch="armed"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label || fluid ? undefined : true}
      className={`${styles.frame} ${fluid ? styles.fluid : ""} ${className}`}
      style={{
        aspectRatio: fluid ? undefined : `${width} / ${height}`,
        ["--base" as string]: `${delayMs}ms`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
