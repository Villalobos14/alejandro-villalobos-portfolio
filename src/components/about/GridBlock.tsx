import type { ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";

interface GridBlockProps {
  label: string;
  title: string;
  span: string;
  delayMs?: number;
  text?: string;
  meta?: string[];
  children?: ReactNode;
}

export default function GridBlock({
  label,
  title,
  span,
  delayMs = 0,
  text,
  meta,
  children,
}: GridBlockProps) {
  return (
    <Reveal className={`md:col-span-1 ${span}`} delayMs={delayMs}>
      <div className="flex h-full flex-col gap-scale rounded-2xl border border-gray/40 p-scale md:p-8">
        <p className="text-body uppercase tracking-[0.2em] text-gray">{label}</p>
        <h3 className="text-2xl font-medium text-white md:text-3xl">{title}</h3>
        {text ? <p className="text-body-lg text-gray">{text}</p> : null}
        {meta && meta.length > 0 ? (
          <ul className="flex flex-col gap-1 text-body text-gray">
            {meta.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {children}
      </div>
    </Reveal>
  );
}
