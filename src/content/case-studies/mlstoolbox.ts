/** Final Figma copy for /work/mlstoolbox. The route renders this module. */

export const mlsHeader = {
  crumb: "MLSToolbox — CodeAssessment",
  title: ["From a score to the", "file that needs fixing."],
  deck: "I redesigned CodeAssessment and built its new assessment flow inside MLSToolbox, so ML engineers can review a pipeline and act on prioritized, file-level issues instead of a single cohesion score.",
  meta: [
    { label: "Role", lines: ["Product design + software engineering"] },
    { label: "Timeline", lines: ["12 weeks", "Sep — Dec 2025"] },
    { label: "Team", lines: ["Principal researcher,", "an engineer and me"] },
    { label: "Shipped", lines: ["Assessment flow in MLSToolbox · 12 analyzers"] },
  ],
} as const;

export const mlsResults = {
  shifts: [
    { from: "10:52", to: "4:18", label: "Median time to first actionable issue" },
    { from: "2/6", to: "5/6", label: "Task success" },
    { from: "3/6", to: "5/6", label: "Correct interpretation without help" },
  ],
  note: "Two moderated rounds · six participants each · directional findings, not production KPIs",
} as const;

export const mlsContext = {
  eyebrow: "01 — Context",
  title: "A research toolbox, and the moment it had to make sense to engineers.",
  body: "MLSToolbox is GESSI’s toolbox for building and assessing ML systems at UPC Barcelona. CodeAssessment runs 12 analyzers over a Python ML repository and reports on its structure and quality.",
  partLabel: "My part",
  part: "The assessment experience end to end, and the ML cohesion metrics the principal researcher defined — implemented in Python, Flask and Angular. I didn’t create MLSToolbox or CodeAssessment from zero.",
} as const;

export const mlsProblem = {
  eyebrow: "02 — The problem",
  quote: ["“¿Qué archivo está", "causando esto?”"],
  attribution:
    "“Which file is causing this?” — ML engineer, repository walkthrough",
  title: "The score could not point to a file.",
  body: "In one walkthrough, an engineer spent 11 minutes locating mixed responsibilities after seeing a cohesion score of 5.1. One session, not an average — but it matched what 7 interviews and 5 repository walkthroughs kept showing: the useful unit was a localized issue, not another metric.",
  note: "Technical corpus: 12 Python ML repositories. The research definitions came from the principal researcher; I operationalized them.",
} as const;

export const mlsFlow = {
  eyebrow: "03 — The flow",
  title: "Six steps, from repository to export.",
  deck: "Connect a repository, confirm the pipeline, run the analyzers, start with one finding, inspect its evidence, export what matters.",
} as const;

export const mlsDecisions = {
  eyebrow: "04 — Decisions",
  title: "Four decisions that changed the experience.",
  deck: "The interface had to make its assumptions visible and leave engineers with somewhere concrete to look.",
  cells: [
    {
      label: "Decision 01",
      title: "Open an issue, not a score.",
      body: "Findings attach to files; the score stays as context. A folder heatmap we tried still left people searching through layers.",
      visual: "Visual 06 — Decision — issues before scores",
    },
    {
      label: "Decision 02",
      title: "Let people correct the assumption.",
      body: "Engineers confirm, move or exclude files per stage before dependent analysis. It added 20–40 seconds in observed sessions — I kept it.",
      visual: "Visual 05 — Decision — confirm the pipeline",
    },
    {
      label: "Decision 03",
      title: "Make every recommendation inspectable.",
      body: "Each finding shows the functions and mixed responsibilities behind it, plus a clear next step. Metric details sit one level down.",
      visual: "Visual 07 — Decision — evidence for every action",
    },
    {
      label: "Decision 04",
      title: "One failure shouldn’t erase the run.",
      body: "If an analyzer fails, completed findings stay visible; the missing check is named and can be retried on its own.",
      visual: "Visual 08 — Decision — partial results stay valid",
    },
  ],
  droppedLabel: "A decision I dropped",
  droppedTitle: "One 0–100 health score.",
  droppedBody:
    "It hid the difference between maintainability and separation of responsibilities — the exact thing engineers needed to see.",
} as const;

export const mlsSystem = {
  eyebrow: "05 — System",
  title: "One contract for 12 analyzers.",
  body: "Every analyzer reports through the same contract, so a failing check or a new analyzer doesn’t break the workspace.",
  from: "~1 day",
  to: "2 h 20 min",
  caption: "to add an analyzer with the shared contract",
  note: "Two integrations compared — not a productivity benchmark.",
  visual: "Visual 02 — System — one contract for 12 analyzers",
} as const;

export const mlsValidation = {
  eyebrow: "06 — Validation",
  title: "A shorter path to an actionable issue.",
  deck: "Two moderated rounds, six participants each — four new and two returning in round 2. Several things changed between rounds, so read these as directional.",
  columns: ["Measure", "Round 1", "Round 2"],
  rows: [
    ["Median time to first actionable issue", "10 min 52 s", "4 min 18 s"],
    ["Task success", "2 / 6", "5 / 6"],
    ["Correct interpretation without help", "3 / 6", "5 / 6"],
    ["Confidence", "2.7 / 5", "4.2 / 5"],
  ],
  cards: [
    {
      label: "Pipeline classification",
      value: "F1 0.84 → 0.92",
      body: "Macro F1 before overrides, then after assisted correction.",
      note: "The second number includes human review.",
    },
    {
      label: "Diagnostic precision",
      value: "49 / 60",
      body: "Sampled issues confirmed in manual review (81.7%).",
      note: "Sample precision, not overall accuracy.",
    },
    {
      label: "Recommendations",
      value: "26 / 30",
      body: "Rated actionable by three senior reviewers · usefulness 4.3 / 5.",
      note: "Reviewers rated 30 recommendations.",
    },
  ],
  disclosures: ["Research methods & task definition", "Implementation details"],
} as const;

export const mlsBehind = {
  eyebrow: "07 — Behind the scenes",
  title: "Iterations, scope and the details.",
  columns: [
    {
      src: "/case-studies/visual-09-iterations.png",
      alt: "Three iterations: report, workspace, verified redesign",
      caption:
        "Report first, then a workspace, then a verified redesign. V3 came after handoff and hasn’t been tested with users yet.",
    },
    {
      src: "/case-studies/visual-11-scope.png",
      alt: "Scope map: implemented, explored, external, concept, out of scope",
      caption: "Implemented, explored, external, concept or out of scope — labelled on purpose.",
    },
    {
      src: "/case-studies/visual-12-themes.png",
      alt: "Light and dark themes of the V3 prototype",
      caption: "Built for long review sessions: light and dark themes in the V3 prototype.",
    },
  ],
} as const;

export const mlsReflection = {
  eyebrow: "08 — Reflection",
  title: "Control was the harder decision.",
  body: "I kept the pipeline review step because people could inspect and correct the assumption. Static analysis supports judgment; it doesn’t establish runtime behavior, data quality or model performance — and the interface says so.",
  nextLabel: "Next time",
  items: [
    "Recruit external ML engineers earlier.",
    "Record step-level behavior from the first version.",
    "Define ground truth before each analyzer.",
  ],
} as const;

export const mlsNext = {
  label: "Next case · 02",
  title: "Ominio",
  description:
    "A gamified, AI-driven soft-skills app for students and early-career professionals.",
  read: "Read next case →",
  all: "All work →",
} as const;

export const mlsPlaceholders = {
  hero: "Visual 01 — Hero — findings workspace",
  system: "Visual 02 — System — one contract for 12 analyzers",
  engineering: "Visual 03 — Engineering — architecture",
  flow: "Visual 04 — Flow — repository to export",
} as const;
