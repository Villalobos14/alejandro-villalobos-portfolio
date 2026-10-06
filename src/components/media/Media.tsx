import Image from "next/image";
import MediaPlaceholder, {
  type MediaPlaceholderProps,
} from "./MediaPlaceholder";
import VideoMedia from "./VideoMedia";

/**
 * An asset can only enter the site paired with its own alt text. Decorative
 * assets pass `alt: ""` explicitly, so the choice is always recorded.
 */
export interface ImageSource {
  type: "image";
  src: string;
  alt: string;
}

/**
 * Always muted and looping, never with controls, so a video can only ever be
 * a moving cover. `poster` is what reduced-motion visitors see instead.
 */
export interface VideoSource {
  type: "video";
  src: string;
  poster?: string;
  alt: string;
}

export type MediaSource = ImageSource | VideoSource;

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

  if (source.type === "video") {
    return <VideoMedia source={source} className={className} />;
  }

  return (
    <Image
      src={source.src}
      alt={source.alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={source.src.endsWith(".svg")}
      className={className}
    />
  );
}
