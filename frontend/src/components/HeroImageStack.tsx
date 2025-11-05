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
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="sticky top-0 flex items-center justify-center">
      <motion.figure
        style={{
          scale,
          top: `calc(-12vh + ${index * 48 + 160}px)`,
        }}
        className="relative -top-1/3 flex w-[min(94vw,780px)] origin-top flex-col items-center overflow-visible rounded-[40px] transition-transform duration-500 will-change-transform"
      >
        <img
          src={image.src}
          alt={image.alt}
          className="w-full max-h-[780px] rounded-[40px] object-contain"
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
      className="relative flex w-full flex-col items-center justify-center pb-[80vh] pt-[28vh]"
      aria-label="Product imagery preview"
    >
      {images.map((image, index) => {
        const targetScale = Math.max(0.35, 1 - (images.length - index - 1) * 0.2);
        return (
          <StickyCard
            key={image.id}
            index={index}
            image={image}
            progress={scrollYProgress}
            range={[index * 0.15, 0.85]}
            targetScale={targetScale}
          />
        );
      })}
    </section>
  );
}
