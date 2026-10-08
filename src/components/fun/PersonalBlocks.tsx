import PhotoButton from "@/components/media/PhotoButton";
import Reveal from "@/components/ui/Reveal";
import { PHOTO_HOVER, PHOTO_IMAGE_HOVER } from "./motion";
import RevealHeading from "./RevealHeading";
import Placeholder, { IS_PRODUCTION } from "@/components/ui/Placeholder";
import {
  PERSONAL_BLOCK_SLOTS,
  personalBlocks,
  type PersonalBlock,
  type Photo,
} from "@/lib/personal";

const blockPhotos: Photo[] = personalBlocks
  .map((block) => block.photo)
  .filter((photo): photo is Photo => photo !== undefined);

function photoIndex(block: PersonalBlock): number {
  return block.photo ? blockPhotos.indexOf(block.photo) : -1;
}

/**
 * Per-story composition. Every story reads head → photo → body on small
 * screens; from lg the same three parts are placed on a 12-column grid.
 */
interface StoryLayout {
  head: string;
  title: string;
  media: string;
  photo: string;
  image: string;
  sizes: string;
  body: string;
  /** Where the photo settles from; varied per story so they do not arrive in lockstep. */
  enter?: { x: number; y: number; r: number };
  /** Sits beside another story in a two-up row instead of owning a full row. */
  pair?: boolean;
}

const TITLE = "text-3xl font-medium leading-[1.05] tracking-tight text-white md:text-5xl";

const layouts: Record<string, StoryLayout> = {
  "beyond-design": {
    head: "lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-end",
    title: `${TITLE} lg:text-[clamp(3rem,5.4vw,5.5rem)] lg:leading-[0.95]`,
    media: "lg:col-span-8 lg:col-start-1 lg:row-span-2 lg:row-start-1",
    photo: "aspect-[2538/1692] -rotate-1",
    image: "",
    sizes: "(max-width: 1023px) 92vw, 62vw",
    body: "lg:col-span-4 lg:col-start-9 lg:row-start-2",
    enter: { x: -16, y: 28, r: -0.8 },
  },
  "sharing-knowledge": {
    head: "lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-end",
    title: `${TITLE} lg:text-[clamp(2.5rem,4.4vw,4.5rem)] lg:leading-[0.98]`,
    media: "lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1",
    photo: "aspect-[2756/1604] rotate-1",
    image: "",
    sizes: "(max-width: 1023px) 92vw, 62vw",
    body: "lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:self-start",
    enter: { x: 16, y: 28, r: 0.8 },
  },
  storytelling: {
    head: "",
    title: TITLE,
    media: "w-[72%] lg:w-[68%]",
    photo: "aspect-[19/20] -rotate-1",
    image: "object-left",
    sizes: "(max-width: 1023px) 150vw, 64vw",
    body: "lg:max-w-md",
    enter: { x: -8, y: 30, r: -0.6 },
    pair: true,
  },
  leadership: {
    head: "",
    title: TITLE,
    media: "ml-auto w-[72%] lg:ml-0 lg:w-[68%]",
    photo: "aspect-[9/10] rotate-1",
    image: "object-left",
    sizes: "(max-width: 1023px) 150vw, 64vw",
    body: "lg:max-w-md",
    enter: { x: 8, y: 30, r: 0.6 },
    pair: true,
  },
  "on-repeat": {
    head: "lg:col-span-7 lg:col-start-1",
    title: `${TITLE} md:text-6xl lg:text-[clamp(4rem,9vw,8.5rem)] lg:leading-[0.9]`,
    media: "",
    photo: "",
    image: "",
    sizes: "",
    body: "lg:col-span-4 lg:col-start-9 lg:self-end",
  },
  "away-from-the-screen": {
    head: "lg:col-span-4 lg:col-start-1",
    title: `${TITLE} lg:text-[clamp(2.5rem,4.4vw,4.5rem)] lg:leading-[0.98]`,
    media: "",
    photo: "",
    image: "",
    sizes: "",
    body: "lg:col-span-7 lg:col-start-6",
  },
};

const fallback: StoryLayout = {
  head: "lg:col-span-5",
  title: TITLE,
  media: "lg:col-span-7",
  photo: "aspect-[3/2]",
  image: "",
  sizes: "(max-width: 1023px) 92vw, 50vw",
  body: "lg:col-span-5",
};

function Story({ block }: { block: PersonalBlock }) {
  const layout = layouts[block.id] ?? fallback;
  const index = photoIndex(block);
  const pair = layout.pair === true;

  return (
    <article
      className={`grid grid-cols-1 gap-x-8 gap-y-5 border-t border-gray/30 pt-6 lg:gap-y-6 lg:pt-8 ${
        pair ? "lg:grid-cols-1" : "lg:grid-cols-12"
      }`}
    >
      <header className={`flex flex-col gap-3 ${layout.head}`}>
        <Reveal offsetY={8} durationMs={600}>
          <p className="flex items-baseline gap-3 text-body uppercase tracking-[0.2em] text-gray">
            <span aria-hidden="true" className="h-px w-6 self-center bg-secondary" />
            {block.label}
          </p>
        </Reveal>
        <RevealHeading className={layout.title} delayMs={80}>
          {block.title}
        </RevealHeading>
      </header>

      {index >= 0 ? (
        <Reveal
          className={layout.media}
          offsetX={layout.enter?.x ?? 0}
          offsetY={layout.enter?.y ?? 28}
          rotateDeg={layout.enter?.r ?? 0}
        >
          <PhotoButton
            photos={blockPhotos}
            index={index}
            sizes={layout.sizes}
            rounded={pair ? "rounded-md" : "rounded-none"}
            imageClassName={`${layout.image} ${PHOTO_IMAGE_HOVER}`}
            className={`w-full ${PHOTO_HOVER} ${layout.photo}`}
          />
        </Reveal>
      ) : null}

      <Reveal className={`flex flex-col gap-4 ${layout.body}`} delayMs={180} offsetY={14}>
        {block.body ? (
          <p className="max-w-xl text-body-lg text-gray">{block.body}</p>
        ) : null}
        {block.items && block.items.length > 0 ? (
          <ul className="flex flex-col gap-1 text-body text-gray">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </Reveal>
    </article>
  );
}

export default function PersonalBlocks() {
  if (personalBlocks.length === 0 && IS_PRODUCTION) return null;

  const pairIds = ["storytelling", "leadership"];
  const pair = personalBlocks.filter((block) => pairIds.includes(block.id));
  const pairAt = personalBlocks.findIndex((block) => block.id === pairIds[0]);

  return (
    <section
      aria-label="Personal notes"
      className="flex w-full flex-col gap-16 overflow-x-clip px-[var(--page-gutter)] lg:gap-28"
    >
      {personalBlocks.map((block, position) => {
        if (pairIds.includes(block.id)) {
          if (position !== pairAt) return null;

          return (
            <div
              key="pair"
              className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0"
            >
              {pair.map((entry, offset) => (
                <div
                  key={entry.id}
                  className={`lg:col-span-6 ${offset === 1 ? "lg:mt-32" : ""}`}
                >
                  <Story block={entry} />
                </div>
              ))}
            </div>
          );
        }

        return <Story key={block.id} block={block} />;
      })}

      {IS_PRODUCTION || PERSONAL_BLOCK_SLOTS.length === 0 ? null : (
        <div className="grid grid-cols-1 gap-scale sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAL_BLOCK_SLOTS.map((slot) => (
            <Placeholder key={slot} label={slot} />
          ))}
        </div>
      )}
    </section>
  );
}
