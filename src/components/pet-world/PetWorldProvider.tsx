"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useState, type ReactNode } from "react";
import { FINE_POINTER_QUERY } from "@/lib/fine-pointer";
import { PetWorldContext } from "./context";

export { usePetWorld } from "./context";

const PetWorldRuntime = dynamic(() => import("./PetWorldRuntime"), { ssr: false });

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
/** Same cutoff as the pet-world mobile tier. The world module stays unloaded here. */
const MOBILE_QUERY = "(max-width: 639px)";

type PetMount = "off" | "hero" | "roam";

function petMount(pathname: string): PetMount {
  if (pathname === "/") return "hero";
  if (pathname === "/fun") return "roam";

  return "off";
}

/**
 * Mounts Calcifer by route. `/fun` gets the roaming layer. `/` gets the hero
 * letter only. Everywhere else, and on touch, narrow screens, or reduced
 * motion, the world chunk is not rendered.
 */
export default function PetWorldProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const mode = petMount(pathname);
  const [deviceOn, setDeviceOn] = useState(false);

  useLayoutEffect(() => {
    const fine = window.matchMedia(FINE_POINTER_QUERY);
    const reduced = window.matchMedia(REDUCED_QUERY);
    const mobile = window.matchMedia(MOBILE_QUERY);
    const sync = () => setDeviceOn(fine.matches && !reduced.matches && !mobile.matches);

    sync();
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    mobile.addEventListener("change", sync);

    return () => {
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      mobile.removeEventListener("change", sync);
    };
  }, []);

  if (mode === "off" || !deviceOn) {
    return <PetWorldContext.Provider value={null}>{children}</PetWorldContext.Provider>;
  }

  return <PetWorldRuntime roam={mode === "roam"}>{children}</PetWorldRuntime>;
}
