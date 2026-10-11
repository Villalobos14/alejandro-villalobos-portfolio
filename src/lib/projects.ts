import type { MediaSource } from "@/components/media/Media";

export type ContentSide = "left" | "right";

export interface ProjectMetric {
  value: string;
  label: string;
}

/** A before → after figure on the home MLS card. */
export interface MetricShift {
  from: string;
  to: string;
  label: string;
}

export interface ResearchStudy {
  id: string;
  title: string;
  summary: string;
  meta: string;
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
  /** Home card eyebrow, e.g. "01 · ML tooling · 2025". */
  eyebrow: string;
  /** Before → after figures. The case study keeps its own metric strings. */
  shifts?: MetricShift[];
  note?: string;
  /** Placeholder label until a cover still or loop is supplied. */
  coverSlot?: string;
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
    name: "MLSToolbox —",
    subtitle: "CodeAssessment",
    eyebrow: "01 · ML tooling · 2025",
    summary:
      "From a single code-quality score to prioritized, file-level issues that ML engineers can act on.",
    category: ["Product Design", "Software Engineering"],
    meta: ["Python", "Angular", "Flask", "AST"],
    coverSlot:
      "Visual slot — Cover B · Product or the 6 s loop, without its own title",
    media: {
      type: "image",
      src: "/case-studies/cover-a2-metrics.png",
      alt: "MLSToolbox CodeAssessment cover titled From metrics to next steps",
    },
    shifts: [
      {
        from: "10:52",
        to: "4:18",
        label: "Median time to first actionable issue",
      },
      { from: "2/6", to: "5/6", label: "Task success" },
    ],
    note: "2 moderated rounds · n = 6 each · directional",
    // About 2,300 words of prose at the case-study route.
    readMinutes: 10,
    contentSide: "left",
    href: "/work/mlstoolbox",
    linkLabel: "Read case study →",
  },
  // Media and route are the existing ones. The card copy is the Figma line.
  {
    id: "02",
    name: "Ominio",
    eyebrow: "02 · EdTech · DaCodes",
    summary:
      "A gamified, AI-driven soft-skills app for students and early-career professionals.",
    category: ["Product Design", "Research"],
    meta: ["2026", "Product Design", "Research"],
    contentSide: "right",
    media: {
      type: "image",
      src: "/ominiocoer.png",
      alt: "Three Ominio phone screens: a green splash screen, an \"Interview Ready\" page offering 5 to 30 minute mock interview sessions, and a home screen with a level badge, a 21-day streak and weekly progress figures",
    },
    href: "/work/ominio",
    linkLabel: "Read case study →",
  },
  // Media and route are the existing ones. The card copy is the Figma line.
  {
    id: "03",
    name: "Nissan intranet",
    eyebrow: "03 · Enterprise · DaCodes",
    summary:
      "An internal intranet redesign: workflows, a design system and ~150–200 responsive screens.",
    category: ["Product Design", "Systems"],
    meta: ["2026", "Product Design", "Systems"],
    contentSide: "left",
    media: {
      type: "image",
      src: "/nissan.png",
      alt: "Andanac web page for Nissan headed \"Nissan presenta Xtremer\" over a close-up of an X-Trail headlight, with a banner reading \"16 años siendo líderes en la industria automotriz\"",
    },
    href: "/work/andanac",
    linkLabel: "Read case study →",
  },
];

export const researchStudiesHeading = "Research studies · HSBC";

/**
 * Compact rows under the featured cases. No routes exist for these studies,
 * so the home rows are not links.
 */
export const researchStudies: ResearchStudy[] = [
  {
    id: "04",
    title: "HSBC Benefits Hub",
    summary:
      "Benchmarking points value, expiration and redemption across channels.",
    meta: "UX research · Benchmark",
  },
  {
    id: "05",
    title: "Multifunctional ATM study",
    summary: "Mapping the cash-deposit journey across five Mexican banks.",
    meta: "UX research · Field",
  },
  {
    id: "06",
    title: "Mobile Security Benchmark",
    summary: "Biometrics, device binding and security centers in banking apps.",
    meta: "UX research · Benchmark",
  },
];

export const PROJECTS_SECTION_ID = "projects";
export const PROJECTS_ANCHOR = `/#${PROJECTS_SECTION_ID}`;

export interface ProjectLogCard {
  id: string;
  name: string;
  summary: string;
  meta: string;
  href?: string;
  cover: { src: string; alt: string; width: number; height: number };
}

const logCovers: Record<string, ProjectLogCard["cover"]> = {
  "01": { src: "/projects/cover-mlstoolbox.svg", alt: "MLSToolbox findings card grouping actionable issues by file", width: 448, height: 400 },
  "02": { src: "/projects/cover-ominio.png", alt: "Two Ominio phones showing the splash screen and learning dashboard", width: 448, height: 336 },
  "03": { src: "/projects/cover-nissan.svg", alt: "Nissan intranet screen system with a selected screen among the grid", width: 448, height: 300 },
  "04": { src: "/projects/cover-hsbc-benefits.svg", alt: "Benefits benchmark comparing points value across four banks", width: 448, height: 336 },
  "05": { src: "/projects/cover-atm.svg", alt: "Cash-deposit journey mapped across five banks", width: 448, height: 260 },
  "06": { src: "/projects/cover-mobile-security.svg", alt: "Biometric confirmation prompt with a security shield", width: 448, height: 300 },
};

/** Shared copy stays in the Home records; this route only supplies cover artwork. */
export const projectLogCards: ProjectLogCard[] = [
  ...featuredProjects.map((project) => ({
    id: project.id,
    name: [project.name, project.subtitle].filter(Boolean).join(" "),
    summary: project.summary,
    meta: project.eyebrow.replace(/^\d+ · /, ""),
    href: project.href,
    cover: logCovers[project.id],
  })),
  ...researchStudies.map((study) => ({
    id: study.id,
    name: study.title,
    summary: study.summary,
    meta: study.meta,
    cover: logCovers[study.id],
  })),
];

export const additionalProfessionalProject: ProjectLogCard = {
  id: "dasoft",
  name: "Dasoft",
  meta: "Design system · DaCodes",
  summary: "An internal people and project platform: ~120 screens and a design system built nearly from scratch.",
  href: "https://www.figma.com/design/o0aDAZt693xMPJicOBpZ23/DASOFT-ALEJANDRO-VILLALOBOS?node-id=2235-237368",
  cover: { src: "/dasoftmock.png", alt: "Dasoft technology directory and Volkswagen client administration screens", width: 120, height: 80 },
};
