import MaskedLines from "@/components/ui/MaskedLines";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  variant?: "strong" | "subtle";
  id?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  variant = "subtle",
  id,
}: SectionHeaderProps) {
  return (
    <header id={id} className="flex w-full min-w-0 flex-col gap-3">
      {eyebrow ? <p className="text-mono text-ink-muted">{eyebrow}</p> : null}
      <MaskedLines as="h2" lines={[title]} className="text-h2 text-ink" />
      <div
        className={`h-px w-full ${variant === "strong" ? "bg-line-strong" : "bg-border"}`}
      />
    </header>
  );
}
