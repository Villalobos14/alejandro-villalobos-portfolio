import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * The AV mark from public/logo.svg on a full-bleed square, as Apple expects:
 * iOS rounds the corners itself and fills transparency with black.
 */
export default async function AppleIcon() {
  const logo = await readFile(join(process.cwd(), "public/logo.svg"));
  const src = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1B1919" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={132} height={129} alt="" />
      </div>
    ),
    size,
  );
}
