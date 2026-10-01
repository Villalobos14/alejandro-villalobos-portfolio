import type { MediaSource } from "@/components/media/Media";

export interface FeaturedProject {
  id: string;
  name: string;
  tags: string[];
  /**
   * Omit until the asset exists. `src` and `alt` travel together, so a
   * thumbnail cannot be added without describing what the screen shows.
   */
  media?: MediaSource;
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
    href: "/work/mlstoolbox",
    linkLabel: "Read case study",
  },
  {
    id: "02",
    name: "Ominio",
    tags: ["E-Learning Platform", "Gamification", "AI"],
    media: {
      src: "/ominiocoer.png",
      alt: "Ominio course dashboard on a laptop, showing a lesson progress bar, an XP counter and a list of unlocked modules",
    },
    href: "/work/ominio",
    linkLabel: "Read case study",
  },
  {
    id: "03",
    name: "Andanac",
    tags: ["Intranet redesign", "Nissan", "Web"],
    media: {
      src: "/nissan.png",
      alt: "Andanac dealer intranet home screen for Nissan, with a vehicle inventory table and a sidebar of monthly sales reports",
    },
    href: "/work/andanac",
    linkLabel: "Read case study",
  },
];

export const PROJECTS_SECTION_ID = "projects";
export const PROJECTS_ANCHOR = `/#${PROJECTS_SECTION_ID}`;
