"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { FINE_POINTER_QUERY } from "@/lib/fine-pointer";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";

const BLANK_CURSOR = `url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7") 0 0, none`;
/** Share of the remaining distance covered per 60 fps frame. */
const LERP = 0.2;
/** Matches --cursor-gap in globals.css: the pill's offset from the pointer. */
const GAP = 16;
/** The pill flips before it comes closer than this to a viewport edge. */
const EDGE = 8;

interface Caption {
  title: string;
  meta: string;
}

/**
 * The caption of the nearest captioned ancestor: data-cursor="pill" with
 * data-cursor-title and data-cursor-meta. A plain data-cursor="Label" still
 * works as a title-only pill. Inside a dialog (the lightbox) it is a dot.
 */
function readCaption(target: EventTarget | null): Caption | null {
  const element =
    target instanceof Element ? target : target instanceof Node ? target.parentElement : null;

  if (!element || element.closest('[role="dialog"]')) return null;

  const host = element.closest<HTMLElement>("[data-cursor]");
  const kind = host?.dataset.cursor?.trim() ?? "";

  if (!host || !kind) return null;
  if (kind !== "pill") return { title: kind, meta: "" };

  const title = host.dataset.cursorTitle?.trim() ?? "";

  return title ? { title, meta: host.dataset.cursorMeta?.trim() ?? "" } : null;
}

/**
 * Site cursor for fine pointers only: a pink dot that follows the pointer and
 * grows into a pill over captioned elements. It only listens (passive, no
 * stopPropagation), so hover effects and the home timeline see every event.
 * Everything it shows is already in the page for keyboards and screen readers.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const pointer = window.matchMedia(FINE_POINTER_QUERY);
    const sync = () => setEnabled(pointer.matches);

    sync();
    pointer.addEventListener("change", sync);

    return () => pointer.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const pill = pillRef.current;
    const titleEl = titleRef.current;
    const metaEl = metaRef.current;

    if (!enabled || !root || !pill || !titleEl || !metaEl) return;

    const motion = window.matchMedia(REDUCED_MOTION_QUERY);
    const html = document.documentElement;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let seen = false;
    let frame = 0;
    let lastTime = 0;
    let recheck = false;
    let captionKey = "";
    let pillWidth = 0;
    let pillHeight = 0;

    html.classList.add("site-cursor-on");
    html.style.setProperty("cursor", BLANK_CURSOR, "important");
    document.body.style.setProperty("cursor", BLANK_CURSOR, "important");

    const syncMotion = () => {
      root.dataset.reducedMotion = motion.matches ? "true" : "false";
    };

    /* Flip against the target, not the eased position, so the pill never pokes out while catching up. */
    const placePill = () => {
      root.dataset.flipX = targetX + GAP + pillWidth > window.innerWidth - EDGE ? "true" : "false";
      root.dataset.flipY = targetY + GAP + pillHeight > window.innerHeight - EDGE ? "true" : "false";
    };

    const setCaption = (caption: Caption | null) => {
      const key = caption ? `${caption.title}\n${caption.meta}` : "";

      if (key === captionKey) return;

      captionKey = key;

      // Leaving a caption keeps the old text, so the pill shrinks back with it.
      if (caption) {
        titleEl.textContent = caption.title;
        metaEl.textContent = caption.meta;
        // One layout read per caption change, never per frame.
        pillWidth = pill.offsetWidth;
        pillHeight = pill.offsetHeight;
        placePill();
      }

      root.dataset.state = caption ? "pill" : "dot";
    };

    const tick = (time: number) => {
      const elapsed = lastTime ? Math.min(64, time - lastTime) : 1000 / 60;
      const ease = motion.matches ? 1 : 1 - Math.pow(1 - LERP, elapsed / (1000 / 60));

      lastTime = time;
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;

      if (Math.abs(targetX - x) < 0.1 && Math.abs(targetY - y) < 0.1) {
        x = targetX;
        y = targetY;
      }

      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      // Content scrolled under a still pointer: hit-test once for this frame.
      if (recheck) {
        recheck = false;
        setCaption(readCaption(document.elementFromPoint(targetX, targetY)));
      }

      if (captionKey) placePill();

      if (x !== targetX || y !== targetY) {
        frame = window.requestAnimationFrame(tick);
      } else {
        frame = 0;
        lastTime = 0;
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      targetX = event.clientX;
      targetY = event.clientY;

      if (!seen) {
        seen = true;
        x = targetX;
        y = targetY;
      }

      root.dataset.visible = "true";
      schedule();
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "touch") setCaption(readCaption(event.target));
    };

    /* No related target: the pointer left the window. It reappears on the next move. */
    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget) return;

      root.dataset.visible = "false";
      setCaption(null);
    };

    const onScroll = () => {
      if (!seen) return;

      recheck = true;
      schedule();
    };

    const onResize = () => {
      if (captionKey) placePill();
    };

    syncMotion();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    motion.addEventListener("change", syncMotion);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      html.classList.remove("site-cursor-on");
      html.style.removeProperty("cursor");
      document.body.style.removeProperty("cursor");
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      motion.removeEventListener("change", syncMotion);
    };
  }, [enabled]);

  if (!enabled) return null;

  return createPortal(
    <div
      ref={rootRef}
      className="site-cursor"
      aria-hidden="true"
      data-visible="false"
      data-state="dot"
      data-flip-x="false"
      data-flip-y="false"
      data-reduced-motion="false"
    >
      <div className="site-cursor-dot" />
      <div ref={pillRef} className="site-cursor-pill">
        <span className="site-cursor-pill-dot" />
        <span className="site-cursor-text">
          <span ref={titleRef} className="site-cursor-title" />
          <span ref={metaRef} className="site-cursor-meta" />
        </span>
      </div>
    </div>,
    document.body,
  );
}
