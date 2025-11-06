"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import React, { useMemo, useRef } from "react";
import ReactLenis from "lenis/react";

type StackImage = {
  title: string;
  src: string;
};

const stackImages: StackImage[] = [
  {
    title: "Frame One",
    src: "/hero section (1).png",
  },
  {
    title: "Frame Two",
    src: "/pic.png",
  },
  {
    title: "Frame Three",
    src: "/pic1.png",
  },
];

const resolvePublicPath = (path: string) => {
  if (!path) return path;
  const segments = path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment));
  return `/${segments.join("/")}`;
};

interface StickyImageCardProps extends StackImage {
  index: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const StickyImageCard = ({
  index,
  title,
  src,
  progress,
  range,
  targetScale,
}: StickyImageCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);
  const resolvedSrc = useMemo(() => resolvePublicPath(src), [src]);

  return (
    <div ref={cardRef} className="sticky top-0 flex items-center justify-center">
      <motion.div
        style={{
          scale,
          top: `calc(-6vh + ${index * 24 + 240}px)`,
        }}
        className="relative flex h-[340px] w-[520px] origin-top overflow-hidden rounded-[32px] bg-black/5 shadow-lg"
      >
        <img src={resolvedSrc} alt={title} className="h-full w-full object-cover" />
      </motion.div>
    </div>
  );
};

export const StackScrollGallery = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const items = useMemo(() => stackImages, []);

  return (
    <ReactLenis root>
      <section
        ref={containerRef}
        className="relative flex w-full flex-col items-center justify-center gap-10 pb-[110vh] pt-[45vh]"
      >
        {items.map((item, index) => {
          const progressStart = Math.min(index / items.length + 0.05 * index, 1);
          const targetScale = Math.max(0.55, 1 - (items.length - index - 1) * 0.12);

          return (
            <StickyImageCard
              key={item.title}
              index={index}
              progress={scrollYProgress}
              range={[progressStart, 1]}
              targetScale={targetScale}
              {...item}
            />
          );
        })}
      </section>
    </ReactLenis>
  );
};

export default StackScrollGallery;
