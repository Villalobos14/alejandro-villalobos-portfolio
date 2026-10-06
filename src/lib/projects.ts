import type { MediaSource } from "@/components/media/Media";

export type ContentSide = "left" | "right";

export interface ProjectMetric {
  value: string;
  label: string;
}

/**
 * One cover structure for every featured case study. Every card fills the
 * same slots: index, title, summary, category line, meta chips and the CTA.
 * The optional fields only appear once the data behind them exists.
 */
export interface FeaturedProject {
  id: string;
  name: string;
  /** Set as a second, quieter title line. */
  subtitle?: string;
  /** One or two sentences on what the work actually was. */
  summary: string;
  /** The uppercase category line: disciplines or the kind of work. */
  category: string[];
  /** Short facts set as chips: stack, year, role or context. */
  meta: string[];
  /**
   * Validated outcomes only, two or three of them. Omit rather than fill the
   * slot, and say in the label when a figure comes from a test, not production.
   */
  metrics?: ProjectMetric[];
  /** Estimated reading time of the case study. Omit while it is unwritten. */
  readMinutes?: number;
  /** Where the text sits on the cover. The media keeps the other side open. */
  contentSide: ContentSide;
  /**
   * Fills the whole card. Omit until the asset exists. `src` and `alt` travel
   * together, so a cover cannot be added without describing what it shows.
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
    name: "MLSToolbox",
    subtitle: "CodeAssessment",
    summary:
      "Designing and building a workflow that takes ML engineers from an unfamiliar Python repository to prioritized, file-level issues backed by evidence.",
    category: ["Product Design", "Software Engineering"],
    meta: ["Python", "Angular", "Flask", "AST"],
    // Task figures come from two moderated rounds of six participants each.
    metrics: [
      { value: "12", label: "Analyzers" },
      { value: "5/6", label: "Moderated task success" },
      { value: "4:18", label: "Median task time" },
    ],
    // About 2,300 words of prose at the case-study route.
    readMinutes: 10,
    contentSide: "left",
    href: "/work/mlstoolbox",
    linkLabel: "Read case study",
  },
  // PLACEHOLDER copy until this case study is written. Media and route are
  // the existing ones.
  {
    id: "02",
    name: "Project Title Two",
    summary:
      "A concise description of the project, the problem space, and the type of product or system explored.",
    category: ["Product Design", "Research"],
    meta: ["2026", "Product Design", "Research"],
    contentSide: "right",
    media: {
      type: "image",
      src: "/ominiocoer.png",
      alt: "Three Ominio phone screens: a green splash screen, an \"Interview Ready\" page offering 5 to 30 minute mock interview sessions, and a home screen with a level badge, a 21-day streak and weekly progress figures",
    },
    href: "/work/ominio",
    linkLabel: "Read case study",
  },
  // PLACEHOLDER copy until this case study is written. Media and route are
  // the existing ones.
  {
    id: "03",
    name: "Project Title Three",
    summary:
      "A concise description of the project, the product context, and the main design challenge.",
    category: ["Product Design", "Systems"],
    meta: ["2026", "Product Design", "Systems"],
    contentSide: "left",
    media: {
      type: "image",
      src: "/nissan.png",
      alt: "Andanac web page for Nissan headed \"Nissan presenta Xtremer\" over a close-up of an X-Trail headlight, with a banner reading \"16 años siendo líderes en la industria automotriz\"",
    },
    href: "/work/andanac",
    linkLabel: "Read case study",
  },
];

export const PROJECTS_SECTION_ID = "projects";
export const PROJECTS_ANCHOR = `/#${PROJECTS_SECTION_ID}`;
