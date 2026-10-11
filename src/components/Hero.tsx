import { TransitionLink } from "@/components/curtain/TransitionLink";
import { homeHeroContent } from "@/lib/home-hero";
import { PROJECTS_ANCHOR } from "@/lib/projects";
import HeroStatement from "./hero/HeroStatement";

const { greeting, currently, previously, statement, intro, cta } = homeHeroContent;

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export default function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="flex w-full min-w-0 flex-col px-[var(--page-gutter)] pb-12 pt-8 lg:h-[807px] lg:pb-[var(--dock-clearance)]"
    >
      <p className="text-[25px] leading-none text-ink">{greeting}</p>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="text-mono-s text-ink-muted">{currently.label}</p>
          <p className="mt-2 text-body text-ink">{currently.role}</p>
          <p className="text-body text-ink">{currently.place}</p>
        </div>
        <div>
          <p className="text-mono-s text-ink-muted">{previously.label}</p>
          {previously.lines.map((line) => (
            <p key={line} className="mt-2 text-body text-ink">
              {line}
            </p>
          ))}
        </div>
      </div>
      <div className="mt-8 grid flex-1 items-end gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-12">
        <div className="max-w-[18rem] text-[24px] leading-snug text-ink-secondary">
          {statement.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <HeroStatement className="lg:justify-self-end" />
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
        <p id="selected-work-title" className="text-[28px] font-medium leading-none text-ink">
          {intro}
        </p>
        <TransitionLink
          href={PROJECTS_ANCHOR}
          className={`inline-flex min-h-11 shrink-0 items-center text-[16px] leading-none text-accent ${focusStyles}`}
        >
          {cta}
        </TransitionLink>
      </div>
    </section>
  );
}
