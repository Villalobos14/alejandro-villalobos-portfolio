import type { MetadataRoute } from "next";
import { getAllCaseStudies } from "@/lib/case-studies";
import { siteUrl } from "@/lib/site";

/** The public pages and every case study that has a route. /resume and /api are left out on purpose. */
const pages = ["", "/projects", "/about", "/fun"];

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = getAllCaseStudies().map((study) => `/work/${study.frontmatter.slug}`);

  return [...pages, ...caseStudies].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "" ? "monthly" : "yearly",
    priority: path === "" ? 1 : path.startsWith("/work/") ? 0.8 : 0.6,
  }));
}
