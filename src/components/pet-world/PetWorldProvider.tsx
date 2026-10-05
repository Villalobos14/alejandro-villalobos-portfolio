"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import PetLayer from "./PetLayer";
import { createPetWorld, type PetWorld } from "./world/world";

const PetWorldContext = createContext<PetWorld | null>(null);

export function usePetWorld(): PetWorld | null {
  return useContext(PetWorldContext);
}

/**
 * Lives in the root layout, inside Lenis, so pets outlast the hero and the
 * route: a pet on the dock is still there after navigating, since the dock is
 * part of the layout too. Creating the world touches no DOM, so this renders
 * on the server like anything else.
 */
export default function PetWorldProvider({ children }: { children: ReactNode }) {
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
      <PetLayer world={world} />
    </PetWorldContext.Provider>
  );
}
