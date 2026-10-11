"use client";

import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  "/": "Home",
  "/projects": "Work",
  "/about": "About",
  "/fun": "Fun",
  "/resume": "Resume",
  "/_system": "System",
};

/** Major ticks sit 40px apart; the number is the cell index × 5. */
const TICKS = Array.from({ length: 48 }, (_, index) => index * 5);

function routeLabel(pathname: string): string {
  const known = LABELS[pathname];

  if (known) return known;
  if (pathname.startsWith("/work/")) return "Work";

  const segment = pathname.split("/").filter(Boolean)[0];

  if (!segment) return "Home";

  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function TopBar() {
  const pathname = usePathname();

  return (
    <header className="bg-bg text-ink">
      <div className="page-container flex items-baseline justify-between gap-4 pb-2 pt-4">
        <p className="text-mono text-ink">AV</p>
        <p className="text-mono-s text-ink-secondary">{routeLabel(pathname)}</p>
      </div>
      <div className="relative h-7 overflow-hidden border-b border-border" aria-hidden="true">
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[repeating-linear-gradient(to_right,rgb(var(--mat-minor))_0_1px,transparent_1px_8px)]" />
        <div className="absolute inset-x-0 bottom-0 h-2.5 bg-[repeating-linear-gradient(to_right,rgb(var(--mat-major))_0_1px,transparent_1px_40px)]" />
        <div className="absolute inset-0 flex items-start">
          {TICKS.map((tick) => (
            <span key={tick} className="w-10 shrink-0 text-mono-s text-mat-number">
              {tick}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
