import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ogImageAlt, ogImageSize, personName, personRole, siteUrl } from "./site";

export const ogAlt = ogImageAlt;
export const ogSize = ogImageSize;
export const ogContentType = "image/png";

// Satori cannot resolve CSS custom properties; mirror the PF27 theme tokens.
// The card is prerendered at build time, so the Geist files are read from the geist package then.
const INK = "#121212";
const BG = "#FFFFFF";
/** --accent-strong: pink text under 24px on white (6.04:1). */
const ACCENT = "#BE185D";
const MUTED = "#767676";

/** Mirrors the site's glyph vocabulary as a single decorative band. */
const GLYPH_BAND = "· + · # * · + · * # · + · * · + · # * · +";

/**
 * Renders the social card from text, so the site has one before a designed
 * asset exists. To swap in that asset later, drop it in `public/` and point
 * `openGraph.images` at it in the root metadata; this route can then go.
 *
 * Styling is limited to what Satori supports: flexbox only, every container
 * declares `display: flex`. Fonts are the site's own Geist and Geist Mono.
 */
async function geist(file: string) {
  return readFile(join(process.cwd(), "node_modules/geist/dist/fonts", file));
}

export async function renderSiteOgImage(): Promise<ImageResponse> {
  const [sans, sansSemiBold, mono] = await Promise.all([
    geist("geist-sans/Geist-Regular.ttf"),
    geist("geist-sans/Geist-SemiBold.ttf"),
    geist("geist-mono/GeistMono-Regular.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BG,
          fontFamily: "Geist",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 22,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: ACCENT,
            }}
          >
            Portfolio
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 22,
              letterSpacing: "0.1em",
              color: MUTED,
            }}
          >
            {siteUrl.replace(/^https?:\/\//, "")}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 30,
              letterSpacing: "0.12em",
              color: MUTED,
              opacity: 0.5,
            }}
          >
            {GLYPH_BAND}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: 104,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: INK,
            }}
          >
            {personName}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 40,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: MUTED,
            }}
          >
            {personRole}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              width: 120,
              height: 3,
              backgroundColor: ACCENT,
            }}
          />
          <div
            style={{
              display: "flex",
              marginLeft: 24,
              fontFamily: "Geist Mono",
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            Research × Design × Engineering
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: sans, weight: 400, style: "normal" },
        { name: "Geist", data: sansSemiBold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
