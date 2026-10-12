import ProSection from "@/components/about/ProSection";
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
            <article className={`${card} frame:!px-7`}>
              <h3 className="text-mono text-ink-muted">{everyday.travel.label}</h3>
              <p className="mt-5 flex items-baseline justify-between gap-2 whitespace-nowrap text-[clamp(36px,10vw,56px)] font-medium leading-none tracking-[-0.04em] md:text-[clamp(32px,4vw,56px)] frame:mt-[21px] frame:text-[56px]">
                <span>{everyday.travel.from}</span>
                <span className="text-[28px] text-accent" aria-hidden="true">→</span>
                <span className="sr-only">to</span>
                <span>{everyday.travel.to}</span>
              </p>
              <p className="mt-5 border-t border-border pt-[10px] text-body text-ink-secondary frame:mt-4 frame:pt-[13px]">
                {everyday.travel.body}
              </p>
              <dl className="mt-5 grid grid-cols-[0.8fr_1.5fr_1.3fr] gap-3 frame:mt-[18px] frame:grid-cols-[77px_143px_minmax(0,1fr)]">
                {everyday.travel.meta.map((item) => (
                  <div key={item.label} className="min-w-0">
                    <dt className="text-mono-s text-ink-muted">{item.label}</dt>
                    <dd className="mt-[7px] text-body-s leading-[20px] frame:whitespace-nowrap">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </Reveal>
          <Reveal delayMs={2 * REVEAL_STAGGER_MS} className="min-w-0 md:col-span-2 frame:col-span-1 frame:ml-px">
            <article className={`${card} bg-bg`}>
              <h3 className="text-mono text-ink-muted">{everyday.korean.label}</h3>
              <p className="mt-[30px] text-mono-s text-ink-muted">{everyday.korean.wordLabel}</p>
              {/* Geist has no Hangul glyphs: the existing system-ui/sans-serif stack supplies them. */}
              <p lang="ko" className="mt-8 font-sans text-[clamp(56px,16vw,88px)] font-medium leading-none tracking-[-0.04em] frame:mt-[39px]">
                {everyday.korean.word}
              </p>
              <p className="mt-8 text-mono !leading-[18px] text-ink frame:mt-[42px]">{everyday.korean.pronunciation}</p>
              <p className="mt-[18px] text-body-s text-ink-secondary">{everyday.korean.note}</p>
            </article>
          </Reveal>
        </div>
      </ProSection>
    </div>
  );
}
