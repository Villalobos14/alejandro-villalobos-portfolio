import type { ReactNode } from "react";
import MaskedLines from "./MaskedLines";

interface SectionHeadingProps {
  lines: [string, string];
  label?: string;
  aside?: ReactNode;
  as?: "h1" | "h2";
  id?: string;
}

export default function SectionHeading({
  lines,
  label,
  aside,
  as = "h2",
  id,
}: SectionHeadingProps) {
  return (
    <div
      id={id}
      className="flex flex-col gap-scale md:flex-row md:items-end md:justify-between"
    >
      <div className="flex min-w-0 flex-col gap-3">
        {label ? (
          <p className="text-body uppercase tracking-[0.2em] text-gray">{label}</p>
        ) : null}
        <MaskedLines
          as={as}
          lines={[
            lines[0],
            <span key="offset" className="block pl-[8vw] md:pl-[6vw]">
              {lines[1]}
            </span>,
          ]}
          className="text-[clamp(2.25rem,8vw,5.5rem)] font-medium leading-[1.02] tracking-tight text-white"
        />
      </div>
      {aside ? (
        <div className="shrink-0 text-body text-gray md:max-w-xs md:text-right">
          {aside}
        </div>
      ) : null}
    </div>
  );
}
