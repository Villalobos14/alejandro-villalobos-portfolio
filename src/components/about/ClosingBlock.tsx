import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { TransitionLink } from "@/components/curtain/TransitionLink";
import Reveal from "@/components/ui/Reveal";

interface ClosingBlockProps {
  label: string;
  title: string;
  href: string;
}

export default function ClosingBlock({ label, title, href }: ClosingBlockProps) {
  return (
    <Reveal className="w-full px-[var(--page-gutter)]">
      <TransitionLink
        href={href}
        data-cursor={`Ir a ${title}`}
        className="group flex flex-col gap-scale rounded-2xl border border-gray/40 p-scale transition-transform duration-500 ease-out fine:hover:rotate-[0.5deg] fine:hover:scale-[0.99] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:p-12"
      >
        <span className="text-body uppercase tracking-[0.2em] text-gray">
          {label}
        </span>
        <span className="flex flex-wrap items-center gap-scale text-[clamp(2rem,7vw,4.5rem)] font-medium leading-none tracking-tight text-white transition-colors duration-300 fine:group-hover:text-secondary">
          {title}
          <ArrowRightIcon
            aria-hidden="true"
            className="pointer-events-none size-8 shrink-0 transition-transform duration-500 ease-out fine:group-hover:translate-x-2"
          />
        </span>
      </TransitionLink>
    </Reveal>
  );
}
