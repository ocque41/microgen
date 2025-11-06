"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

const steps = [
  {
    id: "solve",
    eyebrow: "Step 01",
    title: "Solve the most crucial repetitive tasks",
    summary:
      "Pinpoint the work that drains velocity — discovery calls, follow-ups, weekly reporting — and scope the first win.",
  },
  {
    id: "automate",
    eyebrow: "Step 02",
    title: "Automate the workflows",
    summary:
      "Pair subject matter experts with our operators to translate playbooks into dependable agent routines.",
  },
  {
    id: "schedule",
    eyebrow: "Step 03",
    title: "Schedule actions and reviews",
    summary:
      "Set cadences for outreach, enrichments, and syncs so the agent never misses the next best move.",
  },
  {
    id: "notify",
    eyebrow: "Step 04",
    title: "Notify stakeholders in real time",
    summary:
      "Route alerts to Slack, email, and dashboards whenever the agent completes work or detects blockers.",
  },
  {
    id: "manage",
    eyebrow: "Step 05",
    title: "Manage and refine together",
    summary:
      "Review transcripts, tweak prompts, and stack new processes as the agent proves value week over week.",
  },
];

const HoverExpandSteps = ({ className }: { className?: string }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("relative w-full max-w-4xl", className)}
    >
      <div className="flex w-full flex-col gap-3">
        {steps.map((step, index) => {
          const isActive = activeIndex === index;

          return (
            <motion.button
              key={step.id}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              initial={false}
              animate={{
                height: isActive ? 260 : 68,
                paddingTop: isActive ? 28 : 18,
                paddingBottom: isActive ? 28 : 18,
              }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className={cn(
                "group relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/12 bg-white/5 px-6 text-left backdrop-blur",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70",
              )}
            >
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.35em] text-white/40">
                <span>{step.eyebrow}</span>
                <AnimatePresence>{isActive && <ActiveIndicator />}</AnimatePresence>
              </div>
              <motion.p
                layout
                className="mt-3 text-lg font-semibold leading-snug text-white sm:text-xl"
              >
                {step.title}
              </motion.p>
              <AnimatePresence>
                {isActive && (
                  <motion.p
                    key={`${step.id}-summary`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.26, ease: "easeOut" }}
                    className="mt-4 max-w-[48ch] text-base leading-relaxed text-white/70"
                  >
                    {step.summary}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

const ActiveIndicator = () => (
  <motion.span
    initial={{ opacity: 0, x: 12 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 12 }}
    transition={{ duration: 0.24, ease: "easeOut" }}
    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-medium tracking-[0.2em] text-white"
  >
    ACTIVE
  </motion.span>
);

export function HowItWorksSection() {
  return (
    <section
      aria-labelledby="how-it-works-title"
      className="relative isolate flex w-full justify-center bg-[#101010] px-6 py-32 sm:px-10 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#1c1c1c] opacity-70 blur-3xl" />
        <div className="absolute inset-x-12 bottom-[18%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 text-white">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-[0.45em] text-white/40">How it works</span>
          <h2
            id="how-it-works-title"
            className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl"
          >
            Start with the work that matters, expand into a fully managed operator
          </h2>
        </div>
        <HoverExpandSteps className="w-full" />
      </div>
    </section>
  );
}

export { HoverExpandSteps };
