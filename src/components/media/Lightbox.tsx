"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { Photo } from "@/lib/personal";
import { BLOCK_EASE, prefersReducedMotion } from "@/lib/motion";

interface LightboxProps {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onMove: (step: number) => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const controlStyles =
  "flex size-11 items-center justify-center rounded-full border border-gray text-white transition-colors duration-300 fine:hover:border-secondary fine:hover:text-secondary disabled:opacity-40 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export default function Lightbox({
  photos,
  index,
  onClose,
  onMove,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo = photos[index];
  const hasSiblings = photos.length > 1;

  useEffect(() => {
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowLeft" && hasSiblings) {
        event.preventDefault();
        onMove(-1);
        return;
      }

      if (event.key === "ArrowRight" && hasSiblings) {
        event.preventDefault();
        onMove(1);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasSiblings, onClose, onMove]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog || prefersReducedMotion()) return;

    const animation = dialog.animate(
      [
        { opacity: 0, transform: "scale(0.985)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      { duration: 320, easing: BLOCK_EASE, fill: "backwards" },
    );

    return () => animation.cancel();
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483645] flex flex-col bg-primary/95 p-[var(--page-gutter)] backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Photo viewer"
        className="flex h-full w-full min-w-0 flex-col gap-scale"
      >
        <div className="flex items-center justify-between gap-scale">
          <p className="text-body text-gray" aria-live="polite">
            {index + 1} / {photos.length}
          </p>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close photo viewer"
            onClick={onClose}
            className={controlStyles}
          >
            <XMarkIcon aria-hidden="true" className="pointer-events-none size-5" />
          </button>
        </div>

        <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-scale">
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="100vw"
            className="max-h-full w-auto max-w-full rounded-2xl object-contain"
          />
          {photo.caption ? (
            <figcaption className="text-body text-gray">{photo.caption}</figcaption>
          ) : null}
        </figure>

        {hasSiblings ? (
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => onMove(-1)}
              className={controlStyles}
            >
              <ArrowLeftIcon
                aria-hidden="true"
                className="pointer-events-none size-5"
              />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => onMove(1)}
              className={controlStyles}
            >
              <ArrowRightIcon
                aria-hidden="true"
                className="pointer-events-none size-5"
              />
            </button>
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
