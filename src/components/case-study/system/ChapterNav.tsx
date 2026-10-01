"use client";

import { useLenis } from "lenis/react";
import { useEffect, useState, type MouseEvent } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { caseFocus } from "./styles";

export interface CaseChapter {
  id: string;
  index: string;
  label: string;
}

interface ChapterNavProps {
  title: string;
  chapters: readonly CaseChapter[];
}

function navOffset(): number {
  const nav = document.querySelector<HTMLElement>("[data-case-nav]");

  return nav?.getBoundingClientRect().height ?? 0;
}

export default function ChapterNav({ title, chapters }: ChapterNavProps) {
  const lenis = useLenis();
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    const targets = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((element): element is HTMLElement => element !== null);

    if (targets.length === 0) return;

    const resolve = () => {
      const line = navOffset() + 32;
      const entered = targets.filter((target) => target.getBoundingClientRect().top <= line);

      setActiveId((entered.at(-1) ?? targets[0]).id);
    };

    const observer = new IntersectionObserver(resolve, {
      rootMargin: "-12% 0px -60% 0px",
      threshold: [0, 0.25, 1],
    });

    targets.forEach((target) => observer.observe(target));
    resolve();
    window.addEventListener("scroll", resolve, { passive: true });
    const unsubscribe = lenis?.on("scroll", resolve);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", resolve);
      unsubscribe?.();
    };
  }, [chapters, lenis]);

  const onSelect = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);

    if (!target) return;

    event.preventDefault();
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - navOffset() - 12);

    if (!lenis || lenis.isStopped) {
      window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      return;
    }

    lenis.scrollTo(top, { immediate: true });
  };

  return (
    <nav
      data-case-nav
      aria-label="Case study chapters"
      className="sticky top-0 z-30 border-b border-gray/40 bg-primary"
    >
      <div className="flex items-center gap-4 px-[var(--page-gutter)]">
        <p className="hidden shrink-0 text-sm text-white md:block">{title}</p>
        <ul className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {chapters.map((chapter) => {
            const selected = chapter.id === activeId;

            return (
              <li key={chapter.id} className="shrink-0">
                <a
                  href={`#${chapter.id}`}
                  aria-current={selected ? "location" : undefined}
                  onClick={(event) => onSelect(event, chapter.id)}
                  className={`inline-flex min-h-11 items-center gap-2 whitespace-nowrap border-b px-2 text-sm transition-colors duration-200 motion-reduce:transition-none ${caseFocus} ${
                    selected
                      ? "border-secondary text-secondary"
                      : "border-transparent text-gray fine:hover:text-white"
                  }`}
                >
                  <span className="text-[11px] tracking-[0.16em]">{chapter.index}</span>
                  {chapter.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
