import Image from "next/image";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { HOVER_DOT, POP_GROUP, ROW_TINT, popForIndex, type Pop } from "@/components/system/palette";
import Reveal from "@/components/ui/Reveal";
import { REVEAL_STAGGER_MS } from "@/lib/motion";
import { additionalProfessionalProject, projectLogCards, type ProjectLogCard } from "@/lib/projects";
import ProjectSection from "./ProjectSection";

const focusStyles = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

function Caption({ project, pop }: { project: ProjectLogCard; pop: Pop }) {
  return (
    <>
      <h3 className="relative text-[15px] font-medium leading-[22px]">
        <span aria-hidden="true" className={`${HOVER_DOT} ${pop.dot}`} />
        {project.name}<span className="font-normal text-ink-muted">{"  /  "}{project.meta}</span>
      </h3>
      <p className="mt-1 text-[14px] leading-[21px] text-ink-secondary">{project.summary}</p>
    </>
  );
}

function ProjectCard({ project, index }: { project: ProjectLogCard; index: number }) {
  const content = (
    <>
      <div className="overflow-hidden rounded-md bg-bg-subtle">
        <Image {...project.cover} alt={project.cover.alt} priority={index < 2} sizes="(min-width: 1440px) 44vw, (min-width: 768px) 45vw, 90vw" className="h-auto w-full transition-transform duration-300 fine:group-hover:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none" />
      </div>
      <div className="mt-[14px]"><Caption project={project} pop={popForIndex(index)} /></div>
    </>
  );

  return (
    <Reveal delayMs={index * REVEAL_STAGGER_MS}>
      <article data-professional-project={project.id} className={`${POP_GROUP} min-w-0`}>
        {project.href ? <TransitionLink href={project.href} className={`group block rounded-md ${focusStyles}`}>{content}</TransitionLink> : content}
      </article>
    </Reveal>
  );
}

export default function ProfessionalWork() {
  const dasoft = additionalProfessionalProject;
  const dasoftPop = popForIndex(projectLogCards.length);

  return (
    <ProjectSection id="professional-work" eyebrow="01 — Professional work" count="6 projects" title="Case studies & research." deck="Product design and UX research at DaCodes, GESSI · UPC Barcelona and HSBC." first>
      <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-x-8">
        {[0, 1].map((column) => (
          <div key={column} className="flex min-w-0 flex-col gap-12">
            {projectLogCards.map((project, index) => index % 2 === column ? <ProjectCard key={project.id} project={project} index={index} /> : null)}
          </div>
        ))}
      </div>
      <div className="mt-12">
        <p className="text-mono text-ink-muted">Also at DaCodes</p>
        <a href={dasoft.href} target="_blank" rel="noreferrer" data-hairline="dasoft" className={`${POP_GROUP} ${ROW_TINT} ${dasoftPop.rowTint} mt-[14px] grid grid-cols-[minmax(0,1fr)_44px] items-center gap-x-5 gap-y-4 border-t border-border pt-4 md:grid-cols-[13.05%_minmax(0,1fr)_44px] ${focusStyles}`}>
          <Image {...dasoft.cover} alt={dasoft.cover.alt} sizes="(min-width: 768px) 12vw, 120px" className="col-span-2 aspect-[3/2] h-auto w-[120px] rounded-[3px] object-cover md:col-span-1 md:w-full" />
          <div><Caption project={dasoft} pop={dasoftPop} /></div>
          <span aria-hidden="true" className="text-right text-[20px] text-accent-strong">→</span>
        </a>
      </div>
    </ProjectSection>
  );
}
