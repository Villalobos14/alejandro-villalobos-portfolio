import { thinkingLead, thinkingStages, type StageId, type ThinkingStage } from "@/lib/about";
import { collaborationCopy } from "@/lib/professional";
import SectionHead from "./SectionHead";
import {
  ChallengeSketch,
  ConnectSketch,
  MakeSketch,
  ProcessRail,
  QuestionSketch,
  StageConnector,
  UnderstandSketch,
} from "./sketches/ProcessSketches";
import { labelCase, tone } from "./tone";

const SKETCHES: Record<StageId, (props: { label: string }) => JSX.Element> = {
  question: QuestionSketch,
  understand: UnderstandSketch,
  connect: ConnectSketch,
  make: MakeSketch,
  challenge: ChallengeSketch,
};

function Stage({ stage, mirrored }: { stage: ThinkingStage; mirrored: boolean }) {
  const Sketch = SKETCHES[stage.id];

  return (
    <article
      aria-labelledby={`stage-${stage.id}`}
      className="grid grid-cols-1 items-center gap-x-8 gap-y-5 lg:grid-cols-12"
    >
      <div
        className={`flex flex-col gap-4 lg:col-span-4 lg:row-start-1 lg:gap-5 ${
          mirrored ? "lg:col-start-9" : "lg:col-start-1"
        }`}
      >
        <ProcessRail current={Number(stage.number)} loopBack={stage.loopsBack} />
        <p className={`${labelCase} ${tone.meta}`}>
          <span className="text-secondary">{stage.number}</span>
          <span aria-hidden="true"> — </span>
          {stage.title}
        </p>
        <h3
          id={`stage-${stage.id}`}
          className="text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-[1.05] tracking-tight text-white"
        >
          {stage.question}
        </h3>
        <p className={`max-w-md text-body-lg ${tone.secondary}`}>{stage.body}</p>
      </div>
      <div
        className={`w-full max-w-[640px] lg:col-span-7 lg:row-start-1 ${
          mirrored ? "lg:col-start-1" : "lg:col-start-6 lg:justify-self-end"
        }`}
      >
        <Sketch label={stage.sketchLabel} />
      </div>
    </article>
  );
}

/** 02 — From questions to systems: five behaviours, one loop. */
export default function ProfessionalThinking() {
  return (
    <section aria-label="How I think" className="w-full overflow-x-clip px-[var(--page-gutter)]">
      <SectionHead index="02 — How I think" title={["From questions", "to systems."]}>
        <p className={`text-body-lg ${tone.secondary}`}>{thinkingLead}</p>
      </SectionHead>

      <ol className="mt-10 flex flex-col lg:mt-14">
        {thinkingStages.map((stage, index) => {
          const mirrored = index % 2 === 1;
          const last = index === thinkingStages.length - 1;

          return (
            <li key={stage.id} className="flex flex-col">
              <Stage stage={stage} mirrored={mirrored} />
              {last ? null : (
                <div className="flex justify-start py-6 pl-4 lg:-my-8 lg:block lg:py-0 lg:pl-0">
                  <StageConnector
                    from={mirrored ? "left" : "right"}
                    to={mirrored ? "right" : "left"}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-10 grid grid-cols-1 gap-x-8 lg:mt-14 lg:grid-cols-12">
        <p className={`max-w-2xl text-body-lg lg:col-span-6 lg:col-start-4 ${tone.secondary}`}>
          {collaborationCopy[1]}
        </p>
      </div>
    </section>
  );
}
