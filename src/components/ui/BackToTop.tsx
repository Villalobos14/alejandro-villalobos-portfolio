"use client";

import { useLenis } from "lenis/react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { prefersReducedMotion } from "@/lib/motion";

export default function BackToTop() {
  const lenis = useLenis();

  const handleClick = () => {
    if (prefersReducedMotion()) {
      window.scrollTo({ top: 0 });
      return;
    }

    if (!lenis || lenis.isStopped) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    lenis.scrollTo(0);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      data-cursor="Volver arriba"
      className="group flex w-fit items-center gap-2 text-base transition-colors duration-300 fine:hover:text-white xl:text-h7 2xl:text-h6 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      Back to top
      <ArrowUpIcon
        aria-hidden="true"
        className="pointer-events-none size-4 transition-transform duration-500 ease-out fine:group-hover:-translate-y-1"
      />
    </button>
  );
}
