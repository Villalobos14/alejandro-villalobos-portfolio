import Image from "next/image";
import CaseVisual from "@/components/case-study/CaseVisual";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import MaskedLines from "@/components/ui/MaskedLines";
import Reveal from "@/components/ui/Reveal";
import RevealHeading from "@/components/ui/RevealHeading";
import {
  mlsBehind,
  mlsContext,
  mlsDecisions,
  mlsFlow,
  mlsHeader,
  mlsNext,
  mlsPhotos,
  mlsPlaceholders,
  mlsProblem,
  mlsReflection,
  mlsResults,
  mlsSystem,
  mlsValidation,
} from "@/content/case-studies/mlstoolbox";
import { REVEAL_STAGGER_MS } from "@/lib/motion";
import { featuredProjects } from "@/lib/projects";
import CaseHeroVideo from "./CaseHeroVideo";
import MlsDisclosures from "./MlsDisclosures";
import { caseFocus } from "./styles";

const eyebrow = "text-mono text-ink-muted";
const stickyEyebrow = `${eyebrow} lg:sticky lg:top-0 lg:z-20 lg:bg-bg lg:py-1`;
const body = "text-[17px] leading-[27px] text-ink-secondary";
const h2 =
  "text-[clamp(32px,8vw,48px)] font-semibold leading-[1.12] tracking-[-0.025em] text-ink frame:text-[48px] frame:leading-[54px]";
const h3 = "text-[28px] font-medium leading-[34px] tracking-[-0.015em] text-ink";

function MetaValue({ lines }: { lines: readonly string[] }) {
  return (
    <dd className="text-[17px] leading-[27px] text-ink">
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </dd>
  );
}

export default function MlsCaseStudy() {
  const ominio = featuredProjects.find((project) => project.href === "/work/ominio");
  const ominioCover = ominio?.media?.type === "image" ? ominio.media : null;

  return (
    <article className="bg-bg text-ink">
      <div className="page-container">
        <header className="flex flex-col pb-12 pt-8 frame:min-h-[580px] frame:pb-[59px] frame:pt-[76px]">
          <p className={`${eyebrow} mt-0.5 flex flex-wrap items-start gap-x-3 gap-y-1`}>
            <TransitionLink href="/projects" className={`inline-flex min-h-11 items-start ${caseFocus}`}>
              ← Work
            </TransitionLink>
            <span aria-hidden="true">/</span>
            <span>{mlsHeader.crumb}</span>
          </p>
          <MaskedLines
            as="h1"
            lines={[...mlsHeader.title]}
            className="mt-6 max-w-[12em] text-[clamp(40px,11vw,56px)] font-semibold leading-none tracking-[-0.04em] text-ink frame:mt-6 frame:max-w-none frame:text-[80px] frame:leading-[80px]"
          />
          <Reveal className="mt-6 frame:mt-10">
            <p className="max-w-[760px] text-[17px] leading-[1.55] text-ink-secondary md:text-[20px] md:leading-[31px]">
              {mlsHeader.deck}
            </p>
          </Reveal>
          <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 frame:mt-auto frame:grid-cols-[repeat(4,306px)]">
            {mlsHeader.meta.map((item) => (
              <div key={item.label} data-hairline="meta" className="border-t border-border pt-[15px]">
                <dt className={eyebrow}>{item.label}</dt>
                <MetaValue lines={item.lines} />
              </div>
            ))}
          </dl>
        </header>

        <section aria-label="Hero" className="pb-8 frame:min-h-[818px] frame:pb-0 frame:pt-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border frame:min-h-[810px] frame:aspect-auto">
            <CaseHeroVideo />
          </div>
        </section>

        <section aria-label="Results" className="pb-12 frame:flex frame:min-h-[211px] frame:flex-col frame:justify-between frame:pb-0">
          <div className="grid md:grid-cols-3 md:gap-x-6">
            {mlsResults.shifts.map((shift, index) => (
              <Reveal key={shift.label} delayMs={index * REVEAL_STAGGER_MS}>
              <div
                data-hairline="result"
                className="border-t border-border py-6 md:h-[141px] md:border-r md:px-7 md:py-7 md:last:border-r-0"
              >
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-[28px] font-medium leading-none text-ink-muted line-through">{shift.from}</span>
                  <span className="text-[28px] font-medium leading-none text-ink-muted" aria-hidden="true">
                    →
                  </span>
                  <span className="text-[40px] font-medium leading-none text-ink md:text-[52px]">{shift.to}</span>
                </p>
                <p className="mt-3 text-[15px] leading-snug text-ink-secondary">{shift.label}</p>
              </div>
              </Reveal>
            ))}
          </div>
          <p className="text-mono-s text-ink-muted">{mlsResults.note}</p>
        </section>

        <section aria-labelledby="mls-context" className="grid items-start gap-8 py-8 md:grid-cols-[408fr_840fr] md:gap-12 frame:min-h-[653px] frame:content-start frame:pb-0 frame:pt-32 lg:isolate">
          <div className="order-2 md:order-none lg:self-stretch">
            <p data-sticky-eyebrow="01" className={stickyEyebrow}>
              {mlsContext.eyebrow}
            </p>
            <RevealHeading as="h2" id="mls-context" className={`mt-4 ${h3}`}>
              {mlsContext.title}
            </RevealHeading>
            <Reveal className="mt-6">
              <p className={body}>{mlsContext.body}</p>
            </Reveal>
            <div className="mt-8 border-l-2 border-ink py-1 pl-[22px] frame:min-h-[124px]">
              <p className={eyebrow}>{mlsContext.partLabel}</p>
              <p className="mt-3 text-[15px] leading-snug text-ink">{mlsContext.part}</p>
            </div>
          </div>
          <Reveal className="order-1 md:order-none">
            <CaseVisual
              label={mlsPlaceholders.engineering}
              alt=""
              sizes="(min-width: 1024px) 840px, 100vw"
            />
          </Reveal>
        </section>

        <section aria-labelledby="mls-problem" className="grid items-start gap-10 py-10 md:grid-cols-[463fr_612fr] md:gap-[221px] frame:min-h-[474px] frame:pt-28 lg:isolate">
          <div className="lg:self-stretch">
            <p data-sticky-eyebrow="02" className={stickyEyebrow}>
              {mlsProblem.eyebrow}
            </p>
            <p className="mt-4 text-[clamp(32px,8vw,56px)] font-medium leading-[1.07] tracking-[-0.025em] text-ink frame:text-[56px] frame:leading-[60px]">
              {mlsProblem.quote[0]}
              <br />
              {mlsProblem.quote[1]}
            </p>
            <p className="mt-6 max-w-[460px] text-[15px] leading-snug text-ink-secondary">{mlsProblem.attribution}</p>
          </div>
          <div>
            <RevealHeading as="h2" id="mls-problem" className={h3}>
              {mlsProblem.title}
            </RevealHeading>
            <Reveal className="mt-4">
              <p className={body}>{mlsProblem.body}</p>
            </Reveal>
            <p className="mt-6 text-mono-s text-ink-muted">{mlsProblem.note}</p>
          </div>
        </section>

        <section aria-labelledby="mls-flow" className="py-12 frame:min-h-[1157px] frame:pb-[12px] frame:pt-[131px] lg:isolate">
          <div data-hairline="flow" className="border-t border-border pt-[15px] lg:pt-[11px]">
            <p data-sticky-eyebrow="03" className={stickyEyebrow}>
              {mlsFlow.eyebrow}
            </p>
            <div className="frame:min-h-[152px]">
              <RevealHeading as="h2" id="mls-flow" className={`mt-3 ${h2}`}>
                {mlsFlow.title}
              </RevealHeading>
              <Reveal className="mt-4">
                <p className="max-w-[760px] text-[17px] leading-[1.55] text-ink-secondary md:text-[20px] md:leading-[31px]">
                  {mlsFlow.deck}
                </p>
              </Reveal>
            </div>
            <Reveal className="mt-8">
              <CaseVisual label={mlsPlaceholders.flow} alt="" sizes="(min-width: 1024px) 1296px, 100vw" />
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="mls-decisions" className="py-12 frame:min-h-[1771px] frame:pt-[131px] lg:isolate">
          <div data-hairline="decisions" className="border-t border-border pt-[15px] lg:pt-[11px]">
            <p data-sticky-eyebrow="04" className={stickyEyebrow}>
              {mlsDecisions.eyebrow}
            </p>
            <div className="frame:min-h-[152px]">
              <RevealHeading as="h2" id="mls-decisions" className={`mt-3 ${h2}`}>
                {mlsDecisions.title}
              </RevealHeading>
              <Reveal className="mt-4">
                <p className="max-w-[760px] text-[17px] leading-[1.55] text-ink-secondary md:text-[20px] md:leading-[31px]">
                  {mlsDecisions.deck}
                </p>
              </Reveal>
            </div>
          <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-x-6 md:gap-y-12">
            {mlsDecisions.cells.map((cell, index) => (
              <Reveal key={cell.label} delayMs={index * REVEAL_STAGGER_MS}>
                <CaseVisual label={cell.visual} alt="" sizes="(min-width: 1024px) 636px, 100vw" />
                <p className={`mt-4 ${eyebrow}`}>{cell.label}</p>
                <h3 className={`mt-3 ${h3}`}>{cell.title}</h3>
                <p className={`mt-3 ${body}`}>{cell.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12">
          <div className="rounded-2xl bg-bg-subtle px-6 py-8 md:px-[33px] frame:flex frame:min-h-[192px] frame:items-center frame:gap-8">
            <p className="text-mono-s text-ink-muted md:w-[156px] md:shrink-0">{mlsDecisions.droppedLabel}</p>
            <div>
              <p className="text-[clamp(32px,6vw,48px)] font-semibold leading-none tracking-[-0.025em] text-ink">
                {mlsDecisions.droppedTitle}
              </p>
              <p className="mt-3 max-w-[1041px] text-[17px] leading-snug text-ink-secondary md:text-[20px] md:leading-[31px]">
                {mlsDecisions.droppedBody}
              </p>
            </div>
          </div>
          </Reveal>
          </div>
        </section>

        <section aria-labelledby="mls-system" className="grid items-center gap-8 py-12 md:grid-cols-[840fr_408fr] md:gap-12 frame:min-h-[669px] lg:isolate">
          <Reveal className="lg:self-center">
            <CaseVisual label={mlsPlaceholders.system} alt="" sizes="(min-width: 1024px) 840px, 100vw" />
          </Reveal>
          <div className="lg:flex lg:flex-col lg:justify-center lg:self-stretch">
            <p data-sticky-eyebrow="05" className={stickyEyebrow}>
              {mlsSystem.eyebrow}
            </p>
            <RevealHeading as="h2" id="mls-system" className={`mt-4 ${h3}`}>
              {mlsSystem.title}
            </RevealHeading>
            <Reveal className="mt-4">
              <p className={body}>{mlsSystem.body}</p>
            </Reveal>
            <div data-hairline="system" className="mt-8 border-t border-border pt-[15px] frame:h-[94px]">
              <p className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-[28px] font-medium leading-none text-ink-muted">{mlsSystem.from}</span>
                <span className="text-[28px] leading-none text-ink-muted" aria-hidden="true">
                  →
                </span>
                <span className="text-[44px] font-medium leading-none text-ink">{mlsSystem.to}</span>
              </p>
              <p className="mt-3 text-[15px] leading-snug text-ink-secondary">{mlsSystem.caption}</p>
            </div>
            <p className="mt-4 text-mono-s text-ink-muted">{mlsSystem.note}</p>
          </div>
        </section>

        <section aria-labelledby="mls-validation" className="py-12 frame:min-h-[1310px] frame:pt-[147px] lg:isolate">
          <div data-hairline="validation" className="border-t border-border pt-[15px] lg:pt-[11px]">
            <p data-sticky-eyebrow="06" className={stickyEyebrow}>
              {mlsValidation.eyebrow}
            </p>
            <div className="frame:min-h-[152px]">
              <RevealHeading as="h2" id="mls-validation" className={`mt-3 ${h2}`}>
                {mlsValidation.title}
              </RevealHeading>
              <Reveal className="mt-4">
                <p className="max-w-[760px] text-[17px] leading-[1.55] text-ink-secondary md:text-[20px] md:leading-[31px]">
                  {mlsValidation.deck}
                </p>
              </Reveal>
            </div>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[636fr_636fr] lg:gap-6">
            <div>
              <div className="hidden grid-cols-[344fr_130fr_130fr] gap-4 border-b border-border pb-3 md:grid">
                {mlsValidation.columns.map((column) => (
                  <p key={column} className="text-mono-s text-ink-muted">
                    {column}
                  </p>
                ))}
              </div>
              <div className="hidden md:block">
                {mlsValidation.rows.map((row, index) => (
                  <Reveal key={row[0]} delayMs={index * REVEAL_STAGGER_MS}>
                    <div className="grid grid-cols-[344fr_130fr_130fr] gap-4 border-b border-border py-4">
                      <p className="text-[17px] leading-[27px] text-ink">{row[0]}</p>
                      <p className="text-[17px] leading-[27px] text-ink">{row[1]}</p>
                      <p className="text-[20px] font-medium leading-7 text-ink">{row[2]}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <div className="md:hidden">
                {mlsValidation.rows.map((row, index) => (
                  <Reveal key={row[0]} delayMs={index * REVEAL_STAGGER_MS}>
                  <div className="border-b border-border py-4">
                    <p className="text-[17px] leading-snug text-ink">{row[0]}</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-mono-s text-ink-muted">{mlsValidation.columns[1]}</p>
                        <p className="mt-2 text-[17px] leading-snug text-ink">{row[1]}</p>
                      </div>
                      <div>
                        <p className="text-mono-s text-ink-muted">{mlsValidation.columns[2]}</p>
                        <p className="mt-2 text-[20px] font-medium leading-7 text-ink">{row[2]}</p>
                      </div>
                    </div>
                  </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal>
              <CaseVisual
                src="/case-studies/visual-10-outcomes.jpg"
                alt="Outcomes dashboard of the documented study"
                label="Visual 10 — Outcomes"
                sizes="(min-width: 1024px) 636px, 100vw"
                photos={mlsPhotos}
                photoIndex={0}
              />
            </Reveal>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
            {mlsValidation.cards.map((card, index) => (
              <Reveal key={card.label} delayMs={index * REVEAL_STAGGER_MS}>
              <div data-hairline="metric" className="border-t border-border pt-[15px]">
                <p className={eyebrow}>{card.label}</p>
                <p className="mt-2 text-[28px] font-medium leading-none text-ink">{card.value}</p>
                <p className="mt-3 text-[15px] leading-snug text-ink-secondary">{card.body}</p>
                <p className="mt-3 text-mono-s text-ink-muted">{card.note}</p>
              </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <MlsDisclosures titles={mlsValidation.disclosures} />
          </div>
          </div>
        </section>

        <section aria-labelledby="mls-behind" className="py-12 frame:min-h-[703px] frame:pt-[115px] lg:isolate">
          <div data-hairline="behind" className="border-t border-border pt-[15px] lg:pt-[11px]">
            <p data-sticky-eyebrow="07" className={stickyEyebrow}>
              {mlsBehind.eyebrow}
            </p>
            <div className="frame:min-h-[76px]">
              <RevealHeading as="h2" id="mls-behind" className={`mt-3 ${h2}`}>
                {mlsBehind.title}
              </RevealHeading>
            </div>
          <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-6">
            {mlsBehind.columns.map((column, index) => (
              <Reveal key={column.src} delayMs={index * REVEAL_STAGGER_MS}>
              <figure>
                {column.src.endsWith("visual-12-themes.png") ? (
                  // TODO(content): re-exportar, el archivo está vacío
                  <CaseVisual
                    src={column.src}
                    alt={column.alt}
                    label={column.alt}
                    sizes="(min-width: 1024px) 416px, 100vw"
                    photos={mlsPhotos}
                    photoIndex={mlsPhotos.findIndex((photo) => photo.src === column.src)}
                  />
                ) : (
                  <CaseVisual
                    src={column.src}
                    alt={column.alt}
                    label={column.alt}
                    sizes="(min-width: 1024px) 416px, 100vw"
                    photos={mlsPhotos}
                    photoIndex={mlsPhotos.findIndex((photo) => photo.src === column.src)}
                  />
                )}
                <figcaption className="mt-4 text-[15px] leading-snug text-ink-secondary">{column.caption}</figcaption>
              </figure>
              </Reveal>
            ))}
          </div>
          </div>
        </section>

        <section aria-labelledby="mls-reflection" className="grid gap-10 py-12 md:grid-cols-[612fr_684fr] frame:min-h-[540px] frame:pt-32 lg:isolate">
          <div className="lg:self-stretch">
            <p data-sticky-eyebrow="08" className={stickyEyebrow}>
              {mlsReflection.eyebrow}
            </p>
            <RevealHeading as="h2" id="mls-reflection" className={`mt-4 ${h2}`}>
              {mlsReflection.title}
            </RevealHeading>
            <Reveal className="mt-6">
              <p className="text-[17px] leading-[1.55] text-ink-secondary md:text-[20px] md:leading-[31px]">
                {mlsReflection.body}
              </p>
            </Reveal>
          </div>
          <div className="md:w-[612px] md:justify-self-end">
            <p className="text-mono-s text-ink-muted">{mlsReflection.nextLabel}</p>
            <ol className="mt-4">
              {mlsReflection.items.map((item, index) => (
                <li key={item} data-hairline="next-time" className="h-16 border-t border-border">
                  <Reveal
                    delayMs={index * REVEAL_STAGGER_MS}
                    className="grid h-full grid-cols-[52px_minmax(0,1fr)] items-center"
                  >
                    <span className={eyebrow}>{String(index + 1).padStart(2, "0")}</span>
                    <p className={body}>{item}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-label="Next case" className="pb-16 frame:min-h-[403px] frame:pb-0">
          <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border transition-colors duration-300 fine:hover:bg-bg-subtle frame:h-[275px]">
            <TransitionLink
              href="/work/ominio"
              aria-label={`${mlsNext.label}. ${mlsNext.title}`}
              className={`absolute inset-0 z-[1] hidden frame:block ${caseFocus}`}
            />
            {ominioCover ? (
              <div className="relative mx-6 mt-6 aspect-[16/10] overflow-hidden rounded-xl frame:absolute frame:left-[25px] frame:top-[25px] frame:mx-0 frame:mt-0 frame:aspect-auto frame:h-[225px] frame:w-[360px]">
                <Image src={ominioCover.src} alt={ominioCover.alt} fill sizes="360px" className="object-cover" />
              </div>
            ) : null}
            <div className="pointer-events-none px-6 py-8 frame:absolute frame:left-[425px] frame:top-[64px] frame:w-[650px] frame:p-0">
              <p className={eyebrow}>{mlsNext.label}</p>
              <p className="mt-3 text-[clamp(36px,10vw,48px)] font-semibold leading-none tracking-[-0.04em] text-ink frame:mt-4 frame:text-[80px] frame:leading-[80px]">
                {mlsNext.title}
              </p>
              <p className="mt-3 max-w-[650px] text-[17px] leading-[27px] text-ink">{mlsNext.description}</p>
            </div>
            <div className="flex flex-col items-start px-6 pb-8 frame:hidden">
              <TransitionLink
                href="/work/ominio"
                className={`inline-flex min-h-11 items-center text-[17px] font-medium text-accent ${caseFocus}`}
              >
                {mlsNext.read}
              </TransitionLink>
              <TransitionLink
                href="/projects"
                className={`inline-flex min-h-11 items-center text-[17px] text-ink-secondary ${caseFocus}`}
              >
                {mlsNext.all}
              </TransitionLink>
            </div>
            <div className="pointer-events-none absolute right-10 top-[103px] z-[2] hidden flex-col items-end gap-6 frame:flex">
              <p className="text-[17px] font-medium leading-none text-accent">{mlsNext.read}</p>
              <TransitionLink
                href="/projects"
                className={`pointer-events-auto inline-flex min-h-11 items-start text-[17px] leading-none text-ink-secondary ${caseFocus}`}
              >
                {mlsNext.all}
              </TransitionLink>
            </div>
          </div>
          </Reveal>
        </section>
      </div>
    </article>
  );
}
