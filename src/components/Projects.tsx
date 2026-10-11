import Image from "next/image";
import { TransitionLink } from "@/components/curtain/TransitionLink";
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
    <div className="mt-8 flex flex-col gap-6">
      {shifts.map((shift) => (
        <p key={shift.label}>
          <span className="text-[20px] font-medium leading-none text-ink-muted line-through">
            {shift.from}
          </span>
          <span className="mx-2 text-[15px] text-ink-secondary" aria-hidden="true">
            →
          </span>
          <span className="text-[40px] font-medium leading-none text-ink">{shift.to}</span>
          <span className="mt-2 block text-[15px] leading-snug text-ink-secondary">{shift.label}</span>
        </p>
      ))}
    </div>
  );
}

function FeaturedCase({ project }: { project: FeaturedProject }) {
  return (
    <article className="grid overflow-hidden rounded-xl border border-border lg:grid-cols-[2fr_1fr]">
      <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-tint-ice to-tint-mint p-8">
        {/* TODO(content): Cover B — product still or the 6 s loop, without its own title. */}
        <p className="max-w-sm text-center text-mono text-ink-secondary">{project.coverSlot}</p>
      </div>
      <div className="min-w-0 bg-bg-subtle p-6 sm:p-8 lg:p-10">
        <p className={eyebrowClass}>{project.eyebrow}</p>
        <h3 className="mt-3 text-[40px] font-medium leading-[44px] tracking-[-0.025em] text-ink">
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
        {project.note ? <p className="mt-4 text-body-s text-ink-muted">{project.note}</p> : null}
        <CaseLink href={project.href} label={project.linkLabel} />
      </div>
    </article>
  );
}

function CaseCard({ project }: { project: FeaturedProject }) {
  const cover = project.media?.type === "image" ? project.media : null;

  return (
    <article className="flex h-full min-w-0 flex-col">
      {cover ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 636px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <p className={`mt-5 ${eyebrowClass}`}>{project.eyebrow}</p>
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
      className="w-full min-w-0 scroll-mt-8 px-[var(--page-gutter)] pb-16 pt-4 sm:pb-24"
    >
      {featured ? <FeaturedCase project={featured} /> : null}
      <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-16">
        {rest.map((project) => (
          <CaseCard key={project.id} project={project} />
        ))}
      </div>
      <div className="mt-16 sm:mt-24">
        <h3 className="text-mono text-ink-muted">{researchStudiesHeading}</h3>
        <ul className="mt-6 border-t border-border">
          {researchStudies.map((study) => (
            <li
              key={study.id}
              className="grid grid-cols-1 gap-y-1 border-b border-border py-4 lg:min-h-[73px] lg:grid-cols-[3.5rem_minmax(14rem,18rem)_minmax(0,1fr)_13.25rem_1.5rem] lg:items-center lg:gap-x-6 lg:py-0"
            >
              <span className="text-mono text-ink">{study.id}</span>
              <span className="text-[20px] font-medium leading-[28px] tracking-[-0.01em] text-ink">
                {study.title}
              </span>
              <span className="text-[15px] leading-snug text-ink-secondary">{study.summary}</span>
              <span className="text-mono text-ink-muted">{study.meta}</span>
              <span aria-hidden="true" className="text-body text-ink lg:text-right">
                →
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
