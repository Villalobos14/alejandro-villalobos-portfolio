import PhotoButton from "@/components/media/PhotoButton";
import Reveal from "@/components/ui/Reveal";
import { collagePhotos } from "@/lib/personal";
import { PHOTO_HOVER, PHOTO_IMAGE_HOVER } from "./motion";
import ScrollDepth from "./ScrollDepth";

const ME = 0;
const LEADERSHIP = 1;
const STORYTELLING = 2;

interface EntryProps {
  index: number;
  label: string;
  caption: string;
  className: string;
  photoIndex: number;
  /** Below lg each diptych shows one half so it can run large; lg shows the whole frame. */
  photoClassName: string;
  imageClassName: string;
  sizes: string;
  /** Scroll-depth factor on lg; omitted photos stay put. */
  depth?: number;
  /** Where the photo settles from, so no two frames arrive the same way. */
  enter: { x: number; y: number; r: number };
}

function Entry({
  index,
  label,
  caption,
  className,
  photoIndex,
  photoClassName,
  imageClassName,
  sizes,
  depth,
  enter,
}: EntryProps) {
  return (
    <div
      data-depth={depth}
      className={`relative fine:has-[button:hover]:z-30 has-[button:focus-visible]:z-30 ${className}`}
    >
      <figure>
        <Reveal offsetX={enter.x} offsetY={enter.y} rotateDeg={enter.r}>
          <PhotoButton
            photos={collagePhotos}
            index={photoIndex}
            sizes={sizes}
            rounded="rounded-md lg:rounded-none"
            imageClassName={`${imageClassName} ${PHOTO_IMAGE_HOVER}`}
            className={`w-full ${PHOTO_HOVER} ${photoClassName}`}
          />
        </Reveal>
        <Reveal
          as="figcaption"
          delayMs={220}
          offsetY={8}
          durationMs={600}
          className="mt-4 max-w-[19rem] text-body text-gray"
        >
          <span className="block uppercase tracking-[0.2em] text-white">
            <span className="text-secondary">0{index}</span> / {label}
          </span>
          <span className="mt-1 block">{caption}</span>
        </Reveal>
      </figure>
    </div>
  );
}

export default function Collage() {
  return (
    <section
      aria-label="Photo collage"
      className="w-full overflow-x-clip px-[var(--page-gutter)]"
    >
      <ScrollDepth className="mx-auto flex max-w-[34rem] flex-col gap-12 md:max-w-xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
        <Entry
          index={1}
          label="Out loud"
          caption="A classroom full of computers, then a microphone and a wall that says Chiapas."
          photoIndex={STORYTELLING}
          className="z-0 w-[88%] self-start lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:w-auto"
          photoClassName="aspect-[27/40] -rotate-[1.5deg] lg:aspect-[2568/1577] lg:-rotate-1"
          imageClassName="object-right lg:object-center"
          sizes="(max-width: 1023px) 200vw, 62vw"
          enter={{ x: -14, y: 30, r: -1.5 }}
        />
        <Entry
          index={2}
          label="Making things"
          caption="A hackathon table, then the team that ended up around it."
          photoIndex={LEADERSHIP}
          className="z-20 w-[78%] self-end lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-28 lg:w-auto"
          photoClassName="aspect-[9/10] rotate-[1.5deg] lg:-ml-12 lg:aspect-[2708/1512] lg:w-[calc(100%+3rem)] lg:rotate-2"
          imageClassName="object-right lg:object-center"
          sizes="(max-width: 1023px) 160vw, 36vw"
          depth={0.024}
          enter={{ x: 14, y: 38, r: 1.5 }}
        />
        <Entry
          index={3}
          label="Good people"
          caption="A café on one side, a room with guitars on the other."
          photoIndex={ME}
          className="z-10 w-[84%] self-start lg:col-span-4 lg:col-start-5 lg:row-start-2 lg:-mt-28 lg:w-auto"
          photoClassName="aspect-[3/4] -rotate-1 lg:aspect-[2538/1692] lg:rotate-1"
          imageClassName="object-right lg:object-center"
          sizes="(max-width: 1023px) 170vw, 42vw"
          depth={-0.018}
          enter={{ x: -10, y: 24, r: -1 }}
        />
      </ScrollDepth>
    </section>
  );
}
