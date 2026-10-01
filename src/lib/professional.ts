export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  start: { label: string; dateTime: string };
  end: { label: string; dateTime: string };
  bullets: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
}

export const profile = {
  name: "Alejandro Villalobos",
  role: "Product Designer",
  location: "México",
  availability: "Currently open to work",
  summary:
    "Product Designer based in México. I came into this work through software engineering, and the research I do now is part of how I decide what a product should be. Design is where those two stay in the same conversation.",
} as const;

export const focusCopy = [
  "I am drawn to product problems where the interface is only the part you can see. Under it there is usually a system, a workflow, data, and a constraint. I want to understand that layer before the screen hardens.",
  "Research is how I learn what people actually do, and where a service or a journey breaks. Design is how I turn that into structure, interaction, and a decision about what to show. Software engineering is how I check whether that decision can live in the system being built: what it depends on, what it costs, and where it will break.",
  "That is the work I am most comfortable in. Lately my curiosity is strongest around AI products, developer tools, internal platforms, and other software that is hard to design from the surface alone. Not the only products I want. Just where this way of working is most useful.",
] as const;

export const collaborationCopy = [
  "The same problem changes depending on who is looking at it. With research and with stakeholders, I would rather get the question right than design an answer to the wrong one. With engineers, I can stay with the implementation: constraints, data, and what the system will actually allow. With other designers, I like moving from a rough structure into interactions and the smaller decisions that make a product specific.",
  "Projects rarely arrive finished. The brief can be thin, the constraints can disagree, and sometimes the first useful step is just to find out what is going on. Moving between those conversations is how a decision travels from one group to the next without turning vague on the way.",
] as const;

export const education = [
  {
    id: "software-development",
    title: "Engineering Degree in Software Development",
    detail: "Universidad Politécnica de Chiapas, 2025",
  },
  {
    id: "google-ux",
    title: "Google UX Design Professional Certificate",
    detail: "Google, 2024",
  },
] as const;

export const experience: ExperienceEntry[] = [
  {
    id: "01",
    role: "UX Researcher",
    company: "HSBC",
    start: { label: "Aug 2025", dateTime: "2025-08" },
    end: { label: "Present", dateTime: "present" },
    bullets: [
      "Support mixed-methods UX research across digital banking services, internal tools, and customer-facing journeys.",
      "Analyze survey data, conversation logs, UX metrics, and open-ended feedback to identify friction points and opportunity areas.",
      "Translate research findings into actionable recommendations that help product, design, business, data, and technology teams make clearer experience decisions.",
    ],
  },
  {
    id: "02",
    role: "UX Designer",
    company: "Orium",
    start: { label: "Jun 2023", dateTime: "2023-06" },
    end: { label: "Jun 2024", dateTime: "2024-06" },
    bullets: [
      "Designed end-to-end product experiences for consumer-facing digital platforms, including user flows, interfaces, prototypes, and interaction patterns.",
      "Created high-fidelity designs and functional prototypes to validate concepts, clarify edge cases, and reduce ambiguity before implementation.",
      "Designed scalable design system components and reusable interface patterns to improve consistency, usability, and cohesion across product experiences.",
    ],
  },
  {
    id: "03",
    role: "UX Designer",
    company: "DaCodes",
    start: { label: "Jun 2021", dateTime: "2021-06" },
    end: { label: "May 2023", dateTime: "2023-05" },
    bullets: [
      "Designed user flows, information architecture, wireframes, and interactive prototypes for SaaS products and customer-facing digital platforms.",
      "Translated product requirements, user needs, stakeholder input, and technical constraints into clearer interaction models and usable product experiences.",
      "Collaborated with product managers, engineers, and business stakeholders to present design rationale, incorporate feedback, and improve handoff quality.",
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    id: "ux-design",
    title: "UX Design",
    skills: [
      "User Experience Design",
      "Interaction Design",
      "Product Design",
      "User Flows",
      "Information Architecture",
      "Wireframing",
      "Prototyping",
      "High-Fidelity Design",
      "Component Design",
      "Design Systems",
      "Responsive Web Design",
      "Mobile Design",
      "Design Handoff",
      "Accessibility (WCAG)",
    ],
  },
  {
    id: "research",
    title: "Research",
    skills: [
      "Mixed-Methods Research",
      "Evaluative Research",
      "Usability Testing",
      "User Interviews",
      "Contextual Inquiry",
      "Surveys",
      "Heuristic Evaluation",
      "Journey Mapping",
      "Research Synthesis",
      "Thematic Analysis",
      "Product Discovery",
    ],
  },
  {
    id: "technical",
    title: "Technical",
    skills: [
      "Technical UX",
      "AI-Assisted Tools",
      "AI/ML Workflows",
      "Developer Workflows",
      "Internal Tools",
      "Technical Audiences",
      "LLM Concepts",
      "Agentic AI Concepts",
      "Generative AI Tools",
      "Prompt Engineering",
      "Python",
      "Pandas",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Git",
      "GitHub",
    ],
  },
  {
    id: "soft-skills",
    title: "Soft Skills",
    skills: [
      "Cross-functional Collaboration",
      "Stakeholder Communication",
      "Design Rationale",
      "Design Critiques",
      "Strategic Alignment",
      "Workshop Facilitation",
      "Agile Workflows",
      "Problem-solving",
      "Critical Thinking",
      "Empathy",
      "Documentation",
    ],
  },
];

export function findSkillGroup(id: SkillGroup["id"]): SkillGroup {
  const group = skillGroups.find((candidate) => candidate.id === id);

  if (!group) {
    throw new Error(`Unknown skill group "${id}"`);
  }

  return group;
}
