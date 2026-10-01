export interface FeaturedProject {
  id: string;
  name: string;
  tags: string[];
  image?: string;
  imageAlt: string;
  href: string;
  linkLabel: string;
}

/**
 * Exactly three featured projects render on the Home stack.
 * Each entry points at an internal case-study route.
 */
export const featuredProjects: FeaturedProject[] = [
  {
    id: "01",
    name: "MLSToolbox — CodeAssessment",
    tags: ["Static analysis", "Python", "Research software"],
    imageAlt: "MLSToolbox CodeAssessment",
    href: "/work/mlstoolbox",
    linkLabel: "Read case study",
  },
  {
    id: "02",
    name: "Ominio",
    tags: ["E-Learning Platform", "Gamification", "AI"],
    image: "/ominiocoer.png",
    imageAlt: "Ominio landing page mockup",
    href: "/work/ominio",
    linkLabel: "Read case study",
  },
  {
    id: "03",
    name: "Andanac",
    tags: ["Intranet redesign", "Nissan", "Web"],
    image: "/nissan.png",
    imageAlt: "Andanac intranet redesign mockup for Nissan",
    href: "/work/andanac",
    linkLabel: "Read case study",
  },
];

export const PROJECTS_SECTION_ID = "projects";
export const PROJECTS_ANCHOR = `/#${PROJECTS_SECTION_ID}`;
