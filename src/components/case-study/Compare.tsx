import Image from "next/image";
import type { MediaSource } from "@/components/media/Media";
import { Children, isValidElement, type ReactNode } from "react";

interface CompareProps {
  label?: string;
  children: ReactNode;
}

interface CompareOptionProps {
  title: string;
  outcome?: string;
  /** Omit until the asset exists; `src` cannot arrive without its `alt`. */
  media?: MediaSource;
  children?: ReactNode;
}

function CompareOption({
  title,
  outcome,
  media,
  children,
}: CompareOptionProps) {
  return (
    <div className="flex flex-col gap-scale rounded-2xl border border-gray/40 p-scale">
      <h4 className="text-label text-white">{title}</h4>
      {media ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            unoptimized={media.src.endsWith(".svg")}
            className="object-cover"
          />
        </div>
      ) : null}
      {children ? (
        <div className="flex flex-col gap-2 text-body text-gray">{children}</div>
      ) : null}
      {outcome ? (
        <p className="mt-auto text-body text-secondary">{outcome}</p>
      ) : null}
    </div>
  );
}

function CompareRoot({ label, children }: CompareProps) {
  const count = Children.toArray(children).filter(isValidElement).length;

  if (count !== 2) {
    throw new Error(`Compare expects exactly 2 options, received ${count}`);
  }

  return (
    <section className="flex flex-col gap-scale">
      {label ? (
        <p className="text-body uppercase tracking-[0.2em] text-gray">{label}</p>
      ) : null}
      <div className="grid grid-cols-1 gap-scale md:grid-cols-2">{children}</div>
    </section>
  );
}

const Compare = Object.assign(CompareRoot, { Option: CompareOption });

export default Compare;
