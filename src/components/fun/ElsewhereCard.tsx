"use client";

import { useEffect, useRef, useState } from "react";
import { everyday } from "@/lib/fun";
import { useCardActivity, useReducedMotionPreference } from "./card-activity";
import SplitFlap from "./SplitFlap";

const { travel } = everyday;

const CYCLE_MS = 4500;
/** The city line fades in as the destination cells finish settling. */
const CITY_FADE = { delayMs: 380, durationMs: 220 } as const;

const ticket =
  "text-[clamp(36px,10vw,56px)] leading-none md:text-[clamp(32px,4vw,56px)] frame:text-[56px]";

/**
 * "Elsewhere": the ticket's destination rotates on a split-flap board. The
 * board is decoration; readers of the accessibility tree get a stable
 * sentence for the current destination and the full list, never a live
 * region. Reduced motion shows the original static ticket.
 */
export default function ElsewhereCard({ className }: { className: string }) {
  const cardRef = useRef<HTMLElement>(null);
  const cityRef = useRef<HTMLParagraphElement>(null);
  const { inView, pageVisible, engaged } = useCardActivity(cardRef);
  const reducedMotion = useReducedMotionPreference();
  const [index, setIndex] = useState(0);
  const [booted, setBooted] = useState(false);
  const destination = travel.destinations[index];
  const live = inView && pageVisible && !reducedMotion;

  /* The board runs through its characters once, the first time it is seen. */
  useEffect(() => {
    if (live && !booted) setBooted(true);
  }, [live, booted]);

  useEffect(() => {
    if (!booted || !live || engaged) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % travel.destinations.length);
    }, CYCLE_MS);

    return () => window.clearInterval(timer);
  }, [booted, live, engaged]);

  useEffect(() => {
    if (reducedMotion) setIndex(0);
  }, [reducedMotion]);

  useEffect(() => {
    const city = cityRef.current;

    if (!city || (index === 0 && !booted)) return;

    const fade = city.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: CITY_FADE.durationMs,
      delay: CITY_FADE.delayMs,
      easing: "ease-out",
      fill: "backwards",
    });

    return () => fade.cancel();
  }, [index, booted]);

  return (
    <article ref={cardRef} className={className}>
      <h3 className="text-mono text-ink-muted">{travel.label}</h3>
      <p className="sr-only">
        From {travel.fromCity} to {destination.city}
      </p>
      <p className="sr-only">
        {travel.destinationsLabel}:{" "}
        {travel.destinations.map((item) => `${item.city}, ${item.country}`).join("; ")}
      </p>
      <div aria-hidden="true" className="mt-5 motion-reduce:hidden frame:mt-4">
        <div className={`flex items-center justify-between gap-2 ${ticket}`}>
          <SplitFlap value={travel.from} replay={booted ? 1 : 0} />
          <span className="text-[28px] text-accent">→</span>
          <SplitFlap value={destination.code} replay={booted ? 1 : 0} offset={travel.from.length} />
        </div>
        <p ref={cityRef} className="mt-1.5 text-right text-mono-s text-ink-muted">
          {destination.city}, {destination.country}
        </p>
      </div>
      <p
        aria-hidden="true"
        className={`mt-5 hidden items-baseline justify-between gap-2 whitespace-nowrap font-medium tracking-[-0.04em] motion-reduce:flex frame:mt-[21px] ${ticket}`}
      >
        <span>{travel.from}</span>
        <span className="text-[28px] text-accent">→</span>
        <span>{travel.to}</span>
      </p>
      <p className="mt-5 border-t border-border pt-[10px] text-body text-ink-secondary frame:mt-4 frame:pt-[13px]">
        {travel.body}
      </p>
      <dl className="mt-5 grid grid-cols-[0.8fr_1.5fr_1.3fr] gap-3 frame:mt-[18px] frame:grid-cols-[77px_143px_minmax(0,1fr)]">
        {travel.meta.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="text-mono-s text-ink-muted">{item.label}</dt>
            <dd className="mt-[7px] text-body-s leading-[20px] frame:whitespace-nowrap">{item.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
