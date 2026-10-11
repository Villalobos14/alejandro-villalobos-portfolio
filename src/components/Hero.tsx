import { TransitionLink } from "@/components/curtain/TransitionLink";
import { homeHeroContent } from "@/lib/home-hero";
import { PROJECTS_ANCHOR } from "@/lib/projects";
import HeroStatement from "./hero/HeroStatement";

const { greeting, currently, previously, description, cta } = homeHeroContent;

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export default function Hero() {
  return (
    <section aria-label="Introduction" className="w-full min-w-0 px-[var(--page-gutter)] pb-16 pt-10 sm:pb-24 sm:pt-16">
      <p className="text-display-l text-ink">{greeting}</p>
      <div className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-2 sm:gap-12">
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
      <HeroStatement className="mt-14 sm:mt-20" />
      <p className="mt-8 max-w-xl text-body text-ink">{description}</p>
      <TransitionLink
        href={PROJECTS_ANCHOR}
        className={`mt-6 inline-flex min-h-11 items-center text-body text-accent ${focusStyles}`}
      >
        {cta}
      </TransitionLink>
    </section>
  );
}
