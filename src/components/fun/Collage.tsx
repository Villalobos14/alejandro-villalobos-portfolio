import PhotoButton from "@/components/media/PhotoButton";
import Reveal from "@/components/ui/Reveal";
import { collagePhotos } from "@/lib/personal";

const hoverStyles = "fine:hover:-translate-y-3 fine:hover:rotate-0";

export default function Collage() {
  return (
    <section aria-label="Photo collage" className="w-full px-[var(--page-gutter)]">
      <div className="grid grid-cols-2 gap-scale lg:grid-cols-[1.1fr_0.85fr_1.15fr] lg:items-start lg:gap-8">
        <Reveal>
          <PhotoButton
            photos={collagePhotos}
            index={0}
            sizes="(max-width: 1024px) 46vw, 30vw"
            className={`aspect-[4/5] w-full -rotate-2 ${hoverStyles}`}
          />
        </Reveal>

        <Reveal className="lg:mt-[22%]" delayMs={120}>
          <PhotoButton
            photos={collagePhotos}
            index={1}
            sizes="(max-width: 1024px) 46vw, 24vw"
            className={`aspect-[3/4] w-full rotate-3 ${hoverStyles}`}
          />
        </Reveal>

        <Reveal
          className="col-span-2 mx-auto w-2/3 lg:col-span-1 lg:mx-0 lg:mt-[8%] lg:w-full"
          delayMs={240}
        >
          <PhotoButton
            photos={collagePhotos}
            index={2}
            sizes="(max-width: 1024px) 62vw, 32vw"
            className={`aspect-[4/5] w-full -rotate-1 ${hoverStyles}`}
          />
        </Reveal>
      </div>
    </section>
  );
}
