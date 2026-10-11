/** Copy for the PF27 /about Professional frame. */
export interface WorkHabit {
  id: "understand" | "connect" | "make" | "challenge";
  number: string;
  title: string;
  body: string;
  foot: string;
  sketchLabel: string;
}

export const howIWork = {
  eyebrow: "01 — How I work",
  title: "Four habits, each one from a real project.",
  habits: [
    {
      id: "understand",
      number: "01",
      title: "Start where people get stuck.",
      body: "Workarounds and odd questions are the signal. In CodeAssessment it was an engineer asking which file caused a 5.1.",
      foot: "Seen in · MLSToolbox",
      sketchLabel:
        "Three notes: P1 “I just export it”, P2 “where’s the status?”, P3 “I ask someone”, a scatter of marks, and the note workarounds = signal.",
    },
    {
      id: "connect",
      number: "02",
      title: "Make the system visible.",
      body: "Most of my work is translation: a pipeline, a banking service, an analyzer — turned into something people can inspect and correct.",
      foot: "Seen in · MLSToolbox · HSBC",
      sketchLabel:
        "People, Product, Data, Constraints and Technology joined at one point marked decided here, with a note back to 01?",
    },
    {
      id: "make",
      number: "03",
      title: "Prototype in the real material.",
      body: "When it helps, I build it. Figma → MCP → Cursor puts a working prototype in front of people quickly.",
      foot: "Seen in · CodeAssessment V3",
      sketchLabel: "A quick wireframe that resolves into an interface, labelled rough → resolved.",
    },
    {
      id: "challenge",
      number: "04",
      title: "Say what the evidence can’t prove.",
      body: "Small samples, partial results, directional findings. I’d rather label the limit than oversell the number.",
      foot: "Seen in · every case study",
      sketchLabel:
        "Checks for Usability, Clarity and Feasibility, Evidence still open, and the note Keep improving.",
    },
  ] as const satisfies readonly WorkHabit[],
};

export const experienceSection = {
  eyebrow: "02 — Experience",
  title: "Where I’ve worked.",
  roles: [
    {
      dates: "2025 — Present",
      company: "HSBC",
      role: "UX Researcher",
      body: "Mixed-methods research across digital banking, branches and service journeys: benchmarks, field research, NPS / FCR analysis and dashboards.",
    },
    {
      dates: "Sep — Dec 2025",
      company: "GESSI · UPC Barcelona",
      role: "Research assistant · Software engineer",
      body: "Redesigned CodeAssessment and built its new assessment flow; implemented ML cohesion metrics in Python, Flask and Angular.",
    },
    {
      dates: "2023 — 2024",
      company: "Orium",
      role: "Product Designer",
      body: "Product design across a Webflow migration, components and screens, plus AI-assisted visual work.",
    },
    {
      dates: "2021 — 2023",
      company: "DaCodes",
      role: "Product Designer",
      body: "Design across four to five products: SaaS information architecture, design systems and prototypes with engineering.",
    },
  ],
  education: [
    {
      title: "Software Development Engineering",
      detail: "Universidad Politécnica de Chiapas · 2025",
    },
    {
      title: "Google UX Design Certificate",
      detail: "Google · 2024",
    },
  ],
} as const;

export const toolkitSection = {
  eyebrow: "03 — Toolkit",
  title: "What I use, by job.",
  rows: [
    { label: "Design", value: "Figma, prototyping, design systems, Adobe Photoshop & Illustrator" },
    {
      label: "Research",
      value:
        "Interviews, usability testing, benchmarks, field research, surveys — UserTesting, Optimal Workshop, Hotjar, Google Analytics",
      tall: true,
    },
    { label: "Data", value: "Python, pandas, NumPy, Plotly / Dash, R, Excel" },
    { label: "Build", value: "React, Next.js, TypeScript, Angular, Flask, Git & GitHub" },
    {
      label: "AI workflow",
      value: "Figma → MCP → Cursor for working prototypes; Claude and ChatGPT / Codex for synthesis and code",
    },
  ],
} as const;

export const beyondSection = {
  eyebrow: "04 — Beyond the job",
  title: "Teaching, talking, building with others.",
  columns: [
    {
      title: "Teaching",
      body: "Workshops where someone is stuck and the room figures it out together.",
      photo: "Foto — Teaching",
    },
    {
      title: "Speaking",
      body: "Saying a thing out loud until it’s clear — sometimes on a stage in Chiapas.",
      photo: "Foto — Speaking",
    },
    {
      title: "Hackathons",
      body: "Usually on the design side of the table. 1st place with Monogatari, 3rd with GoodActions.",
      photo: "Foto — Hackathons",
    },
  ],
} as const;

export const aboutCta = {
  title: "Want the details?",
  cv: "Download CV (PDF) ↓",
  fun: "The other side: Fun →",
} as const;

export const professionalHeader = {
  eyebrow: "About — Professional",
  title: ["Understand the system.", "Then shape the interface."] as const,
  deck: "I’m a product designer with a software-engineering degree and a UX-research job at HSBC. I make complex products easier to understand, use and build — and I’m happiest where research, design and code meet.",
  meta: "Mexico City · Open to relocation · Spanish & English",
  portraitCaption: "me, coffee, thinking about pipelines",
};
