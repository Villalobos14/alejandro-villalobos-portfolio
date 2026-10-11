"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { REVEAL_STAGGER_MS } from "@/lib/motion";
import { sideProjects, type SideProject } from "@/lib/side-projects";

const mono = "font-mono text-[10px] leading-[14px] tracking-[0.04em] uppercase";
const rowGrid = "md:grid md:grid-cols-[minmax(0,1fr)_14%_18%_14%_44px] md:gap-x-5";
const focusStyles = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const filters: { label: string; type?: SideProject["type"] }[] = [
  { label: "All" },
  { label: "Hackathons", type: "Hackathon" },
  { label: "Open source", type: "Open source" },
  { label: "Team", type: "Team project" },
  { label: "Visual", type: "Visual" },
];

function LogEntry({ project, open, onToggle }: { project: SideProject; open: boolean; onToggle: () => void }) {
  const id = useId();

  return (
    <article data-log-entry={project.name} data-hairline={`log-${project.name}`} className={`border-t border-border ${open ? "bg-bg-subtle" : ""}`}>
      <div className={`relative py-4 md:min-h-[100px] md:items-center ${rowGrid}`}>
        <div className="flex min-w-0 items-center gap-4 pr-12 md:gap-5 md:pr-0">
          {project.thumb ? <Image {...project.thumb} alt={project.thumb.alt} width={104} height={68} sizes="104px" className="h-[68px] w-[104px] shrink-0 rounded object-cover" /> : null}
          <div className="min-w-0">
            <h3 id={`${id}-title`} className="text-[17px] font-medium leading-6">{project.name}</h3>
            <p className="mt-0.5 text-[14px] leading-[21px] text-ink-secondary">{project.summary}</p>
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-[1fr_1.35fr_1fr] items-start gap-3 md:contents">
          <div>
            <dt className={`${mono} mb-1.5 text-ink-secondary md:sr-only`}>Type</dt>
            <dd className={`${mono} text-ink-secondary`}>{project.type}</dd>
          </div>
          <div>
            <dt className={`${mono} mb-1.5 text-ink-secondary md:sr-only`}>Built with</dt>
            <dd className={`${mono} text-ink-secondary`}>{project.builtWith}</dd>
          </div>
          <div>
            <dt className={`${mono} mb-1.5 text-ink-secondary md:sr-only`}>Result</dt>
            <dd className={`${mono} text-ink-secondary`}>
              <span className={project.resultKind === "chip" ? "inline-flex rounded-full border border-border px-2.5 py-[5px]" : ""}>{project.result}</span>
            </dd>
          </div>
        </dl>
        <button type="button" id={`${id}-toggle`} aria-label={`${open ? "Collapse" : "Expand"} ${project.name}`} aria-expanded={open} aria-controls={`${id}-detail`} onClick={onToggle} className={`absolute right-0 top-4 flex size-11 items-center justify-center rounded-full text-[20px] text-accent md:static ${focusStyles}`}>
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
      </div>
      <div id={`${id}-detail`} role="region" aria-labelledby={`${id}-title`} aria-hidden={!open} className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className={`min-h-0 overflow-hidden ${open ? "visible" : "invisible"}`}>
          <div className={`pb-6 pt-1 ${rowGrid}`}>
            {project.detail && project.thumb ? (
              <div className="relative mb-6 aspect-[8/5] overflow-hidden rounded-md md:mb-0">
                <Image {...project.thumb} alt={project.thumb.alt} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
              </div>
            ) : <div className="hidden md:block" />}
            <div className="min-w-0 space-y-[14px] px-4 pt-2 md:col-span-4 md:pl-0 md:pr-6">
              <p className={`${mono} text-accent`}>{project.detail?.label ?? `${project.type} · ${project.result}`}</p>
              {project.detail ? <>
                <p className="text-[17px] leading-[26px] tracking-[-0.002em]">{project.detail.body}</p>
                <p className="text-[14px] leading-[21px] text-ink-secondary">{project.detail.contribution}</p>
              </> : null}
              {project.href ? <a href={project.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className={`inline-flex min-h-11 items-center text-[15px] font-medium leading-[22px] text-accent underline underline-offset-4 ${focusStyles}`}>View project ↗</a> : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function SideProjectsLog() {
  const [filter, setFilter] = useState<SideProject["type"]>();
  const [openProject, setOpenProject] = useState<string | null>("Monogatari");
  const visible = sideProjects.filter((project) => !filter || project.type === filter);

  return (
    <div className="mt-7">
      <div role="group" aria-label="Filter side projects" className="flex snap-x snap-mandatory gap-2 overflow-x-auto p-1 -mx-1">
        {filters.map((item) => (
          <button key={item.label} type="button" aria-pressed={filter === item.type} onClick={() => { setFilter(item.type); setOpenProject(null); }} className={`inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full px-4 text-[14px] ${focusStyles} ${filter === item.type ? "bg-ink text-white" : "text-ink-secondary"}`}>
            {item.label}<span className={filter === item.type ? "text-on-ink-secondary" : "text-ink-muted"}>{sideProjects.filter((project) => !item.type || project.type === item.type).length}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">{visible.length} {visible.length === 1 ? "entry" : "entries"}</p>
      <div className="mt-7 border-b border-border">
        <div aria-hidden="true" className={`hidden pb-3 ${rowGrid} ${mono} text-ink-muted`}>
          <span className="pl-[124px]">Project</span><span>Type</span><span>Built with</span><span>Result</span><span />
        </div>
        {visible.map((project, index) => (
          <Reveal key={project.name} delayMs={index * REVEAL_STAGGER_MS}>
            <LogEntry project={project} open={openProject === project.name} onToggle={() => setOpenProject((current) => current === project.name ? null : project.name)} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
