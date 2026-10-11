"use client";

import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/curtain/TransitionLink";

const focusStyles =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

const options = [
  { id: "professional", label: "Professional", href: "/about" },
  { id: "fun", label: "Fun", href: "/fun" },
] as const;

export default function AboutSwitch({ stretch = false }: { stretch?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="About sections" className={stretch ? "w-full md:w-max md:max-w-full" : "w-max max-w-full"}>
      <ul className={`flex items-center gap-1 rounded-full border border-border bg-bg p-1 ${stretch ? "w-full md:w-auto" : ""}`}>
        {options.map((option) => {
          const selected = pathname === option.href;

          return (
            <li key={option.id} className={stretch ? "min-w-0 flex-1 md:flex-none" : undefined}>
              <TransitionLink
                href={option.href}
                aria-current={selected ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-4 text-mono transition-colors duration-300 motion-reduce:transition-none ${focusStyles} ${
                  stretch ? "w-full justify-center md:w-auto" : ""
                } ${
                  selected
                    ? "bg-accent text-white"
                    : "text-ink-secondary fine:hover:text-ink active:text-ink"
                }`}
              >
                {option.label}
              </TransitionLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
