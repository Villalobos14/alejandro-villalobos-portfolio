import type { ReactNode } from "react";
import { proH2 } from "@/components/about/ProSection";
import MaskedLines from "@/components/ui/MaskedLines";
import RevealHeading from "@/components/ui/RevealHeading";

export default function ProjectSection({
  id, eyebrow, count, title, deck, first = false, children,
}: {
  id: string;
  eyebrow: string;
  count: string;
  title: string;
  deck: string;
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <section aria-label={title} className="min-w-0 lg:isolate">
      <div data-hairline={id} className="border-t border-border">
        <div data-sticky-eyebrow={id} className="mt-[14px] flex items-start justify-between gap-4 bg-bg py-1 text-mono text-ink-muted lg:sticky lg:top-0 lg:z-20">
          <p>{eyebrow}</p>
          <p className="shrink-0">{count}</p>
        </div>
        {first ? (
          <MaskedLines as="h1" lines={[title]} className={`mt-[14px] ${proH2}`} />
        ) : (
          <RevealHeading as="h2" className={`mt-[14px] ${proH2}`}>{title}</RevealHeading>
        )}
        <p className="mt-[14px] text-[17px] leading-[26px] tracking-[-0.002em] text-ink-secondary">{deck}</p>
        {children}
      </div>
    </section>
  );
}
