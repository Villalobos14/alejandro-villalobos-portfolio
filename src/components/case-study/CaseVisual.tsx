import Image from "next/image";

interface CaseVisualProps {
  src?: string;
  alt: string;
  label: string;
  /** Width / height. Defaults to 16:10. */
  ratio?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * A 16:10 case-study slot. Without `src` it stays a labelled placeholder.
 */
export default function CaseVisual({
  src,
  alt,
  label,
  ratio = 16 / 10,
  priority = false,
  sizes = "(min-width: 1024px) 840px, 100vw",
  className = "",
}: CaseVisualProps) {
  return (
    <figure
      className={`relative overflow-hidden rounded-xl border border-border bg-bg-subtle ${
        src ? "border-solid" : "border-dashed"
      } ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
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
          <p className="text-mono text-ink-muted">{label}</p>
          <p className="text-mono-s text-ink-muted">Pendiente</p>
        </figcaption>
      )}
    </figure>
  );
}
