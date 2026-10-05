"use client";

import { useEffect, useRef, useState } from "react";
import { FINE_POINTER_QUERY } from "@/lib/fine-pointer";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";
import { createGlyphField, WIDE_QUERY, type GlyphField } from "./field/field";

export default function HeroField() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    const wide = window.matchMedia(WIDE_QUERY);
    const fine = window.matchMedia(FINE_POINTER_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    let field: GlyphField | null = null;
    let onScreen = true;
    let disposed = false;

    const sync = () => {
      if (!field) return;
      if (onScreen && document.visibilityState === "visible") field.start();
      else field.stop();
    };

    const build = () => {
      field?.stop();
      field = createGlyphField(canvas, {
        wide: wide.matches,
        pointer: fine.matches,
        reduced: reduced.matches,
      });
      if (!field) return;
      field.resize();
      sync();
      setReady(true);
    };

    const observer = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      sync();
    });
    const resizeObserver = new ResizeObserver(() => field?.resize());
    const onPointer = (event: PointerEvent) => field?.pointer(event.clientX, event.clientY);

    build();
    observer.observe(root);
    resizeObserver.observe(root);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", sync);
    wide.addEventListener("change", build);
    fine.addEventListener("change", build);
    reduced.addEventListener("change", build);
    void document.fonts.ready.then(() => {
      if (!disposed) field?.measure();
    });

    return () => {
      disposed = true;
      field?.stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", sync);
      wide.removeEventListener("change", build);
      fine.removeEventListener("change", build);
      reduced.removeEventListener("change", build);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 motion-reduce:transition-none ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
