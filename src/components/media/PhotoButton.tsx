"use client";

import Image from "next/image";
import type { Photo } from "@/lib/personal";
import { useLightbox } from "./LightboxProvider";

interface PhotoButtonProps {
  photos: Photo[];
  index: number;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export default function PhotoButton({
  photos,
  index,
  sizes,
  className = "",
  priority = false,
}: PhotoButtonProps) {
  const { openLightbox } = useLightbox();
  const photo = photos[index];

  return (
    <button
      type="button"
      onClick={() => openLightbox(photos, index)}
      aria-label={
        photo.alt ? `Enlarge photo: ${photo.alt}` : "Enlarge photo"
      }
      data-cursor="Ampliar"
      className={`relative block overflow-hidden rounded-2xl transition-transform duration-500 ease-out focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${className}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="pointer-events-none object-cover"
      />
    </button>
  );
}
