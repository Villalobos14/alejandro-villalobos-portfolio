import Image from "next/image";
import MediaPlaceholder, {
  type MediaPlaceholderProps,
} from "./MediaPlaceholder";

/**
 * An asset can only enter the site paired with its own alt text. Decorative
 * assets pass `alt: ""` explicitly, so the choice is always recorded.
 */
export interface MediaSource {
  src: string;
  alt: string;
}

interface MediaProps {
  /** Omit while the asset does not exist yet. */
  source?: MediaSource;
  /** Shown in place of the asset. Absence is a normal state, not an error. */
  placeholder: MediaPlaceholderProps;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Fills its positioned parent with either the asset or its placeholder. Adding
 * an asset later is a one-line change at the data layer.
 */
export default function Media({
  source,
  placeholder,
  sizes,
  priority,
  className = "object-cover",
}: MediaProps) {
  if (!source) return <MediaPlaceholder {...placeholder} />;

  return (
    <Image
      src={source.src}
      alt={source.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
