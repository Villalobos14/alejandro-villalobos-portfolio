import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { aboutHero } from "@/lib/about";
import { profile } from "@/lib/professional";
import AboutSubNav from "./AboutSubNav";
import { HeroDiagram, HeroDiagramCompact } from "./sketches/ThinkingDiagram";
import { focusRing, labelCase, tone } from "./tone";

/**
 * 01 — Beyond the interface. Every word is readable on the first render; only
 * the sketch beside it draws itself in.
 */
function CaseStudyLink() {
  const { caseStudy } = aboutHero;

  return (
    <TransitionLink
      href={caseStudy.href}
      data-cursor="Ver caso"
      className={`group mt-2 flex max-w-md flex-col gap-1 border-t border-gray/30 pt-4 ${focusRing}`}
    >
      <span className={`${labelCase} ${tone.meta}`}>Case study</span>
      <span className="inline-flex min-h-11 items-center gap-2 text-label text-white underline decoration-white/30 underline-offset-4 transition-colors duration-200 fine:group-hover:text-secondary fine:group-hover:decoration-secondary">
        {caseStudy.title}
        <ArrowUpRightIcon
          aria-hidden="true"
          className="pointer-events-none size-4 shrink-0 transition-transform duration-200 fine:group-hover:-translate-y-0.5 fine:group-hover:translate-x-0.5"
        />
      </span>
      <span className={`text-body ${tone.secondary}`}>{caseStudy.summary}</span>
    </TransitionLink>
  );
}

export default function ProfessionalHero() {
  return (
    <header className="grid w-full grid-cols-1 gap-y-10 overflow-x-clip px-[var(--page-gutter)] pt-scale text-white lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
      <div className="flex flex-col gap-scale lg:col-span-6 lg:pt-[6vh]">
        <p className={`flex items-center gap-3 ${labelCase} ${tone.meta}`}>
          <span aria-hidden="true" className="h-px w-8 shrink-0 bg-secondary" />
          {aboutHero.index}
        </p>
        <h1 className="text-[clamp(2.5rem,12.5vw,6rem)] font-medium leading-[0.95] tracking-tight lg:text-[clamp(4rem,6.3vw,7.25rem)]">
          <span className="block">{aboutHero.title[0]}</span>
          <span className="block">
            {aboutHero.title[1]}
            <span className="text-secondary">.</span>
          </span>
        </h1>
        <div className="mt-3 flex flex-col gap-5 lg:mt-8 lg:gap-6">
          <p className="max-w-xl text-[clamp(1.25rem,1.7vw,1.625rem)] leading-snug text-white">
            {aboutHero.intro}
          </p>
          <p className={`max-w-lg text-base leading-7 sm:text-body-lg ${tone.secondary}`}>{aboutHero.support}</p>
          <p className={`${labelCase} ${tone.meta}`}>
            Based in {profile.location}
            <span aria-hidden="true" className="px-2 text-secondary">
              ·
            </span>
            {profile.availability}
          </p>
          <div className="w-fit">
            <AboutSubNav active="professional" />
          </div>
          <CaseStudyLink />
        </div>
      </div>

      <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
        <HeroDiagram className="mx-auto hidden w-full max-w-[640px] md:block lg:mr-0 2xl:max-w-[720px]" />
        <HeroDiagramCompact className="mx-auto w-full max-w-[420px] md:hidden" />
      </div>
    </header>
  );
}
