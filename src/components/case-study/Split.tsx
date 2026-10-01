import Image from "next/image";
import type { ReactNode } from "react";

interface SplitProps {
  src: string;
  alt: string;
  caption?: string;
  /** Places the image before the text on wide screens. Reading order stays text-first on mobile. */
  imageFirst?: boolean;
  ratio?: string;
  children: ReactNode;
}

export default function Split({
  src,
  alt,
  caption,
  imageFirst = false,
  ratio = "4/3",
  children,
}: SplitProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-scale md:grid-cols-2 md:gap-8">
      <div
        className={`flex flex-col gap-scale ${imageFirst ? "md:order-2" : ""}`}
      >
        {children}
      </div>
      <figure
        className={`flex flex-col gap-3 ${imageFirst ? "md:order-1" : ""}`}
      >
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-gray/40"
          style={{ aspectRatio: ratio }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            unoptimized={src.endsWith(".svg")}
            className="object-cover"
          />
        </div>
        {caption ? (
          <figcaption className="text-body text-gray">{caption}</figcaption>
        ) : null}
      </figure>
    </div>
  );
}
