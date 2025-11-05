import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

export type HeroImageStackItem = {
  id: string;
  src: string;
  alt: string;
};

type HeroImageStackProps = {
  images: HeroImageStackItem[];
};

type StickyCardProps = {
  index: number;
  image: HeroImageStackItem;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
};

function StickyCard({ index, image, progress, range, targetScale }: StickyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={cardRef} className="sticky top-0 flex items-center justify-center">
      <motion.figure
        style={{
          scale,
          top: `calc(-5vh + ${index * 32 + 220}px)`,
        }}
        className="relative -top-1/4 flex h-[320px] w-[min(90vw,520px)] origin-top overflow-hidden rounded-[32px] border border-white/12 bg-white/5 shadow-[0_32px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform duration-500 will-change-transform md:h-[380px] md:w-[min(70vw,640px)] lg:h-[420px] lg:w-[min(60vw,720px)]"
      >
        <img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </motion.figure>
    </div>
  );
}

export function HeroImageStack({ images }: HeroImageStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      className="relative flex w-full flex-col items-center justify-center pb-[70vh] pt-[35vh]"
      aria-label="Product imagery preview"
    >
      <div className="pointer-events-none absolute left-1/2 top-[16%] -translate-x-1/2 text-center text-[11px] uppercase tracking-[0.28em] text-white/40">
        scroll to explore
      </div>
      {images.map((image, index) => {
        const targetScale = Math.max(0.55, 1 - (images.length - index - 1) * 0.12);
        return (
          <StickyCard
            key={image.id}
            index={index}
            image={image}
            progress={scrollYProgress}
            range={[index * 0.25, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </section>
  );
}

