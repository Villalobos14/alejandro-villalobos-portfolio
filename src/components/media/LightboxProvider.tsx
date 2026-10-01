"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Photo } from "@/lib/personal";
import Lightbox from "./Lightbox";

interface LightboxState {
  photos: Photo[];
  index: number;
}

interface LightboxContextValue {
  openLightbox: (photos: Photo[], index: number) => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox(): LightboxContextValue {
  const context = useContext(LightboxContext);

  if (!context) {
    throw new Error("useLightbox must be used within LightboxProvider.");
  }

  return context;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openLightbox = useCallback((photos: Photo[], index: number) => {
    if (photos.length === 0) return;

    triggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    setState({ photos, index });
  }, []);

  const close = useCallback(() => {
    setState(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

  const move = useCallback((step: number) => {
    setState((current) => {
      if (!current) return current;

      const total = current.photos.length;

      return {
        ...current,
        index: (current.index + step + total) % total,
      };
    });
  }, []);

  const value = useMemo(() => ({ openLightbox }), [openLightbox]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {state ? (
        <Lightbox
          photos={state.photos}
          index={state.index}
          onClose={close}
          onMove={move}
        />
      ) : null}
    </LightboxContext.Provider>
  );
}
