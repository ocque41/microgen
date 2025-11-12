"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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

type PricingParallaxProps = {
  variant?: "default" | "inverted";
};

const PricingParallax = ({ variant = "default" }: PricingParallaxProps) => {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const maxOffset = height * 0.25;
  const yCard = useTransform(scrollYProgress, [0, 0.5, 1], [maxOffset, 0, -maxOffset]);
  const isMobile = dimension.width < 1024;
  const parallaxStyle = !isMobile ? { y: yCard } : undefined;

  const isInverted = variant === "inverted";
  const mainBackgroundClass = isInverted
    ? "bg-[#090909] text-[#f9f9f9]"
    : "bg-[#f9f9f9] text-[#090909]";
  const headlineTextClass = isInverted ? "text-[#f9f9f9]" : "text-[#090909]";
  const bodyTextClass = isInverted ? "text-[#f9f9f9]/70" : "text-[#090909]/70";
  const cueTextClass = isInverted ? "text-[#f9f9f9]/60" : "text-[#090909]/60";
  const cueGradientClass = isInverted
    ? "after:from-[#f9f9f9]/70 after:to-transparent"
    : "after:from-[#f9f9f9] after:to-[#090909]/30";
  const sectionBackgroundClass = isInverted ? "bg-[#090909]" : "bg-[#f9f9f9]";
  const cardSurfaceClass = isInverted
    ? "bg-gradient-to-b from-[#090909] via-[#0d0d0d] to-[#050505]"
    : "bg-gradient-to-b from-white via-[#fdfdfd] to-[#f2f2f2]";
  const cardBorderClass = isInverted ? "border-[#f9f9f9]/15" : "border-[#090909]/10";
  const badgeBorderClass = isInverted ? "border-[#f9f9f9]/30" : "border-[#090909]/15";
  const badgeTextClass = isInverted ? "text-[#f9f9f9]/70" : "text-[#090909]/60";
  const mobileFeatureTextClass = isInverted ? "text-[#f9f9f9]/60" : "text-[#090909]/50";

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const enableSmooth = window.innerWidth >= 768;
    let lenis: Lenis | null = null;
    let rafId = 0;
    let resizeObserver: ResizeObserver | null = null;

    const syncDimensions = () => {
      const width = window.innerWidth;
      const galleryHeight = gallery.current?.offsetHeight ?? window.innerHeight;
      setDimension({ width, height: galleryHeight });
    };

    if (enableSmooth) {
      lenis = new Lenis();
      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
      syncDimensions();
    } else {
      syncDimensions();
    }

    const handleResize = () => {
      syncDimensions();
    };

    window.addEventListener("resize", handleResize);

    if (gallery.current && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        syncDimensions();
      });
      resizeObserver.observe(gallery.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return (
    <main className={`w-full ${mainBackgroundClass}`}>
      <div className="font-geist relative flex min-h-[45vh] items-center justify-center gap-2 lg:min-h-[70vh] lg:h-screen">
        <div
          className={`absolute bottom-[12%] left-1/2 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center ${headlineTextClass}`}
        >
          {/* Preface copy anchored near the gray/white boundary before the gallery opens */}
          <h2 className="text-4xl font-semibold uppercase tracking-tight">Models</h2>
          <p className={`max-w-[48ch] text-base ${bodyTextClass}`}>
            We pair automation-first delivery with pragmatic capital deployment so teams can adopt AI
            copilots without runaway spend.
          </p>
          <span
            className={`relative max-w-[12ch] text-xs uppercase leading-tight opacity-60 ${cueTextClass} after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-[''] ${cueGradientClass}`}
          >
            scroll down to see
          </span>
        </div>
      </div>

      <section
        ref={gallery}
        className={`relative flex min-h-[115vh] flex-col items-center justify-center overflow-hidden lg:overflow-visible ${sectionBackgroundClass} px-4 py-12 md:min-h-[135vh] lg:min-h-[180vh] xl:min-h-[200vh] lg:flex-row lg:px-[4vw] lg:py-[14vh] xl:py-[16vh]`}
      >
        <motion.div
          className="relative mx-auto flex w-full max-w-[90rem] flex-col items-center justify-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16"
          style={parallaxStyle}
        >
          <FeatureColumn alignment="right" features={leftFeatures} inverted={isInverted} />

          <div
            className={`relative flex w-full max-w-4xl flex-col items-center rounded-[12px] border ${cardBorderClass} ${cardSurfaceClass} p-10 shadow-[0_30px_120px_rgba(0,0,0,0.1)]`}
          >
            <span
              className={`mb-4 rounded-full border px-4 py-1 text-xs uppercase tracking-[0.35em] ${badgeBorderClass} ${badgeTextClass}`}
            >
              Pricing Models
            </span>
            <h3 className={`font-geist text-5xl font-semibold text-center ${headlineTextClass}`}>
              Loaded with Features
            </h3>
            <p className={`mt-3 max-w-2xl text-center text-base ${bodyTextClass}`}>
              Experience a comprehensive suite of automation-ready capabilities bundled into every
              model tier. Each deployment blends governance, insights, and collaboration for faster
              go-to-market.
            </p>
            <div
              className={`mt-12 grid w-full grid-cols-1 gap-0 overflow-hidden rounded-[10px] border ${cardBorderClass} lg:grid-cols-2`}
            >
              <PlanCard
                accent="light"
                label="Pro"
                price="$4.5k"
                description="Perfect for growth teams launching copilots across a single business unit."
                points={["Embedded analytics", "Guided onboarding", "Weekly office hours"]}
              />
              <PlanCard
                accent="dark"
                label="Business"
                price="$9.8k"
                description="Scaled governance, multi-region observability, and proactive model tuning."
                points={["Dedicated strategist", "24/7 response", "Model drift insurance"]}
              />
            </div>

            <div className={`mt-10 grid w-full gap-4 text-center text-sm ${mobileFeatureTextClass} md:hidden`}>
              {[...leftFeatures, ...rightFeatures].map((feature) => (
                <p key={feature} className="py-2 text-base font-medium">
                  {feature}
                </p>
              ))}
            </div>
          </div>

          <FeatureColumn alignment="left" features={rightFeatures} inverted={isInverted} />
        </motion.div>
      </section>
      <div className="font-geist relative flex min-h-[45vh] items-center justify-center gap-2 lg:min-h-[70vh] lg:h-screen">
        <div
          className={`absolute left-1/2 top-[10%] z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center ${headlineTextClass}`}
        >
          {/* Preface copy now lives above the "scroll up" cue per request */}
          <h2 className="text-4xl font-semibold uppercase tracking-tight">Models</h2>
          <p className={`max-w-[48ch] text-base ${bodyTextClass}`}>
            We pair automation-first delivery with pragmatic capital deployment so teams can adopt
            AI copilots without runaway spend.
          </p>
          <span
            className={`relative max-w-[12ch] text-xs uppercase leading-tight opacity-60 ${cueTextClass} after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-[''] ${cueGradientClass}`}
          >
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
  inverted?: boolean;
};

const FeatureColumn = ({ alignment, features, inverted = false }: FeatureColumnProps) => {
  const arrow = alignment === "right" ? "→" : "←";
  const textAlign = alignment === "right" ? "items-end" : "items-start";
  const flow = alignment === "right" ? "flex-row" : "flex-row-reverse";
  const arrowColor = inverted ? "text-[#f9f9f9]/60" : "text-[#090909]/50";
  const featureColor = inverted ? "text-[#f9f9f9]" : "text-[#090909]";

  return (
    <div className={`hidden shrink-0 flex-col items-center md:flex`}>
      <div className={`flex h-full min-h-[520px] w-48 flex-col justify-center gap-10 ${textAlign}`}>
        {features.map((feature) => (
          <div key={feature} className={`flex ${flow} items-center gap-3 text-lg ${featureColor}`}>
            <span className={`text-2xl ${arrowColor}`}>{arrow}</span>
            <span className="font-medium">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

type PlanCardProps = {
  accent: "light" | "dark";
  label: string;
  price: string;
  description: string;
  points: string[];
};

const PlanCard = ({ accent, label, price, description, points }: PlanCardProps) => {
  const isDark = accent === "dark";
  return (
    <div
      className={`relative flex h-full flex-col gap-4 rounded-[10px] border p-8 text-left ${
        isDark
          ? "border-[#f9f9f9]/20 bg-[#0c0c0c] text-[#f9f9f9]"
          : "border-[#090909]/10 bg-[#f9f9f9] text-[#090909]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-4 py-1 text-xs uppercase tracking-[0.35em] ${
            isDark ? "bg-white/10 text-[#f9f9f9]/80" : "bg-[#090909]/5 text-[#090909]/70"
          }`}
        >
          {label}
        </span>
        <span className="text-3xl font-semibold">{price}
          <small className="pl-1 text-sm font-normal opacity-70">/model</small>
        </span>
      </div>
      <p className={`text-base ${isDark ? "text-[#f9f9f9]/75" : "text-[#090909]/70"}`}>{description}</p>
      <hr className={`${isDark ? "border-white/10" : "border-[#090909]/15"}`} />
      <ul className="flex flex-col gap-2 text-sm">
        {points.map((point) => (
          <li key={point} className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isDark ? "bg-[#f9f9f9]" : "bg-[#090909]"}`} />
            <span className={isDark ? "text-[#f9f9f9]/75" : "text-[#090909]/70"}>{point}</span>
          </li>
        ))}
      </ul>
      <button
        className={`mt-auto rounded-full border px-5 py-2 text-sm font-semibold ${
          isDark ? "border-white/30 text-[#f9f9f9]" : "border-[#090909]/30 text-[#090909]"
        }`}
      >
        Talk to sales
      </button>
    </div>
  );
};

export { PricingParallax };
