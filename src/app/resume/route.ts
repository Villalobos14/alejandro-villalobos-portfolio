import { hasCvPdf } from "@/lib/cv";

// Match the statically rendered CV links: adding the PDF takes effect on rebuild.
export const dynamic = "force-static";

export function GET() {
  return hasCvPdf()
    ? new Response(null, { status: 308, headers: { Location: "/cv.pdf" } })
    : new Response(null, { status: 404 });
}
