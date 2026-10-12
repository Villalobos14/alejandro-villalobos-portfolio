import { profile } from "./professional";

/**
 * Copy for the home hero. The final Figma frame is the source of the lines
 * that render. The fields after `cta` are not in that frame; they stay here
 * and are not rendered on `/`.
 */
export const homeHeroContent = {
  greeting: "I’m Alejandro.",
  currently: {
    label: "Currently",
    role: "Designing & researching @ HSBC",
    place: "Mexico City",
  },
  previously: {
    label: "Previously",
    lines: [
      "Product design @ DaCodes & Orium",
      "Research & engineering @ UPC Chiapas | Barcelona",
    ],
  },
  statement: {
    lines: ["Research-driven.", "Engineering-minded.", "AI-fluent."],
  },
  role: {
    lead: "I’m a",
    title: "PRODUCT DESIGNER",
  },
  /**
   * Calcifer perches on top of the "G" of DESIGNER, which stays visible. The
   * word and letter are a slice of `role.title`, not a second headline.
   */
  petGlyph: { word: "DESIGNER", letter: "G" },
  description:
    "I combine research, design and engineering to create human–AI interfaces",
  intro: "A few things I’ve helped make.",
  cta: "Explore work ↓",
  identity: { index: "[01]", name: profile.name, role: profile.role },
  place: { location: profile.location, edition: "2027" },
  availability: profile.availability,
  supporting: [
    "AI-fluent, engineering-minded, and focused on",
    "human-centered products and complex systems.",
  ],
  practice: {
    label: "Practice",
    discipline: "Product Design",
    attributes: ["Research", "Engineering", "AI-fluent"],
  },
  annotation: {
    label: "[Note 01]",
    marker: "*",
    lines: [
      "I may not have 8 years of experience,",
      "but given a weekend and an ominous deadline,",
      "I can lowkey learn anything.",
    ],
  },
} as const;
