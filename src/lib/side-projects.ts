export interface SideProject {
  name: string;
  summary: string;
  type: "Hackathon" | "Open source" | "Team project" | "Visual";
  builtWith: string;
  result: string;
  resultKind: "text" | "chip";
  href?: string;
  thumb?: { src: string; alt: string };
  detail?: { label: string; body: string; contribution: string };
}

export const sideProjects: SideProject[] = [
  {
    name: "Monogatari",
    summary: "Web3 manga publishing where creators keep ownership.",
    type: "Hackathon",
    builtWith: "UX/UI · blockchain",
    result: "1st place",
    resultKind: "text",
    thumb: { src: "/projects/cover-monogatari.png", alt: "Monogatari manga landing page: Discover unique stories anytime" },
    // TODO(content): URL de View project de Monogatari; Figma has no link target.
    detail: {
      label: "Hackathon · 1st place",
      body: "Web3 manga and comics publishing where creators keep ownership and get paid through transparent smart-contract royalties — with a reader experience that still feels familiar.",
      contribution: "My part: UX/UI and the blockchain side of the build.",
    },
  },
  {
    name: "GoodActions",
    summary: "Rewards for reforestation and community work, recorded on-chain.",
    type: "Hackathon",
    builtWith: "Rust · blockchain",
    result: "3rd place",
    resultKind: "text",
    href: "https://www.behance.net/gallery/217217671/GOOD-ACTIONS",
    thumb: { src: "/projects/cover-goodactions.png", alt: "GoodActions reward card for planting a tree, with tokens and a community goal" },
    // TODO(content): detalle de GoodActions
  },
  {
    name: "Solary",
    summary: "Solar-panel monitoring with real-time dashboards.",
    type: "Team project",
    builtWith: "UX/UI · engineering",
    result: "Paper",
    resultKind: "chip",
    thumb: { src: "/projects/cover-solary.png", alt: "Solary monitor card charting live solar output from morning to evening" },
    // TODO(content): detalle de Solary
  },
  {
    name: "Parking Go",
    summary: "A concurrent parking simulator that explains goroutines and race detection.",
    type: "Open source",
    builtWith: "Go",
    result: "Repo",
    resultKind: "chip",
    thumb: { src: "/projects/cover-parking-go.png", alt: "Parking Go terminal showing cars entering and leaving slots with zero data races" },
    // TODO(content): detalle de Parking Go
  },
  {
    name: "Explorations",
    summary: "Interface studies and visual work that didn’t become case studies.",
    type: "Visual",
    builtWith: "Figma",
    result: "Archive",
    resultKind: "chip",
    thumb: { src: "/projects/cover-explorations.png", alt: "Three overlapping interface explorations in the original Figma collage" },
    // TODO(content): detalle de Explorations
  },
];
