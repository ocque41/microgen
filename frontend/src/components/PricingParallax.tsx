"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

const modelSections = [
  {
    id: "fund",
    stepLabel: "1",
    title: "Fund model",
    subtitle: "Venture capital · Private equity",
    description:
      "Capture every deck, email, and spreadsheet into one workspace so partners see the same qualified view.",
    badge: "Fund model",
    cardSummary: "Build once for partners, platform, and ops with capture + schema sync.",
    price: "$2K+",
    priceSuffix: "per deployment",
    features: [
      "AI capture for decks, emails, and investor updates",
      "Normalized schema that syncs to Affinity / Airtable / HubSpot",
      "Single workspace for partners, platform, and ops",
      "Ops studio to launch follow-ups and IC memos",
    ],
    ctaLabel: "Schedule fund build",
    panel: {
      tag: "Portfolio pulse",
      title: "Decks in · data out",
      body: "Every attachment drops into a shared view. Metrics snap to your template and partners review the same source of truth.",
      chips: ["Deal threads", "IC-ready", "Live QA"],
    },
  },
  {
    id: "flow",
    stepLabel: "4",
    title: "Flow model",
    subtitle: "Investment · Investment banking",
    description:
      "Standardize intake, keep diligence moving, and hand off notes without rebuilding the data room every time.",
    badge: "Flow model",
    cardSummary: "Give sourcing, research, and execution a shared surface with live intake and diligence context.",
    price: "$5K+",
    priceSuffix: "per deployment",
    features: [
      "Structured intake that mirrors your mandate",
      "Deal room auto-populates comps, bios, and documents",
      "Secure hand-off between research and execution",
      "Priority analyst support with response SLAs",
    ],
    ctaLabel: "Design a flow build",
    panel: {
      tag: "Execution view",
      title: "Every step linked",
      body: "Notes, comps, diligence docs, and chat sit on the same screen so teams move with the client without chasing files.",
      chips: ["Client safe", "Instant comps", "Audit trail"],
    },
  },
];

type ModelSection = (typeof modelSections)[number];

const PricingParallax = () => {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

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
    <section id="models" className="relative w-full bg-[#090909] py-24 text-[#f9f9f9] md:py-28">
      <div className="mx-auto max-w-5xl px-4 text-center md:px-6 lg:px-8">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/50">Models</p>
        <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          Choose the model that matches how your team works
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm tracking-[0.01em] text-white/55 md:text-base">
          Each build uses the same Skiper-style parallax scroll so the section feels alive, but the workflows are tuned for
          different capital teams.
        </p>
      </div>

      <div className="mt-16 flex flex-col gap-24">
        {modelSections.map((model) => (
          <ModelRow key={model.id} model={model} viewportHeight={dimension.height} />
        ))}
      </div>
    </section>
  );
};

const ModelRow = ({ model, viewportHeight }: { model: ModelSection; viewportHeight: number }) => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardsRef,
    offset: ["start end", "end start"],
  });

  const openRange = [0, 0.2, 0.8, 1];
  const primaryY = useTransform(
    scrollYProgress,
    openRange,
    [-viewportHeight * 0.25, -viewportHeight * 0.08, viewportHeight * 0.08, viewportHeight * 0.15],
  );
  const secondaryY = useTransform(
    scrollYProgress,
    openRange,
    [-viewportHeight * 0.3, -viewportHeight * 0.12, viewportHeight * 0.12, viewportHeight * 0.2],
  );
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.28, 0.65, 1], [0, 1, 1, 0]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
      <div className="mb-12 text-left sm:text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-white/35">{model.stepLabel}</p>
        <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">{model.title}</h3>
        <p className="mx-auto mt-4 max-w-3xl text-sm tracking-[0.01em] text-white/65 md:text-base">{model.description}</p>
      </div>
      <div ref={cardsRef}>
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_1.6fr]">
          <motion.article
            style={{ y: primaryY, opacity: cardsOpacity }}
            className="flex h-full flex-col justify-between rounded-2xl border border-white/5 bg-[#121212] p-6 md:p-8"
          >
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.35em] text-white/70">
                {model.badge}
              </span>
              <p className="text-sm tracking-[0.01em] text-white/55">{model.subtitle}</p>
              <p className="text-base tracking-[0.01em] text-white/80">{model.cardSummary}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">{model.price}</span>
                <span className="text-xs text-white/40">{model.priceSuffix}</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm tracking-[0.01em] text-white/75">
              {model.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/50" />
                  {feature}
                </li>
              ))}
              </ul>
            </div>
            <button className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90">
              {model.ctaLabel}
            </button>
          </motion.article>

          <motion.div
            style={{ y: secondaryY, opacity: cardsOpacity }}
            className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#151515]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/pic11.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/70 to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-6 md:p-10">
              <div className="space-y-3">
                <span className="inline-flex rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                  {model.panel.tag}
                </span>
                <h3 className="text-3xl font-semibold tracking-[0.01em] text-white">{model.panel.title}</h3>
                <p className="max-w-xl text-sm tracking-[0.01em] text-white/70">{model.panel.body}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {model.panel.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-white/25 px-4 py-1 text-xs uppercase tracking-[0.25em] text-white/70">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PricingParallax;
