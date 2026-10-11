"use client";

import { useState } from "react";

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

function Disclosure({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const panelId = `mls-disclosure-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="border-b border-border">
      <button
        type="button"
        className={`flex min-h-11 w-full items-center justify-between gap-4 py-4 text-left ${focusStyles}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="text-[20px] font-normal leading-7 text-ink">{title}</span>
        <span
          aria-hidden="true"
          className={`text-[28px] font-normal leading-none text-ink transition-transform duration-300 motion-reduce:transition-none ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-4 text-[15px] leading-snug text-ink-muted">TODO(content)</p>
        </div>
      </div>
    </div>
  );
}

export default function MlsDisclosures({ titles }: { titles: readonly string[] }) {
  return (
    <div className="border-t border-border">
      {titles.map((title) => (
        <Disclosure key={title} title={title} />
      ))}
    </div>
  );
}
