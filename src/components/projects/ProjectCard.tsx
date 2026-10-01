import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import Media from "@/components/media/Media";
import type { FeaturedProject } from "@/lib/projects";

interface ProjectCardProps {
  project: FeaturedProject;
  isStacked: boolean;
}

const linkStyles =
  "group/link mt-auto flex w-fit items-center gap-2 text-label text-white transition-colors duration-300 fine:hover:text-secondary focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export default function ProjectCard({ project, isStacked }: ProjectCardProps) {
  return (
    <article
      className={`flex w-full flex-col overflow-hidden rounded-2xl border border-gray/40 bg-primary lg:flex-row ${
        isStacked
          ? "h-[min(40rem,calc(100svh-var(--dock-clearance)-4rem))]"
          : ""
      }`}
    >
      <div className="flex min-w-0 flex-col gap-scale p-scale lg:w-[40%] lg:p-8">
        <p className="text-body uppercase tracking-[0.2em] text-gray">
          {project.id}
        </p>
        {/*
          The jump from text-3xl to md:text-4xl left the title filling its
          column at mid widths. A fluid size keeps it clear of the padding,
          and the column is narrowest from lg up, where it is only 40% of the
          card. break-words covers a future name with no place to wrap.
        */}
        <h3 className="text-balance break-words text-[clamp(1.5rem,3.2vw,2.25rem)] font-medium leading-tight text-white">
          {project.name}
        </h3>
        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-gray/60 px-3 py-1 text-body text-gray"
            >
              {tag}
            </li>
          ))}
        </ul>
        <TransitionLink
          href={project.href}
          data-cursor={project.linkLabel}
          className={linkStyles}
        >
          {project.linkLabel}
          <ArrowUpRightIcon
            aria-hidden="true"
            className="pointer-events-none size-4 transition-transform duration-500 ease-out fine:group-hover/link:translate-x-1 fine:group-hover/link:-translate-y-1"
          />
        </TransitionLink>
      </div>

      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-primary lg:aspect-auto lg:h-auto lg:w-[60%]">
        {/*
          The card already states the index and the tags in the column to the
          left, so the placeholder carries only the glyph field and the status
          line. Case-study slots stand alone and do pass them.
        */}
        <Media
          source={project.media}
          sizes="(max-width: 1024px) 100vw, 60vw"
          placeholder={{
            footer: "Case visuals in progress",
            seed: project.href,
          }}
        />
      </div>
    </article>
  );
}
