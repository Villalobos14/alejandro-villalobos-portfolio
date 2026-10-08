"use client";

import { useEffect, useRef, type ReactNode } from "react";

const DEPTH_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const MAX_SHIFT_PX = 26;

interface ScrollDepthProps {
  children: ReactNode;
  className?: string;
}

/**
 * Nudges descendants marked with `data-depth="<factor>"` as the group crosses
 * the viewport, so overlapping photos drift a few pixels relative to each
 * other. One scroll listener and one rect read per frame; it only writes the
 * `translate` property, which composes with each photo's own transforms and
 * never touches layout.
 */
export default function ScrollDepth({ children, className }: ScrollDepthProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const media = window.matchMedia(DEPTH_QUERY);
    let items: { el: HTMLElement; factor: number }[] = [];
    let frame = 0;
    let visible = false;
    let active = false;

    const apply = () => {
      frame = 0;

      const rect = root.getBoundingClientRect();
      const delta = window.innerHeight / 2 - (rect.top + rect.height / 2);

      items.forEach(({ el, factor }) => {
        const shift = Math.max(-MAX_SHIFT_PX, Math.min(MAX_SHIFT_PX, delta * factor));
        el.style.translate = `0 ${shift.toFixed(1)}px`;
      });
    };

    const schedule = () => {
      if (visible && !frame) frame = window.requestAnimationFrame(apply);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      schedule();
    });

    const enable = () => {
      items = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]")).map((el) => ({
        el,
        factor: Number(el.dataset.depth) || 0,
      }));
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      observer.observe(root);
      active = true;
    };

    const disable = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      visible = false;
      items.forEach(({ el }) => {
        el.style.translate = "";
      });
      items = [];
      active = false;
    };

    const sync = () => {
      if (media.matches && !active) enable();
      else if (!media.matches && active) disable();
    };

    sync();
    media.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
      if (active) disable();
    };
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
