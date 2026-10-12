import { ogAlt, ogContentType, ogSize, renderSiteOgImage } from "@/lib/og";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderSiteOgImage();
}
