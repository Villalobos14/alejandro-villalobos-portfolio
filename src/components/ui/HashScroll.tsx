"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const id = window.location.hash.replace("#", "");

    if (!id) return;

    const target = document.getElementById(id);

    if (!target) return;

    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }, [pathname]);

  return null;
}
