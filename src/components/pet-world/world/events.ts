import type { PetId } from "./types";

export type PetWorldEvent =
  | { type: "HERO_PET_READY"; pet: PetId }
  | { type: "PET_DETACHED"; pet: PetId; x: number; y: number }
  | { type: "PET_REACHED_SURFACE"; pet: PetId; surface: string }
  | { type: "POINTER_NEAR"; pet: PetId; distance: number }
  | { type: "SURFACE_VISIBLE"; surface: string; visible: boolean }
  | { type: "ASCII_CREATURE_PASS"; x: number; y: number; creature: string };

export type PetWorldEventType = PetWorldEvent["type"];

type Listener<T extends PetWorldEventType> = (event: Extract<PetWorldEvent, { type: T }>) => void;

export interface PetEvents {
  on: <T extends PetWorldEventType>(type: T, listener: Listener<T>) => () => void;
  emit: (event: PetWorldEvent) => void;
}

export function createEvents(): PetEvents {
  const listeners = new Map<PetWorldEventType, Set<(event: PetWorldEvent) => void>>();

  return {
    on(type, listener) {
      const set = listeners.get(type) ?? new Set();
      const wrapped = listener as (event: PetWorldEvent) => void;
      set.add(wrapped);
      listeners.set(type, set);
      return () => set.delete(wrapped);
    },
    emit(event) {
      listeners.get(event.type)?.forEach((listener) => listener(event));
    },
  };
}

/*
 * Bridge for systems that should not import PetWorld, such as the ASCII hero
 * field. They dispatch a DOM event; PetWorld re-emits it as
 * ASCII_CREATURE_PASS and nearby pets turn to watch. Nothing dispatches it
 * yet.
 */
export const ASCII_CREATURE_EVENT = "petworld:ascii-creature";

export interface AsciiCreatureDetail {
  /** Viewport pixels. */
  x: number;
  y: number;
  creature: string;
}

export function announceAsciiCreature(detail: AsciiCreatureDetail): void {
  window.dispatchEvent(new CustomEvent<AsciiCreatureDetail>(ASCII_CREATURE_EVENT, { detail }));
}
