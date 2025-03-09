'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTransform, useScroll, motion, MotionValue } from 'framer-motion';

const images = [
  'smooth-images/9.png', 'smooth-images/1.png', 'smooth-images/3.png', 'smooth-images/4.png', 'smooth-images/5.png', 'smooth-images/6.png',
  'smooth-images/2.png', 'smooth-images/8.png', 'smooth-images/7.png', 'smooth-images/10.png', 'smooth-images/6.png', 'smooth-images/2.png',
];

export default function Home() {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ['start end', 'end start']
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

    window.addEventListener('resize', resize);
    resize();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="flex flex-col items-center">
      <div ref={gallery} className="relative flex gap-5 p-5 h-[175vh] bg-[#0d0d0d] overflow-hidden w-full">
        <Column images={[images[0], images[1], images[2]]} y={y} index={1} />
        <Column images={[images[3], images[4], images[5]]} y={y2} index={2} />
        <Column images={[images[6], images[7], images[8]]} y={y3} index={3} />
        <Column images={[images[9], images[10], images[11]]} y={y4} index={4} />
      </div>
    </section>
  );
}

interface ColumnProps {
  images: string[];
  y: MotionValue<number>;
  index: number;

}

const Column: React.FC<ColumnProps> = ({ images, y, index }) => {
  const topValues: { [key: number]: string } = {
    1: '-45%',
    2: '-95%',
    3: '-45%',
    4: '-75%'
  };

  return (
    <motion.div
      className="relative flex flex-col gap-5 w-1/4 min-w-[250px]"
      style={{ y, top: topValues[index] }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative w-full h-full rounded-lg overflow-hidden">
          <Image src={`/${src}`} alt="image" layout="fill" objectFit="cover" />
        </div>
      ))}
    </motion.div>
  );
};
