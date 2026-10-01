"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { useReducedMotion } from "framer-motion";
import CurtainPanel, { type CurtainPhase } from "./CurtainPanel";
import { CURTAIN_DURATION_MS, CURTAIN_SAFETY_MS } from "./timing";

interface CurtainContextValue {
  isTransitioning: boolean;
  prefersReducedMotion: boolean;
  navigateWithCurtain: (href: string) => void;
}

const CurtainContext = createContext<CurtainContextValue | null>(null);

export function useCurtain(): CurtainContextValue {
  const context = useContext(CurtainContext);

  if (!context) {
    throw new Error("useCurtain must be used within CurtainProvider.");
  }

  return context;
}

function normalizePath(path: string): string {
  if (!path) return "/";
  const stripped = path.replace(/\/$/, "");
  return stripped === "" ? "/" : stripped;
}

export function isSamePath(href: string, currentPathname: string): boolean {
  try {
    const url = new URL(href, "http://local.invalid");
    return normalizePath(url.pathname) === normalizePath(currentPathname);
  } catch {
    return href === currentPathname;
  }
}

function focusPageHeading() {
  const heading = document.querySelector("h1");

  if (!(heading instanceof HTMLElement)) return;

  if (!heading.hasAttribute("tabindex")) {
    heading.setAttribute("tabindex", "-1");
  }

  heading.dataset.programmaticFocus = "";
  heading.focus({ preventScroll: true });

  const clear = () => {
    delete heading.dataset.programmaticFocus;
    heading.removeEventListener("blur", clear);
  };

  heading.addEventListener("blur", clear);
}

export function CurtainProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion() === true;
  const [phase, setPhase] = useState<CurtainPhase | "idle">("idle");
  const [announcement, setAnnouncement] = useState("");

  const phaseRef = useRef(phase);
  const busyRef = useRef(false);
  const pendingHrefRef = useRef<string | null>(null);
  const originPathRef = useRef(pathname);
  const sourceRef = useRef<"link" | "history">("link");
  const historyDestRef = useRef<string | null>(null);
  const safetyRef = useRef<number | null>(null);
  const pathnameRef = useRef(pathname);
  const committedPathRef = useRef(pathname);
  const reducedRef = useRef(prefersReducedMotion);

  phaseRef.current = phase;
  pathnameRef.current = pathname;
  reducedRef.current = prefersReducedMotion;

  const clearSafety = () => {
    if (safetyRef.current !== null) {
      window.clearTimeout(safetyRef.current);
      safetyRef.current = null;
    }
  };

  const finish = useCallback(() => {
    clearSafety();
    busyRef.current = false;
    pendingHrefRef.current = null;
    sourceRef.current = "link";
    historyDestRef.current = null;
    phaseRef.current = "idle";
    setPhase("idle");
    setAnnouncement(document.title);
    focusPageHeading();
  }, []);

  const startSafety = useCallback(() => {
    clearSafety();
    safetyRef.current = window.setTimeout(() => {
      safetyRef.current = null;
      if (phaseRef.current === "idle") return;

      if (phaseRef.current === "exiting") {
        finish();
        return;
      }

      phaseRef.current = "exiting";
      setPhase("exiting");
      safetyRef.current = window.setTimeout(() => {
        safetyRef.current = null;
        if (phaseRef.current !== "idle") finish();
      }, CURTAIN_DURATION_MS + 100);
    }, CURTAIN_SAFETY_MS);
  }, [finish]);

  const beginCurtain = useCallback(
    (source: "link" | "history", href: string | null) => {
      if (busyRef.current) return;

      if (reducedRef.current) {
        if (source === "link" && href) router.push(href);
        return;
      }

      busyRef.current = true;
      pendingHrefRef.current = href;
      sourceRef.current = source;
      originPathRef.current = pathnameRef.current;
      startSafety();
      phaseRef.current = "entering";
      setPhase("entering");
    },
    [router, startSafety],
  );

  const navigateWithCurtain = useCallback(
    (href: string) => {
      if (isSamePath(href, pathnameRef.current)) return;
      beginCurtain("link", href);
    },
    [beginCurtain],
  );

  const handleAnimationComplete = useCallback(
    (completedPhase: CurtainPhase) => {
      if (completedPhase === "entering" && phaseRef.current === "entering") {
        phaseRef.current = "waiting";
        setPhase("waiting");
        if (sourceRef.current === "link" && pendingHrefRef.current) {
          router.push(pendingHrefRef.current);
        }
        return;
      }

      if (completedPhase === "exiting" && phaseRef.current === "exiting") {
        finish();
      }
    },
    [finish, router],
  );

  useEffect(() => {
    if (phase !== "waiting") return;

    if (sourceRef.current === "history") {
      if (
        historyDestRef.current &&
        normalizePath(pathname) !== normalizePath(historyDestRef.current)
      ) {
        return;
      }

      if (phaseRef.current !== "waiting") return;
      phaseRef.current = "exiting";
      setPhase("exiting");
      return;
    }

    if (normalizePath(pathname) === normalizePath(originPathRef.current)) {
      return;
    }

    if (phaseRef.current !== "waiting") return;
    phaseRef.current = "exiting";
    setPhase("exiting");
  }, [pathname, phase]);

  useEffect(() => {
    if (phase !== "entering") return;

    const fallback = window.setTimeout(() => {
      handleAnimationComplete("entering");
    }, CURTAIN_DURATION_MS + 80);

    return () => window.clearTimeout(fallback);
  }, [handleAnimationComplete, phase]);

  useEffect(() => {
    if (phase !== "exiting") return;

    const fallback = window.setTimeout(() => {
      if (phaseRef.current === "exiting") finish();
    }, CURTAIN_DURATION_MS + 80);

    return () => window.clearTimeout(fallback);
  }, [finish, phase]);

  useEffect(() => {
    const onPopState = () => {
      if (reducedRef.current) return;
      if (busyRef.current) return;
      if (isSamePath(window.location.pathname, committedPathRef.current)) return;

      historyDestRef.current = window.location.pathname;
      flushSync(() => {
        beginCurtain("history", null);
      });
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [beginCurtain]);

  useEffect(() => {
    if (phase !== "idle") return;
    committedPathRef.current = pathname;
  }, [pathname, phase]);

  useEffect(() => {
    return () => clearSafety();
  }, []);

  return (
    <CurtainContext.Provider
      value={{
        isTransitioning: phase !== "idle",
        prefersReducedMotion,
        navigateWithCurtain,
      }}
    >
      {children}
      {phase !== "idle" ? (
        <CurtainPanel
          phase={phase}
          onAnimationComplete={handleAnimationComplete}
        />
      ) : null}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </CurtainContext.Provider>
  );
}
