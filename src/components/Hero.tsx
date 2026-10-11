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
      className="flex w-full min-w-0 flex-col px-[var(--page-gutter)] pb-12 pt-8 frame:h-[807px] frame:pb-[var(--dock-clearance)]"
    >
      <div className="relative">
        <p className="text-[25px] font-medium leading-none text-ink">{greeting}</p>
        <div className="relative mt-10">
          <div className="max-w-[20rem] text-[24px] font-normal leading-[1.28] text-ink-secondary">
            {statement.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="mt-8 md:absolute md:left-[47.5%] md:top-0 md:mt-0 md:w-[23%]">
            <p className={metaLabel}>{currently.label}</p>
            <p className={`mt-2 ${metaValue}`}>{currently.role}</p>
            <p className={metaValue}>{currently.place}</p>
          </div>
          <div className="mt-8 md:absolute md:left-[72.9%] md:top-0 md:mt-0 md:w-[27.1%]">
            <p className={metaLabel}>{previously.label}</p>
            {previously.lines.map((line) => (
              <p key={line} className={`mt-2 ${metaValue}`}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 flex min-w-0 flex-1 flex-col justify-end md:mt-0">
        <HeroStatement className="md:pl-[28.9%] frame:w-max frame:max-w-none" />
        <p className="mt-4 max-w-full text-[24px] font-normal leading-none text-ink-secondary md:pl-[28.9%] frame:ml-[calc(43.1%-2px)] frame:w-max frame:max-w-none frame:pl-0 frame:whitespace-nowrap">
          {description}
        </p>
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
