import { PETWORLD } from "./config";
import type { PetEvents } from "./events";
import { SURFACE_TYPES, type Ledge, type PetSurface, type SurfaceAllow, type SurfaceType } from "./types";

/*
 * Surfaces opt in from markup, so server components can declare them too:
 *
 *   <nav data-pet-surface="dock" data-pet-surface-id="main-dock">
 *
 * Optional: data-pet-surface-allow="walk sit hide" to narrow what pets may do
 * there, and data-pet-surface-inset="24" to override the corner inset.
 *
 * Nothing else on the page is ever treated as a surface. Rects are read on
 * demand: every frame only for a surface a pet stands on or is jumping to,
 * and otherwise only when a pet is choosing where to go.
 */

const DEFAULT_ALLOW: Record<SurfaceType, SurfaceAllow> = {
  dock: { walk: true, sit: true, sleep: true, hide: true, land: true },
  card: { walk: true, sit: true, sleep: false, hide: true, land: true },
  ledge: { walk: true, sit: true, sleep: true, hide: false, land: true },
  frame: { walk: true, sit: true, sleep: false, hide: true, land: true },
  divider: { walk: true, sit: true, sleep: false, hide: false, land: true },
  footer: { walk: true, sit: true, sleep: true, hide: true, land: true },
};

const ALLOW_KEYS = Object.keys(DEFAULT_ALLOW.dock) as (keyof SurfaceAllow)[];

function isSurfaceType(value: string | undefined): value is SurfaceType {
  return (SURFACE_TYPES as readonly string[]).includes(value ?? "");
}

function readAllow(element: HTMLElement, type: SurfaceType): SurfaceAllow {
  const listed = element.dataset.petSurfaceAllow?.split(/\s+/).filter(Boolean);
  if (!listed) return DEFAULT_ALLOW[type];
  return Object.fromEntries(ALLOW_KEYS.map((key) => [key, listed.includes(key)])) as unknown as SurfaceAllow;
}

export interface SurfaceRegistry {
  /** Picks up surfaces added since the last scan and drops ones that left the document. */
  scan: () => void;
  /** Surfaces of these types last seen on screen, in the order of the types given. */
  visible: (types: readonly SurfaceType[]) => PetSurface[];
  /** Reads the walkable top edge now. Null once the surface has left the document or collapsed. */
  ledge: (surface: PetSurface) => Ledge | null;
  all: () => PetSurface[];
  connect: () => void;
  disconnect: () => void;
}

export function createSurfaceRegistry(events: PetEvents): SurfaceRegistry {
  const surfaces = new Map<HTMLElement, PetSurface>();
  let observer: IntersectionObserver | null = null;
  let counter = 0;

  const drop = (surface: PetSurface) => {
    observer?.unobserve(surface.element);
    surfaces.delete(surface.element);
  };

  const register = (element: HTMLElement) => {
    const type = element.dataset.petSurface;

    if (!isSurfaceType(type)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[petworld] unknown surface type "${type}"`, element);
      }
      return;
    }

    const style = window.getComputedStyle(element);
    const inset = Number.parseFloat(element.dataset.petSurfaceInset ?? "");
    counter += 1;

    const surface: PetSurface = {
      id: element.dataset.petSurfaceId || `${type}-${counter}`,
      type,
      element,
      allow: readAllow(element, type),
      inset: Number.isFinite(inset) ? inset : null,
      radius: Number.parseFloat(style.borderTopLeftRadius) || 0,
      visible: false,
      fixed: style.position === "fixed",
    };

    surfaces.set(element, surface);
    observer?.observe(element);
  };

  const scan = () => {
    surfaces.forEach((surface) => {
      if (!surface.element.isConnected) drop(surface);
    });
    document.querySelectorAll<HTMLElement>("[data-pet-surface]").forEach((element) => {
      if (!surfaces.has(element)) register(element);
    });
  };

  return {
    scan,
    visible(types) {
      const result: PetSurface[] = [];
      types.forEach((type) => {
        surfaces.forEach((surface) => {
          if (surface.type === type && surface.visible && surface.element.isConnected) result.push(surface);
        });
      });
      return result;
    },
    ledge(surface) {
      if (!surface.element.isConnected) {
        drop(surface);
        return null;
      }

      const rect = surface.element.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return null;

      const inset = surface.inset ?? Math.min(surface.radius, rect.height / 2) + PETWORLD.surfaces.edgePadding;
      return { left: rect.left + inset, right: rect.right - inset, y: rect.top };
    },
    all: () => Array.from(surfaces.values()),
    connect() {
      if (observer) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const surface = surfaces.get(entry.target as HTMLElement);
          if (!surface || surface.visible === entry.isIntersecting) return;
          surface.visible = entry.isIntersecting;
          events.emit({ type: "SURFACE_VISIBLE", surface: surface.id, visible: surface.visible });
        });
      });
      surfaces.forEach((surface) => observer?.observe(surface.element));
      scan();
    },
    disconnect() {
      observer?.disconnect();
      observer = null;
      surfaces.forEach((surface) => {
        surface.visible = false;
      });
    },
  };
}
