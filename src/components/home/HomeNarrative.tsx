"use client";

import { useLayoutEffect, useRef, type KeyboardEvent } from "react";
import { homeNarrativeContent } from "@/lib/home-narrative";
import { prefersReducedMotion } from "@/lib/motion";
import HomePersonal from "./HomePersonal";
import HomeTimeline from "./HomeTimeline";
import { MarkerSentence } from "./MarkerSentence";
import { useNarrativePanel, type NarrativePanel } from "./NarrativeProvider";

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const panels: { id: NarrativePanel; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "personal", label: "Personal" },
];

function NarrativeSwitch() {
  const { panel, setPanel } = useNarrativePanel();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    event.preventDefault();
    const next: NarrativePanel = event.key === "ArrowRight" ? "personal" : "professional";
    setPanel(next);
    document.getElementById(`home-tab-${next}`)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Home preview"
      aria-orientation="horizontal"
      className="flex items-center gap-8"
      onKeyDown={onKeyDown}
    >
      {panels.map((item) => {
        const selected = panel === item.id;

        return (
          <button
            key={item.id}
            id={`home-tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`home-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            className={`relative inline-flex min-h-11 items-center gap-2 pb-2 text-lg transition-colors duration-300 md:text-2xl ${focusStyles} ${
              selected ? "text-secondary" : "text-gray"
            }`}
            onClick={() => setPanel(item.id)}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${selected ? "bg-secondary" : "bg-transparent"}`}
            />
            {item.label}
            <span
              aria-hidden="true"
              className={`absolute bottom-0 left-0 h-px w-full origin-left bg-secondary transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
                selected ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function NarrativePanels() {
  const { panel } = useNarrativePanel();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = ref.current;

    if (!node || prefersReducedMotion()) return;

    const animation = node.animate(
      [
        { opacity: 0, transform: "translateY(12px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 380, easing: "cubic-bezier(0.32, 0.72, 0, 1)", fill: "both" },
    );

    return () => animation.cancel();
  }, [panel]);

  return (
    <div ref={ref} className="mt-6 sm:mt-10 lg:mt-12">
      <div
        role="tabpanel"
        id="home-panel-professional"
        aria-labelledby="home-tab-professional"
        hidden={panel !== "professional"}
      >
        {panel === "professional" ? <HomeTimeline /> : null}
      </div>
      <div
        role="tabpanel"
        id="home-panel-personal"
        aria-labelledby="home-tab-personal"
        hidden={panel !== "personal"}
      >
        {panel === "personal" ? <HomePersonal /> : null}
      </div>
    </div>
  );
}

export default function HomeNarrative() {
  return (
    <section id="home-narrative" aria-label="Practice and personal notes" className="w-full min-w-0">
      <MarkerSentence
        segments={homeNarrativeContent.professionalStatement.segments}
        textClassName="text-[clamp(2rem,10vw,3.8rem)] font-medium leading-[1.08] tracking-tight lg:text-[clamp(2.8rem,5.5vw,7rem)]"
      />
      <div id="home-panels" className="scroll-mt-6 pb-8">
        <div className="px-[var(--page-gutter)]">
          <NarrativeSwitch />
        </div>
        <NarrativePanels />
      </div>
    </section>
  );
}
