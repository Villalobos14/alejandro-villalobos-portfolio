import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import ProjectsLog from "@/components/projects/ProjectsLog";

export const metadata: Metadata = pageMetadata({
  title: "Projects | Alejandro Villalobos",
  description:
    "Selected product design, UX research and engineering case studies by Alejandro Villalobos, plus side projects and hackathons.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <ProjectsLog />;
}
