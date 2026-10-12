"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRightIcon, FireIcon } from "@heroicons/react/16/solid";
import { duolingoStreakDays, everyday } from "@/lib/fun";
import { LINE_EASE } from "@/lib/motion";
import { useCardActivity, useReducedMotionPreference } from "./card-activity";

const { korean } = everyday;
type Word = (typeof korean.words)[number];

const WORD_MS = 4000;
const CHAR_STAGGER_S = 0.03;
/** The new word waits for the old one to clear before it rises. */
const ENTER_DELAY_S = 0.1;
/** The same curve as the masked headings, as a cubic-bezier array. */
const LINE_CURVE = (LINE_EASE.match(/-?[\d.]+/g) ?? []).map(Number) as [number, number, number, number];

/*
 * Inside the mask the old syllables lift, fade and blur; the new ones rise
 * into place a beat later. Longest path: 100 + 4 × 30 + 420 = 640 ms.
 */
const syllable: Variants = {
  /* Below the mask's 0.16em bleed, so no sliver shows before the rise. */
  enter: { y: "130%", opacity: 1, filter: "blur(0px)" },
  center: (index: number) => ({
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.42, ease: LINE_CURVE, delay: ENTER_DELAY_S + index * CHAR_STAGGER_S },
  }),
  exit: (index: number) => ({
    y: "-45%",
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.22, ease: "easeIn", delay: index * CHAR_STAGGER_S },
  }),
};

/** Romanization and meaning follow the rising Hangul by about 100 ms. */
const gloss: Variants = {
  enter: { y: 6, opacity: 0 },
  center: { y: 0, opacity: 1, transition: { duration: 0.3, ease: LINE_CURVE, delay: ENTER_DELAY_S } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: "easeIn" } },
};

/*
 * A Hangul syllable is at most 1em wide (0.83em in Apple SD Gothic Neo, a
 * full em in Noto Sans KR) and a space about a third. Up to three syllables
 * keep the full size; longer words shrink to the card's width in container
 * units, sized for the widest fonts so they never wrap or clip. A word past
 * five syllables needs a smaller step.
 */
function fitClass(hangul: string) {
  const width = Array.from(hangul).reduce((sum, char) => sum + (char === " " ? 0.35 : 1), 0);

  if (width <= 3.5) return "";
  if (width <= 4.5) return "text-[length:min(clamp(56px,16vw,88px),22.5cqi)]";

  return "text-[length:min(clamp(56px,16vw,88px),20cqi)]";
}

const glossText = (word: Word) => `${word.romanization} — ${word.meaning}`;

function Syllables({ word, animated }: { word: Word; animated: boolean }): ReactNode {
  const chars = Array.from(word.hangul);
  const className = `inline-block leading-none ${fitClass(word.hangul)}`;

  return chars.map((char, index) =>
    animated ? (
      <motion.span key={index} custom={index} variants={syllable} className={className}>
        {char}
      </motion.span>
    ) : (
      <span key={index} className={className}>
        {char}
      </span>
    ),
  );
}

/**
 * "Korean, slowly": the word rotates every four seconds while the card is on
 * screen and nobody is hovering or focused inside it. "Next word" steps by
 * hand and is the only change announced to screen readers.
 */
export default function KoreanCard({ className }: { className: string }) {
  const cardRef = useRef<HTMLElement>(null);
  const { inView, pageVisible, engaged } = useCardActivity(cardRef);
  const reducedMotion = useReducedMotionPreference();
  const [index, setIndex] = useState(0);
  const [announced, setAnnounced] = useState<Word | null>(null);
  const word = korean.words[index];
  const count = korean.words.length;

  useEffect(() => {
    if (!inView || !pageVisible || engaged || reducedMotion) return;

    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), WORD_MS);

    return () => window.clearInterval(timer);
  }, [inView, pageVisible, engaged, reducedMotion, count]);

  const next = () => {
    const nextIndex = (index + 1) % count;

    setIndex(nextIndex);
    setAnnounced(korean.words[nextIndex]);
  };

  return (
    <article ref={cardRef} className={`flex flex-col ${className}`}>
      <h3 className="text-mono text-ink-muted">{korean.label}</h3>
      <button
        type="button"
        aria-label={korean.nextWord}
        onClick={next}
        className="absolute right-3 top-2 inline-flex h-11 min-w-11 items-center justify-end gap-1.5 rounded-full px-3 text-mono-s text-ink-muted transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink fine:hover:text-ink md:right-4 md:top-3 frame:right-[15px] frame:top-[11px]"
      >
        <span aria-hidden="true">
          {index + 1}/{count}
        </span>
        <ArrowRightIcon aria-hidden="true" className="size-3.5" />
      </button>
      <p className="mt-[30px] text-mono-s text-ink-muted frame:mt-5">{korean.wordLabel}</p>

      {/* Geist has no Hangul glyphs: the existing system-ui/sans-serif stack supplies them. */}
      <div className="relative mt-8 h-[1em] font-sans text-[clamp(56px,16vw,88px)] font-medium leading-none tracking-[-0.04em] [container-type:inline-size] frame:mt-6">
        <p lang="ko" className="absolute inset-x-0 -inset-y-[0.16em] overflow-hidden">
          <span className="sr-only">{word.hangul}</span>
          {reducedMotion ? (
            <span aria-hidden="true" className="absolute inset-x-0 bottom-[0.16em] flex items-end whitespace-pre">
              <Syllables word={word} animated={false} />
            </span>
          ) : (
            <AnimatePresence initial={false}>
              <motion.span
                key={index}
                aria-hidden="true"
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-x-0 bottom-[0.16em] flex items-end whitespace-pre"
              >
                <Syllables word={word} animated />
              </motion.span>
            </AnimatePresence>
          )}
        </p>
      </div>

      <p className="mt-8 h-[18px] text-mono !leading-[18px] text-ink frame:mt-[26px]">
        {reducedMotion ? (
          glossText(word)
        ) : (
          <AnimatePresence initial={false} mode="wait">
            <motion.span key={index} variants={gloss} initial="enter" animate="center" exit="exit" className="block">
              {glossText(word)}
            </motion.span>
          </AnimatePresence>
        )}
      </p>
      <p className="mt-[18px] text-body-s text-ink-secondary frame:mt-3">{korean.note}</p>
      <p className="mt-5 inline-flex items-center gap-1.5 self-start rounded-full border border-border px-2.5 py-[5px] text-mono-s text-ink-secondary frame:mt-auto">
        <FireIcon aria-hidden="true" className="size-3 text-signal" />
        {duolingoStreakDays} {korean.streak.unit} · {korean.streak.service}
      </p>
      <p aria-live="polite" className="sr-only">
        {announced ? (
          <>
            <span lang="ko">{announced.hangul}</span>, {glossText(announced)}
          </>
        ) : null}
      </p>
    </article>
  );
}
