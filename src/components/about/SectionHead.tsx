import type { ReactNode } from "react";
import { labelCase, tone } from "./tone";

interface SectionHeadProps {
  index: string;
  /** Two lines, set as one heading. */
  title: [string, string];
  children?: ReactNode;
}

/** Shared opening for every /about section after the hero. Static: readable at once. */
export default function SectionHead({ index, title, children }: SectionHeadProps) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-gray/30 pt-6 lg:grid-cols-12 lg:pt-8">
      <p className={`flex items-center gap-3 lg:col-span-12 ${labelCase} ${tone.meta}`}>
        <span aria-hidden="true" className="h-px w-8 shrink-0 bg-secondary" />
        {index}
      </p>
      <h2 className="text-[clamp(2.5rem,9vw,6.5rem)] font-medium leading-[0.95] tracking-tight text-white lg:col-span-7">
        <span className="block">{title[0]}</span>
        <span className="block">{title[1]}</span>
      </h2>
      {children ? <div className="lg:col-span-4 lg:col-start-9 lg:self-end">{children}</div> : null}
    </div>
  );
}
