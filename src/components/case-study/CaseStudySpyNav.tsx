"use client";

import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import type { CaseStudySection } from "@/lib/case-studies";
import { prefersReducedMotion } from "@/lib/motion";

interface CaseStudySpyNavProps {
  sections: CaseStudySection[];
}

const ACTIVATION_RATIO = 1 / 3;

function readHeaderOffset(): number {
  const header = document.querySelector<HTMLElement>("[data-site-header]");

  return header?.getBoundingClientRect().height ?? 0;
}

export default function CaseStudySpyNav({ sections }: CaseStudySpyNavProps) {
  const lenis = useLenis();
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    if (targets.length === 0) return;

    const resolveActiveSection = () => {
      const activationLine = window.innerHeight * ACTIVATION_RATIO;
      const entered = targets.filter(
        (target) => target.getBoundingClientRect().top <= activationLine,
      );

      setActiveId((entered.at(-1) ?? targets[0]).id);
    };

    const observer = new IntersectionObserver(resolveActiveSection, {
      rootMargin: "-33% 0px -66% 0px",
      threshold: [0, 1],
    });

    targets.forEach((target) => observer.observe(target));
    resolveActiveSection();

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    const target = document.getElementById(id);

    if (!target) return;

    event.preventDefault();
    window.history.replaceState(null, "", `#${id}`);

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

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Case study sections"
      className="sticky top-[var(--site-header-h)] z-30 -mx-[var(--page-gutter)] max-w-[100%] self-start overflow-x-auto bg-primary px-[var(--page-gutter)] py-scale lg:top-[calc(var(--site-header-h)+theme(spacing.scale))] lg:mx-0 lg:overflow-visible lg:px-0"
    >
      <ul className="flex gap-scale lg:flex-col">
        {sections.map((section) => {
          const isActive = section.id === activeId;

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => handleClick(event, section.id)}
                className={`flex items-center gap-2 whitespace-nowrap text-label transition-colors duration-150 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  isActive ? "text-secondary" : "text-gray fine:hover:text-white"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`size-2 shrink-0 rounded-full transition-colors duration-150 ${
                    isActive ? "bg-secondary" : "bg-gray"
                  }`}
                />
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
