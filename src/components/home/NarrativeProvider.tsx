"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type NarrativePanel = "professional" | "personal";

interface NarrativeContextValue {
  panel: NarrativePanel;
  setPanel: (panel: NarrativePanel) => void;
}

const NarrativeContext = createContext<NarrativeContextValue | null>(null);

export function HomeNarrativeProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<NarrativePanel>("professional");
  const value = useMemo(() => ({ panel, setPanel }), [panel]);

  return <NarrativeContext.Provider value={value}>{children}</NarrativeContext.Provider>;
}

export function useNarrativePanel(): NarrativeContextValue {
  const value = useContext(NarrativeContext);

  if (!value) {
    throw new Error("useNarrativePanel must be used within HomeNarrativeProvider");
  }

  return value;
}
