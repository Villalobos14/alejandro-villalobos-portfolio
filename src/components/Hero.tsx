import HeroField from "./hero/HeroField";
import HeroComposition from "./hero/HeroComposition";
import HeroPractice from "./hero/HeroPractice";
import HeroStatement from "./hero/HeroStatement";
import { heroColumnLabel, heroColumnText, heroHalo, heroMeta } from "./hero/styles";
import { homeHeroContent } from "@/lib/home-hero";

const { identity, place, availability, supporting, annotation } = homeHeroContent;

/** From lg the body and the bottom row share two columns: the statement, and a fixed column against the right edge. */
const columns = "lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-x-8";

/** The right column, from md: as wide as the note's longest line, so its text runs to the right edge. */
const aside = "md:w-[22rem] md:shrink-0 lg:w-auto";

/*
 * The first viewport of the page, on the same grid as every section below
 * it: the page gutter on both sides and nothing narrower. The field runs edge
 * to edge behind it. Structure comes from alignment alone: the statement on
 * the left edge, the metadata and the right column against the right edge.
 *
 * Below md the section is as tall as its content and ends well clear of the
 * dock. From md up it fills the viewport, keeping the dock's height and a
 * margin free at the bottom. The dock only measures itself once hydrated, so
 * until then --dock-clearance is short by the dock's height; the 5.625rem
 * floor is what it comes to, which keeps the content from moving when it does.
 *
 * Nothing here clips: Calcifer's flame and teleport spill past the letter,
 * and only the headline's own line masks may hold him.
 */
export default function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="relative -mt-[var(--site-header-h)] flex w-full flex-col px-[var(--page-gutter)] pb-[clamp(1.5rem,4vh,2.5rem)] pt-[calc(var(--site-header-h)+max(var(--page-gutter),1.25rem))] text-white md:min-h-[100svh] md:pb-[calc(max(var(--dock-clearance),5.625rem)+clamp(1.5rem,6vh,3.5rem))]"
    >
      <HeroField />

      <HeroComposition className="relative z-10 flex w-full flex-1 flex-col">
        <div data-hero-enter className={`flex flex-col gap-x-6 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between ${heroMeta} ${heroHalo}`}>
          <p>
            <span className="mr-2.5">{identity.index}</span>
            <span className="whitespace-nowrap">{identity.name}</span> /{" "}
            <span className="whitespace-nowrap">{identity.role}</span>
          </p>
          <p className="sm:text-right">
            {place.location} / {place.edition}
          </p>
        </div>

        <div className={`flex flex-1 flex-col gap-5 py-8 md:gap-8 md:py-[clamp(2rem,6vh,4.5rem)] lg:py-[clamp(1.5rem,5vh,4.5rem)] ${columns}`}>
          <div className="flex flex-col gap-5 md:gap-8 lg:gap-[clamp(1rem,2.6vh,2rem)] lg:self-center">
            <HeroStatement />

            <p
              data-hero-enter
              className={`max-w-[34rem] text-[clamp(1rem,1.2vw,1.25rem)] leading-[1.45] text-gray md:max-w-none ${heroHalo}`}
            >
              {supporting.map((line, index) => (
                <span key={line} className="md:block">
                  {index > 0 ? " " : null}
                  {line}
                </span>
              ))}
            </p>
          </div>

          <HeroPractice className={`md:mt-auto md:self-end lg:mt-0 ${aside} ${heroHalo}`} />
        </div>

        <div data-hero-enter className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between lg:items-end ${columns} ${heroHalo}`}>
          <p className={`flex items-center gap-2 ${heroMeta}`}>
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-secondary" />
            {availability}
          </p>

          {/* The designed breaks hold from md; below that the sentence wraps on its own. */}
          <div data-field-quiet className={`md:mt-4 ${aside}`}>
            <p className={heroColumnLabel}>{annotation.label}</p>
            <p className={`mt-3 text-pretty leading-[1.5] text-white/80 ${heroColumnText}`}>
              {annotation.lines.map((line, index) => (
                <span key={line} className="md:block">
                  {index === 0 ? (
                    <span aria-hidden="true" className="mr-1 text-white sm:-ml-[0.9em] sm:mr-0 sm:inline-block sm:w-[0.9em]">
                      {annotation.marker}
                    </span>
                  ) : (
                    " "
                  )}
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      </HeroComposition>
    </section>
  );
}
