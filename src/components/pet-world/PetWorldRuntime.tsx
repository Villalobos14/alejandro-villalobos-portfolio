"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import PetLayer from "./PetLayer";
import { PetWorldContext } from "./context";
import { createPetWorld } from "./world/world";

interface PetWorldRuntimeProps {
  children: ReactNode;
  /** Free roaming on surfaces. Home keeps the hero letter only. */
  roam: boolean;
}

export default function PetWorldRuntime({ children, roam }: PetWorldRuntimeProps) {
  const [world] = useState(createPetWorld);
  const pathname = usePathname();

  useLenis(() => world.scrolled(), [world]);

  useEffect(() => world.mount(), [world]);

  useEffect(() => {
    world.routeChanged();
  }, [world, pathname]);

  return (
    <PetWorldContext.Provider value={world}>
      {children}
      {roam ? <PetLayer world={world} /> : null}
    </PetWorldContext.Provider>
  );
}
