"use client";

import { useLayoutEffect, useRef } from "react";
import { usePetWorld } from "./PetWorldProvider";
import { createGlyphOrigin } from "./world/origin";
import type { PetId } from "./world/types";

interface PetGlyphOriginProps {
  petId: PetId;
  /** The letter the pet stands in for. It stays in the DOM and in the accessible name throughout. */
  children: string;
}

/** Animations still running on any ancestor, such as the MaskedLines entrance the letter rides in on. */
function ancestorAnimations(element: HTMLElement): Animation[] {
  const animations: Animation[] = [];

  for (let node = element.parentElement; node; node = node.parentElement) {
    node.getAnimations().forEach((animation) => {
      if (animation.playState !== "finished") animations.push(animation);
    });
  }

  return animations;
}

/**
 * One letter of running text that a pet can live in. The server renders the
 * plain letter; on the client, before first paint, the world either keeps it
 * or makes it transparent (so it still holds its exact width) and draws the
 * pet over it on an aria-hidden span. Nothing here changes layout.
 */
export default function PetGlyphOrigin({ petId, children }: PetGlyphOriginProps) {
  const world = usePetWorld();
  const glyphRef = useRef<HTMLSpanElement>(null);
  const spriteRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const glyph = glyphRef.current;
    const sprite = spriteRef.current;

    if (!world || !glyph || !sprite) return;

    const origin = createGlyphOrigin(petId, glyph, sprite, children);
    let live = true;

    world.claimOrigin(origin);

    // Ancestors start their entrance in their own layout effects, which run
    // after this one; by the microtask they all exist.
    queueMicrotask(() => {
      if (!live) return;
      const entrances = ancestorAnimations(glyph).map((animation) => animation.finished);
      void Promise.allSettled(entrances).then(() => {
        if (live) world.originReady(origin);
      });
    });

    const resize = new ResizeObserver(() => world.refitOrigin(origin));
    resize.observe(glyph);
    void document.fonts.ready.then(() => {
      if (live) world.refitOrigin(origin);
    });

    return () => {
      live = false;
      resize.disconnect();
      world.releaseOrigin(origin);
    };
  }, [world, petId, children]);

  return (
    <span ref={glyphRef} className="relative">
      {children}
      <span
        ref={spriteRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 hidden select-none"
      />
    </span>
  );
}
