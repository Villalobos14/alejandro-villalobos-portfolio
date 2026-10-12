import { siteLinks } from "@/lib/links";
import { personName, personRole, siteDescription, siteUrl } from "@/lib/site";

/** Profiles listed in links.ts as the author's own. Instagram is personal and stays out. */
const PROFILES = ["linkedin", "github", "behance", "dribbble"];

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: personName,
      jobTitle: personRole,
      url: siteUrl,
      sameAs: siteLinks.filter((link) => PROFILES.includes(link.id)).map((link) => link.href),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: personName,
      description: siteDescription,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

/** Person and WebSite JSON-LD for the whole site. Only facts the site already states. */
export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // `<` is escaped so no field can close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
