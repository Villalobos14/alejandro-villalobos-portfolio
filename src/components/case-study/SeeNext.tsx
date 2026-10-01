import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import {
  SEE_NEXT_SECTION_ID,
  type CaseStudyFrontmatter,
} from "@/lib/case-studies";

interface SeeNextProps {
  caseStudy: CaseStudyFrontmatter;
}

export default function SeeNext({ caseStudy }: SeeNextProps) {
  return (
    <TransitionLink
      id={SEE_NEXT_SECTION_ID}
      href={`/work/${caseStudy.slug}`}
      data-cursor="Ver case study"
      className="group flex w-full scroll-mt-[var(--site-header-h)] flex-col gap-scale rounded-2xl border border-gray/40 p-scale transition-transform duration-500 ease-out fine:hover:rotate-[0.5deg] fine:hover:scale-[0.99] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:p-12"
    >
      <span className="text-body uppercase tracking-[0.2em] text-gray">
        Next project
      </span>
      <span className="flex flex-wrap items-center gap-scale text-[clamp(1.75rem,5vw,3.5rem)] font-medium leading-tight tracking-tight text-white transition-colors duration-300 fine:group-hover:text-secondary">
        {caseStudy.title}
        <ArrowRightIcon
          aria-hidden="true"
          className="pointer-events-none size-8 shrink-0 transition-transform duration-500 ease-out fine:group-hover:translate-x-2"
        />
      </span>
    </TransitionLink>
  );
}
