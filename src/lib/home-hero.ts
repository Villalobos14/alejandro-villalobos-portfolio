import { profile } from "./professional";

/*
 * Every word of the home hero. Line arrays are the designed line breaks: the
 * statement keeps them at every width, the supporting text only from md up.
 */
export const homeHeroContent = {
  identity: { index: "[01]", name: profile.name, role: profile.role },
  /** Top right: where, and which edition of the portfolio. */
  place: { location: profile.location, edition: "2027" },
  availability: profile.availability,
  statement: {
    /** Who: set in white. */
    lead: ["I’m Alejandro,", "a Product Designer"],
    /** How: set back in gray, so the role stays the identity. */
    trail: ["who researches", "and builds."],
  },
  /** Calcifer stands in for this letter of this word, the first time it appears in the statement. */
  petGlyph: { word: "Product", letter: "o" },
  supporting: [
    "AI-fluent, engineering-minded, and focused on",
    "human-centered products and complex systems.",
  ],
  /** One discipline and what it draws on: attributes of the practice, not more job titles. */
  practice: {
    label: "Practice",
    discipline: "Product Design",
    attributes: ["Research", "Engineering", "AI-fluent"],
  },
  /**
   * A margin note to "builds", marked in the statement. One sentence: the
   * lines are its designed breaks from md up, and joined with spaces they
   * are the sentence exactly.
   */
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
