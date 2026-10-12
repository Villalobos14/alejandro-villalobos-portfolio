"use client";

import { useEffect, useRef } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Each cell runs through 4–8 random characters before it settles. */
const TICKS = { min: 4, max: 8 } as const;
const TICK_MS = { min: 50, max: 70 } as const;
const SETTLE_MS = 180;
const STAGGER_MS = 70;

interface CellParts {
  top: HTMLSpanElement;
  bottom: HTMLSpanElement;
  flapTop: HTMLSpanElement;
  flapBottom: HTMLSpanElement;
}

interface SplitFlapProps {
  value: string;
  /** Raising it makes every cell run through characters again, even unchanged ones. */
  replay?: number;
  /** Position of the first cell in a longer board, so staggers continue across boards. */
  offset?: number;
  className?: string;
}

const random = (min: number, max: number) => min + Math.random() * (max - min);
const randomChar = (except: string) => {
  let char = except;

  while (char === except) char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

  return char;
};
const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const glyph = (part: HTMLSpanElement) => part.firstElementChild as HTMLSpanElement;

/*
 * One flip: the upper flap carrying the old character falls to horizontal and
 * uncovers the new upper half; then the lower flap carrying the new character
 * drops from horizontal over the old lower half. Until its turn the lower flap
 * waits edge-on, so it cannot be seen. Cancelling still leaves a whole glyph.
 */
async function flip(cell: CellParts, to: string, ms: number) {
  const from = glyph(cell.bottom).textContent ?? "";

  glyph(cell.top).textContent = to;
  glyph(cell.flapTop).textContent = from;
  glyph(cell.flapBottom).textContent = to;
  cell.flapTop.style.visibility = "visible";
  cell.flapBottom.style.visibility = "visible";

  const half = ms / 2;
  const fall = cell.flapTop.animate([{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }], {
    duration: half,
    easing: "ease-in",
    fill: "forwards",
  });
  const land = cell.flapBottom.animate([{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }], {
    duration: half,
    delay: half,
    easing: "ease-out",
    fill: "both",
  });

  try {
    await land.finished;
  } finally {
    glyph(cell.bottom).textContent = to;
    cell.flapTop.style.visibility = "";
    cell.flapBottom.style.visibility = "";
    fall.cancel();
    land.cancel();
  }
}

/**
 * Mechanical departures-board characters. The markup always holds the final
 * text; motion is layered on top, so callers hide it from assistive tech and
 * skip it under reduced motion.
 */
export default function SplitFlap({ value, replay = 0, offset = 0, className = "" }: SplitFlapProps) {
  const cellRefs = useRef<(HTMLSpanElement | null)[]>([]);
  /* The first render's characters; afterwards the DOM is driven directly. */
  const initial = useRef(value.split(""));
  const run = useRef(0);
  const settled = useRef({ value, replay });

  useEffect(() => {
    if (settled.current.value === value && settled.current.replay === replay) return;

    const scrambleAll = settled.current.replay !== replay;
    const current = ++run.current;
    const isCurrent = () => run.current === current;

    settled.current = { value, replay };

    value.split("").forEach((target, index) => {
      const element = cellRefs.current[index];

      if (!element) return;

      const [top, bottom, flapTop, flapBottom] = Array.from(element.children) as HTMLSpanElement[];
      const cell = { top, bottom, flapTop, flapBottom };

      /* A newer run takes over mid-flip: the old flips finish instantly. */
      element.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());

      if (!scrambleAll && glyph(bottom).textContent === target) return;

      void (async () => {
        await wait((offset + index) * STAGGER_MS);

        const ticks = Math.round(random(TICKS.min, TICKS.max));

        for (let tick = 0; tick < ticks && isCurrent(); tick++) {
          await flip(cell, randomChar(target), random(TICK_MS.min, TICK_MS.max));
        }

        if (isCurrent()) await flip(cell, target, SETTLE_MS);
      })().catch(() => undefined);
    });
  }, [value, replay, offset]);

  /* Unmounting abandons the run and stops every flap where it is. */
  useEffect(() => {
    const cells = cellRefs.current;

    return () => {
      run.current += 1;
      cells.forEach((element) => {
        element?.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
      });
    };
  }, []);

  const half = "absolute inset-x-0 h-1/2 overflow-hidden bg-cover-ink-raised";
  const glyphBox = "absolute inset-x-0 flex h-[200%] items-center justify-center";

  return (
    <span aria-hidden="true" className={`flex gap-1 font-mono font-medium ${className}`}>
      {initial.current.map((char, index) => (
        <span
          key={index}
          ref={(element) => {
            cellRefs.current[index] = element;
          }}
          className="relative block h-[1em] w-[0.8em] rounded-[3px] text-bg [perspective:4em]"
        >
          <span className={`${half} top-0 rounded-t-[3px]`}>
            <span className={`${glyphBox} top-0`}>{char}</span>
          </span>
          <span className={`${half} bottom-0 rounded-b-[3px]`}>
            <span className={`${glyphBox} bottom-0`}>{char}</span>
          </span>
          <span className={`${half} invisible top-0 origin-bottom rounded-t-[3px] [backface-visibility:hidden]`}>
            <span className={`${glyphBox} top-0`}>{char}</span>
          </span>
          <span className={`${half} invisible bottom-0 origin-top rounded-b-[3px] [backface-visibility:hidden]`}>
            <span className={`${glyphBox} bottom-0`}>{char}</span>
          </span>
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-cover-ink" />
        </span>
      ))}
    </span>
  );
}
