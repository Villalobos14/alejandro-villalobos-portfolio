import Reveal from "@/components/ui/Reveal";
import { howIWork } from "@/lib/about";
import { REVEAL_STAGGER_MS } from "@/lib/motion";
import ProSection from "./ProSection";
import {
  ChallengeSketch,
  ConnectSketch,
  MakeSketch,
  UnderstandSketch,
} from "./sketches/ProcessSketches";

const SKETCHES = {
  understand: UnderstandSketch,
  connect: ConnectSketch,
  make: MakeSketch,
  challenge: ChallengeSketch,
} as const;

/** 01 — Four habits. Sketch cards stack below 768 so each column stays readable. */
export default function HowIWork() {
  return (
    <ProSection
      id="about-work"
      eyebrow={howIWork.eyebrow}
      title={howIWork.title}
      hairline="how-i-work"
      className="pb-16 frame:min-h-[804px] frame:pb-0 frame:pt-24"
    >
      <ol className="mt-10 grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-6 frame:mt-12 frame:grid-cols-4">
        {howIWork.habits.map((habit, index) => {
          const Sketch = SKETCHES[habit.id];

          return (
            <li key={habit.id} className="min-w-0">
              <Reveal delayMs={index * REVEAL_STAGGER_MS}>
                <div className="overflow-hidden border border-border bg-bg">
                  <Sketch label={habit.sketchLabel} />
                </div>
                <p className="mt-8 text-mono text-ink">{habit.number}</p>
                <h3 className="mt-[18px] text-[20px] font-medium leading-[28px] text-ink">{habit.title}</h3>
                <p className="mt-[14px] text-[15px] leading-[22px] text-ink-secondary">{habit.body}</p>
                <p className="mt-[17px] text-mono-s text-ink-muted">{habit.foot}</p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </ProSection>
  );
}
