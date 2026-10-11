import { NextResponse, type NextRequest } from "next/server";

const PREVIEW_HEADER = "x-system-preview";

/**
 * App Router treats a `_` folder as private, so the specimen cannot live at
 * `app/_system`. This rewrite is the public URL; the page folder stays unlinked.
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/_system") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/system";
  const headers = new Headers(request.headers);
  headers.set(PREVIEW_HEADER, "1");

  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/_system"],
};
