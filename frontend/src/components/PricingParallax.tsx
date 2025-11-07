"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

const PricingParallax = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;

  const yCards = useTransform(scrollYProgress, [0, 1], [0, height * 0.12]);
  const yAccent = useTransform(scrollYProgress, [0, 1], [0, height * 0.18]);

  useEffect(() => {
    const lenis = new Lenis();

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      lenis.destroy();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#090909] py-20 text-[#f9f9f9] md:py-28"
      id="pricing"
    >
      <div className="mx-auto mb-12 max-w-5xl px-4 text-center md:mb-16 md:px-6 lg:px-8">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/50">
          Pricing
        </p>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Choose the plan that matches your build
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm text-white/50 md:text-base">
          Start with Pro for single builds or move to Business when you need priority support, multiple data sources
          and managed delivery.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_1.1fr_0.85fr]">
          <motion.div
            style={{ y: yCards }}
            className="flex flex-col justify-between rounded-2xl border border-white/5 bg-[#121212] p-6 md:p-8"
          >
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70">
                Pro
              </span>
              <h3 className="text-xl font-semibold">For solo projects</h3>
              <p className="text-sm text-white/50">
                Build a complete Micro Agent experience with guided setup.
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">$2,000</span>
                <span className="text-xs text-white/40">per project</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/50" />
                  1 micro-agent flow or landing
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/50" />
                  Implementation with your current stack
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/50" />
                  Standard support
                </li>
              </ul>
            </div>
            <button className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90">
              Talk to us
            </button>
          </motion.div>

          <motion.div
            style={{ y: yAccent }}
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-transparent bg-[#f9f9f9] p-6 text-black shadow-[0_0_90px_rgba(249,249,249,0.08)] md:p-8"
          >
            <div className="absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-black/5" />
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1 text-xs text-white">
                Business
              </span>
              <h3 className="text-xl font-semibold">For fully managed builds</h3>
              <p className="text-sm text-black/60">
                Custom solution with our team + partner, priority channel, and multi-source ingestion.
              </p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">$10,000</span>
                <span className="text-xs text-black/40">per project</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-black/70">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-black/70" />
                  Work with our team + partner crew
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-black/70" />
                  Import from 100+ sources
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-black/70" />
                  Priority support channel
                </li>
              </ul>
            </div>
            <button className="mt-8 inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/90">
              Get a quote
            </button>
          </motion.div>

          <motion.div
            style={{ y: yCards }}
            className="flex min-h-[280px] items-center justify-center rounded-2xl border border-white/0 bg-[#151515]"
          >
            <div className="rounded-2xl border border-white/10 bg-[#090909] px-8 py-10 text-center text-xs uppercase tracking-[0.35em] text-white/70">
              Microagents
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingParallax;
