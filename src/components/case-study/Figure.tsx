"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface FigureProps {
  src: string;
  alt: string;
  caption: string;
  poster?: string;
  width?: number;
  height?: number;
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

export default function Figure({
  src,
  alt,
  caption,
  poster,
  width = 1600,
  height = 900,
}: FigureProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isVideo = src.endsWith(".mp4");
  const showPosterInstead = isVideo && prefersReducedMotion && poster !== undefined;

  return (
    <figure className="flex flex-col gap-scale">
      <div className="overflow-hidden rounded-2xl border border-gray/40">
        {isVideo && !showPosterInstead ? (
          <video
            src={src}
            poster={poster}
            aria-label={alt}
            autoPlay={!prefersReducedMotion}
            loop
            muted
            playsInline
            controls={prefersReducedMotion}
            className="h-auto w-full"
          />
        ) : (
          <Image
            src={showPosterInstead ? (poster as string) : src}
            alt={alt}
            width={width}
            height={height}
            unoptimized={src.endsWith(".svg") || Boolean(poster?.endsWith(".svg"))}
            className="h-auto w-full"
          />
        )}
      </div>
      <figcaption className="text-body text-gray">{caption}</figcaption>
    </figure>
  );
}
