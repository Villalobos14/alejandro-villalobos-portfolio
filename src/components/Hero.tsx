import { TransitionLink } from "@/components/curtain/TransitionLink";
import { homeHeroContent } from "@/lib/home-hero";
import { PROJECTS_ANCHOR } from "@/lib/projects";
import HeroStatement from "./hero/HeroStatement";

const { greeting, currently, previously, statement, description, intro, cta } = homeHeroContent;

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

const metaLabel = "font-sans text-[13px] font-normal normal-case tracking-normal text-ink-muted";
const metaValue = "text-[15px] font-normal leading-snug text-ink md:text-[18px]";

export default function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="flex w-full min-w-0 flex-col gap-4 pb-6 pt-8 md:gap-0 md:pb-12 md:pt-[58px] frame:h-[807px] frame:pb-[var(--dock-clearance)]"
    >
      <div className="contents md:grid md:grid-cols-[47.5%_25.4%_27.1%] md:items-start md:gap-y-4">
        <p className="order-1 text-[18px] font-medium leading-none text-ink md:order-none md:col-start-1 md:row-start-1 md:text-[25px]">
          {greeting}
        </p>
        <div className="order-2 max-w-[20rem] text-[20px] font-normal leading-[1.28] text-ink-secondary md:order-none md:col-start-1 md:row-start-2 md:text-[24px]">
          {statement.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="order-5 flex flex-col gap-1 md:contents">
          <p className={`${metaLabel} md:col-start-2 md:row-start-1`}>{currently.label}</p>
          <div className="md:col-start-2 md:row-start-2">
            <p className={metaValue}>{currently.role}</p>
            <p className={metaValue}>{currently.place}</p>
          </div>
        </div>
        <div className="order-6 flex flex-col gap-1 md:contents">
          <p className={`${metaLabel} md:col-start-3 md:row-start-1`}>{previously.label}</p>
          <div className="md:col-start-3 md:row-start-2">
            {previously.lines.map((line) => (
              <p key={line} className={metaValue}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="order-3 md:order-none md:flex md:min-w-0 md:flex-1 md:flex-col md:justify-end">
        <div className="hero-role max-md:max-w-none">
          <HeroStatement />
          <p className="hero-description mt-3 md:mt-4">{description}</p>
        </div>
      </div>

      <div className="order-7 flex flex-col gap-3 md:order-none md:mt-8 md:flex-row md:items-baseline md:justify-between">
        <p id="selected-work-title" className="text-[24px] font-medium leading-none text-ink md:text-[28px]">
          {intro}
        </p>
        <TransitionLink
          href={PROJECTS_ANCHOR}
          className={`inline-flex min-h-11 items-center text-[16px] font-medium leading-none text-accent max-md:w-full max-md:justify-center max-md:rounded-full max-md:bg-accent max-md:px-4 max-md:text-white md:shrink-0 ${focusStyles}`}
        >
          {cta}
        </TransitionLink>
      </div>
    </section>
  );
}
