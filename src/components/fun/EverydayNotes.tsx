import ProSection from "@/components/about/ProSection";
import ElsewhereCard from "@/components/fun/ElsewhereCard";
import KoreanCard from "@/components/fun/KoreanCard";
import OnRepeatCard from "@/components/fun/OnRepeatCard";
import Reveal from "@/components/ui/Reveal";
import { everyday } from "@/lib/fun";
import { REVEAL_STAGGER_MS } from "@/lib/motion";

const card = "relative min-w-0 border border-border p-6 md:p-7 frame:h-[328px] frame:p-[27px]";

export default function EverydayNotes() {
  return (
    <div data-fun-section="everyday">
      <ProSection
        id="fun-everyday"
        eyebrow={everyday.eyebrow}
        title={everyday.title}
        hairline="everyday"
        className="py-16 frame:h-[710px] frame:pb-0 frame:pt-[110px]"
      >
        <div className="mt-10 grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 frame:grid-cols-[433fr_435fr_380fr]">
          <Reveal delayMs={0} className="min-w-0">
            <OnRepeatCard className={`${card} bg-cover-ink text-bg`} />
          </Reveal>
          <Reveal delayMs={REVEAL_STAGGER_MS} className="min-w-0">
            <ElsewhereCard className={`${card} frame:!px-7`} />
          </Reveal>
          <Reveal delayMs={2 * REVEAL_STAGGER_MS} className="min-w-0 md:col-span-2 frame:col-span-1 frame:ml-px">
            <KoreanCard className={`${card} bg-bg`} />
          </Reveal>
        </div>
      </ProSection>
    </div>
  );
}
