import PhotoButton from "@/components/media/PhotoButton";
import Reveal from "@/components/ui/Reveal";
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

function Block({ block, sizes }: { block: PersonalBlock; sizes: string }) {
  const index = photoIndex(block);

  return (
    <div className="flex h-full flex-col gap-scale rounded-2xl border border-gray/40 p-scale md:p-8">
      <p className="text-body uppercase tracking-[0.2em] text-gray">
        {block.label}
      </p>
      <h3 className="text-2xl font-medium text-white md:text-3xl">
        {block.title}
      </h3>
      {block.body ? (
        <p className="max-w-2xl text-body-lg text-gray">{block.body}</p>
      ) : null}
      {block.items && block.items.length > 0 ? (
        <ul className="flex flex-col gap-1 text-body text-gray">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {index >= 0 ? (
        <PhotoButton
          photos={blockPhotos}
          index={index}
          sizes={sizes}
          className="mt-auto aspect-[16/10] w-full fine:hover:-translate-y-1"
        />
      ) : null}
    </div>
  );
}

export default function PersonalBlocks() {
  const [first, second, ...rest] = personalBlocks;

  if (personalBlocks.length === 0 && IS_PRODUCTION) return null;

  return (
    <section
      aria-label="Personal notes"
      className="flex w-full flex-col gap-scale px-[var(--page-gutter)]"
    >
      {first || second ? (
        <div className="grid grid-cols-1 gap-scale lg:grid-cols-5">
          {first ? (
            <Reveal className="lg:col-span-3">
              <Block block={first} sizes="(max-width: 1024px) 92vw, 46vw" />
            </Reveal>
          ) : null}
          {second ? (
            <Reveal className="lg:col-span-2" delayMs={120}>
              <Block block={second} sizes="(max-width: 1024px) 92vw, 32vw" />
            </Reveal>
          ) : null}
        </div>
      ) : null}

      {rest.map((block, index) => (
        <Reveal key={block.id} delayMs={index * 80}>
          <Block block={block} sizes="92vw" />
        </Reveal>
      ))}

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
