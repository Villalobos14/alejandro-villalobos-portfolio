import localFont from "next/font/local";

/**
 * Caveat (SIL OFL 1.1, see src/app/fonts/Caveat-OFL.txt), self-hosted and
 * Latin-only. It is used for sketch annotations on /about and nothing else;
 * headings and body copy stay in the site typeface.
 */
export const handFont = localFont({
  src: "../../../app/fonts/Caveat-Latin.woff2",
  weight: "400 700",
  variable: "--font-hand",
  display: "swap",
  fallback: ["Bradley Hand", "Segoe Print", "cursive"],
});
