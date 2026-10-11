import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import AboutSwitch from "@/components/system/AboutSwitch";
import ProjectRow from "@/components/system/ProjectRow";
import SectionHeader from "@/components/system/SectionHeader";
import TopBar from "@/components/system/TopBar";
import { featuredProjects, type FeaturedProject } from "@/lib/projects";

export const metadata: Metadata = {
  title: "System",
  robots: { index: false, follow: false },
};

function yearOf(meta: string[]): string | undefined {
  return meta.find((item) => /^\d{4}$/.test(item));
}

function coverOf(project: FeaturedProject): { src: string; alt: string } | undefined {
  if (project.media?.type !== "image") return undefined;

  return { src: project.media.src, alt: project.media.alt };
}

export default function SystemPage() {
  if (headers().get("x-system-preview") !== "1") notFound();

  const sideSample = featuredProjects[0];

  return (
    <div className="bg-bg text-ink">
      <TopBar />
      <div className="mx-auto flex w-full max-w-content flex-col gap-16 px-[var(--page-gutter)] py-16">
        <section className="flex flex-col gap-6">
          <SectionHeader eyebrow="Navigation" title="About switch" variant="subtle" />
          <AboutSwitch />
        </section>
        <section className="flex flex-col gap-6">
          <SectionHeader eyebrow="01 — Professional work" title="Log" variant="strong" />
          {featuredProjects.map((project) => (
            <ProjectRow
              key={project.id}
              index={project.id}
              title={project.subtitle ? `${project.name} ${project.subtitle}` : project.name}
              role={project.category.join(", ")}
              year={yearOf(project.meta)}
              tone="professional"
              summary={project.summary}
              cover={coverOf(project)}
            />
          ))}
        </section>
        <section className="flex flex-col gap-6">
          <SectionHeader eyebrow="02 — Side projects" title="Log" variant="subtle" />
          <p className="text-mono text-ink-muted">TODO(content)</p>
          {sideSample ? (
            <ProjectRow
              index={sideSample.id}
              title={sideSample.name}
              role={sideSample.category.join(", ")}
              year={yearOf(sideSample.meta)}
              tone="side"
              summary={sideSample.summary}
              cover={coverOf(sideSample)}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}
