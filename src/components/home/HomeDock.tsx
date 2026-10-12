"use client";

import { useLenis } from "lenis/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { PROJECTS_SECTION_ID } from "@/lib/projects";
import { contactEmail } from "@/lib/links";
import { prefersReducedMotion } from "@/lib/motion";

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

type DockSection = "home" | "work" | "narrative";
type DockItem = "home" | "work" | "about" | "fun";

const items: { id: Exclude<DockItem, "home">; label: string; href: string }[] = [
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

    const update = () => {
      const current = list.querySelector<HTMLElement>("[data-dock-active='true']");

      setIndicator(current
        ? { x: current.offsetLeft, width: current.offsetWidth }
        : { x: 0, width: 0 });
    };

    update();
    // Re-measure after responsive padding or loaded fonts change the tab widths.
    const observer = new ResizeObserver(update);
    observer.observe(list);
    list.querySelectorAll("a").forEach((link) => observer.observe(link));
    return () => observer.disconnect();
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
      className={`fixed bottom-[var(--dock-offset)] left-1/2 z-40 w-max max-w-[calc(100%-2rem)] rounded-full bg-ink p-1.5 text-bg drop-shadow-[0_12px_16px_rgb(var(--ink)/0.22)] transition-transform duration-300 motion-reduce:transition-none [@media(min-width:420px)]:w-[385px] ${
        dockHidden ? "pointer-events-none" : ""
      }`}
      style={{
        transform: dockHidden ? "translate3d(-50%, calc(100% + 2.5rem), 0)" : "translate3d(-50%, 0, 0)",
      }}
    >
      <div ref={listRef} className="relative flex items-center gap-0 [@media(min-width:360px)]:gap-0.5 [@media(min-width:420px)]:justify-between">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 top-0 rounded-full bg-accent transition-[transform,width] duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
          style={{ width: indicator.width, transform: `translateX(${indicator.x}px)` }}
        />
        <TransitionLink
          href="/"
          aria-label="Home"
          aria-current={active === "home" ? "page" : undefined}
          onClick={onHomeClick}
          className={`relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold leading-7 tracking-[0.02em] ${focusStyles} ${
            // Pink marks the active page, so the monogram is pink only on Home.
            active === "home" ? "bg-accent text-ink" : "bg-bg/10 text-bg fine:hover:bg-bg/20 active:bg-bg/20"
          }`}
        >
          AV
        </TransitionLink>
        <span aria-hidden="true" className="hidden h-2.5 w-1.5 shrink-0 [@media(min-width:360px)]:block" />
        {items.map((item) => {
          const selected = active === item.id;

          return (
            <TransitionLink
              key={item.id}
              href={item.href}
              aria-current={selected ? "page" : undefined}
              data-dock-active={selected ? "true" : undefined}
              className={`relative z-10 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-1 py-[11px] text-[15px] font-medium leading-[23px] [@media(min-width:360px)]:px-2.5 [@media(min-width:420px)]:px-4 ${focusStyles} ${
                selected ? "text-ink" : "text-bg fine:hover:bg-bg/10 active:bg-bg/10"
              }`}
              onClick={item.id === "work" ? onWorkClick : undefined}
            >
              {item.label}
            </TransitionLink>
          );
        })}
        <span aria-hidden="true" className="h-5 w-px shrink-0 bg-bg/30" />
        <a
          href={`mailto:${contactEmail}`}
          className={`relative z-10 inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-2 py-[11px] text-[15px] font-medium leading-[23px] text-bg fine:hover:bg-bg/10 active:bg-bg/10 [@media(min-width:360px)]:px-2.5 [@media(min-width:420px)]:pl-4 [@media(min-width:420px)]:pr-[18px] ${focusStyles}`}
        >
          <Image src="/navigation/status-dot.svg" alt="" width={8} height={8} className="shrink-0" />
          Say hi ↗
        </a>
      </div>
    </nav>
  );
}
