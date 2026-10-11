import type { ReactNode } from "react";

/**
 * Shared desktop opening, measured from the first text ink at y=76.
 * Mono's line box starts 2px lower; the case back-link starts 1.5px higher.
 * These preserve the verified optical alignment while sharing one anchor.
 * Home deliberately uses its own opening. The dock stays in the layout.
 */
export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg text-ink [--page-content-start:76px] [--page-mono-start:calc(var(--page-content-start)+2px)] [--page-link-start:calc(var(--page-content-start)-1.5px)]">
      {children}
    </div>
  );
}
