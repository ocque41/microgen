"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

type StickyCardProps = {
  i: number;
  title: string;
  src: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
};

const projects: Array<{ title: string; src: string }> = [
  {
    title: "Hero highlight",
    src: "/hero section (1).png",
  },
  {
    title: "Product workspace",
    src: "/pic.png",
  },
  {
    title: "Interface detail",
    src: "/pic1.png",
  },
];

function StickyCard({ i, title, src, progress, range, targetScale }: StickyCardProps) {
  const container = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);
  const y = useTransform(progress, range, [0, -160]);

  return (
    <div ref={container} className="sticky top-24 flex items-center justify-center">
      <motion.div
        style={{
          scale,
          y,
        }}
        className="relative flex h-[min(78vh,520px)] w-[min(94vw,680px)] origin-top flex-col overflow-hidden"
      >
        <img src={src} alt={title} className="h-full w-full object-cover" loading="lazy" />
      </motion.div>
    </div>
  );
}

export function Skiper16() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.65", "end start"],
  });

  return (
    <div
      ref={container}
      className="relative flex w-full flex-col items-center justify-center pb-[60vh] pt-[36vh]"
    >
      {projects.map((project, i) => {
        const remaining = projects.length - i - 1;
        const start = i * 0.14;
        const end = Math.min(0.62 + i * 0.12, 0.92);
        const targetScale = Math.max(0.45, 1 - remaining * 0.18);
        return (
          <StickyCard
            key={`p_${i}`}
            i={i}
            {...project}
            progress={scrollYProgress}
            range={[start, end]}
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
}

export { StickyCard as StickyCard_001 };
