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
      alt: "Three Ominio phone screens: a green splash screen, an \"Interview Ready\" page offering 5 to 30 minute mock interview sessions, and a home screen with a level badge, a 21-day streak and weekly progress figures",
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
      alt: "Andanac web page for Nissan headed \"Nissan presenta Xtremer\" over a close-up of an X-Trail headlight, with a banner reading \"16 años siendo líderes en la industria automotriz\"",
    },
    href: "/work/andanac",
    linkLabel: "Read case study",
  },
];

export const PROJECTS_SECTION_ID = "projects";
export const PROJECTS_ANCHOR = `/#${PROJECTS_SECTION_ID}`;
