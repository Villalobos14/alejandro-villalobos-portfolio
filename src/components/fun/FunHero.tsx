import AboutSubNav from "@/components/about/AboutSubNav";
import PhotoButton from "@/components/media/PhotoButton";
import MaskedLines from "@/components/ui/MaskedLines";
import Reveal from "@/components/ui/Reveal";
import { funIntro, heroPhotos } from "@/lib/personal";
import { PHOTO_HOVER, PHOTO_IMAGE_HOVER } from "./motion";

/**
 * Opening spread of /fun. The photo is the café half of the first diptych; the
 * lightbox still opens the full frame.
 *
 * Entrance order: index → heading (masked lines) → intro → photo → caption.
 */
export default function FunHero() {
  return (
    <header className="grid w-full grid-cols-1 gap-x-8 gap-y-10 overflow-x-clip px-[var(--page-gutter)] pt-scale text-white lg:grid-cols-12 lg:gap-y-0">
      <div className="flex flex-col gap-scale lg:col-span-7 lg:pt-[7vh]">
        <Reveal offsetY={10} durationMs={600}>
          <p className="flex items-center gap-3 text-body uppercase tracking-[0.2em] text-gray">
            <span aria-hidden="true" className="h-px w-8 bg-secondary" />
            02 — The personal side
          </p>
        </Reveal>
        <MaskedLines
          as="h1"
          lines={[
            funIntro.title[0],
            <>
              {funIntro.title[1]}
              <span className="text-secondary">.</span>
            </>,
          ]}
          className="text-[clamp(4rem,20vw,9rem)] font-medium leading-[0.92] tracking-tight lg:text-[clamp(6rem,10vw,10.5rem)]"
        />
        <Reveal className="flex flex-col gap-6 lg:mt-6" delayMs={350}>
          <p className="max-w-md text-body-lg text-gray">{funIntro.body}</p>
          <div className="w-fit">
            <AboutSubNav active="fun" />
          </div>
        </Reveal>
      </div>

      <figure className="ml-auto w-[82%] md:w-[52%] lg:col-span-5 lg:mt-[4vh] lg:w-full lg:max-w-[32rem]">
        <Reveal delayMs={450} offsetY={32} rotateDeg={1.2}>
          <PhotoButton
            photos={heroPhotos}
            index={0}
            priority
            sizes="(max-width: 1023px) 170vw, 80vw"
            rounded="rounded-md"
            imageClassName={`object-left ${PHOTO_IMAGE_HOVER}`}
            className={`aspect-[3/4] w-full rotate-[1.5deg] ${PHOTO_HOVER}`}
          />
        </Reveal>
        <Reveal
          as="figcaption"
          delayMs={800}
          offsetY={8}
          durationMs={600}
          className="mt-4 flex items-baseline gap-3 text-body text-gray"
        >
          <span className="uppercase tracking-[0.2em] text-secondary">Fig.</span>
          Café side. The guitars are further down.
        </Reveal>
      </figure>
    </header>
  );
}
