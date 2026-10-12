"use client";

import { useLayoutEffect, useRef, type KeyboardEvent } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import HomePersonal from "./HomePersonal";
import HomeTimeline from "./HomeTimeline";
import { useNarrativePanel, type NarrativePanel } from "./NarrativeProvider";

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const panels: { id: NarrativePanel; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "personal", label: "Fun" },
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
      className="flex w-full shrink-0 items-center rounded-full border border-border p-1 md:inline-flex md:w-auto"
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
            className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-4 text-body transition-colors duration-300 md:flex-none ${focusStyles} ${
              selected ? "bg-ink text-white" : "text-ink-secondary"
            }`}
            onClick={() => setPanel(item.id)}
          >
            {item.label}
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
    <div ref={ref} className="mt-3 md:mt-10 lg:mt-12">
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
      <div className="flex flex-col gap-3 pt-6 md:flex-row md:items-start md:justify-between md:gap-6 md:pt-10">
        <h2 className="min-w-0 text-[clamp(30px,8.5vw,40px)] font-medium leading-none text-ink md:text-[clamp(2rem,4.6vw,66px)] md:leading-[0.98]">
          <span className="block">So, how did I get here? A quick tour,</span>
          <span className="block">2002 to now.</span>
        </h2>
        <NarrativeSwitch />
      </div>
      <div id="home-panels" className="scroll-mt-6 pb-8">
        <NarrativePanels />
      </div>
    </section>
  );
}
