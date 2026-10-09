import type { CSSProperties, ReactNode } from "react";
import type { Arrow } from "./geometry";

/**
 * Building blocks for sketches, authored in the frame's viewBox units.
 * Strokes live in the SVG; words are HTML laid over it, sized in container
 * units so they scale with the strokes yet stay real text.
 */

export interface Frame {
  w: number;
  h: number;
}

type Tone = "ink" | "muted" | "faint" | "accent";

const TONE: Record<Tone, string> = {
  ink: "currentColor",
  muted: "var(--sk-muted)",
  faint: "var(--sk-faint)",
  accent: "var(--sk-accent)",
};

function timing(delay: number, duration: number): CSSProperties {
  return { ["--d" as string]: `${delay}ms`, ["--t" as string]: `${duration}ms` };
}

interface DrawProps {
  d: string;
  delay?: number;
  duration?: number;
  tone?: Tone;
  width?: number;
}

/** A freehand stroke, revealed along its length. */
export function Draw({ d, delay = 0, duration = 700, tone = "ink", width = 1.8 }: DrawProps) {
  return (
    <path
      d={d}
      pathLength={1}
      data-draw=""
      fill="none"
      stroke={TONE[tone]}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={timing(delay, duration)}
    />
  );
}

/** Shaft first, then a quick head. */
export function DrawArrow({
  arrow,
  delay = 0,
  duration = 550,
  tone = "ink",
  width = 1.8,
}: Omit<DrawProps, "d"> & { arrow: Arrow }) {
  return (
    <>
      <Draw d={arrow.shaft} delay={delay} duration={duration} tone={tone} width={width} />
      <Draw
        d={arrow.head}
        delay={delay + duration - 40}
        duration={160}
        tone={tone}
        width={width}
      />
    </>
  );
}

interface FadeProps {
  /** Hold back until the frame plays (only the resolved interface in "Make" does). */
  appear?: boolean;
  delay?: number;
  duration?: number;
  children: ReactNode;
}

/** Precise structure. It is simply there, unless it is the late arrival of a sketch. */
export function Fade({ appear = false, delay = 0, duration = 300, children }: FadeProps) {
  if (!appear) return <g>{children}</g>;

  return (
    <g data-appear="" style={timing(delay, duration)}>
      {children}
    </g>
  );
}

/** Hairline geometry that stays 1px at any size: the "engineered" layer. */
export const precise = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  vectorEffect: "non-scaling-stroke",
} as const;

interface NoteProps {
  frame: Frame;
  x: number;
  /** Vertical centre of the line. */
  y: number;
  size?: number;
  children: ReactNode;
  tone?: Tone;
  /** "hand" is written in; "label" is the site typeface, set like a spec label. */
  variant?: "hand" | "label";
  align?: "left" | "center" | "right";
  rotate?: number;
  region?: string;
  hit?: string;
  /** Hidden below md, where sketches are simplified. */
  detail?: boolean;
}

/** A word in a sketch. Always complete and readable: only strokes are drawn in. */
export function Note({
  frame,
  x,
  y,
  size,
  children,
  tone = "ink",
  variant = "hand",
  align = "left",
  rotate = 0,
  region,
  hit,
  detail = false,
}: NoteProps) {
  const fontSize = size ?? (variant === "hand" ? 24 : 11);
  const shift = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";
  const color =
    tone === "accent" ? "var(--sk-accent)" : tone === "muted" ? "var(--sk-muted-text)" : undefined;
  const typeClass =
    variant === "hand"
      ? "font-[family-name:var(--font-hand)] leading-none"
      : "font-sans font-medium uppercase leading-none tracking-[0.16em]";

  return (
    <span
      data-region={region}
      className={`absolute whitespace-nowrap ${detail ? "hidden md:block" : "block"}`}
      style={{
        left: `${(x / frame.w) * 100}%`,
        top: `${(y / frame.h) * 100}%`,
        transform: `translate(${shift}, -50%) rotate(${rotate}deg)`,
        transformOrigin: align === "right" ? "right center" : "left center",
      }}
    >
      <span
        data-hit={hit}
        className={`block ${typeClass}`}
        style={{
          // Spec labels never drop below 10px; handwriting scales with the strokes.
          fontSize:
            variant === "label"
              ? `max(10px, ${(fontSize / frame.w) * 100}cqw)`
              : `${(fontSize / frame.w) * 100}cqw`,
          color,
        }}
      >
        {children}
      </span>
    </span>
  );
}
