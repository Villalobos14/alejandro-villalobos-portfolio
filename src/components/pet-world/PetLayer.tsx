"use client";

import { memo, useCallback } from "react";
import { PETWORLD } from "./world/config";
import { PETS } from "./world/pets";
import type { PetId } from "./world/types";
import type { PetWorld } from "./world/world";

const ENABLED = PETS.filter((pet) => pet.enabled);

interface PetSlotProps {
  id: PetId;
  world: PetWorld;
}

/** The world positions the outer element and paints the inner one; React only creates them. */
function PetSlot({ id, world }: PetSlotProps) {
  const bind = useCallback((element: HTMLDivElement | null) => world.bindPet(id, element), [id, world]);

  return (
    <div ref={bind} data-pet={id} className="invisible absolute left-0 top-0 will-change-transform">
      <div />
    </div>
  );
}

/**
 * Fixed over the viewport and out of the document flow, so a pet can never
 * move the page, and nothing in it takes pointer events, so a pet never sits
 * between a click and its target. It renders once.
 */
function PetLayer({ world }: { world: PetWorld }) {
  const bind = useCallback((element: HTMLDivElement | null) => world.bindLayer(element), [world]);

  return (
    <div
      ref={bind}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden [contain:strict]"
      style={{ zIndex: PETWORLD.zIndex }}
    >
      {ENABLED.map((pet) => (
        <PetSlot key={pet.id} id={pet.id} world={world} />
      ))}
    </div>
  );
}

export default memo(PetLayer);
