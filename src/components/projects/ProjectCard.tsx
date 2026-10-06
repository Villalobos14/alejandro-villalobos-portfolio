import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import Media from "@/components/media/Media";
import type { ContentSide, FeaturedProject } from "@/lib/projects";

interface ProjectCardProps {
  project: FeaturedProject;
  isStacked: boolean;
}

/**
 * Content column: three fifths of the card on tablet, then the text measure on
 * desktop, so right-hand copy starts well past the middle of the cover.
 */
const contentWidth = "md:w-[60%] lg:w-[min(56%,37rem)]";

/**
 * How far the scrim holds before it starts to fall off: just past the content
 * column's inner edge. Both scrim layers read it, so text on either side sits
 * on the dense part and the falloff happens over open media.
 */
const scrimReach = "md:[--scrim-x:66%] lg:[--scrim-x:min(60%,42rem)]";

/**
 * Everything that mirrors between the two compositions. Class names stay
 * literal so Tailwind can find them. The scrim is a dark gradient plus a blur
 * masked to the same falloff, so it never ends at an edge.
 */
const sides: Record<
  ContentSide,
  { topRow: string; content: string; blur: string; shade: string }
> = {
  left: {
    topRow: "",
    content: "",
    blur: "[mask-image:linear-gradient(to_right,#000_0%,#000_calc(var(--scrim-x)_*_0.8),transparent_calc(var(--scrim-x)_+_18%))]",
    shade:
      "bg-[linear-gradient(to_right,rgb(12_13_14/0.8)_0%,rgb(12_13_14/0.74)_calc(var(--scrim-x)_*_0.6),rgb(12_13_14/0.62)_var(--scrim-x),rgb(12_13_14/0.3)_calc(var(--scrim-x)_+_10%),rgb(12_13_14/0.1)_calc(var(--scrim-x)_+_20%),rgb(12_13_14/0)_calc(var(--scrim-x)_+_30%))]",
  },
  right: {
    topRow: "md:flex-row-reverse",
    content: "md:self-end",
    blur: "[mask-image:linear-gradient(to_left,#000_0%,#000_calc(var(--scrim-x)_*_0.8),transparent_calc(var(--scrim-x)_+_18%))]",
    shade:
      "bg-[linear-gradient(to_left,rgb(12_13_14/0.8)_0%,rgb(12_13_14/0.74)_calc(var(--scrim-x)_*_0.6),rgb(12_13_14/0.62)_var(--scrim-x),rgb(12_13_14/0.3)_calc(var(--scrim-x)_+_10%),rgb(12_13_14/0.1)_calc(var(--scrim-x)_+_20%),rgb(12_13_14/0)_calc(var(--scrim-x)_+_30%))]",
  },
};

/** Card-level states: a fine pointer hovering anywhere, or keyboard focus on its link. */
const lifted = {
  media:
    "motion-safe:fine:group-hover:scale-[1.03] motion-safe:group-has-[:focus-visible]:scale-[1.03]",
  shade: "fine:group-hover:opacity-100 group-has-[:focus-visible]:opacity-100",
  cta: "fine:group-hover:text-secondary group-has-[:focus-visible]:text-secondary",
  arrow:
    "fine:group-hover:translate-x-1 fine:group-hover:-translate-y-1 group-has-[:focus-visible]:translate-x-1 group-has-[:focus-visible]:-translate-y-1",
};

/**
 * A full-bleed cover with the case study layered on one side. The link sits in
 * the heading and its ::after stretches over the whole card, so the card is a
 * single link named by its title while the rest stays readable text. Nothing
 * between the article and that link may be positioned or transformed, or the
 * overlay would shrink to that box.
 */
export default function ProjectCard({ project, isStacked }: ProjectCardProps) {
  const side = sides[project.contentSide];
  const summaryId = `project-${project.id}-summary`;

  return (
    <article
      data-pet-surface="card"
      data-pet-surface-id={`project-${project.id}`}
      className={`group relative isolate flex w-full flex-col justify-between gap-24 overflow-hidden rounded-2xl border border-gray/40 bg-primary p-5 transition-colors duration-500 fine:hover:border-white/40 has-[:focus-visible]:border-white/40 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-white md:gap-8 md:p-8 lg:p-10 xl:p-12 ${
        isStacked
          ? "h-[min(40rem,calc(100svh-var(--dock-clearance)-4rem))]"
          : "min-h-[38rem] md:min-h-[36rem] lg:min-h-[40rem]"
      }`}
    >
      <div
        className={`absolute inset-0 -z-10 transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${lifted.media}`}
      >
        <Media
          source={project.media}
          sizes="(max-width: 1440px) 100vw, 1440px"
          placeholder={{ seed: project.href }}
        />
      </div>

      {/* Mobile keeps the index readable over whatever the cover shows up top. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-primary/60 to-transparent md:hidden"
      />

      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 hidden md:block ${scrimReach}`}
      >
        <div
          className={`absolute inset-0 backdrop-blur-[10px] [-webkit-backdrop-filter:blur(10px)] ${side.blur}`}
        />
        <div
          className={`absolute inset-0 opacity-90 transition-opacity duration-700 ${side.shade} ${lifted.shade}`}
        />
      </div>

      <div className={`flex items-center justify-between gap-4 ${side.topRow}`}>
        <p className={`text-body tabular-nums tracking-[0.2em] text-white/70 ${contentWidth}`}>
          {project.id}
        </p>
        {project.readMinutes ? (
          <p className="shrink-0 rounded-full border border-white/20 bg-primary/40 px-3 py-1 text-[0.6875rem] font-medium uppercase leading-4 tracking-[0.16em] text-white/80 backdrop-blur-md [-webkit-backdrop-filter:blur(12px)]">
            {project.readMinutes} min read
          </p>
        ) : null}
      </div>

      {/*
        Below md the text spans the card, so its scrim is this block's own
        background: it grows with the copy and fades out through the top
        padding. From md up the side scrim above takes over. (No max-md:
        here: the raw `fine` screen in the Tailwind config disables max-*.)
      */}
      <div
        className={`-mx-5 -mb-5 flex flex-col bg-[linear-gradient(to_top,rgb(12_13_14/0.92)_0%,rgb(12_13_14/0.86)_calc(100%_-_7rem),rgb(12_13_14/0.5)_calc(100%_-_3.5rem),rgb(12_13_14/0)_100%)] px-5 pb-5 pt-28 md:m-0 md:bg-none md:p-0 ${contentWidth} ${side.content}`}
      >
        <h3 className="break-words text-[clamp(2.125rem,5.4vw,5rem)] font-medium leading-[0.95] tracking-[-0.02em] text-white">
          <TransitionLink
            href={project.href}
            data-cursor={project.linkLabel}
            aria-describedby={summaryId}
            className="outline-none after:absolute after:inset-0 after:z-10"
          >
            <span className="block">{project.name}</span>
            {project.subtitle ? (
              <span className="block text-white/50">{project.subtitle}</span>
            ) : null}
          </TransitionLink>
        </h3>

        <p
          id={summaryId}
          className="mt-4 max-w-[34rem] text-pretty text-label text-white/80 md:mt-5 md:text-body-lg"
        >
          {project.summary}
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {/*
            Every item leads with a separator and the list is pulled left by
            one separator's width, so whichever item starts a line has its dot
            clipped: no stray dot when the line wraps.
          */}
          <div className="overflow-hidden">
            <ul className="-ml-5 flex flex-wrap gap-y-1 text-xs font-medium uppercase tracking-[0.16em] text-white">
              {project.category.map((item) => (
                <li key={item} className="flex items-center">
                  <span aria-hidden="true" className="w-5 text-center text-white/40">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {project.meta.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/20 bg-primary/50 px-2.5 py-0.5 text-xs text-white/70"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {project.metrics?.length ? (
          <dl className="mt-6 grid max-w-[30rem] auto-cols-fr grid-flow-col gap-x-4 border-t border-white/15 pt-4 md:gap-x-6">
            {project.metrics.map((metric) => (
              // Label first for assistive tech; the figure leads visually.
              <div key={metric.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-2 text-xs leading-4 text-white/60">{metric.label}</dt>
                <dd className="text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-none tracking-tight tabular-nums text-white">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {/* Visual only: the heading link already covers the card. */}
        <span
          aria-hidden="true"
          className={`mt-6 flex w-fit items-center gap-2 text-label text-white transition-colors duration-300 ${lifted.cta}`}
        >
          {project.linkLabel}
          <ArrowUpRightIcon
            className={`size-4 transition-transform duration-500 ease-out ${lifted.arrow}`}
          />
        </span>
      </div>
    </article>
  );
}
