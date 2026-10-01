import type { ReactNode } from "react";
import type { CaseStudySection } from "@/lib/case-studies";
import CaseStudySpyNav from "./CaseStudySpyNav";

interface CaseStudyLayoutProps {
  sections: CaseStudySection[];
  children: ReactNode;
}

export default function CaseStudyLayout({
  sections,
  children,
}: CaseStudyLayoutProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-stack px-[var(--page-gutter)] lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-[var(--page-gutter)]">
      <CaseStudySpyNav sections={sections} />
      <div className="flex min-w-0 flex-col gap-stack pb-stack">{children}</div>
    </div>
  );
}
