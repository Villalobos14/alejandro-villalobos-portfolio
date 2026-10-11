import { TransitionLink } from "@/components/curtain/TransitionLink";
import { homeHeroContent } from "@/lib/home-hero";
import { PROJECTS_ANCHOR } from "@/lib/projects";
import HeroStatement from "./hero/HeroStatement";

const { greeting, currently, previously, statement, description, intro, cta } = homeHeroContent;

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

const metaLabel = "font-sans text-[13px] font-normal normal-case tracking-normal text-ink-muted";
const metaValue = "text-[18px] font-normal leading-snug text-ink";

export default function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="flex w-full min-w-0 flex-col pb-12 pt-8 md:pt-[58px] frame:h-[807px] frame:pb-[var(--dock-clearance)]"
    >
      <div className="md:grid md:grid-cols-[47.5%_25.4%_27.1%] md:items-start md:gap-y-4">
        <p className="text-[25px] font-medium leading-none text-ink md:col-start-1 md:row-start-1">
          {greeting}
        </p>
        <p className={`${metaLabel} mt-8 md:col-start-2 md:row-start-1 md:mt-0`}>{currently.label}</p>
        <p className={`${metaLabel} mt-8 md:col-start-3 md:row-start-1 md:mt-0`}>{previously.label}</p>
        <div className="mt-8 max-w-[20rem] text-[24px] font-normal leading-[1.28] text-ink-secondary md:col-start-1 md:row-start-2 md:mt-0">
          {statement.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="mt-8 md:col-start-2 md:row-start-2 md:mt-0">
          <p className={metaValue}>{currently.role}</p>
          <p className={metaValue}>{currently.place}</p>
        </div>
        <div className="mt-8 md:col-start-3 md:row-start-2 md:mt-0">
          {previously.lines.map((line) => (
            <p key={line} className={metaValue}>
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-12 flex min-w-0 flex-1 flex-col justify-end md:mt-0">
        <div className="hero-role">
          <HeroStatement />
          <p className="hero-description mt-4">{description}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
        <p id="selected-work-title" className="text-[28px] font-medium leading-none text-ink">
          {intro}
        </p>
        <TransitionLink
          href={PROJECTS_ANCHOR}
          className={`inline-flex min-h-11 shrink-0 items-center text-[16px] font-medium leading-none text-accent ${focusStyles}`}
        >
          {cta}
        </TransitionLink>
      </div>
    </section>
  );
}
