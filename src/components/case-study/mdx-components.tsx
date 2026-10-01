import { Children, isValidElement, type ReactNode } from "react";
import {
  SEE_NEXT_SECTION_ID,
  slugifyHeading,
  type CaseStudySection,
} from "@/lib/case-studies";
import Compare from "./Compare";
import Figure from "./Figure";
import Grid from "./Grid";
import Impact from "./Impact";
import Note from "./Note";
import Outcomes from "./Outcomes";
import ScreenGallery from "./ScreenGallery";
import Split from "./Split";
import Statement from "./Statement";
import Placeholder from "@/components/ui/Placeholder";

function toPlainText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (isValidElement<{ children?: ReactNode }>(child)) {
        return toPlainText(child.props.children);
      }

      return "";
    })
    .join("");
}

interface MdxOptions {
  transferSeeNextId?: boolean;
  sections?: CaseStudySection[];
}

export function getMdxComponents(options?: MdxOptions) {
  const sections = options?.sections ?? [];

  return {
    h2: ({ children }: { children?: ReactNode }) => {
      const id = slugifyHeading(toPlainText(children));
      const isSeeNext = id === SEE_NEXT_SECTION_ID;
      const htmlId =
        options?.transferSeeNextId && isSeeNext ? undefined : id;
      const position = sections.findIndex((section) => section.id === id);

      return (
        <h2
          id={htmlId}
          className="mt-stack flex scroll-mt-[var(--site-header-h)] flex-col gap-2 text-display text-white first:mt-0"
        >
          {position >= 0 && !isSeeNext ? (
            <span className="text-body uppercase tracking-[0.2em] text-gray">
              {String(position + 1).padStart(2, "0")}
            </span>
          ) : null}
          <span className="block">{children}</span>
        </h2>
      );
    },
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="text-body-lg text-white">{children}</h3>
    ),
    p: ({ children }: { children?: ReactNode }) => (
      <p className="max-w-3xl text-body text-gray">{children}</p>
    ),
    a: ({
      href,
      children,
    }: {
      href?: string;
      children?: ReactNode;
    }) => (
      <a
        href={href}
        className="text-secondary underline decoration-secondary/40 underline-offset-4 transition-colors duration-150 hover:text-white"
      >
        {children}
      </a>
    ),
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-medium text-white">{children}</strong>
    ),
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="max-w-3xl list-disc space-y-2 pl-5 text-body text-gray">
        {children}
      </ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol className="max-w-3xl list-decimal space-y-2 pl-5 text-body text-gray">
        {children}
      </ol>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li className="text-body text-gray">{children}</li>
    ),
    Impact,
    "Impact.Metric": Impact.Metric,
    Statement,
    "Statement.Headline": Statement.Headline,
    "Statement.Body": Statement.Body,
    Figure,
    Grid,
    Split,
    Compare,
    "Compare.Option": Compare.Option,
    ScreenGallery,
    Note,
    Outcomes,
    "Outcomes.Item": Outcomes.Item,
    Placeholder,
  };
}
