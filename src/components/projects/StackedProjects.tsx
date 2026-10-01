"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import {
  REDUCED_MOTION_QUERY,
  STACK_QUERY,
  STACK_SCALE_RANGE,
  STACK_TOP_OFFSETS_PX,
  prefersReducedMotion,
} from "@/lib/motion";
import type { FeaturedProject } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

interface StackedProjectsProps {
  projects: FeaturedProject[];
}

/**
 * Sticky stacking only runs when the viewport is wide and tall enough for a card to
 * stay usable. Everywhere else the cards keep their natural height and flow.
 */
export default function StackedProjects({ projects }: StackedProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isStacked, setIsStacked] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const sizeQuery = window.matchMedia(STACK_QUERY);
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setIsStacked(sizeQuery.matches && !motionQuery.matches);

    sync();
    sizeQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);

    return () => {
      sizeQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !isStacked || prefersReducedMotion()) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>("[data-stack-item]"),
    );

    let frame = 0;

    const update = () => {
      frame = 0;

      const viewportHeight = window.innerHeight;

      items.forEach((item, index) => {
        const next = items[index + 1];

        if (!next) {
          item.style.transform = "";
          return;
        }

        const nextCardTop = next.getBoundingClientRect().top;
        const progress = Math.min(
          Math.max((viewportHeight - nextCardTop) / viewportHeight, 0),
          1,
        );

        item.style.transform = `scale(${1 - progress * STACK_SCALE_RANGE})`;
      });
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    lenis?.on("scroll", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      lenis?.off("scroll", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      items.forEach((item) => {
        item.style.transform = "";
      });
    };
  }, [isStacked, lenis]);

  return (
    <div ref={containerRef} className="flex w-full flex-col gap-stack">
      {projects.map((project, index) => (
        <div
          key={project.id}
          data-stack-item={isStacked ? "" : undefined}
          className="origin-top will-change-transform"
          style={
            isStacked
              ? {
                  position: "sticky",
                  top: `${
                    STACK_TOP_OFFSETS_PX[
                      Math.min(index, STACK_TOP_OFFSETS_PX.length - 1)
                    ]
                  }px`,
                }
              : undefined
          }
        >
          <ProjectCard project={project} isStacked={isStacked} />
        </div>
      ))}
    </div>
  );
}
