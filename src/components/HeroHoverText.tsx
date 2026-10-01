"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { useFinePointer } from "@/lib/fine-pointer";

const SCRAMBLE_SET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>%&@!#$^*()-_+=[]{}|\\:;\"?/~`";

const TWEEN_MS = 1100;
const SMOOTH_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const RADIUS_RATIO = 0.85;
const SCRAMBLE_COLORS = [
  "#3DD964",
  "#FF90E8",
  "#FFC900",
  "#90FFE8",
  "#4D9FFF",
  "#FF5C32",
];

function randomColor(): string {
  if (Math.random() < 0.4) return SCRAMBLE_COLORS[0];
  return (
    SCRAMBLE_COLORS[Math.floor(Math.random() * SCRAMBLE_COLORS.length)] ??
    SCRAMBLE_COLORS[0]
  );
}

function randomChar(): string {
  return SCRAMBLE_SET[Math.floor(Math.random() * SCRAMBLE_SET.length)] ?? "";
}

interface Glyph {
  char: string;
  className: string;
}

function toGlyphs(children: ReactNode, className = ""): Glyph[] {
  const glyphs: Glyph[] = [];

  Children.forEach(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      for (const char of String(child)) {
        glyphs.push({ char, className });
      }
      return;
    }

    if (isValidElement<{ children?: ReactNode; className?: string }>(child)) {
      const nestedClass = [className, child.props.className]
        .filter(Boolean)
        .join(" ");
      glyphs.push(...toGlyphs(child.props.children, nestedClass));
    }
  });

  return glyphs;
}

function flattenText(glyphs: Glyph[]): string {
  return glyphs.map((glyph) => glyph.char).join("");
}

function fadeOverlay(element: HTMLElement, duration: number) {
  element.style.opacity = "0";
  return element.animate(
    [
      { opacity: 0 },
      { opacity: 0.85, offset: 0.14 },
      { opacity: 0.85, offset: 0.78 },
      { opacity: 0 },
    ],
    { duration, easing: SMOOTH_EASE, fill: "forwards" },
  );
}

function pulseColor(element: HTMLElement, color: string, duration: number) {
  return element.animate(
    [
      { color: "currentColor", filter: "blur(0px)", transform: "scale(1)" },
      {
        color,
        filter: "blur(0.4px)",
        transform: "scale(1.03)",
        offset: 0.16,
      },
      {
        color,
        filter: "blur(0px)",
        transform: "scale(1)",
        offset: 0.78,
      },
      { color: "currentColor", filter: "blur(0px)", transform: "scale(1)" },
    ],
    { duration, easing: SMOOTH_EASE },
  );
}

function scrambleBox(box: HTMLElement, intensity: number) {
  if (box.dataset.playing === "true") return;

  const base = box.querySelector<HTMLElement>("[data-original]");
  const alt = box.querySelector<HTMLElement>("[data-alt]");
  if (!base || !alt) return;

  const original = base.dataset.original ?? "";
  if (original.trim() === "") return;

  box.dataset.playing = "true";

  const flashColor = randomColor();
  const duration = TWEEN_MS + (1 - intensity) * 120;
  const shouldSwap = intensity > 0.45 && Math.random() < 0.65;

  if (shouldSwap) {
    alt.textContent = randomChar();
    base.animate(
      [
        { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
        {
          opacity: 0,
          filter: "blur(3px)",
          transform: "scale(0.96)",
          offset: 0.14,
        },
        {
          opacity: 0,
          filter: "blur(0px)",
          transform: "scale(1)",
          offset: 0.78,
        },
        { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
      ],
      { duration, easing: SMOOTH_EASE },
    );
    alt.animate(
      [
        { opacity: 0, filter: "blur(3px)", transform: "scale(1.04)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          transform: "scale(1)",
          offset: 0.14,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          transform: "scale(1)",
          offset: 0.78,
        },
        { opacity: 0, filter: "blur(3px)", transform: "scale(1.04)" },
      ],
      { duration, easing: SMOOTH_EASE },
    );
  }

  const colorAnimation = pulseColor(base, flashColor, duration);
  if (shouldSwap) {
    pulseColor(alt, flashColor, duration);
  }

  let border: HTMLSpanElement | undefined;
  if (intensity > 0.7 && Math.random() < 0.22) {
    border = document.createElement("span");
    border.setAttribute("aria-hidden", "true");
    border.className = "pointer-events-none absolute inset-0 box-border";
    border.style.border = `1px solid ${flashColor}`;
    box.appendChild(border);
    fadeOverlay(border, duration);
  }

  let label: HTMLSpanElement | undefined;
  if (intensity > 0.8 && Math.random() < 0.16) {
    const width = Math.round(box.getBoundingClientRect().width);
    label = document.createElement("span");
    label.setAttribute("aria-hidden", "true");
    label.className =
      "pointer-events-none absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap";
    label.style.fontSize = "11px";
    label.style.color = flashColor;
    label.textContent = `△x = ${width}px`;
    box.appendChild(label);
    fadeOverlay(label, duration);
  }

  void colorAnimation.finished
    .catch(() => undefined)
    .finally(() => {
      base.style.opacity = "";
      base.style.filter = "";
      base.style.transform = "";
      base.style.color = "";
      alt.style.opacity = "0";
      alt.style.filter = "";
      alt.style.transform = "";
      alt.textContent = "";
      border?.remove();
      label?.remove();
      delete box.dataset.playing;
    });
}

function CharBox({ glyph }: { glyph: Glyph }) {
  return (
    <span
      data-char-box=""
      className={`relative inline-block align-baseline ${glyph.className}`}
    >
      <span data-original={glyph.char} className="relative inline-block">
        {glyph.char === " " ? "\u00A0" : glyph.char}
      </span>
      <span
        data-alt=""
        className="pointer-events-none absolute inset-0 inline-block opacity-0"
      />
    </span>
  );
}

function GlyphLine({ glyphs }: { glyphs: Glyph[] }) {
  const parts: ReactNode[] = [];
  let word: { glyph: Glyph; index: number }[] = [];

  const flushWord = () => {
    if (word.length === 0) return;

    const start = word[0].index;
    parts.push(
      <span key={`word-${start}`} className="inline-block whitespace-nowrap">
        {word.map(({ glyph, index }) => (
          <CharBox key={`${glyph.char}-${index}`} glyph={glyph} />
        ))}
      </span>,
    );
    word = [];
  };

  glyphs.forEach((glyph, index) => {
    if (glyph.char === " ") {
      flushWord();
      parts.push(<CharBox key={`space-${index}`} glyph={glyph} />);
      return;
    }

    word.push({ glyph, index });
  });

  flushWord();
  return parts;
}

interface HeroHoverTextProps {
  children: ReactNode;
}

export default function HeroHoverText({ children }: HeroHoverTextProps) {
  const glyphs = toGlyphs(children);
  const text = flattenText(glyphs);
  const shouldReduceMotion = useReducedMotion();
  const hasFinePointer = useFinePointer();
  const interactive = shouldReduceMotion !== true && hasFinePointer;
  const lineRef = useRef<HTMLSpanElement>(null);

  const reserveWidths = useCallback(() => {
    const boxes =
      lineRef.current?.querySelectorAll<HTMLElement>("[data-char-box]") ?? [];

    boxes.forEach((box) => {
      const glyph = box.querySelector<HTMLElement>("[data-original]");
      if (!glyph) return;
      box.style.width = `${glyph.getBoundingClientRect().width}px`;
    });
  }, []);

  useLayoutEffect(() => {
    if (!interactive) return;

    reserveWidths();

    const line = lineRef.current;
    if (!line) return;

    const observer = new ResizeObserver(() => reserveWidths());
    observer.observe(line);
    window.addEventListener("resize", reserveWidths);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", reserveWidths);
    };
  }, [interactive, reserveWidths, text]);

  const handlePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (shouldReduceMotion || !hasFinePointer || !lineRef.current) return;

    const boxes = Array.from(
      lineRef.current.querySelectorAll<HTMLElement>("[data-char-box]"),
    );

    if (boxes.length === 0) return;

    const sample = boxes[0].getBoundingClientRect();
    const radius = Math.max(sample.height * RADIUS_RATIO, 18);

    boxes.forEach((box) => {
      const rect = box.getBoundingClientRect();
      const distance = Math.hypot(
        event.clientX - (rect.left + rect.width / 2),
        event.clientY - (rect.top + rect.height / 2),
      );

      if (distance > radius) return;
      if (box.dataset.playing === "true" || box.dataset.queued === "true") {
        return;
      }

      const intensity = 1 - distance / radius;
      box.dataset.queued = "true";
      window.setTimeout(() => {
        delete box.dataset.queued;
        scrambleBox(box, intensity);
      }, (1 - intensity) * 55);
    });
  };

  if (!interactive) {
    return <span>{children}</span>;
  }

  return (
    <span className="relative inline" onPointerMove={handlePointerMove}>
      <span className="sr-only">{text}</span>
      <span ref={lineRef} aria-hidden="true">
        <GlyphLine glyphs={glyphs} />
      </span>
    </span>
  );
}
