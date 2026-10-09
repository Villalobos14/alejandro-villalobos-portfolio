import { capabilityGroups, workingWith, type CapabilityGroup } from "@/lib/about";
import SectionHead from "./SectionHead";
import { curvedArrow, roughEllipse } from "./sketches/geometry";
import { Draw, DrawArrow, Note, type Frame } from "./sketches/primitives";
import SketchFrame from "./sketches/SketchFrame";
import { labelCase, tone } from "./tone";

/** The one category with a diagram: the human/model loop is still a question. */
function LoopSketch() {
  const f: Frame = { w: 280, h: 120 };

  return (
    <SketchFrame width={f.w} height={f.h} className="w-full max-w-[260px]">
      <svg viewBox={`0 0 ${f.w} ${f.h}`} aria-hidden="true">
        <Draw d={roughEllipse(58, 58, 46, 26, 91)} duration={400} />
        <Draw d={roughEllipse(212, 58, 46, 26, 93)} delay={120} duration={380} />
        <DrawArrow arrow={curvedArrow([108, 44], [162, 44], -0.25, 95, 8)} delay={300} duration={240} width={1.6} />
        <DrawArrow arrow={curvedArrow([162, 74], [108, 74], -0.25, 97, 8)} delay={420} duration={240} width={1.6} />
      </svg>
      <Note frame={f} x={58} y={58} size={24} align="center">
        people
      </Note>
      <Note frame={f} x={212} y={58} size={24} align="center">
        model
      </Note>
      <Note frame={f} x={140} y={110} size={23} tone="accent" align="center">
        who stays in the loop?
      </Note>
    </SketchFrame>
  );
}

function Group({ group }: { group: CapabilityGroup }) {
  return (
    <li className="group grid grid-cols-1 gap-x-8 gap-y-5 border-t border-gray/30 py-8 lg:grid-cols-12 lg:gap-y-6 lg:py-12">
      <div className="flex flex-col gap-3 lg:col-span-4">
        <p className={`text-body transition-colors duration-200 fine:group-hover:text-secondary ${tone.meta}`}>
          {group.number}
        </p>
        <h3 className="relative w-fit text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-[1.05] tracking-tight text-white">
          {group.title}
          <svg
            viewBox="0 0 300 12"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 left-0 hidden h-2.5 w-full fine:block"
          >
            <path
              d="M2 7 C 70 4, 150 9, 220 6 S 285 4, 298 3"
              pathLength={1}
              fill="none"
              stroke="#3DD964"
              strokeWidth={2}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-300 ease-out [stroke-dasharray:1_1] [stroke-dashoffset:1] motion-reduce:transition-none fine:group-hover:[stroke-dashoffset:0]"
            />
          </svg>
        </h3>
        <p className={`max-w-sm text-body-lg ${tone.secondary}`}>{group.lead}</p>
        {group.id === "ai" ? (
          <div className="mt-2">
            <LoopSketch />
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:col-span-7 lg:col-start-6 lg:gap-y-6">
        {group.sets.map((set) => (
          <div key={set.label} className={set.items.length > 3 ? "sm:col-span-2" : ""}>
            <h4 className={`${labelCase} ${set.tone === "exploring" ? "text-secondary" : tone.meta}`}>
              {set.label}
              {set.tone === "exploring" ? (
                <span className="ml-3 font-[family-name:var(--font-hand)] text-xl normal-case tracking-normal text-white/70">
                  still learning
                </span>
              ) : null}
            </h4>
            <ul className="mt-3 flex flex-col gap-1.5 text-body-lg text-white/90 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
              {set.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </li>
  );
}

/** 04 — Tools are part of the process. */
export default function ProfessionalCapabilities() {
  return (
    <section aria-label="Capabilities" className="w-full px-[var(--page-gutter)]">
      <SectionHead index="04 — Capabilities" title={["Tools are part", "of the process."]}>
        <p className={`text-body-lg ${tone.secondary}`}>
          Tools matter because they help me understand problems and build solutions. Grouped by
          what they are for, not by how long the list is.
        </p>
      </SectionHead>

      <ol className="mt-8 lg:mt-16">
        {capabilityGroups.map((group) => (
          <Group key={group.id} group={group} />
        ))}
      </ol>

      <div className="grid grid-cols-1 gap-x-8 gap-y-3 border-y border-gray/30 py-8 lg:grid-cols-12">
        <h3 className={`lg:col-span-4 ${labelCase} ${tone.meta}`}>Across all four</h3>
        <ul className={`flex max-w-3xl flex-col gap-1.5 text-body-lg sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2 lg:col-span-7 lg:col-start-6 ${tone.secondary}`}>
          {workingWith.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
