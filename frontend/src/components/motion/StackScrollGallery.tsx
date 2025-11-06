"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef, useMemo } from "react";
import ReactLenis from "lenis/react";

const stackImages = [
  { title: "Frame One", src: "/hero section (1).png" },
  { title: "Frame Two", src: "/pic.png" },
  { title: "Frame Three", src: "/pic1.png" },
];

const resolvePublicPath = (path: string) => {
  if (!path) return path;
  const segments = path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment));
  return `/${segments.join("/")}`;
};

const StickyImageCard = ({
  index,
  title,
  src,
  progress,
  range,
  targetScale,
}: {
  index: number;
  title: string;
  src: string;
  progress: any;
  range: [number, number];
  targetScale: number;
}) => {
  const scale = useTransform(progress, range, [1, targetScale]);
  const resolvedSrc = useMemo(() => resolvePublicPath(src), [src]);

  return (
    <div className="sticky top-0 flex items-center justify-center">
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${index * 20 + 250}px)`,
          zIndex: 100 - index,
        }}
        className="relative flex h-[340px] w-[520px] origin-top overflow-hidden rounded-[32px] bg-black/10 shadow-xl"
      >
        <img src={resolvedSrc} alt={title} className="h-full w-full object-cover" />
      </motion.div>
    </div>
  );
};

export default function StackScrollGallery() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <ReactLenis root>
      <section
        ref={containerRef}
        className="relative flex w-full flex-col items-center justify-center pb-[100vh] pt-[50vh]"
      >
        {stackImages.map((item, index) => {
          const targetScale = Math.max(
            0.5,
            1 - (stackImages.length - index - 1) * 0.1
          );

          return (
            <StickyImageCard
              key={item.title}
              index={index}
              title={item.title}
              src={item.src}
              progress={scrollYProgress}
              range={[index * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </section>
    </ReactLenis>
  );
}

