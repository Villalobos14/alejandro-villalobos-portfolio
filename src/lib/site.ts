/** Absolute origin used to resolve canonical and social URLs. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://alejandro-villalobos-portfolio.vercel.app";

export const siteName = "Alejandro Villalobos";

export const siteTitle = "Alejandro Villalobos — Product Designer";

export const siteDescription =
  "Selected product design and UX by Alejandro Villalobos.";

/**
 * Alt text for the generated social card. Keep this in step with whatever the
 * card renders, including a designed image dropped in later.
 */
export const ogImageAlt = `${siteName} — Product designer portfolio`;

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
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website" as const, url: path, siteName, title, description },
    twitter: { card: "summary_large_image" as const, title, description },
  };
}
