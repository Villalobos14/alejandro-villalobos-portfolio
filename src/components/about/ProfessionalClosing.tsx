import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { closing } from "@/lib/about";
import { siteLinks } from "@/lib/links";
import { PROJECTS_ANCHOR } from "@/lib/projects";
import SectionHead from "./SectionHead";
import { UnderlinedPhrase } from "./sketches/Marks";
import { focusRing, labelCase, tone } from "./tone";

const resumeHref = siteLinks.find((link) => link.id === "resume")?.href ?? "/resume";

/** 05 — The problems I want to solve, then the way out of the page. */
export default function ProfessionalClosing() {
  return (
    <section aria-label="Direction" className="w-full px-[var(--page-gutter)]">
      <SectionHead index="05 — Direction" title={["The problems", "I want to solve."]} />

      <div className="mt-10 lg:mt-16 lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-9">
          <UnderlinedPhrase
            text={closing.statement}
            phrase={closing.emphasis}
            className="text-[clamp(1.75rem,3.6vw,3.5rem)] font-medium leading-[1.1] tracking-tight text-white"
          />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-5 lg:mt-20 lg:grid-cols-12">
        <div className="flex flex-col gap-2 lg:col-span-3">
          <h3 className={`${labelCase} ${tone.meta}`}>Where I want to go next</h3>
          <p className="font-[family-name:var(--font-hand)] text-2xl leading-none text-white/70">
            interests, not a track record
          </p>
        </div>
        <div className="lg:col-span-8 lg:col-start-5">
          <ul>
            {closing.interests.map((interest, index) => (
              <li
                key={interest}
                className="flex items-baseline gap-5 border-t border-gray/30 py-3 last:border-b sm:py-4"
              >
                <span className={`w-6 shrink-0 text-body ${tone.meta}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[clamp(1.375rem,2.4vw,2.25rem)] font-medium leading-tight tracking-tight text-white">
                  {interest}
                </span>
              </li>
            ))}
          </ul>
          <p className={`mt-4 max-w-xl text-body-lg ${tone.secondary}`}>{closing.interestsNote}</p>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-3 lg:mt-16">
        <TransitionLink
          href={PROJECTS_ANCHOR}
          data-cursor="Ver trabajo"
          className={`group inline-flex min-h-11 items-center gap-2 rounded-full bg-secondary px-5 text-label font-medium text-black transition-[filter] duration-200 fine:hover:brightness-110 ${focusRing}`}
        >
          View selected work
          <ArrowUpRightIcon
            aria-hidden="true"
            className="pointer-events-none size-4 transition-transform duration-200 fine:group-hover:-translate-y-0.5 fine:group-hover:translate-x-0.5"
          />
        </TransitionLink>
        <TransitionLink
          href={resumeHref}
          data-cursor="Ver resume"
          className={`group inline-flex min-h-11 items-center gap-2 rounded-full border border-gray/40 px-5 text-label text-white transition-colors duration-200 fine:hover:border-secondary fine:hover:bg-secondary/10 ${focusRing}`}
        >
          Read the resume
          <ArrowUpRightIcon
            aria-hidden="true"
            className="pointer-events-none size-4 transition-transform duration-200 fine:group-hover:-translate-y-0.5 fine:group-hover:translate-x-0.5"
          />
        </TransitionLink>
      </div>

      <div className="mt-16 lg:mt-24">
        <TransitionLink
          href="/fun"
          data-cursor="Ir a Fun"
          className={`group flex flex-col gap-6 border-t border-gray/40 pt-6 transition-colors duration-200 fine:hover:border-secondary lg:pt-8 ${focusRing}`}
        >
          <span className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 ${labelCase} ${tone.meta}`}>
            Next
            <span className="text-secondary">02 — The personal side</span>
          </span>
          <span className="flex items-end justify-between gap-6">
            <span className="text-[clamp(3.5rem,16vw,11rem)] font-medium leading-[0.9] tracking-tight text-white transition-colors duration-200 fine:group-hover:text-secondary">
              Fun
            </span>
            <ArrowRightIcon
              aria-hidden="true"
              className="pointer-events-none mb-3 size-8 shrink-0 text-white transition-transform duration-200 ease-out motion-reduce:transition-none fine:group-hover:translate-x-2 lg:size-12"
            />
          </span>
        </TransitionLink>
      </div>
    </section>
  );
}
