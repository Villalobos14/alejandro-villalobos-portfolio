import AboutSwitch from "@/components/system/AboutSwitch";
import MediaPlaceholder from "@/components/media/MediaPlaceholder";
import MaskedLines from "@/components/ui/MaskedLines";
import { professionalHeader } from "@/lib/about";

const h1 =
  "max-w-[12em] text-[clamp(40px,11vw,80px)] font-semibold leading-none tracking-[-0.04em] text-ink frame:max-w-none frame:text-[80px] frame:leading-[80px]";

/**
 * Opening of /about Professional. The portrait asset does not exist yet:
 * the frame, the border and the caption are real; the photo slot is a placeholder.
 */
export default function AboutHeader() {
  return (
    <header className="relative flex flex-col gap-8 py-10 md:grid md:grid-cols-[minmax(320px,1fr)_minmax(0,330px)] md:items-start md:gap-x-8 md:py-16 frame:block frame:h-[690px] frame:py-0">
      <p className="text-mono text-ink-muted md:col-start-1 frame:absolute frame:left-0 frame:top-[78px]">
        {professionalHeader.eyebrow}
      </p>
      <MaskedLines
        as="h1"
        lines={[...professionalHeader.title]}
        className={`md:col-start-1 frame:absolute frame:left-0 frame:top-[117px] ${h1}`}
        maskClassName="py-[0.06em] -my-[0.12em]"
      />
      <p className="max-w-[640px] text-[20px] leading-[31px] text-ink-secondary md:col-start-1 frame:absolute frame:left-0 frame:top-[318px] frame:w-[640px]">
        {professionalHeader.deck}
      </p>
      <div className="w-full md:col-start-1 md:w-max frame:absolute frame:left-0 frame:top-[470px]">
        <AboutSwitch stretch />
      </div>
      <p className="order-6 max-w-[411px] text-mono text-ink-muted md:max-w-none md:whitespace-nowrap md:order-none md:col-start-1 frame:absolute frame:left-0 frame:top-[548px] frame:w-[411px]">
        {professionalHeader.meta}
      </p>
      <figure className="relative order-5 mx-auto aspect-[330/420] w-full max-w-[330px] border border-border bg-bg md:order-none md:col-start-2 md:row-span-5 md:row-start-1 md:mx-0 md:justify-self-end frame:absolute frame:right-0 frame:top-[96px] frame:mx-0 frame:h-[420px] frame:w-[330px] frame:max-w-none">
        {/* TODO(content): retrato 330×420 */}
        <div className="absolute inset-x-0 top-0 h-[83%]">
          <MediaPlaceholder seed="about-portrait" className="h-full" />
        </div>
        <figcaption className="absolute inset-x-4 bottom-5 text-[11px] leading-[14px] text-ink-muted frame:bottom-auto frame:left-4 frame:right-4 frame:top-[386px]">
          {professionalHeader.portraitCaption}
        </figcaption>
      </figure>
    </header>
  );
}
