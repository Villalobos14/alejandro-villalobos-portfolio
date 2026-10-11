"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { PROJECTS_SECTION_ID } from "@/lib/projects";
import { prefersReducedMotion } from "@/lib/motion";

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

type DockSection = "home" | "work" | "narrative";
type DockItem = "home" | "work" | "about" | "fun";

const items: { id: DockItem; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "work", label: "Work", href: "/projects" },
  { id: "about", label: "About", href: "/about" },
  { id: "fun", label: "Fun", href: "/fun" },
];

export default function HomeDock() {
  const pathname = usePathname();
  const lenis = useLenis();
  const dockRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<DockSection>("home");
  const [indicator, setIndicator] = useState({ x: 0, width: 0 });
  const [dockHidden, setDockHidden] = useState(false);
  const isHome = pathname === "/";
  const isWorkRoute = pathname === "/projects" || pathname.startsWith("/work");
  const active: DockItem | null = isHome
    ? section === "work"
      ? "work"
      : "home"
    : isWorkRoute
      ? "work"
      : pathname === "/about"
        ? "about"
        : pathname === "/fun"
          ? "fun"
          : null;

  useLayoutEffect(() => {
    const dock = dockRef.current;

    if (!dock) return;

    const apply = () => {
      document.documentElement.style.setProperty("--bottom-nav-height", `${dock.offsetHeight}px`);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(dock);

    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty("--bottom-nav-height", "0px");
    };
  }, []);

  useEffect(() => {
    if (!isHome) return;

    const hero = document.querySelector<HTMLElement>('[aria-label="Introduction"]');
    const work = document.getElementById(PROJECTS_SECTION_ID);
    const narrative = document.getElementById("home-narrative");
    const nodes: { key: DockSection; element: Element }[] = [];

    if (hero) nodes.push({ key: "home", element: hero });
    if (work) nodes.push({ key: "work", element: work });
    if (narrative) nodes.push({ key: "narrative", element: narrative });

    const ratios = new Map<DockSection, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const match = nodes.find((node) => node.element === entry.target);

          if (!match) return;

          ratios.set(match.key, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let best: DockSection = "home";
        let bestRatio = 0;

        ratios.forEach((ratio, key) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = key;
          }
        });

        if ((best === "home" || best === "work") && bestRatio > 0) setSection(best);
      },
      {
        rootMargin: "-15% 0px -25% 0px",
        threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
      },
    );

    nodes.forEach((node) => observer.observe(node.element));

    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    const dock = dockRef.current;

    if (!dock) return;

    const show = () => setDockHidden(false);
    dock.addEventListener("focusin", show);

    return () => dock.removeEventListener("focusin", show);
  }, []);

  useEffect(() => {
    let last = window.scrollY;

    const update = (y: number) => {
      if (dockRef.current?.contains(document.activeElement)) {
        setDockHidden(false);
        last = y;
        return;
      }

      const delta = y - last;

      if (y < 64) setDockHidden(false);
      else if (delta > 6) setDockHidden(true);
      else if (delta < -6) setDockHidden(false);

      last = y;
    };

    if (lenis) {
      const onLenisScroll = (instance: { scroll: number }) => update(instance.scroll);
      lenis.on("scroll", onLenisScroll);

      return () => {
        lenis.off("scroll", onLenisScroll);
      };
    }

    const onScroll = () => update(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  useLayoutEffect(() => {
    const list = listRef.current;

    if (!list) return;

    const current = list.querySelector<HTMLElement>("[data-dock-active='true']");

    if (!current) {
      setIndicator({ x: 0, width: 0 });
      return;
    }

    setIndicator({ x: current.offsetLeft, width: current.offsetWidth });
  }, [active, pathname]);

  const scrollTo = (target: number | HTMLElement) => {
    if (prefersReducedMotion() || !lenis || lenis.isStopped) {
      if (typeof target === "number") {
        window.scrollTo(0, target);
        return;
      }

      target.scrollIntoView({ block: "start" });
      return;
    }

    lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : -16 });
  };

  const onHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return;

    event.preventDefault();
    scrollTo(0);
  };

  const onWorkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return;

    event.preventDefault();

    const target = document.getElementById(PROJECTS_SECTION_ID);

    if (target) scrollTo(target);
  };

  return (
    <nav
      ref={dockRef}
      aria-label="Primary"
      data-pet-surface="dock"
      data-pet-surface-id="main-dock"
      className={`fixed left-1/2 z-40 w-max max-w-[calc(100%-2rem)] rounded-full border border-border bg-bg px-1 py-1 transition-transform duration-300 motion-reduce:transition-none ${
        dockHidden ? "pointer-events-none" : ""
      }`}
      style={{
        bottom: "var(--dock-offset)",
        transform: dockHidden ? "translate3d(-50%, calc(100% + 2.5rem), 0)" : "translate3d(-50%, 0, 0)",
      }}
    >
      <div ref={listRef} className="relative flex items-center">
        <span
          aria-hidden="true"
          className="absolute bottom-0 top-0 rounded-full bg-accent transition-[transform,width] duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
          style={{ width: indicator.width, transform: `translateX(${indicator.x}px)` }}
        />
        {items.map((item) => {
          const selected = active === item.id;

          return (
            <TransitionLink
              key={item.id}
              href={item.href}
              aria-current={selected ? "page" : undefined}
              data-dock-active={selected ? "true" : undefined}
              className={`relative z-10 inline-flex min-h-11 min-w-[4.75rem] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 text-mono sm:px-4 ${focusStyles} ${
                selected ? "text-white" : "text-ink-secondary fine:hover:text-ink active:text-ink"
              }`}
              onClick={item.id === "home" ? onHomeClick : item.id === "work" ? onWorkClick : undefined}
            >
              {item.label}
            </TransitionLink>
          );
        })}
      </div>
    </nav>
  );
}
