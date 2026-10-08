"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  useReducedMotion,
  useScroll,
  useTransform,
  motion,
  type MotionValue,
} from "framer-motion";

const PARALLAX_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

function useDesktopParallax(): boolean {
  const prefersReducedMotion = useReducedMotion() === true;
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia(PARALLAX_QUERY);
    const sync = () => setMatches(media.matches);

    sync();
    media.addEventListener("change", sync);

    return () => media.removeEventListener("change", sync);
  }, []);

  return matches && !prefersReducedMotion;
}

const images = [
  "smooth-images/9.png",
  "smooth-images/1.png",
  "smooth-images/3.png",
  "smooth-images/4.png",
  "smooth-images/5.png",
  "smooth-images/6.png",
  "smooth-images/2.png",
  "smooth-images/8.png",
  "smooth-images/7.png",
  "smooth-images/10.png",
  "smooth-images/6.png",
  "smooth-images/2.png",
];

const staticImages = images.slice(0, 10);

const headingId = "visual-explorations";

export default function SmoothSection() {
  const showParallax = useDesktopParallax();

  return (
    <section
      aria-labelledby={headingId}
      className="hidden w-full flex-col items-center md:flex"
    >
      {/*
        The gallery sat between two h2 sections without a heading of its own,
        so jumping by heading skipped straight past it. The heading is hidden
        rather than drawn, since the section is meant to read as pure image.
        Below md the whole section is display:none: the screenshots are
        supplementary and too small to read there.
      */}
      <h2 id={headingId} className="sr-only">
        Visual explorations
      </h2>
      {showParallax ? <ParallaxGallery /> : <StaticGallery />}
    </section>
  );
}

function StaticGallery() {
  return (
    <div className="grid w-full grid-cols-2 gap-3 bg-primary p-[var(--page-gutter)] sm:grid-cols-3">
      {staticImages.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className="relative aspect-[3/4] overflow-hidden rounded-lg"
        >
          <Image
            src={`/${src}`}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function ParallaxGallery() {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      ref={gallery}
      className="relative flex h-[175vh] w-full gap-5 overflow-hidden bg-primary p-[var(--page-gutter)]"
    >
      <Column images={[images[0], images[1], images[2]]} y={y} index={1} />
      <Column images={[images[3], images[4], images[5]]} y={y2} index={2} />
      <Column images={[images[6], images[7], images[8]]} y={y3} index={3} />
      <Column images={[images[9], images[10], images[11]]} y={y4} index={4} />
    </div>
  );
}

interface ColumnProps {
  images: string[];
  y: MotionValue<number>;
  index: number;
}

const topValues: Record<number, string> = {
  1: "-45%",
  2: "-95%",
  3: "-45%",
  4: "-75%",
};

function Column({ images, y, index }: ColumnProps) {
  return (
    <motion.div
      className="relative flex w-1/4 flex-col gap-5"
      style={{ y, top: topValues[index] }}
    >
      {images.map((src, i) => (
        <div key={`${src}-${i}`} className="relative h-full w-full overflow-hidden rounded-lg">
          <Image
            src={`/${src}`}
            alt=""
            fill
            sizes="25vw"
            className="object-cover"
          />
        </div>
      ))}
    </motion.div>
  );
}
