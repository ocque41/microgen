"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

const steps = [
  {
    id: "step-1",
    title: "What is the first thing you think about when it comes to working?",
    details: ["(No specific answer provided yet — probably meant to lead into the next node.)"],
    image: "/pic (4).png",
  },
  {
    id: "step-2",
    title: "What eats the most time in a normal week?",
    details: [
      "Sourcing / finding targets / keeping the pipeline full",
      "Collecting data from PDFs, emails, data sheets, etc.",
      "Cleaning / normalizing data in Excel (formatting, duplicates)",
      "Building or updating slides, memos, or IC decks",
      "Reviewing reporting (portfolio, LP/GP, etc.)",
      "Ad hoc tasks just to check that analysis from teammates is correct",
    ],
    image: "/pic (7).png",
  },
  {
    id: "step-3",
    title: "What’s the most annoying part of that task?",
    details: ["Say one part"],
    image: "/pic10.png",
  },
  {
    id: "step-4",
    title: "When you try a new tool / AI, what are you actually hoping for?",
    details: ["Do everything", "Do something", "Work with me together"],
    image: "/pic (6).png",
  },
  {
    id: "step-5",
    title: "How structured is your environment?",
    details: [
      "Pipelines set up",
      "Decided tools already track deals/companies in a system (Affinity, HubSpot, Airtable, Excel)",
      "Mostly run on files, email, and Slack",
      "Mix and it changes deal to deal",
    ],
    image: "/pic9.png",
  },
];

const HoverExpandSteps = ({ className }: { className?: string }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const resetIfActive = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : prev));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("relative w-full max-w-5xl", className)}
    >
      <div className="flex w-full flex-col gap-5">
        {steps.map((step, index) => {
          const isActive = activeIndex === index;

          return (
            <div key={step.id} className="flex items-stretch gap-4">
              <div className="flex w-10 items-center justify-center text-base font-semibold tracking-[0.2em] text-white/40">
                {String(index + 1).padStart(2, "0")}
              </div>
              <motion.button
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => resetIfActive(index)}
                onFocus={() => setActiveIndex(index)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    resetIfActive(index);
                  }
                }}
                onClick={() => setActiveIndex(index)}
                initial={false}
                animate={{
                  height: isActive ? 330 : 150,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={cn(
                  "group relative flex w-full overflow-hidden rounded-[28px] bg-transparent text-left",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70",
                )}
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className={cn(
                    "h-full w-full object-cover transition-opacity duration-300",
                    isActive ? "opacity-30" : "opacity-100",
                  )}
                />

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key={`${step.id}-content`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute inset-0 flex h-full w-full flex-col justify-end bg-gradient-to-t from-[#090909] via-[#090909]/85 to-transparent px-8 pb-8"
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">
                        Step {index + 1}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        {step.title}
                      </h3>
                      <ul className="mt-4 space-y-1.5 text-base leading-relaxed text-white/80">
                        {step.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export function HowItWorksSection() {
  return (
    <section
      aria-labelledby="how-it-works-title"
      className="relative isolate flex w-full justify-center bg-[#090909] px-6 py-28 sm:px-10 lg:px-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-white">
        <h2
          id="how-it-works-title"
          className="text-center text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl"
        >
          Start by mapping the repetitive questions, then let the agent work the plan
        </h2>
        <HoverExpandSteps className="w-full" />
      </div>
    </section>
  );
}

export { HoverExpandSteps };
