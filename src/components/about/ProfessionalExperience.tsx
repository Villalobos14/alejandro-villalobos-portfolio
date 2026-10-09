import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { careerLayers, experienceLead, type CareerEntry } from "@/lib/about";
import { education } from "@/lib/professional";
import Responsibilities from "./Responsibilities";
import SectionHead from "./SectionHead";
import { CircledWord, MarginNote } from "./sketches/Marks";
import { focusRing, labelCase, tone } from "./tone";

function Period({ entry }: { entry: CareerEntry["entry"] }) {
  const current = entry.end.dateTime === "present";

  return (
    <p className={`leading-7 ${labelCase} ${tone.meta}`}>
      <time dateTime={entry.start.dateTime}>{entry.start.label}</time>
      <span aria-hidden="true"> — </span>
      <span className="sr-only"> to </span>
      {current ? (
        <CircledWord>
          <span className="text-secondary">{entry.end.label}</span>
        </CircledWord>
      ) : (
        <time dateTime={entry.end.dateTime}>{entry.end.label}</time>
      )}
    </p>
  );
}

function Layer({ layer }: { layer: CareerEntry }) {
  const { entry } = layer;
  const [lead, ...rest] = entry.bullets;

  return (
    <li className="grid grid-cols-1 gap-x-8 gap-y-3 border-t border-gray/30 py-6 lg:grid-cols-12 lg:gap-y-4 lg:py-12">
      <div className="lg:col-span-2">
        <Period entry={entry} />
      </div>

      <div className="flex flex-col gap-3 lg:col-span-6 lg:col-start-3 lg:gap-4">
        <div>
          <h3 className="text-[clamp(2rem,4.4vw,3.75rem)] font-medium leading-none tracking-tight text-white">
            {entry.company}
          </h3>
          <p className="mt-2 text-label text-white/85">{entry.role}</p>
        </div>
        {lead ? <p className={`max-w-2xl text-body-lg ${tone.secondary}`}>{lead}</p> : null}
        <Responsibilities items={rest} />
        {layer.caseStudy ? (
          <TransitionLink
            href={layer.caseStudy.href}
            data-cursor="Ver caso"
            className={`group inline-flex min-h-11 w-fit items-center gap-2 text-label text-white underline decoration-white/30 underline-offset-4 transition-colors duration-200 fine:hover:text-secondary fine:hover:decoration-secondary ${focusRing}`}
          >
            {layer.caseStudy.label}
            <ArrowUpRightIcon
              aria-hidden="true"
              className="pointer-events-none size-4 shrink-0 transition-transform duration-200 fine:group-hover:-translate-y-0.5 fine:group-hover:translate-x-0.5"
            />
          </TransitionLink>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 lg:col-span-3 lg:col-start-10 lg:gap-4 lg:pt-3">
        <p className={`text-body ${tone.meta}`}>{layer.disciplines.join(" · ")}</p>
        <div className="pl-5 lg:pl-0">
          <MarginNote mark={layer.mark}>{layer.note}</MarginNote>
        </div>
      </div>
    </li>
  );
}

/** 03 — A career in layers. */
export default function ProfessionalExperience() {
  return (
    <section aria-label="Experience" className="w-full overflow-x-clip px-[var(--page-gutter)]">
      <SectionHead index="03 — Experience" title={["A career", "in layers."]}>
        <p className={`text-body-lg ${tone.secondary}`}>{experienceLead}</p>
      </SectionHead>

      <ol className="mt-8 lg:mt-16">
        {careerLayers.map((layer) => (
          <Layer key={layer.entry.id} layer={layer} />
        ))}
      </ol>

      <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-y border-gray/30 py-8 lg:grid-cols-12">
        <h3 className={`lg:col-span-2 ${labelCase} ${tone.meta}`}>Education</h3>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:col-span-8 lg:col-start-3">
          {education.map((item) => (
            <li key={item.id} className="flex flex-col gap-1">
              <p className="text-label text-white">{item.title}</p>
              <p className={`text-body ${tone.secondary}`}>{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
