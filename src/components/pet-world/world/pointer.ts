import { FINE_POINTER_QUERY } from "@/lib/fine-pointer";

export interface PointerState {
  x: number;
  y: number;
  /** performance.now() of the last move; -Infinity once the pointer leaves the window. */
  movedAt: number;
  /** A hovering mouse or pen. Touch never drives pets. */
  fine: boolean;
}

export interface PointerTracker {
  state: PointerState;
  connect: () => void;
  disconnect: () => void;
}

/** One listener for the whole world; pets read the shared state. */
export function createPointerTracker(): PointerTracker {
  const state: PointerState = { x: -1e4, y: -1e4, movedAt: Number.NEGATIVE_INFINITY, fine: false };
  let media: MediaQueryList | null = null;

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    state.x = event.clientX;
    state.y = event.clientY;
    state.movedAt = performance.now();
  };

  const onLeave = () => {
    state.movedAt = Number.NEGATIVE_INFINITY;
  };

  const syncFine = () => {
    state.fine = media?.matches ?? false;
  };

  return {
    state,
    connect() {
      if (media) return;
      media = window.matchMedia(FINE_POINTER_QUERY);
      syncFine();
      media.addEventListener("change", syncFine);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    },
    disconnect() {
      media?.removeEventListener("change", syncFine);
      media = null;
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    },
  };
}
