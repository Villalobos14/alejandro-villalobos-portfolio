import MediaPlaceholder from "@/components/media/MediaPlaceholder";
import SectionHeader from "@/components/system/SectionHeader";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { homeHeroContent } from "@/lib/home-hero";
import {
  PROJECTS_SECTION_ID,
  featuredProjects,
  researchStudies,
  researchStudiesHeading,
  type FeaturedProject,
  type MetricShift,
} from "@/lib/projects";

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

const studyMetaClass =
  "font-mono text-[0.75rem] leading-none tracking-[0.06em] text-ink-muted";

/** Mono at the small size without the uppercase transform, so the Figma case stays. */
const eyebrowClass =
  "font-mono text-[0.6875rem] leading-none tracking-[0.04em] text-ink-muted";

function CaseLink({ href, label }: { href: string; label: string }) {
  return (
    <TransitionLink
      href={href}
      className={`mt-6 inline-flex min-h-11 items-center text-body text-ink ${focusStyles}`}
    >
      {label}
    </TransitionLink>
  );
}

function MetricShifts({ shifts }: { shifts: MetricShift[] }) {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      {shifts.map((shift) => (
        <p key={shift.label}>
          <span className="text-stat text-ink">
            {shift.from} → {shift.to}
          </span>
          <span className="mt-2 block text-body-s text-ink-secondary">{shift.label}</span>
        </p>
      ))}
    </div>
  );
}

function FeaturedCase({ project }: { project: FeaturedProject }) {
  return (
    <article className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="min-h-64">
        <MediaPlaceholder
          detail={project.coverSlot}
          seed={project.id}
          className="min-h-64 border border-border"
        />
      </div>
      <div className="min-w-0">
        <p className={eyebrowClass}>{project.eyebrow}</p>
        <h3 className="mt-3 text-h2 text-ink">
          {project.name}
          {project.subtitle ? (
            <>
              <br />
              {project.subtitle}
            </>
          ) : null}
        </h3>
        <p className="mt-4 max-w-prose text-body text-ink-secondary">{project.summary}</p>
        {project.shifts ? <MetricShifts shifts={project.shifts} /> : null}
        {project.note ? (
          <p className="mt-4 text-body-s text-ink-muted">{project.note}</p>
        ) : null}
        <CaseLink href={project.href} label={project.linkLabel} />
      </div>
    </article>
  );
}

function CaseCard({ project }: { project: FeaturedProject }) {
  return (
    <article className="flex h-full flex-col border-t border-border pt-8">
      <p className={eyebrowClass}>{project.eyebrow}</p>
      <h3 className="mt-3 text-h3 text-ink">{project.name}</h3>
      <p className="mt-3 max-w-prose text-body text-ink-secondary">{project.summary}</p>
      <CaseLink href={project.href} label={project.linkLabel} />
    </article>
  );
}

export default function Projects() {
  const [featured, ...rest] = featuredProjects;

  return (
    <section
      id={PROJECTS_SECTION_ID}
      aria-labelledby="selected-work-title"
      className="w-full min-w-0 scroll-mt-8 px-[var(--page-gutter)] py-16 sm:py-24"
    >
      <SectionHeader id="selected-work-title" title={homeHeroContent.intro} variant="strong" />
      {featured ? (
        <div className="mt-12">
          <FeaturedCase project={featured} />
        </div>
      ) : null}
      <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
        {rest.map((project) => (
          <CaseCard key={project.id} project={project} />
        ))}
      </div>
      <div className="mt-16 sm:mt-24">
        <h3 className="text-h4 text-ink">{researchStudiesHeading}</h3>
        <ul className="mt-6 border-t border-border">
          {researchStudies.map((study) => (
            <li
              key={study.id}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-start gap-x-3 border-b border-border py-4 sm:gap-x-6"
            >
              <span className="text-mono text-ink">{study.id}</span>
              <span className="min-w-0">
                <span className="block text-h4 text-ink">{study.title}</span>
                <span className="mt-1 block text-body text-ink-secondary">{study.summary}</span>
                <span className={`mt-2 block ${studyMetaClass}`}>{study.meta}</span>
              </span>
              <span aria-hidden="true" className="text-body text-ink">
                →
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
