import ProSection from "@/components/about/ProSection";
import PhotoButton from "@/components/media/PhotoButton";
import Reveal from "@/components/ui/Reveal";
import { cameraPhotos, cameraRoll, japanCaption } from "@/lib/fun";
import { REVEAL_STAGGER_MS } from "@/lib/motion";
import { PHOTO_HOVER } from "./motion";

const frames = [
  { photo: 0, width: "max-w-[286px]", ratio: "aspect-[260/320]", crop: "!right-auto object-left" },
  { photo: 1, width: "max-w-[326px]", ratio: "aspect-[300/260]", crop: "!left-auto object-right" },
  { photo: 2, width: "max-w-[366px]", ratio: "aspect-[340/220]", crop: "!left-auto object-right" },
  { photo: null, width: "max-w-[256px]", ratio: "aspect-square", crop: "" },
  { photo: 3, width: "max-w-[346px]", ratio: "aspect-[320/200]", crop: "!left-auto object-right" },
  { photo: 4, width: "max-w-[356px]", ratio: "aspect-[330/210]", crop: "!right-auto object-left" },
] as const;

const MAT_NUMBERS = Array.from({ length: 11 }, (_, index) => index + 1);

/** Two polaroids carry a strip of tape; the rest stay plain. Rotation in degrees. */
const TAPE: Partial<Record<number, string>> = { 0: "-rotate-3", 4: "rotate-2" };

export default function CameraRoll() {
  return (
    <div data-fun-section="camera-roll" data-cutting-mat="camera-roll" className="relative isolate bg-bg">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Same grid, spacing and tokens as the shared footer. */}
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgb(var(--mat-major))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--mat-major))_1px,transparent_1px),linear-gradient(to_right,rgb(var(--mat-minor))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--mat-minor))_1px,transparent_1px)] [background-size:5rem_5rem,5rem_5rem,1rem_1rem,1rem_1rem]" />
        <div className="absolute left-[125px] top-[6px] hidden md:flex">
          {MAT_NUMBERS.map((number) => (
            <span key={number} className="w-[120px] shrink-0 text-mono-s text-mat-number">{number}</span>
          ))}
        </div>
        <div className="absolute left-0 top-[140px] hidden h-px w-[1500px] origin-left rotate-[35deg] bg-mat-major md:block" />
      </div>
      <ProSection
        id="fun-camera-roll"
        eyebrow={cameraRoll.eyebrow}
        title={cameraRoll.title}
        hairline="camera-roll"
        className="page-container relative py-12 frame:h-[1000px] frame:pb-0 frame:pt-[38px]"
        headingClassName="frame:!mt-[10px]"
      >
        <div className="mt-10 grid grid-cols-1 items-start justify-items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 frame:mt-[38px] frame:grid-cols-[repeat(3,380px)] frame:gap-y-12">
          {frames.map((frame, index) => (
            <Reveal key={index} delayMs={index * REVEAL_STAGGER_MS} className={`w-full min-w-0 ${frame.width}`}>
              <figure
                data-polaroid={index + 1}
                className={`relative w-full rounded-none border border-border bg-bg px-3 pb-[14px] pt-3 shadow-[0_14px_26px_rgb(var(--ink)/0.15)] transition-transform duration-500 ease-out motion-reduce:transition-none ${frame.photo === null ? "" : `${PHOTO_HOVER} motion-reduce:fine:hover:translate-y-0`}`}
              >
                {TAPE[index] ? (
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -top-2 left-1/2 z-[1] h-4 w-14 -translate-x-1/2 bg-pop-orange/45 ${TAPE[index]}`}
                  />
                ) : null}
                {frame.photo === null ? (
                  <div className={`flex items-center justify-center bg-bg-subtle ${frame.ratio}`}>
                    <p className="text-mono-s text-ink-secondary">{cameraRoll.coming}</p>
                  </div>
                ) : (
                  <PhotoButton
                    photos={cameraPhotos}
                    index={frame.photo}
                    rounded="rounded-none"
                    className={`w-full ${frame.ratio}`}
                    // A 2× image box clips exactly one half of each diptych, including wide frames.
                    imageClassName={`!w-[200%] !max-w-none ${frame.crop}`}
                    sizes="(min-width: 1440px) 680px, (min-width: 640px) 90vw, 180vw"
                  />
                )}
                <figcaption className="mt-[10px] text-mono-s !leading-[14px] text-ink-muted">
                  {frame.photo === null ? japanCaption : cameraPhotos[frame.photo].caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-12 text-mono leading-[18px] text-ink-muted md:text-right frame:absolute frame:bottom-9 frame:right-[var(--page-gutter)] frame:mt-0 frame:leading-3">
          {cameraRoll.gear}
        </p>
      </ProSection>
    </div>
  );
}
