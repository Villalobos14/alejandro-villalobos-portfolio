import AboutSwitch from "@/components/system/AboutSwitch";
import MaskedLines from "@/components/ui/MaskedLines";
import { funHeader } from "@/lib/fun";

/** The opening anchor comes from PageShell, including Geist Mono's optical offset. */
export default function FunHero() {
  return (
    <header data-fun-section="header" className="relative flex flex-col gap-8 pb-16 pt-[var(--page-mono-start)] frame:block frame:h-[543px] frame:py-0">
      <p data-fun-eyebrow className="text-mono text-ink-muted frame:absolute frame:left-0 frame:top-[var(--page-mono-start)]">
        {funHeader.eyebrow}
      </p>
      <MaskedLines
        as="h1"
        lines={[...funHeader.title]}
        className="text-[clamp(40px,11vw,80px)] font-semibold leading-none tracking-[-0.04em] text-ink frame:absolute frame:left-0 frame:top-[112px] frame:text-[80px] frame:leading-[80px]"
        maskClassName="py-[0.05em] -my-[0.05em]"
      />
      <p className="max-w-[560px] text-body-l text-ink-secondary frame:absolute frame:left-0 frame:top-[312px] frame:w-[560px]">
        {funHeader.deck}
      </p>
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-[30px] frame:absolute frame:left-0 frame:top-[410px]">
        <div className="shrink-0 md:w-[198px]">
          <AboutSwitch />
        </div>
        <p className="max-w-[560px] text-mono !leading-[18px] text-ink-muted md:!leading-[16px]">
          {funHeader.meta}
        </p>
      </div>
    </header>
  );
}
