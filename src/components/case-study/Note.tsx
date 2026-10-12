import type { ReactNode } from "react";

type NoteKind = "finding" | "decision";

interface NoteProps {
  kind?: NoteKind;
  title: string;
  children: ReactNode;
}

const KIND_LABELS: Record<NoteKind, string> = {
  finding: "Finding",
  decision: "Decision",
};

export default function Note({ kind = "finding", title, children }: NoteProps) {
  return (
    <aside className="flex flex-col gap-scale rounded-2xl border border-border border-l-2 border-l-secondary p-scale md:p-8">
      <p className="text-body uppercase tracking-[0.2em] text-accent-strong">
        {KIND_LABELS[kind]}
      </p>
      <h4 className="max-w-3xl text-body-lg text-ink">{title}</h4>
      <div className="flex max-w-3xl flex-col gap-scale text-body text-ink-muted">
        {children}
      </div>
    </aside>
  );
}
