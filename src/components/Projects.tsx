"use client";

import { useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import {
  PROJECTS_SECTION_ID,
  featuredProjects,
  researchStudies,
  researchStudiesHeading,
  type FeaturedProject,
  type MetricShift,
  type ResearchStudy,
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
      className={`mt-3 inline-flex min-h-11 items-center text-[15px] leading-snug text-ink md:mt-6 md:text-body ${focusStyles}`}
    >
      {label}
    </TransitionLink>
  );
}

function MetricShifts({ shifts }: { shifts: MetricShift[] }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:mt-8 md:flex md:flex-col md:gap-6">
      {shifts.map((shift) => (
        <p key={shift.label} className="min-w-0">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[20px] font-medium leading-none text-ink-muted line-through">
              {shift.from}
            </span>
            <span className="text-[15px] text-ink-secondary" aria-hidden="true">
              →
            </span>
            <span className="text-[32px] font-medium leading-none text-ink md:text-[40px]">{shift.to}</span>
          </span>
          <span className="mt-2 block text-[15px] leading-snug text-ink-secondary">{shift.label}</span>
        </p>
      ))}
    </div>
  );
}

function FeaturedCase({ project }: { project: FeaturedProject }) {
  return (
    <article className="grid overflow-hidden rounded-xl border border-border lg:grid-cols-[2fr_1fr]">
      <div className="flex aspect-[16/10] min-h-0 items-center justify-center bg-gradient-to-br from-tint-ice to-tint-mint p-6 md:aspect-auto md:min-h-64 md:p-8">
        {/* TODO(content): Cover B — product still or the 6 s loop, without its own title. */}
        <p className="max-w-sm text-center text-mono text-ink-secondary">{project.coverSlot}</p>
      </div>
      <div className="min-w-0 bg-bg-subtle p-4 md:p-8 lg:p-10">
        <p className={eyebrowClass}>{project.eyebrow}</p>
        <h3 className="mt-2 text-[28px] font-medium leading-8 tracking-[-0.02em] text-ink md:mt-3 md:text-[40px] md:leading-[44px] md:tracking-[-0.025em]">
          {project.name}
          {project.subtitle ? (
            <>
              <br />
              {project.subtitle}
            </>
          ) : null}
        </h3>
        <p className="mt-2 max-w-prose text-[15px] leading-snug text-ink-secondary md:mt-4 md:text-body">
          {project.summary}
        </p>
        {project.shifts ? <MetricShifts shifts={project.shifts} /> : null}
        {project.note ? (
          <p className="mt-3 font-mono text-[11px] leading-snug tracking-[0.02em] text-ink-muted md:mt-4 md:font-sans md:text-body-s md:tracking-normal">
            {project.note}
          </p>
        ) : null}
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
            sizes="(min-width: 1024px) 636px, 85vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <p className={`mt-3 md:mt-5 ${eyebrowClass}`}>{project.eyebrow}</p>
      <h3 className="mt-2 text-[22px] font-medium leading-7 text-ink md:mt-3 md:text-h3">{project.name}</h3>
      <p className="mt-2 line-clamp-3 max-w-prose text-[15px] leading-snug text-ink-secondary md:mt-3 md:line-clamp-none md:text-body">
        {project.summary}
      </p>
      <CaseLink href={project.href} label={project.linkLabel} />
    </article>
  );
}

function CaseCarousel({ projects }: { projects: FeaturedProject[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = scroller.current;

    if (!el) return;

    const cards = Array.from(el.querySelectorAll("article"));
    let next = 0;

    cards.forEach((card, cardIndex) => {
      if (card instanceof HTMLElement && card.offsetLeft - el.offsetLeft <= el.scrollLeft + 24) {
        next = cardIndex;
      }
    });
    setIndex(next);
  };

  return (
    <>
      <div
        ref={scroller}
        onScroll={onScroll}
        className="mobile-bleed mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:mt-12 md:grid md:snap-none md:grid-cols-2 md:gap-12 md:overflow-visible md:pb-0 lg:mt-16 lg:gap-x-20 lg:gap-y-16"
      >
        {projects.map((project) => (
          <div key={project.id} className="w-[85%] shrink-0 snap-start md:w-auto md:shrink">
            <CaseCard project={project} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-2 md:hidden" aria-hidden="true">
        {projects.map((project, dotIndex) => (
          <span
            key={project.id}
            className={`size-1.5 rounded-full ${dotIndex === index ? "bg-ink" : "bg-border"}`}
          />
        ))}
      </div>
    </>
  );
}

function StudyRow({ study }: { study: ResearchStudy }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-border">
      <button
        type="button"
        className={`flex min-h-16 w-full items-center gap-3 py-2 text-left md:hidden ${focusStyles}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="w-8 shrink-0 text-mono text-ink">{study.id}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-medium leading-6 text-ink">{study.title}</span>
          <span className="mt-0.5 block text-mono-s text-ink-muted">{study.meta}</span>
        </span>
        <ChevronDownIcon
          aria-hidden="true"
          className={`size-5 shrink-0 text-ink-muted transition-transform duration-300 motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p aria-hidden={open ? undefined : true} className="pb-3 pl-11 text-[15px] leading-snug text-ink-secondary">
            {study.summary}
          </p>
        </div>
      </div>
      <div className="hidden gap-y-1 py-4 md:grid lg:min-h-[73px] lg:grid-cols-[3.5rem_minmax(14rem,18rem)_minmax(0,1fr)_13.25rem_1.5rem] lg:items-center lg:gap-x-6 lg:py-0">
        <span className="text-mono text-ink">{study.id}</span>
        <span className="text-[20px] font-medium leading-[28px] tracking-[-0.01em] text-ink">{study.title}</span>
        <span className="text-[15px] leading-snug text-ink-secondary">{study.summary}</span>
        <span className="text-mono text-ink-muted">{study.meta}</span>
        <span aria-hidden="true" className="text-body text-ink lg:text-right">
          →
        </span>
      </div>
    </li>
  );
}

export default function Projects() {
  const [featured, ...rest] = featuredProjects;

  return (
    <section
      id={PROJECTS_SECTION_ID}
      aria-labelledby="selected-work-title"
      className="w-full min-w-0 scroll-mt-8 pb-6 pt-2 md:pb-16 md:pt-4 lg:pb-24"
    >
      {featured ? <FeaturedCase project={featured} /> : null}
      <CaseCarousel projects={rest} />
      <div className="mt-8 md:mt-16 lg:mt-24">
        <h3 className="text-mono text-ink-muted">{researchStudiesHeading}</h3>
        <ul className="mt-4 border-t border-border md:mt-6">
          {researchStudies.map((study) => (
            <StudyRow key={study.id} study={study} />
          ))}
        </ul>
      </div>
    </section>
  );
}
