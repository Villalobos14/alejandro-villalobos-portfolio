import { existsSync } from "node:fs";
import { join } from "node:path";

/** Server-only file check. Static pages pick up an added PDF on the next build. */
export function hasCvPdf(): boolean {
  return existsSync(join(process.cwd(), "public", "cv.pdf"));
}
