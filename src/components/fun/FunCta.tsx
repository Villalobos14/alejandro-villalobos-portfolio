import { proH2 } from "@/components/about/ProSection";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import { funCta } from "@/lib/fun";

const focus = "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";
const button = `inline-flex min-h-[55px] w-full items-center justify-center rounded-full px-5 text-body-s font-medium transition-colors duration-300 motion-reduce:transition-none md:w-auto ${focus}`;

export default function FunCta() {
  return (
    <section data-fun-section="cta" aria-labelledby="fun-cta" className="pb-16 frame:h-[226px] frame:pb-0">
      <div data-hairline="cta" className="flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between frame:h-[98px] frame:items-start frame:pt-10">
        <h2 id="fun-cta" className={`${proH2} frame:mt-0.5`}>{funCta.title}</h2>
        <div className="flex shrink-0 flex-col gap-4 md:flex-row md:gap-5">
          <TransitionLink href="/about" className={`${button} bg-ink text-bg fine:hover:bg-accent fine:hover:text-ink frame:mt-px frame:h-[55px] frame:w-[160px] frame:self-start`}>
            {funCta.professional}
          </TransitionLink>
          <TransitionLink href="/projects" className={`${button} min-h-[57px] border border-border text-ink fine:hover:border-ink frame:w-[169px]`}>
            {funCta.work}
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
