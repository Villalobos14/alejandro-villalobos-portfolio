import { TransitionLink } from "@/components/curtain/TransitionLink";
import RevealHeading from "@/components/ui/RevealHeading";
import { aboutCta } from "@/lib/about";
import { hasCvPdf } from "@/lib/cv";
import { proH2 } from "./ProSection";
import { focusRing } from "./tone";

/** Closing row. Below the frame the heading stacks and both actions go full width. */
export default function AboutCta() {
  return (
    <section aria-labelledby="about-cta" className="frame:min-h-[226px]">
      <div
        data-hairline="cta"
        className="flex flex-col items-stretch gap-3 border-t border-border py-6 md:flex-row md:items-center md:justify-between frame:relative frame:block frame:h-[98px] frame:py-0"
      >
        <RevealHeading
          as="h2"
          id="about-cta"
          className={`${proH2} frame:absolute frame:left-0 frame:top-[43px]`}
        >
          {aboutCta.title}
        </RevealHeading>
        {hasCvPdf() ? <a
          href="/cv.pdf"
          className={`inline-flex min-h-11 w-full items-center justify-center text-[17px] font-medium text-ink fine:hover:text-accent-strong md:w-auto ${focusRing} frame:absolute frame:left-[869px] frame:top-[56px] frame:min-h-0 frame:w-auto frame:justify-start`}
        >
          {aboutCta.cv}
        </a> : null}
        <TransitionLink
          href="/fun"
          className={`inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border px-5 text-[17px] font-medium text-ink fine:hover:border-accent md:w-auto ${focusRing} frame:absolute frame:left-[1081px] frame:top-[41px] frame:h-[57px] frame:w-[215px] frame:px-0`}
        >
          {aboutCta.fun}
        </TransitionLink>
      </div>
    </section>
  );
}
