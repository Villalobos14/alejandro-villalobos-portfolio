"use client";

import { useEffect, useRef } from "react";
import { REDUCED_MOTION_QUERY } from "@/lib/motion";
import type { VideoSource } from "./Media";

interface VideoMediaProps {
  source: VideoSource;
  className?: string;
}

/**
 * Plays only while on screen and only when motion is welcome. There is no
 * `autoPlay` attribute on purpose: it would start before hydration and ignore
 * reduced motion. Reduced-motion visitors keep the poster, or the first frame
 * when there is none.
 */
export default function VideoMedia({ source, className = "" }: VideoMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    let isOnScreen = false;

    const sync = () => {
      if (isOnScreen && !motionQuery.matches) {
        // Rejects when the browser blocks playback; the still frame stays.
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isOnScreen = entry.isIntersecting;
      sync();
    });

    observer.observe(video);
    motionQuery.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  const decorative = source.alt.trim() === "";

  return (
    <div
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : source.alt}
      aria-hidden={decorative ? true : undefined}
      className="pointer-events-none absolute inset-0"
    >
      <video
        ref={videoRef}
        src={source.src}
        poster={source.poster}
        muted
        loop
        playsInline
        disablePictureInPicture
        preload={source.poster ? "none" : "metadata"}
        aria-hidden="true"
        className={`h-full w-full ${className}`}
      />
    </div>
  );
}
