"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { prefersReducedMotion } from "@/lib/motion";
import type { Photo } from "@/lib/personal";
import { useLightbox } from "@/components/media/LightboxProvider";

interface HorizontalGalleryProps {
  title: string;
  photos: Photo[];
}

const SCROLL_RATIO = 0.8;

const controlStyles =
  "flex size-11 items-center justify-center rounded-full border border-gray text-white transition-colors duration-300 fine:hover:border-secondary fine:hover:text-secondary disabled:opacity-40 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export default function HorizontalGallery({
  title,
  photos,
}: HorizontalGalleryProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const { openLightbox } = useLightbox();

  const sync = useCallback(() => {
    const track = trackRef.current;

    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;

    setAtStart(track.scrollLeft <= 1);
    setAtEnd(maxScroll <= 1 || track.scrollLeft >= maxScroll - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    sync();
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    return () => {
      track.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;

    if (!track) return;

    track.scrollBy({
      left: direction * track.clientWidth * SCROLL_RATIO,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <section aria-label={title} className="flex w-full min-w-0 flex-col gap-scale px-[var(--page-gutter)]">
      <div className="flex items-end justify-between gap-scale">
        <h2 className="text-3xl font-medium text-white md:text-4xl">{title}</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous photos"
            disabled={atStart}
            onClick={() => step(-1)}
            className={controlStyles}
          >
            <ArrowLeftIcon
              aria-hidden="true"
              className="pointer-events-none size-5"
            />
          </button>
          <button
            type="button"
            aria-label="Next photos"
            disabled={atEnd}
            onClick={() => step(1)}
            className={controlStyles}
          >
            <ArrowRightIcon
              aria-hidden="true"
              className="pointer-events-none size-5"
            />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-scale overflow-x-auto overscroll-x-contain pb-3"
      >
        {photos.map((photo, index) => (
          <li
            key={photo.src}
            className="w-[74%] shrink-0 snap-start md:w-[42%] lg:w-[29%]"
          >
            <button
              type="button"
              onClick={() => openLightbox(photos, index)}
              aria-label={
                photo.alt
                  ? `Enlarge photo ${index + 1} of ${photos.length}: ${photo.alt}`
                  : `Enlarge photo ${index + 1} of ${photos.length}`
              }
              data-cursor="Ampliar"
              className="relative block aspect-[4/5] w-full overflow-hidden rounded-2xl transition-transform duration-500 ease-out fine:hover:-translate-y-1 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 74vw, (max-width: 1024px) 42vw, 29vw"
                className="pointer-events-none object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
