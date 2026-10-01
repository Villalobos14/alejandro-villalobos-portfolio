import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import StackedProjects from "./projects/StackedProjects";
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
          aside={<p>&apos;21–&apos;24</p>}
        />
      </Reveal>
      <StackedProjects projects={featuredProjects} />
    </section>
  );
}
