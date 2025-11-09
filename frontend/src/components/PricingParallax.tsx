"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

const leftFeatures = [
  "Dark Mode",
  "Real-time Updates",
  "Authentication",
  "Drag & Drop",
];

const rightFeatures = [
  "API Integration",
  "Role Based Access",
  "Multi-language",
  "Auto-save Insights",
];

const PricingParallax = () => {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const yLeft = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const yCard = useTransform(scrollYProgress, [0, 1], [0, height * 1.2]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, height * 2.6]);

  useEffect(() => {
    const lenis = new Lenis();

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="w-full bg-[#eee] text-black">
      <div className="font-geist relative flex h-screen items-center justify-center gap-2">
        <div className="absolute bottom-[12%] left-1/2 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
          {/* Preface copy anchored near the gray/white boundary before the gallery opens */}
          <h2 className="text-4xl font-semibold uppercase tracking-tight">Models</h2>
          <p className="max-w-[48ch] text-base text-black/70">
            We pair automation-first delivery with pragmatic capital deployment so teams can adopt AI
            copilots without runaway spend.
          </p>
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
            scroll down to see
          </span>
        </div>
      </div>

      <section
        ref={gallery}
        className="relative flex h-[175vh] items-center justify-center overflow-hidden bg-white px-[4vw]"
      >
        <FeatureColumn alignment="right" features={leftFeatures} y={yLeft} />

        <motion.div
          className="relative mx-4 flex w-full max-w-4xl flex-col items-center rounded-[40px] border border-black/5 bg-gradient-to-b from-white via-white to-[#f3f3f3] p-10 shadow-[0_30px_120px_rgba(0,0,0,0.1)]"
          style={{ y: yCard }}
        >
          <span className="mb-4 rounded-full border border-black/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-black/60">
            Pricing Models
          </span>
          <h3 className="font-geist text-5xl font-semibold text-black">Loaded with Features</h3>
          <p className="mt-3 max-w-2xl text-center text-base text-black/60">
            Experience a comprehensive suite of automation-ready capabilities bundled into every
            model tier. Each deployment blends governance, insights, and collaboration for faster
            go-to-market.
          </p>
          <div className="mt-10 flex w-full flex-wrap items-center justify-between gap-6 rounded-[32px] border border-black/5 bg-white/70 p-8">
            <div className="flex flex-col gap-2">
              <span className="text-sm uppercase tracking-[0.3em] text-black/40">Starting at</span>
              <span className="text-4xl font-semibold text-black">$4.5k <small className="text-base font-normal text-black/60">per model</small></span>
            </div>
            <div className="flex flex-col gap-2 text-right">
              <span className="text-sm uppercase tracking-[0.3em] text-black/40">Support</span>
              <span className="text-lg font-medium text-black">Enterprise SLAs • Concierge enablement</span>
            </div>
          </div>

          <div className="mt-10 grid w-full gap-4 text-center text-sm text-black/50 lg:hidden">
            {[...leftFeatures, ...rightFeatures].map((feature) => (
              <p key={feature} className="py-2 text-base font-medium">
                {feature}
              </p>
            ))}
          </div>
        </motion.div>

        <FeatureColumn alignment="left" features={rightFeatures} y={yRight} />
      </section>
      <div className="font-geist relative flex h-screen items-center justify-center gap-2">
        <div className="absolute left-1/2 top-[10%] z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
          {/* Preface copy now lives above the "scroll up" cue per request */}
          <h2 className="text-4xl font-semibold uppercase tracking-tight">Models</h2>
          <p className="max-w-[48ch] text-base text-black/70">
            We pair automation-first delivery with pragmatic capital deployment so teams can adopt
            AI copilots without runaway spend.
          </p>
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
            scroll Up to see
          </span>
        </div>
      </div>
    </main>
  );
};

type FeatureColumnProps = {
  alignment: "left" | "right";
  features: string[];
  y: MotionValue<number>;
};

const FeatureColumn = ({ alignment, features, y }: FeatureColumnProps) => {
  const arrow = alignment === "right" ? "→" : "←";
  const textAlign = alignment === "right" ? "text-right" : "text-left";
  const justify = alignment === "right" ? "justify-end" : "justify-start";

  return (
    <motion.div
      className={`hidden h-full w-1/4 min-w-[200px] flex-col gap-10 font-geist text-lg text-black/80 lg:flex ${textAlign}`}
      style={{ y }}
    >
      {features.map((feature) => (
        <div
          key={feature}
          className={`flex items-center gap-3 text-2xl font-medium text-black ${justify}`}
        >
          {alignment === "right" ? (
            <>
              <span className="text-lg font-normal text-black/75">{feature}</span>
              <span className="text-3xl text-black/60">{arrow}</span>
            </>
          ) : (
            <>
              <span className="text-3xl text-black/60">{arrow}</span>
              <span className="text-lg font-normal text-black/75">{feature}</span>
            </>
          )}
        </div>
      ))}
    </motion.div>
  );
};

export { PricingParallax };
