/**
 * Absolute origin used to resolve canonical and social URLs: the apex of the
 * production domain. NEXT_PUBLIC_SITE_URL may override it (previews), but it
 * must not be set to the old vercel.app address in Vercel.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://notreallyjosh.com").replace(/\/+$/, "");

/** The professional identity. notreallyjosh.com is only the domain. */
export const personName = "Alejandro Villalobos";

export const personRole = "Product Designer & Engineer";

export const siteName = `${personName} — ${personRole}`;

export const siteTitle = `${personName} | ${personRole}`;

export const siteDescription =
  "Product Designer and Engineer combining UX research, software engineering, and AI to design intuitive, accessible, and human-centered digital experiences.";

/**
 * Alt text for the generated social card. Keep this in step with whatever the
 * card renders, including a designed image dropped in later.
 */
export const ogImageAlt = `${personName}, ${personRole}. Research × Design × Engineering.`;

export const ogImageSize = { width: 1200, height: 630 };

/**
 * Builds a page's title, description and social tags from one place, so a new
 * route cannot ship with a share card that still describes the home page.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  /*
   * A page's own openGraph replaces the one the layout inherits, image
   * included, so the shared card is named here. Case studies pass their own.
   */
  const image = { url: "/opengraph-image", ...ogImageSize, alt: ogImageAlt };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website" as const, url: path, siteName, title, description, images: [image] },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [{ url: "/twitter-image", alt: ogImageAlt }],
    },
  };
}
