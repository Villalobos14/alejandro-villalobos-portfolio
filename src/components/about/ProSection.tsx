import type { ReactNode } from "react";
import RevealHeading from "@/components/ui/RevealHeading";

export const proH2 =
  "text-[clamp(32px,5vw,48px)] font-semibold leading-[1.12] tracking-[-0.025em] text-ink frame:text-[48px] frame:leading-[54px]";

const stickyEyebrow = "text-mono text-ink-muted lg:sticky lg:top-0 lg:z-20 lg:bg-bg lg:py-1";

/**
 * Section opener shared by the professional about page: a hairline, a sticky
 * eyebrow from lg up, and a heading that reveals as it enters.
 */
export default function ProSection({
  id,
  eyebrow,
  title,
  hairline,
  className = "",
  eyebrowClassName = "",
  headingClassName = "",
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  hairline: string;
  className?: string;
  eyebrowClassName?: string;
  headingClassName?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={`lg:isolate ${className}`}>
      <div data-hairline={hairline} className="border-t border-border">
        <p data-sticky-eyebrow={id} className={`${stickyEyebrow} frame:mt-[15px] ${eyebrowClassName}`}>
          {eyebrow}
        </p>
        <RevealHeading as="h2" id={id} className={`mt-3 frame:mt-[14px] ${proH2} ${headingClassName}`}>
          {title}
        </RevealHeading>
        {children}
      </div>
    </section>
  );
}
