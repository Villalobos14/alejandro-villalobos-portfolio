"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { FINE_POINTER_QUERY } from "@/lib/fine-pointer";

const POINTER_QUERY = FINE_POINTER_QUERY;
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const BLANK_CURSOR = `url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7") 0 0, none`;

function readCursorLabel(target: EventTarget | null): string {
  const element =
    target instanceof Element
      ? target
      : target instanceof Node
        ? target.parentElement
        : null;

  return element?.closest("[data-cursor]")?.getAttribute("data-cursor")?.trim() ?? "";
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const pointerMq = window.matchMedia(POINTER_QUERY);
    const syncEnabled = () => setEnabled(pointerMq.matches);

    syncEnabled();
    pointerMq.addEventListener("change", syncEnabled);

    return () => pointerMq.removeEventListener("change", syncEnabled);
  }, []);

  useLayoutEffect(() => {
    if (!enabled) return;

    const root = rootRef.current;
    const labelEl = labelRef.current;
    if (!root) return;

    const motionMq = window.matchMedia(MOTION_QUERY);
    let x = 0;
    let y = 0;
    let hoverTarget: EventTarget | null = null;
    let rafId = 0;

    const html = document.documentElement;
    html.classList.add("site-cursor-on");
    html.style.setProperty("cursor", BLANK_CURSOR, "important");
    document.body.style.setProperty("cursor", BLANK_CURSOR, "important");

    const hideNativeOn = (element: HTMLElement) => {
      element.style.setProperty("cursor", BLANK_CURSOR, "important");
    };

    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const headerTargets = header
      ? [
          header,
          ...Array.from(
            header.querySelectorAll<HTMLElement>("a, button, img, svg, span, div"),
          ),
        ]
      : [];
    headerTargets.forEach(hideNativeOn);

    const syncMotion = () => {
      root.dataset.reducedMotion = motionMq.matches ? "true" : "false";
    };

    const flush = () => {
      rafId = 0;
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      const label = readCursorLabel(hoverTarget);
      root.dataset.visible = "true";
      root.dataset.expanded = label ? "true" : "false";

      if (labelEl && labelEl.textContent !== label) {
        labelEl.textContent = label;
      }
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(flush);
    };

    const onMouseMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      hoverTarget = event.target;

      if (event.target instanceof HTMLElement) {
        const nav = event.target.closest<HTMLElement>("[data-site-header]");
        if (nav) {
          hideNativeOn(nav);
          hideNativeOn(event.target);
        }
      }

      schedule();
    };

    syncMotion();
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    motionMq.addEventListener("change", syncMotion);

    return () => {
      html.classList.remove("site-cursor-on");
      html.style.removeProperty("cursor");
      document.body.style.removeProperty("cursor");
      headerTargets.forEach((element) => element.style.removeProperty("cursor"));
      window.removeEventListener("mousemove", onMouseMove);
      motionMq.removeEventListener("change", syncMotion);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return createPortal(
    <div
      ref={rootRef}
      className="site-cursor"
      aria-hidden="true"
      data-visible="false"
      data-expanded="false"
      data-reduced-motion="false"
    >
      <div className="site-cursor-pill">
        <span ref={labelRef} className="site-cursor-label" />
      </div>
    </div>,
    document.body,
  );
}
