"use client";

import Image from "next/image";
import type { Photo } from "@/lib/media";
import { useLightbox } from "@/components/media/LightboxProvider";

interface CaseVisualProps {
  src?: string;
  alt: string;
  label: string;
  /** Width / height. Defaults to 16:10. */
  ratio?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Full case collection. Only real images belong in it. */
  photos?: readonly Photo[];
  photoIndex?: number;
}

const focus =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

/**
 * A 16:10 case-study slot. Without `src` it stays a labelled placeholder.
 * With `src` and a collection index it opens the shared lightbox.
 */
export default function CaseVisual({
  src,
  alt,
  label,
  ratio = 16 / 10,
  priority = false,
  sizes = "(min-width: 1024px) 840px, 100vw",
  className = "",
  photos,
  photoIndex,
}: CaseVisualProps) {
  const { openLightbox } = useLightbox();
  const canOpen = Boolean(src && photos && photoIndex !== undefined && photoIndex >= 0);

  return (
    <figure
      className={`relative overflow-hidden rounded-xl border border-border bg-bg-subtle ${
        src ? "border-solid" : "border-dashed"
      } ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {src && canOpen && photos && photoIndex !== undefined ? (
        <button
          type="button"
          aria-label={`Ampliar: ${label}`}
          onClick={() => openLightbox([...photos], photoIndex)}
          className={`absolute inset-0 fine:cursor-zoom-in ${focus}`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="pointer-events-none object-cover"
          />
        </button>
      ) : src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-cover"
        />
      ) : (
        <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-mono text-ink-secondary">{label}</p>
          <p className="text-mono-s text-ink-secondary">Pendiente</p>
        </figcaption>
      )}
    </figure>
  );
}
