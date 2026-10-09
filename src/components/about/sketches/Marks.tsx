import type { ReactNode } from "react";
import { curvedArrow, handBracket, handUnderline, roughEllipse } from "./geometry";
import { Draw, DrawArrow } from "./primitives";
import SketchFrame from "./SketchFrame";

/**
 * Marks that sit on real text rather than inside a diagram: a margin note, a
 * circled word, an underlined phrase. The text stays selectable HTML; only the
 * strokes are SVG.
 */

export type MarginMark = "circle" | "underline" | "arrow" | "bracket";

export function MarginNote({ children, mark }: { children: ReactNode; mark: MarginMark }) {
  return (
    <SketchFrame fluid className="relative max-w-[17rem]">
      {mark === "bracket" ? (
        <svg
          viewBox="0 0 16 80"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute -left-5 top-0 h-full w-4"
        >
          <Draw d={handBracket(9, 3, 77, 7, 81)} duration={360} width={1.6} />
        </svg>
      ) : null}
      {mark === "arrow" ? (
        <svg viewBox="0 0 48 48" aria-hidden="true" className="absolute -left-14 top-1 hidden size-12 lg:block">
          <DrawArrow arrow={curvedArrow([44, 10], [6, 34], 0.35, 83, 8)} duration={360} width={1.6} />
        </svg>
      ) : null}
      <p
        className="font-[family-name:var(--font-hand)] text-[1.5rem] leading-[1.1] text-[color:var(--sk-ink)] sm:text-[1.625rem]"
      >
        {children}
      </p>
      {mark === "underline" ? (
        <svg viewBox="0 0 240 14" preserveAspectRatio="none" aria-hidden="true" className="mt-1 h-3 w-[92%]">
          <Draw d={handUnderline(2, 230, 6, 85)} tone="accent" delay={150} duration={360} width={2} />
        </svg>
      ) : null}
    </SketchFrame>
  );
}

/** A word circled by hand, e.g. "Present". */
export function CircledWord({ children }: { children: ReactNode }) {
  return (
    <SketchFrame fluid as="span" className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)]"
      >
        <Draw d={roughEllipse(50, 20, 44, 15, 87, 1.12)} tone="accent" delay={150} duration={500} width={1.4} />
      </svg>
    </SketchFrame>
  );
}

/** A sentence with one phrase underlined by hand as it comes into view. */
export function UnderlinedPhrase({
  text,
  phrase,
  className = "",
}: {
  text: string;
  phrase: string;
  className?: string;
}) {
  const at = text.indexOf(phrase);

  if (at < 0) return <p className={className}>{text}</p>;

  return (
    <SketchFrame fluid className="relative">
      <p className={className}>
        {text.slice(0, at)}
        <span data-underline="" style={{ ["--d" as string]: "150ms", ["--t" as string]: "600ms" }}>
          {phrase}
        </span>
        {text.slice(at + phrase.length)}
      </p>
    </SketchFrame>
  );
}
