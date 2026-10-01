import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import StackedProjects from "./projects/StackedProjects";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { PROJECTS_SECTION_ID, featuredProjects } from "@/lib/projects";

export default function Projects() {
  return (
    <section
      id={PROJECTS_SECTION_ID}
      aria-label="Selected works"
      className="flex w-full flex-col gap-stack scroll-mt-[var(--site-header-h)] px-[var(--page-gutter)]"
    >
      <Reveal>
        <SectionHeading
          lines={["Selected", "works"]}
          aside={<p>21&apos;–24&apos;</p>}
        />
      </Reveal>
      <StackedProjects projects={featuredProjects} />
      <Reveal className="flex justify-center">
        <TransitionLink
          href="/projects"
          data-cursor="Ver más proyectos"
          className="rounded-full bg-secondary px-8 py-4 text-label text-black transition-colors duration-300 fine:hover:bg-[#216d34] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          See more
        </TransitionLink>
      </Reveal>
    </section>
  );
}
