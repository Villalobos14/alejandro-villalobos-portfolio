"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useId, useState } from "react";

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export interface ProjectRowCover {
  src: string;
  alt: string;
}

export interface ProjectRowProps {
  index: string;
  title: string;
  role: string;
  year?: string;
  tone?: "professional" | "side";
  cover?: ProjectRowCover;
  summary?: string;
}

export default function ProjectRow({
  index,
  title,
  role,
  year,
  tone = "professional",
  cover,
  summary,
}: ProjectRowProps) {
  const reduced = useReducedMotion() === true;
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const side = tone === "side";
  const visibleCover = side ? undefined : cover;
  const canExpand = summary !== undefined || visibleCover !== undefined;

  const row = (
    <span className="flex w-full min-w-0 items-center gap-3 py-4 sm:gap-6">
      <span className={`w-8 shrink-0 text-mono ${side ? "text-ink-muted" : "text-ink"}`}>
        {index}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
        <span className={`min-w-0 ${side ? "text-mono text-ink-secondary" : "text-h4 text-ink"}`}>
          {title}
        </span>
        <span className={`min-w-0 ${side ? "text-mono text-ink-muted" : "text-body-s text-ink-secondary"}`}>
          {role}
        </span>
      </span>
      {year ? (
        <span className={`shrink-0 text-mono ${side ? "text-ink-muted" : "text-ink"}`}>{year}</span>
      ) : null}
      <ArrowRightIcon
        aria-hidden="true"
        className={`size-4 shrink-0 text-ink-secondary transition-transform duration-300 motion-reduce:transition-none ${
          open ? "rotate-90" : ""
        }`}
      />
    </span>
  );

  return (
    <div className="border-b border-border">
      {canExpand ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          className={`w-full text-left fine:hover:bg-bg-subtle active:bg-bg-subtle ${focusStyles}`}
          onClick={() => setOpen((current) => !current)}
        >
          {row}
        </button>
      ) : (
        row
      )}
      {canExpand ? (
        <motion.div
          id={panelId}
          initial={false}
          animate={{ height: open ? "auto" : 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="overflow-hidden"
          aria-hidden={open ? undefined : true}
          inert={open ? undefined : true}
        >
          <div className="flex flex-col gap-4 pb-5 pl-11 pr-1">
            {summary ? <p className="max-w-3xl text-body-s text-ink-secondary">{summary}</p> : null}
            {visibleCover ? (
              <div className="relative aspect-[16/10] w-full max-w-xl overflow-hidden bg-bg-subtle">
                <Image
                  src={visibleCover.src}
                  alt={visibleCover.alt}
                  fill
                  sizes="(min-width: 768px) 36rem, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
