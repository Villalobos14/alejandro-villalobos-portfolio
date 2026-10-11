import Image from "next/image";
import CaseVisual from "@/components/case-study/CaseVisual";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import MaskedLines from "@/components/ui/MaskedLines";
import {
  mlsBehind,
  mlsContext,
  mlsDecisions,
  mlsFlow,
  mlsHeader,
  mlsNext,
  mlsPlaceholders,
  mlsProblem,
  mlsReflection,
  mlsResults,
  mlsSystem,
  mlsValidation,
} from "@/content/case-studies/mlstoolbox";
import { featuredProjects } from "@/lib/projects";
import CaseHeroVideo from "./CaseHeroVideo";
import MlsDisclosures from "./MlsDisclosures";
import { caseFocus } from "./styles";

const eyebrow = "text-mono text-ink-muted";
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
          <p className={`${eyebrow} flex flex-wrap items-center gap-x-3 gap-y-1`}>
            <TransitionLink href="/projects" className={`inline-flex min-h-11 items-center ${caseFocus}`}>
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
          <p className={`mt-6 max-w-[760px] text-[17px] leading-[1.55] text-ink-secondary md:text-[20px] md:leading-[31px] frame:mt-10`}>
            {mlsHeader.deck}
          </p>
          <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 frame:mt-auto">
            {mlsHeader.meta.map((item) => (
              <div key={item.label}>
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
          <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {mlsResults.shifts.map((shift) => (
              <div key={shift.label} className="py-6 md:px-7 md:py-7 md:first:pl-0 md:last:pr-0">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-[28px] font-medium leading-none text-ink-muted line-through">{shift.from}</span>
                  <span className="text-[28px] font-medium leading-none text-ink-muted" aria-hidden="true">
                    →
                  </span>
                  <span className="text-[40px] font-medium leading-none text-ink md:text-[52px]">{shift.to}</span>
                </p>
                <p className="mt-3 text-[15px] leading-snug text-ink-secondary">{shift.label}</p>
              </div>
            ))}
          </div>
          <p className="text-mono-s text-ink-muted">{mlsResults.note}</p>
        </section>

        <section aria-labelledby="mls-context" className="grid items-start gap-8 py-8 md:grid-cols-[408fr_840fr] md:gap-12 frame:min-h-[653px] frame:content-start frame:pb-0 frame:pt-32">
          <div className="order-2 md:order-none">
            <p className={eyebrow}>{mlsContext.eyebrow}</p>
            <h2 id="mls-context" className={`mt-4 ${h3}`}>
              {mlsContext.title}
            </h2>
            <p className={`mt-6 ${body}`}>{mlsContext.body}</p>
            <div className="mt-8 rounded-xl bg-bg-subtle p-[22px]">
              <p className={eyebrow}>{mlsContext.partLabel}</p>
              <p className="mt-3 text-[15px] leading-snug text-ink">{mlsContext.part}</p>
            </div>
          </div>
          <CaseVisual
            className="order-1 md:order-none"
            label={mlsPlaceholders.engineering}
            alt=""
            sizes="(min-width: 1024px) 840px, 100vw"
          />
        </section>

        <section aria-labelledby="mls-problem" className="grid items-start gap-10 py-10 md:grid-cols-[463fr_612fr] md:gap-[221px] frame:min-h-[474px] frame:pt-28">
          <div>
            <p className={eyebrow}>{mlsProblem.eyebrow}</p>
            <p className="mt-4 text-[clamp(32px,8vw,56px)] font-medium leading-[1.07] tracking-[-0.025em] text-ink frame:text-[56px] frame:leading-[60px]">
              {mlsProblem.quote[0]}
              <br />
              {mlsProblem.quote[1]}
            </p>
            <p className="mt-6 max-w-[460px] text-[15px] leading-snug text-ink-secondary">{mlsProblem.attribution}</p>
          </div>
          <div>
            <h2 id="mls-problem" className={h3}>
              {mlsProblem.title}
            </h2>
            <p className={`mt-4 ${body}`}>{mlsProblem.body}</p>
            <p className="mt-6 text-mono-s text-ink-muted">{mlsProblem.note}</p>
          </div>
        </section>

        <section aria-labelledby="mls-flow" className="py-12 frame:min-h-[1157px] frame:pb-[12px] frame:pt-[147px]">
          <p className={eyebrow}>{mlsFlow.eyebrow}</p>
          <h2 id="mls-flow" className={`mt-3 ${h2}`}>
            {mlsFlow.title}
          </h2>
          <p className="mt-4 max-w-[760px] text-[17px] leading-[1.55] text-ink-secondary md:text-[20px] md:leading-[31px]">
            {mlsFlow.deck}
          </p>
          <CaseVisual className="mt-8" label={mlsPlaceholders.flow} alt="" sizes="(min-width: 1024px) 1296px, 100vw" />
        </section>

        <section aria-labelledby="mls-decisions" className="py-12 frame:min-h-[1771px] frame:pt-[147px]">
          <p className={eyebrow}>{mlsDecisions.eyebrow}</p>
          <h2 id="mls-decisions" className={`mt-3 ${h2}`}>
            {mlsDecisions.title}
          </h2>
          <p className="mt-4 max-w-[760px] text-[17px] leading-[1.55] text-ink-secondary md:text-[20px] md:leading-[31px]">
            {mlsDecisions.deck}
          </p>
          <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-x-6 md:gap-y-12">
            {mlsDecisions.cells.map((cell) => (
              <div key={cell.label}>
                <CaseVisual label={cell.visual} alt="" sizes="(min-width: 1024px) 636px, 100vw" />
                <p className={`mt-4 ${eyebrow}`}>{cell.label}</p>
                <h3 className={`mt-3 ${h3}`}>{cell.title}</h3>
                <p className={`mt-3 ${body}`}>{cell.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl bg-bg-subtle px-6 py-8 md:px-[33px] frame:mt-12 frame:flex frame:min-h-[192px] frame:items-center frame:gap-8">
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
        </section>

        <section aria-labelledby="mls-system" className="grid items-center gap-8 py-12 md:grid-cols-[840fr_408fr] md:gap-12 frame:min-h-[669px]">
          <CaseVisual label={mlsPlaceholders.system} alt="" sizes="(min-width: 1024px) 840px, 100vw" />
          <div>
            <p className={eyebrow}>{mlsSystem.eyebrow}</p>
            <h2 id="mls-system" className={`mt-4 ${h3}`}>
              {mlsSystem.title}
            </h2>
            <p className={`mt-4 ${body}`}>{mlsSystem.body}</p>
            <p className="mt-8 flex flex-wrap items-baseline gap-x-3">
              <span className="text-[28px] font-medium leading-none text-ink-muted">{mlsSystem.from}</span>
              <span className="text-[28px] leading-none text-ink-muted" aria-hidden="true">
                →
              </span>
              <span className="text-[44px] font-medium leading-none text-ink">{mlsSystem.to}</span>
            </p>
            <p className="mt-3 text-[15px] leading-snug text-ink-secondary">{mlsSystem.caption}</p>
            <p className="mt-4 text-mono-s text-ink-muted">{mlsSystem.note}</p>
          </div>
        </section>

        <section aria-labelledby="mls-validation" className="py-12 frame:min-h-[1310px] frame:pt-[163px]">
          <p className={eyebrow}>{mlsValidation.eyebrow}</p>
          <h2 id="mls-validation" className={`mt-3 ${h2}`}>
            {mlsValidation.title}
          </h2>
          <p className="mt-4 max-w-[760px] text-[17px] leading-[1.55] text-ink-secondary md:text-[20px] md:leading-[31px]">
            {mlsValidation.deck}
          </p>
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
                {mlsValidation.rows.map((row) => (
                  <div
                    key={row[0]}
                    className="grid grid-cols-[344fr_130fr_130fr] gap-4 border-b border-border py-4"
                  >
                    <p className="text-[17px] leading-[27px] text-ink">{row[0]}</p>
                    <p className="text-[17px] leading-[27px] text-ink">{row[1]}</p>
                    <p className="text-[20px] font-medium leading-7 text-ink">{row[2]}</p>
                  </div>
                ))}
              </div>
              <div className="md:hidden">
                {mlsValidation.rows.map((row) => (
                  <div key={row[0]} className="border-b border-border py-4">
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
                ))}
              </div>
            </div>
            <CaseVisual
              src="/case-studies/visual-10-outcomes.jpg"
              alt="Outcomes dashboard of the documented study"
              label="Visual 10 — Outcomes"
              sizes="(min-width: 1024px) 636px, 100vw"
            />
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
            {mlsValidation.cards.map((card) => (
              <div key={card.label}>
                <p className={eyebrow}>{card.label}</p>
                <p className="mt-2 text-[28px] font-medium leading-none text-ink">{card.value}</p>
                <p className="mt-3 text-[15px] leading-snug text-ink-secondary">{card.body}</p>
                <p className="mt-3 text-mono-s text-ink-muted">{card.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <MlsDisclosures titles={mlsValidation.disclosures} />
          </div>
        </section>

        <section aria-labelledby="mls-behind" className="py-12 frame:min-h-[703px] frame:pt-[131px]">
          <p className={eyebrow}>{mlsBehind.eyebrow}</p>
          <h2 id="mls-behind" className={`mt-3 ${h2}`}>
            {mlsBehind.title}
          </h2>
          <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-6">
            {mlsBehind.columns.map((column) => (
              <figure key={column.src}>
                {column.src.endsWith("visual-12-themes.png") ? (
                  // TODO(content): re-exportar, el archivo está vacío
                  <CaseVisual src={column.src} alt={column.alt} label={column.alt} sizes="(min-width: 1024px) 416px, 100vw" />
                ) : (
                  <CaseVisual src={column.src} alt={column.alt} label={column.alt} sizes="(min-width: 1024px) 416px, 100vw" />
                )}
                <figcaption className="mt-4 text-[15px] leading-snug text-ink-secondary">{column.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section aria-labelledby="mls-reflection" className="grid gap-10 py-12 md:grid-cols-[612fr_684fr] frame:min-h-[540px] frame:pt-32">
          <div>
            <p className={eyebrow}>{mlsReflection.eyebrow}</p>
            <h2 id="mls-reflection" className={`mt-4 ${h2}`}>
              {mlsReflection.title}
            </h2>
            <p className="mt-6 text-[17px] leading-[1.55] text-ink-secondary md:text-[20px] md:leading-[31px]">
              {mlsReflection.body}
            </p>
          </div>
          <div>
            <p className="text-mono-s text-ink-muted">{mlsReflection.nextLabel}</p>
            <ol className="mt-4 space-y-6">
              {mlsReflection.items.map((item, index) => (
                <li key={item} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-2">
                  <span className={eyebrow}>{String(index + 1).padStart(2, "0")}</span>
                  <p className={body}>{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-label="Next case" className="pb-16 frame:min-h-[403px] frame:pb-0">
          <div className="grid overflow-hidden rounded-3xl border border-border transition-colors duration-300 fine:hover:bg-bg-subtle md:h-[275px] md:grid-cols-[425px_minmax(0,1fr)]">
            {ominioCover ? (
              <div className="relative aspect-[16/10] md:aspect-auto">
                <Image src={ominioCover.src} alt={ominioCover.alt} fill sizes="425px" className="object-cover" />
              </div>
            ) : (
              <div className="hidden md:block" />
            )}
            <div className="flex flex-col justify-center gap-3 px-6 py-8 md:px-8">
              <p className={eyebrow}>{mlsNext.label}</p>
              <TransitionLink href="/work/ominio" className={`inline-flex min-h-11 items-center ${caseFocus}`}>
                <span className="text-[clamp(36px,10vw,48px)] font-semibold leading-none tracking-[-0.04em] text-ink frame:text-[80px] frame:leading-[80px]">
                  {mlsNext.title}
                </span>
              </TransitionLink>
              <p className="max-w-[650px] text-[17px] leading-[27px] text-ink">{mlsNext.description}</p>
              <div className="mt-2 flex flex-col items-start gap-1">
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
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
