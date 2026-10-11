import type { ReactNode } from "react";

/** The route. The dock stays in the layout. */
export default function PageShell({ children }: { children: ReactNode }) {
  return <div className="bg-bg text-ink">{children}</div>;
}
