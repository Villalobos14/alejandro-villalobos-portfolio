import Media from "@/components/media/Media";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import MaskedLines from "@/components/ui/MaskedLines";
import Reveal from "@/components/ui/Reveal";
import type { CaseStudyFrontmatter } from "@/lib/case-studies";
import { PROJECTS_ANCHOR } from "@/lib/projects";

interface CaseStudyHeroProps {
  frontmatter: CaseStudyFrontmatter;
}

export default function CaseStudyHero({ frontmatter }: CaseStudyHeroProps) {
  const meta = [
    { label: "Role", value: frontmatter.role },
    { label: "Period", value: frontmatter.timeline },
    { label: "Team", value: frontmatter.team },
    { label: "Client", value: frontmatter.client },
  ].filter((item): item is { label: string; value: string } =>
    Boolean(item.value),
  );

  return (
    <header className="flex flex-col gap-scale pt-scale">
      <TransitionLink
        href={PROJECTS_ANCHOR}
        data-cursor="Volver a proyectos"
        className="group flex w-fit items-center gap-2 text-label text-gray transition-colors duration-300 fine:hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <ArrowLeftIcon
          aria-hidden="true"
          className="pointer-events-none size-4 transition-transform duration-500 ease-out fine:group-hover:-translate-x-1"
        />
        Back to projects
      </TransitionLink>

      <MaskedLines
        as="h1"
        lines={[frontmatter.title]}
        className="w-full text-[clamp(1.875rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-tight text-white"
      />

      <ul className="flex flex-wrap gap-2">
        {frontmatter.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-gray/60 px-3 py-1 text-body text-gray"
          >
            {skill}
          </li>
        ))}
      </ul>

      <Reveal>
        <dl className="grid grid-cols-2 gap-scale border-y border-gray/40 py-scale lg:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <dt className="text-body text-gray">{item.label}</dt>
              <dd className="text-label text-white">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-gray/40">
          <Media
            source={frontmatter.cover}
            sizes="(max-width: 1024px) 100vw, 70vw"
            priority
            placeholder={{
              index: frontmatter.type,
              title: `${frontmatter.title} cover`,
              detail: frontmatter.summary || undefined,
              footer: "Cover in progress",
              seed: frontmatter.slug,
            }}
          />
        </div>
      </Reveal>
    </header>
  );
}
