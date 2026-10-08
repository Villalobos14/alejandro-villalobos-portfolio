import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import Reveal from "@/components/ui/Reveal";

/** Last page of the spread: a page-specific take on the shared closing link. */
export default function FunClosing() {
  return (
    <Reveal className="w-full px-[var(--page-gutter)]">
      <TransitionLink
        href="/about"
        data-cursor="Ir a Professional"
        className="group flex flex-col gap-6 border-t border-gray/40 pt-6 transition-colors duration-500 fine:hover:border-secondary focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:pt-8"
      >
        <span className="flex items-baseline justify-between text-body uppercase tracking-[0.2em] text-gray">
          Next
          <span className="text-secondary">04</span>
        </span>
        <span className="text-[clamp(2.75rem,13.5vw,11rem)] font-medium leading-[0.9] tracking-tight text-white transition-colors duration-500 fine:group-hover:text-secondary">
          Professional
        </span>
        <span className="flex items-center justify-between gap-6 text-label text-gray">
          Product design, UX research and engineering.
          <ArrowRightIcon
            aria-hidden="true"
            className="pointer-events-none size-8 shrink-0 text-white transition-transform duration-500 ease-out fine:group-hover:translate-x-2 motion-reduce:transition-none"
          />
        </span>
      </TransitionLink>
    </Reveal>
  );
}
