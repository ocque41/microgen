"use client";

import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CardAccent = "light" | "dark" | "outline";

type PricingCardContent = {
  accent: CardAccent;
  label: string;
  badge?: string;
  price: string;
  cadence?: string;
  summary: string;
  perks: string[];
  ctaLabel: string;
};

type PricingColumnConfig = {
  id: string;
  align: "start" | "center" | "end";
  cards: PricingCardContent[];
};

const pricingColumns: PricingColumnConfig[] = [
  {
    id: "activation",
    align: "end",
    cards: [
      {
        accent: "light",
        label: "Starter",
        badge: "Pilot ready",
        price: "$2.4k",
        cadence: "/model",
        summary: "Launch a single workflow with embedded guardrails and analytics across one pod.",
        perks: ["Workspace analytics", "Guided onboarding", "Async product support"],
        ctaLabel: "Launch pilot",
      },
      {
        accent: "light",
        label: "Growth",
        badge: "Most adopted",
        price: "$4.5k",
        cadence: "/model",
        summary: "Run copilots across multiple teams with packaged change-management playbooks.",
        perks: ["Slack copilots", "Change kits", "Weekly office hours"],
        ctaLabel: "Book review",
      },
    ],
  },
  {
    id: "scale",
    align: "center",
    cards: [
      {
        accent: "dark",
        label: "Business",
        badge: "Scale",
        price: "$9.8k",
        cadence: "/model",
        summary: "Multi-region rollouts, dedicated strategists, and proactive model tuning coverage.",
        perks: ["Dedicated strategist", "24/7 response", "Model drift insurance"],
        ctaLabel: "Talk to sales",
      },
      {
        accent: "dark",
        label: "Enterprise",
        badge: "Custom",
        price: "Custom",
        cadence: "engagement",
        summary: "Mission-critical automations with layered reviews, premium telemetry, and legal support.",
        perks: ["Private cloud option", "On-prem connectors", "Joint success plans"],
        ctaLabel: "Design program",
      },
    ],
  },
  {
    id: "addons",
    align: "start",
    cards: [
      {
        accent: "outline",
        label: "Safety Desk",
        badge: "Add-on",
        price: "+$1.2k",
        cadence: "/mo",
        summary: "External review council plus red-team playbooks across sensitive workflows.",
        perks: ["Live incident routing", "Audit-ready exports", "Policy templating"],
        ctaLabel: "Secure review",
      },
      {
        accent: "outline",
        label: "Telemetry Kit",
        price: "Usage based",
        summary: "Deep observability for product, finance, and compliance teams in one surface.",
        perks: ["Realtime dashboards", "Forecasting hooks", "Data warehouse sync"],
        ctaLabel: "Add telemetry",
      },
    ],
  },
];

type PricingParallaxProps = {
  variant?: "default" | "inverted";
};

type SectionDimension = {
  width: number;
  height: number;
  viewport: number;
};

const PricingParallax = ({ variant = "default" }: PricingParallaxProps) => {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState<SectionDimension>({ width: 0, height: 0, viewport: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height, width } = dimension;
  const yPrimary = useTransform(scrollYProgress, [0, 1], [0, height * 0.35]);
  const ySecondary = useTransform(scrollYProgress, [0, 1], [0, height * 0.55]);
  const yTertiary = useTransform(scrollYProgress, [0, 1], [0, height * 0.4]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let lenis: Lenis | null = null;
    let rafId = 0;
    let resizeObserver: ResizeObserver | null = null;

    const syncDimensions = () => {
      const viewport = window.innerHeight;
      const width = window.innerWidth;
      const galleryHeight = gallery.current?.scrollHeight ?? viewport;
      setDimension({ width, viewport, height: galleryHeight });
    };

    const enableSmooth = window.innerWidth >= 768;

    if (enableSmooth) {
      lenis = new Lenis();
      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    syncDimensions();

    const handleResize = () => syncDimensions();
    window.addEventListener("resize", handleResize);

    if (gallery.current && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => syncDimensions());
      resizeObserver.observe(gallery.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  const isInverted = variant === "inverted";
  const isDesktop = width >= 1024;

  const headlineClass = isInverted ? "text-[#f9f9f9]" : "text-[#090909]";
  const bodyTextClass = isInverted ? "text-[#f9f9f9]/70" : "text-[#090909]/70";
  const cueClass = isInverted ? "text-[#f9f9f9]/60" : "text-[#090909]/60";
  const cueGradient = isInverted ? "after:from-white/70" : "after:from-[#090909]/60";
  const sectionBackground = isInverted ? "bg-[#050505]" : "bg-[#f9f8f2]";

  const transforms = [yPrimary, ySecondary, yTertiary];

  return (
    <section className={cn("relative w-full overflow-hidden", sectionBackground)}>
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center sm:py-24">
        <span className={cn("text-xs uppercase tracking-[0.35em]", bodyTextClass)}>Pricing</span>
        <h2 className={cn("mt-3 text-4xl font-semibold leading-tight sm:text-5xl", headlineClass)}>
          Models that stay close to the work
        </h2>
        <p className={cn("mt-4 max-w-3xl text-base sm:text-lg", bodyTextClass)}>
          Pair a focused automation pod with scale-ready governance. Each stack shares the same telemetry,
          safety gates, and cost controls so finance never loses sight of spend.
        </p>
        <span
          className={cn(
            "relative mt-8 text-[11px] uppercase tracking-[0.4em] opacity-70 after:absolute after:left-1/2 after:top-full after:h-12 after:w-px after:bg-gradient-to-b after:to-transparent after:content-['']",
            cueClass,
            cueGradient,
          )}
        >
          Scroll to explore
        </span>
      </div>

      <div
        ref={gallery}
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-20 md:min-h-[120vh] md:flex-row md:gap-7"
      >
        {pricingColumns.map((column, index) => (
          <ParallaxColumn
            key={column.id}
            config={column}
            y={transforms[index]}
            inverted={isInverted}
            isStatic={!isDesktop}
          />
        ))}
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-16 text-center">
        <span
          className={cn(
            "relative text-[11px] uppercase tracking-[0.4em] opacity-60 before:absolute before:left-1/2 before:bottom-full before:h-10 before:w-px before:bg-gradient-to-b before:from-transparent before:to-current before:content-['']",
            cueClass,
          )}
        >
          Scroll back for the hero
        </span>
      </div>
    </section>
  );
};

type ParallaxColumnProps = {
  config: PricingColumnConfig;
  y: MotionValue<number>;
  inverted: boolean;
  isStatic: boolean;
};

const ParallaxColumn = ({ config, y, inverted, isStatic }: ParallaxColumnProps) => {
  const alignmentMap: Record<PricingColumnConfig["align"], string> = {
    start: "items-start",
    center: "items-stretch",
    end: "items-end",
  };

  return (
    <motion.div
      style={!isStatic ? { y } : undefined}
      className={cn(
        "relative flex min-h-full w-full flex-1 flex-col gap-5 md:min-w-[260px]",
        alignmentMap[config.align],
      )}
    >
      {config.cards.map((card) => (
        <PricingCard key={`${config.id}-${card.label}`} {...card} inverted={inverted} />
      ))}
    </motion.div>
  );
};

type PricingCardProps = PricingCardContent & { inverted: boolean };

type CardToneStyles = {
  container: string;
  border: string;
  muted: string;
  bullet: string;
  button: string;
  badge: string;
};

const getCardToneStyles = (accent: CardAccent, inverted: boolean): CardToneStyles => {
  switch (accent) {
    case "dark":
      return {
        container: "bg-[#090909] text-[#f9f9f9]",
        border: "border-white/15",
        muted: "text-white/70",
        bullet: "bg-white",
        button: "border-white/30 text-white hover:border-white/60",
        badge: "bg-white/10 text-white/70",
      };
    case "outline":
      return inverted
        ? {
            container: "bg-white/5 text-[#f9f9f9]",
            border: "border-white/20",
            muted: "text-white/70",
            bullet: "bg-white/80",
            button: "border-white/30 text-white hover:border-white/60",
            badge: "bg-white/10 text-white/65",
          }
        : {
            container: "bg-white/80 text-[#090909]",
            border: "border-[#090909]/10",
            muted: "text-[#090909]/70",
            bullet: "bg-[#090909]/70",
            button: "border-[#090909]/20 text-[#090909] hover:border-[#090909]/40",
            badge: "bg-[#090909]/5 text-[#090909]/60",
          };
    case "light":
    default:
      return {
        container: "bg-white text-[#090909]",
        border: "border-[#090909]/10",
        muted: "text-[#090909]/70",
        bullet: "bg-[#090909]",
        button: "border-[#090909]/20 text-[#090909] hover:border-[#090909]/40",
        badge: "bg-[#090909]/5 text-[#090909]/60",
      };
  }
};

const PricingCard = ({ accent, label, badge, price, cadence, summary, perks, ctaLabel, inverted }: PricingCardProps) => {
  const tone = getCardToneStyles(accent, inverted);

  return (
    <article
      className={cn(
        "group flex w-full flex-col gap-5 rounded-3xl border px-6 py-6 text-left shadow-[0_25px_60px_rgba(0,0,0,0.08)] backdrop-blur",
        tone.container,
        tone.border,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold uppercase tracking-[0.2em]">{label}</p>
          {badge ? (
            <span className={cn("mt-2 inline-flex rounded-full px-3 py-1 text-[11px] font-medium", tone.badge)}>
              {badge}
            </span>
          ) : null}
        </div>
        <div className="text-right">
          <span className="text-3xl font-semibold">{price}</span>
          {cadence ? (
            <small className={cn("block text-xs font-normal", tone.muted)}>{cadence}</small>
          ) : null}
        </div>
      </div>
      <p className={cn("text-sm leading-relaxed", tone.muted)}>{summary}</p>
      <ul className="mt-1 flex flex-col gap-2 text-sm">
        {perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full", tone.bullet)} />
            <span className={tone.muted}>{perk}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={cn(
          "mt-auto inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-colors",
          tone.button,
        )}
      >
        {ctaLabel}
      </button>
    </article>
  );
};

export { PricingParallax };
