"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
      image: "/pic11.png",
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
      image: "/pic11.png",
    },
  },
];

type ModelSection = (typeof modelSections)[number];

const PricingParallax = () => {
  return (
    <section id="models" className="relative isolate overflow-hidden bg-[#050505] py-28 text-[#f9f9f9] md:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-10 h-64 bg-gradient-to-b from-[#141414] via-transparent to-transparent opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-[10%] top-1/2 h-[640px] rounded-full bg-[#5f5cff] opacity-[0.08] blur-[120px]" />

      <div className="mx-auto flex max-w-6xl flex-col gap-24 px-4 pb-40 md:gap-28 md:px-10 lg:px-12">
        <header className="space-y-6 text-left">
          <p className="text-xs uppercase tracking-[0.55em] text-white/45">Models</p>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <h2 className="text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl">
              Build the operating system that matches how your capital team actually moves
            </h2>
            <p className="text-base leading-relaxed text-white/70 sm:text-lg">
              Each model is a full-stack deployment: capture, schema, automations, and a guided workspace. Scroll through to
              see how the cards expand, blur, and hand off to the next model—matching the flow from sourcing to execution.
            </p>
          </div>
        </header>

        <div className="space-y-[26vh]">
          {modelSections.map((model) => (
            <ModelRow key={model.id} model={model} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ModelRow = ({ model }: { model: ModelSection }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.12, 0.25], [0, 0.6, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.25], [40, 0]);
  const cardsOpacity = useTransform(scrollYProgress, [0.18, 0.35, 0.74, 0.92], [0, 1, 1, 0]);
  const cardsScale = useTransform(scrollYProgress, [0.18, 0.35], [0.95, 1]);
  const cardsY = useTransform(scrollYProgress, [0.65, 0.92], [0, 140]);
  const washOpacity = useTransform(scrollYProgress, [0.65, 0.85, 1], [0, 0.25, 0.5]);

  return (
    <div ref={sectionRef} className="relative min-h-[220vh]">
      <motion.div
        style={{ opacity: washOpacity }}
        className="pointer-events-none absolute inset-x-10 bottom-0 h-[45vh] rounded-[120px] bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] blur-[110px]"
        aria-hidden
      />
      <div className="sticky top-[12vh] flex flex-col gap-8 sm:gap-10 lg:gap-14">
        <motion.div style={{ opacity: headingOpacity, y: headingY }} className="max-w-4xl space-y-5">
          <div className="text-xs uppercase tracking-[0.45em] text-white/40">{model.title}</div>
          <div className="space-y-4">
            <p className="text-3xl font-light leading-tight text-white sm:text-4xl">{model.description}</p>
            <p className="text-sm text-white/60 sm:text-base">{model.cardSummary}</p>
          </div>
        </motion.div>
        <motion.div
          style={{ opacity: cardsOpacity, scale: cardsScale, y: cardsY }}
          className="grid items-start gap-6 lg:grid-cols-[1.05fr_1.45fr]"
        >
          <article className="flex h-full flex-col rounded-[32px] border border-white/10 bg-gradient-to-b from-[#161616] via-[#0e0e0e] to-[#090909] p-5 shadow-[0_45px_120px_rgba(0,0,0,0.65)] sm:p-7">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.4em] text-white/70">
                {model.badge}
              </div>
              <p className="text-sm text-white/60">{model.subtitle}</p>
              <p className="text-base text-white/80">{model.cardSummary}</p>
            </div>
            <div className="mt-8 space-y-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-semibold tracking-tight">{model.price}</span>
                <span className="text-xs uppercase tracking-[0.25em] text-white/40">{model.priceSuffix}</span>
              </div>
              <ul className="space-y-3 text-sm text-white/75">
                {model.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white/50" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition duration-200 hover:translate-y-[-2px] hover:bg-white/90">
              {model.ctaLabel}
              <span aria-hidden>→</span>
            </button>
          </article>

          <MotionHero panel={model.panel} cardsOpacity={cardsOpacity} />
        </motion.div>
      </div>
    </div>
  );
};

const MotionHero = ({
  panel,
  cardsOpacity,
}: {
  panel: ModelSection["panel"];
  cardsOpacity: ReturnType<typeof useTransform>;
}) => {
  const glowShadow = useTransform(cardsOpacity, (value) => `0 40px 120px rgba(1,1,1,${0.15 + value * 0.4})`);

  return (
    <motion.div
      style={{ boxShadow: glowShadow }}
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-[32px] border border-white/10 bg-[#0d0d0d]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${panel.image ?? "/pic11.png"})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-black/70 to-transparent" aria-hidden />
      <div className="relative flex h-full flex-col justify-between gap-10 p-6 sm:p-8 md:p-10">
        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-white/20 px-4 py-1 text-[10px] uppercase tracking-[0.4em] text-white/75">
            {panel.tag}
          </span>
          <h3 className="text-3xl font-semibold leading-tight text-white md:text-4xl">{panel.title}</h3>
          <p className="max-w-xl text-sm leading-relaxed text-white/75">{panel.body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {panel.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/35 bg-white/5 px-4 py-1 text-[10px] uppercase tracking-[0.4em] text-white/80"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PricingParallax;
