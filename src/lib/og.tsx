import { ImageResponse } from "next/og";
import { ogImageAlt, ogImageSize, siteName, siteUrl } from "./site";

export const ogAlt = ogImageAlt;
export const ogSize = ogImageSize;
export const ogContentType = "image/png";

const INK = "#ffffff";
const BG = "#0C0D0E";
const ACCENT = "#3DD964";
const MUTED = "#8C8C8C";

/** Mirrors the site's glyph vocabulary as a single decorative band. */
const GLYPH_BAND = "· + · # * · + · * # · + · * · + · # * · + · * # · + ·";

/**
 * Renders the social card from text, so the site has one before a designed
 * asset exists. To swap in that asset later, drop it in `public/` and point
 * `openGraph.images` at it in the root metadata; this route can then go.
 *
 * Styling is limited to what Satori supports: flexbox only, every container
 * declares `display: flex`, and no custom font is loaded so the bundled
 * default is used.
 */
export function renderSiteOgImage(): ImageResponse {
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
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: INK,
            }}
          >
            {siteName}
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
            Designing AI products for people.
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
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            UX research · Product design
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
