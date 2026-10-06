import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ImageSource } from "@/components/media/Media";

export const CASE_STUDY_TYPES = ["Concept", "Contract", "Shipped"] as const;

export type CaseStudyType = (typeof CASE_STUDY_TYPES)[number];

export interface CaseStudyFrontmatter {
  slug: string;
  title: string;
  client: string;
  type: CaseStudyType;
  year: string;
  role: string;
  timeline: string;
  team?: string;
  skills: string[];
  /** Absent until the asset exists; `coverAlt` is required alongside it. */
  cover?: ImageSource;
  summary: string;
  next?: string;
}

export interface CaseStudySection {
  id: string;
  label: string;
}

export interface CaseStudy {
  frontmatter: CaseStudyFrontmatter;
  content: string;
  sections: CaseStudySection[];
  nextSlug?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "case-studies");

/** Anchors the Solución section to a stable id that never changes with content. */
const FIXED_SECTION_IDS: Record<string, string> = {
  solucion: "solution-section",
  solution: "solution-section",
};

export function slugifyHeading(heading: string): string {
  const normalized = heading
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return FIXED_SECTION_IDS[normalized] ?? normalized;
}

export const SEE_NEXT_SECTION_ID = slugifyHeading("See Next");

function fail(source: string, message: string): never {
  throw new Error(`Invalid case study frontmatter in ${source}: ${message}`);
}

function requireString(
  data: Record<string, unknown>,
  field: string,
  source: string,
): string {
  const value = data[field];

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value !== "string" || value.trim() === "") {
    return fail(source, `"${field}" is required and must be a non-empty string`);
  }

  return value;
}

function optionalString(
  data: Record<string, unknown>,
  field: string,
  source: string,
): string | undefined {
  if (!(field in data) || data[field] === undefined || data[field] === null) {
    return undefined;
  }

  if (typeof data[field] === "number") {
    return String(data[field]);
  }

  if (typeof data[field] !== "string") {
    return fail(source, `"${field}" must be a string when provided`);
  }

  const value = (data[field] as string).trim();

  return value === "" ? undefined : value;
}

function parseFrontmatter(
  data: Record<string, unknown>,
  source: string,
): CaseStudyFrontmatter {
  const type = requireString(data, "type", source);

  if (!CASE_STUDY_TYPES.includes(type as CaseStudyType)) {
    fail(source, `"type" must be one of ${CASE_STUDY_TYPES.join(" | ")}`);
  }

  const skills = data.skills;

  if (
    !Array.isArray(skills) ||
    skills.length === 0 ||
    skills.some((skill) => typeof skill !== "string" || skill.trim() === "")
  ) {
    fail(source, '"skills" is required and must be a non-empty string array');
  }

  const coverSrc = optionalString(data, "cover", source);
  const coverAlt = optionalString(data, "coverAlt", source);

  if (coverSrc && !coverAlt) {
    fail(
      source,
      '"coverAlt" is required whenever "cover" is set; describe what the cover shows, or drop the cover until it exists',
    );
  }

  return {
    slug: requireString(data, "slug", source),
    title: requireString(data, "title", source),
    client: optionalString(data, "client", source) ?? "",
    type: type as CaseStudyType,
    year: optionalString(data, "year", source) ?? "",
    role: requireString(data, "role", source),
    timeline: optionalString(data, "timeline", source) ?? "",
    team: optionalString(data, "team", source),
    skills: skills as string[],
    cover: coverSrc
      ? { type: "image", src: coverSrc, alt: coverAlt as string }
      : undefined,
    summary: optionalString(data, "summary", source) ?? "",
    next: optionalString(data, "next", source),
  };
}

export function deriveSections(content: string): CaseStudySection[] {
  const withoutCodeBlocks = content.replace(/^```[\s\S]*?^```/gm, "");
  const headings = withoutCodeBlocks.matchAll(/^##[ \t]+(.+?)\s*$/gm);

  return Array.from(headings, (match) => {
    const label = match[1].trim();

    return { id: slugifyHeading(label), label };
  });
}

export function getCaseStudySlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function readCaseStudy(slug: string): Omit<CaseStudy, "nextSlug"> {
  const source = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(source)) {
    throw new Error(`Case study "${slug}" does not exist at ${source}`);
  }

  const file = matter(fs.readFileSync(source, "utf8"));
  const frontmatter = parseFrontmatter(
    file.data as Record<string, unknown>,
    `${slug}.mdx`,
  );

  if (frontmatter.slug !== slug) {
    throw new Error(
      `Case study "${slug}.mdx" declares slug "${frontmatter.slug}"; they must match`,
    );
  }

  const sections = deriveSections(file.content);

  return {
    frontmatter,
    content: file.content,
    sections,
  };
}

function sortByPublication(
  caseStudies: Omit<CaseStudy, "nextSlug">[],
): Omit<CaseStudy, "nextSlug">[] {
  return [...caseStudies].sort((left, right) => {
    const yearOrder = left.frontmatter.year.localeCompare(
      right.frontmatter.year,
      undefined,
      { numeric: true },
    );

    if (yearOrder !== 0) {
      return yearOrder;
    }

    return left.frontmatter.slug.localeCompare(right.frontmatter.slug);
  });
}

function resolveNextSlug(
  caseStudy: Omit<CaseStudy, "nextSlug">,
  ordered: Omit<CaseStudy, "nextSlug">[],
  index: number,
): string | undefined {
  const explicit = caseStudy.frontmatter.next;
  const currentSlug = caseStudy.frontmatter.slug;

  if (explicit) {
    if (explicit === currentSlug) {
      throw new Error(
        `Case study "${currentSlug}" points next to itself. A case study cannot link to itself.`,
      );
    }

    if (!ordered.some((item) => item.frontmatter.slug === explicit)) {
      throw new Error(
        `Case study "${currentSlug}" points to unknown next slug "${explicit}"`,
      );
    }

    return explicit;
  }

  if (ordered.length < 2) {
    return undefined;
  }

  const derived = ordered[(index + 1) % ordered.length].frontmatter.slug;

  if (derived === currentSlug) {
    throw new Error(
      `Case study "${currentSlug}" resolved next to itself. A case study cannot link to itself.`,
    );
  }

  return derived;
}

export function getAllCaseStudies(): CaseStudy[] {
  const ordered = sortByPublication(getCaseStudySlugs().map(readCaseStudy));

  return ordered.map((caseStudy, index) => ({
    ...caseStudy,
    nextSlug: resolveNextSlug(caseStudy, ordered, index),
  }));
}

export function getCaseStudy(slug: string): CaseStudy {
  const caseStudy = getAllCaseStudies().find(
    (item) => item.frontmatter.slug === slug,
  );

  if (!caseStudy) {
    throw new Error(`Case study "${slug}" does not exist`);
  }

  return caseStudy;
}
