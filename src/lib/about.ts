/**
 * Copy and structure for /about ("The thinking canvas"). Facts come from
 * src/lib/professional.ts; this file only adds framing, grouping and the
 * margin notes, so nothing here should claim experience the data does not.
 */
import {
  experience,
  findSkillGroup,
  researchContract,
  type ExperienceEntry,
} from "./professional";

export const aboutHero = {
  index: "01 — The professional side",
  title: ["Beyond", "the interface"] as [string, string],
  intro:
    "I’m a Product Designer with a background in software engineering and UX research.",
  support:
    "I work across research, design, and engineering to make complex products easier to understand, use, and build.",
  /** The one case study that shows this way of working end to end. */
  caseStudy: {
    href: "/work/mlstoolbox",
    title: "MLSToolbox — CodeAssessment",
    // From the case study summary (src/content/case-studies/mlstoolbox.mdx).
    summary: "Redesigned and built a workflow for engineers assessing ML pipelines, with GESSI at UPC Barcelona.",
  },
};

/** Sets up the loop without repeating the hero or the capability leads. */
export const thinkingLead =
  "Five habits rather than five steps. Any of them can send me back to the first question.";

export const experienceLead =
  "Each role added a layer. The notes in the margin are what it changed in how I work.";

export type StageId = "question" | "understand" | "connect" | "make" | "challenge";

export interface ThinkingStage {
  id: StageId;
  number: string;
  title: string;
  question: string;
  body: string;
  /** Plain-language description of the sketch, for screen readers. */
  sketchLabel: string;
  /** Shows the way back to stage 01 on the process rail. */
  loopsBack?: boolean;
}

export const thinkingStages: ThinkingStage[] = [
  {
    id: "question",
    number: "01",
    title: "Question",
    question: "Are we solving the right problem?",
    body: "I try to understand what is actually being asked before committing to a solution.",
    sketchLabel:
      "A handwritten note asks “Are we solving the right problem?”, with “right problem” circled and an arrow to “for whom?”. A green note says “Start with curiosity.”",
  },
  {
    id: "understand",
    number: "02",
    title: "Understand",
    question: "What are people actually experiencing?",
    body: "I use research, observation, and evidence to understand how people interact with a product and where friction emerges.",
    sketchLabel:
      "Three interview notes with short quotes, a small scatter of data points with one outlier circled, and a green note: “workarounds = signal”.",
  },
  {
    id: "connect",
    number: "03",
    title: "Connect",
    question: "How do all these pieces fit together?",
    body: "I connect user needs, product goals, and technical constraints to identify where a meaningful design decision can happen.",
    sketchLabel:
      "A system map linking people, product, data, constraints and technology to one point marked “decided here”, with a note asking whether to go back to the first question.",
    loopsBack: true,
  },
  {
    id: "make",
    number: "04",
    title: "Make",
    question: "Turn understanding into something tangible.",
    body: "I translate ideas into flows, interactions, prototypes, and working solutions.",
    sketchLabel:
      "A rough hand-drawn wireframe of an internal tool that resolves into a clean interface with the same structure: sidebar, primary action and a status table.",
  },
  {
    id: "challenge",
    number: "05",
    title: "Challenge",
    question: "Does this actually work?",
    body: "I test assumptions, examine trade-offs, and refine decisions using evidence and feedback.",
    sketchLabel:
      "The finished interface reviewed against usability, clarity and feasibility, each checked, and evidence still open. A green arrow loops back to the start: “Keep improving.”",
    loopsBack: true,
  },
];

export interface CareerEntry {
  entry: ExperienceEntry;
  /** What the role added to how I work: the handwritten margin note. */
  note: string;
  disciplines: string[];
  mark: "circle" | "underline" | "arrow" | "bracket";
  caseStudy?: { href: string; label: string };
}

const byId = (id: string): ExperienceEntry => {
  const entry = experience.find((candidate) => candidate.id === id);

  if (!entry) throw new Error(`Unknown experience entry "${id}"`);

  return entry;
};

export const careerLayers: CareerEntry[] = [
  {
    entry: byId("01"),
    note: "Understanding complex systems.",
    disciplines: ["UX Research", "Data", "Service journeys"],
    mark: "circle",
  },
  {
    entry: researchContract,
    note: "Making technical work understandable.",
    disciplines: ["Software Engineering", "Developer tools", "Research"],
    mark: "underline",
    caseStudy: { href: "/work/mlstoolbox", label: "MLSToolbox — CodeAssessment case study" },
  },
  {
    entry: byId("02"),
    note: "From ideas to real products.",
    disciplines: ["Product Design", "Prototyping", "Design systems"],
    mark: "arrow",
  },
  {
    entry: byId("03"),
    note: "Working across disciplines.",
    disciplines: ["Interaction Design", "Information architecture", "Collaboration"],
    mark: "bracket",
  },
];

export interface CapabilityGroup {
  id: string;
  number: string;
  title: string;
  /** One line on why the group matters, not a claim of mastery. */
  lead: string;
  sets: { label: string; items: string[]; tone?: "exploring" }[];
}

/**
 * One line for one or more related skills from professional.ts, so near-
 * duplicates ("Product Design", "Interaction Design", "User Experience
 * Design") read as one capability. Every name is checked against the data.
 */
const skill = (groupId: string, names: string[], label?: string): string => {
  const skills = findSkillGroup(groupId).skills;

  names.forEach((name) => {
    if (!skills.includes(name)) throw new Error(`"${name}" is not in skill group "${groupId}"`);
  });

  return label ?? names[0];
};

export const capabilityGroups: CapabilityGroup[] = [
  {
    id: "product",
    number: "01",
    title: "Product & interaction design",
    lead: "Turning what I learn into structure, flows and decisions people can see.",
    sets: [
      {
        label: "Practice",
        items: [
          skill("ux-design", ["Product Design", "Interaction Design", "User Experience Design"], "Product, interaction & UX design"),
          skill("ux-design", ["User Flows", "Information Architecture"], "User flows & information architecture"),
          skill("ux-design", ["Wireframing", "Prototyping", "High-Fidelity Design"], "Wireframes to high-fidelity prototypes"),
        ],
      },
      {
        label: "Systems & delivery",
        items: [
          skill("ux-design", ["Design Systems", "Component Design"], "Design systems & components"),
          skill("ux-design", ["Responsive Web Design", "Mobile Design"], "Responsive & mobile design"),
          skill("ux-design", ["Accessibility (WCAG)"]),
          skill("ux-design", ["Design Handoff"], "Design handoff"),
        ],
      },
    ],
  },
  {
    id: "research",
    number: "02",
    title: "UX research & data",
    lead: "Finding out what people actually do, and where the experience breaks.",
    sets: [
      {
        label: "Methods",
        items: [
          skill("research", ["Mixed-Methods Research", "Evaluative Research"], "Mixed-methods & evaluative research"),
          skill("research", ["User Interviews", "Contextual Inquiry"], "Interviews & contextual inquiry"),
          skill("research", ["Usability Testing", "Heuristic Evaluation"], "Usability testing & heuristic evaluation"),
          skill("research", ["Surveys"]),
        ],
      },
      {
        label: "Synthesis",
        items: [
          skill("research", ["Research Synthesis", "Thematic Analysis"], "Synthesis & thematic analysis"),
          skill("research", ["Journey Mapping"], "Journey mapping"),
          skill("research", ["Product Discovery"], "Product discovery"),
        ],
      },
      { label: "Data", items: [skill("technical", ["Python", "Pandas"], "Python & Pandas")] },
    ],
  },
  {
    id: "engineering",
    number: "03",
    title: "Software engineering",
    lead: "Checking whether a design decision can live in the system being built.",
    sets: [
      {
        label: "Build",
        items: [
          skill("technical", ["TypeScript", "JavaScript"], "TypeScript & JavaScript"),
          skill("technical", ["React", "Next.js"], "React & Next.js"),
          skill("technical", ["Python"]),
        ],
      },
      {
        label: "Workflow",
        items: [
          skill("technical", ["Git", "GitHub"], "Git & GitHub"),
          skill("technical", ["Developer Workflows"], "Developer workflows"),
        ],
      },
    ],
  },
  {
    id: "ai",
    number: "04",
    title: "AI & technical systems",
    lead: "Where the system under the interface matters most, and where I want to go deeper.",
    sets: [
      {
        label: "Working with",
        items: [
          skill("technical", ["Technical UX", "Technical Audiences"], "Technical UX for technical audiences"),
          skill("technical", ["Internal Tools"], "Internal tools"),
          skill("technical", ["AI-Assisted Tools", "Generative AI Tools"], "AI-assisted & generative AI tools"),
          skill("technical", ["Prompt Engineering"], "Prompt engineering"),
          skill("technical", ["AI/ML Workflows"], "AI/ML workflows"),
        ],
      },
      {
        label: "Exploring",
        items: [skill("technical", ["LLM Concepts", "Agentic AI Concepts"], "LLM & agentic AI concepts")],
        tone: "exploring",
      },
    ],
  },
];

export const workingWith = [
  skill("soft-skills", ["Cross-functional Collaboration", "Stakeholder Communication"], "Cross-functional collaboration & stakeholder communication"),
  skill("soft-skills", ["Design Rationale", "Design Critiques"], "Design rationale & critiques"),
  skill("soft-skills", ["Workshop Facilitation"], "Workshop facilitation"),
  skill("soft-skills", ["Strategic Alignment"], "Strategic alignment"),
  skill("soft-skills", ["Agile Workflows"], "Agile workflows"),
  skill("soft-skills", ["Problem-solving", "Critical Thinking"], "Problem-solving & critical thinking"),
  skill("soft-skills", ["Empathy"]),
  skill("soft-skills", ["Documentation"]),
];

export const closing = {
  statement:
    "I’m interested in products where understanding the underlying system is just as important as designing the interface.",
  /** The phrase in the statement that gets the hand-drawn underline. */
  emphasis: "the underlying system",
  // The closing sentences of focusCopy[2] in professional.ts.
  interestsNote: "Not the only products I want. Just where this way of working is most useful.",
  interests: [
    "AI products",
    "Developer tools",
    "Internal platforms",
    "Complex technical workflows",
    "Human-centered technical systems",
  ],
};
