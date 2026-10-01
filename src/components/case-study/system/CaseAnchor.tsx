"use client";

import { useLenis } from "lenis/react";
import type { MouseEvent, ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface CaseAnchorProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export function CaseAnchor({ href, className, children }: CaseAnchorProps) {
  const lenis = useLenis();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const id = href.replace(/^#/, "");
    const target = document.getElementById(id);

    if (!target) return;

    event.preventDefault();
    const nav = document.querySelector<HTMLElement>("[data-case-nav]");
    const top = Math.max(
      0,
      target.getBoundingClientRect().top + window.scrollY - (nav?.offsetHeight ?? 0) - 12,
    );

    if (!lenis || lenis.isStopped) {
      window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      return;
    }

    lenis.scrollTo(top, { immediate: true });
  };

  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
