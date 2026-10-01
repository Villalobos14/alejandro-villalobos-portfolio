"use client";

import { useLenis } from "lenis/react";
import type { MouseEvent, ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface AnchorLinkProps {
  targetId: string;
  children: ReactNode;
  className?: string;
  cursorLabel?: string;
}

function readHeaderOffset(): number {
  const header = document.querySelector<HTMLElement>("[data-site-header]");

  return header?.getBoundingClientRect().height ?? 0;
}

export default function AnchorLink({
  targetId,
  children,
  className = "",
  cursorLabel,
}: AnchorLinkProps) {
  const lenis = useLenis();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(targetId);

    if (!target) return;

    event.preventDefault();

    if (prefersReducedMotion()) {
      target.scrollIntoView({ block: "start" });
      return;
    }

    if (!lenis || lenis.isStopped) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    lenis.scrollTo(target, { offset: -readHeaderOffset() });
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      data-cursor={cursorLabel}
      className={className}
    >
      {children}
    </a>
  );
}
