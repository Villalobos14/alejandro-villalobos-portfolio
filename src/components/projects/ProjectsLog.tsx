import PageShell from "@/components/system/PageShell";
import { siteLinks } from "@/lib/links";
import ProfessionalWork from "./ProfessionalWork";
import ProjectSection from "./ProjectSection";
import SideProjectsLog from "./SideProjectsLog";

const experimentLinks = ["github", "dribbble", "behance"].map((id) => siteLinks.find((link) => link.id === id)).filter((link) => link !== undefined);

export default function ProjectsLog() {
  return (
    <PageShell>
      <div className="page-container pb-20 pt-[calc(var(--page-mono-start)-19px)] md:pb-[140px]">
        <ProfessionalWork />
        <div className="mt-24 md:mt-[240px]">
          <ProjectSection id="side-projects" eyebrow="02 — Side projects & hackathons" count="5 entries" title="Side projects, logged." deck="Hackathons, open source and visual experiments. Open a row to see it.">
            <SideProjectsLog />
            <p className="mt-7 text-[15px] leading-[22px] text-accent-strong">
              More experiments on{" "}
              {experimentLinks.map((link, index) => <span key={link.id}>
                {index > 0 ? " · " : null}
                <a href={link.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center underline-offset-4 fine:hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{link.id === "github" ? "GitHub" : link.label}</a>
              </span>)}{" "}<span aria-hidden="true">→</span>
            </p>
          </ProjectSection>
        </div>
      </div>
    </PageShell>
  );
}
