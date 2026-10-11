"use client";

import { createContext, useContext } from "react";
import type { PetWorld } from "./world/world";

export const PetWorldContext = createContext<PetWorld | null>(null);

export function usePetWorld(): PetWorld | null {
  return useContext(PetWorldContext);
}
