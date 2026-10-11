"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const POSTER = "/case-studies/mlstoolbox-cover-poster.jpg";
const SOURCE_720 = "/case-studies/mlstoolbox-cover-720p.mp4";
const SOURCE_1080 = "/case-studies/mlstoolbox-cover-1080p.mp4";
const ALT = "MLSToolbox CodeAssessment cover, from metrics to the findings workspace";

const STILL_QUERY = "(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 767px)";

/**
 * Looping cover on a fine pointer. Reduced motion, touch, and phones keep the poster.
 */
export default function CaseHeroVideo() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(STILL_QUERY);
    const sync = () => setPlay(!query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  if (!play) {
    return (
      <Image
        src={POSTER}
        alt={ALT}
        fill
        priority
        sizes="(min-width: 1024px) 1296px, 100vw"
        className="object-cover"
      />
    );
  }

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      poster={POSTER}
      aria-label={ALT}
    >
      <source src={SOURCE_720} type="video/mp4" media="(max-width: 767px)" />
      <source src={SOURCE_1080} type="video/mp4" />
    </video>
  );
}
