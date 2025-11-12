"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: "stage-a",
    title: "Where does the week actually go?",
    details: [
      "Hours disappear into sourcing lists, pulling metrics out of decks, cleaning them in sheets, and restacking slides.",
      "We start by ingesting those decks, emails, and spreadsheets so you get one structured record without retyping.",
    ],
    image: "/pic (4).png",
  },
  {
    id: "stage-b",
    title: "Name the villain in that workflow",
    details: [
      "Duplicate entry across CRM, tracker, and memo.",
      "Metrics show up in ten formats and never match your schema.",
      "Everyone is chasing the latest attachment across files, email, and Slack.",
      "We normalize the data and keep one living version so the team stops copy/pasting.",
    ],
    image: "/pic (7).png",
  },
  {
    id: "stage-c",
    title: "Pick your automation comfort level",
    details: [
      "Autopilot: the agent reads the deck, updates the deal, and syncs to CRM.",
      "Assist mode: it drafts the record and you approve or tweak.",
      "Co-pilot: you lead, the agent fills blanks, links docs, and fetches context.",
      "Whatever path you choose, the workflow bends to your control, not the other way around.",
    ],
    image: "/pic10.png",
  },
  {
    id: "stage-d",
    title: "Work with the stack you already have",
    details: [
      "Affinity, HubSpot, Airtable, Excel — we sit on top of all of it.",
      "Most deal work still runs through files, email, and Slack; we pull that into one view.",
      "If a process shifts mid-deal, the workspace shifts with you so nothing gets rebuilt from scratch.",
    ],
    image: "/pic (6).png",
  },
  {
    id: "stage-e",
    title: "Why this matters right now",
    details: [
      "Inbound volume is up while teams stay small — quick extraction keeps screening moving.",
      "Switching CRMs or comparing stacks is painful; acting as an overlay avoids another migration.",
      "Partners still expect polished memos, so automatic standardization frees time for actual evaluation.",
      "Deal cycles are unpredictable, so trimming the ops drag buys back focus for the calls that count.",
    ],
    image: "/pic9.png",
  },
];

const HoverExpandSteps = ({ className }: { className?: string }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("relative w-full max-w-5xl", className)}
    >
      <div className="flex w-full flex-col gap-5">
        {steps.map((step, index) => {
          if (isMobile) {
            return (
              <div key={step.id} className="flex flex-col overflow-hidden rounded-[24px] bg-[#111]/60 ring-1 ring-white/5">
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={step.image} alt={step.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                    Step {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="space-y-3 px-5 py-6">
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <ul className="space-y-2 text-sm leading-relaxed text-white/80">
                    {step.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          }

          const isActive = activeIndex === index;

          return (
            <div key={step.id} className="flex items-stretch gap-4">
              <div className="hidden w-10 items-center justify-center text-base font-semibold tracking-[0.2em] text-white/40 sm:flex">
                {String(index + 1).padStart(2, "0")}
              </div>
              <motion.button
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setActiveIndex((prev) => (prev === index ? null : prev));
                  }
                }}
                onFocus={() => setActiveIndex(index)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setActiveIndex((prev) => (prev === index ? null : prev));
                  }
                }}
                onClick={() => setActiveIndex(index)}
                layout
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={cn(
                  "group relative flex w-full overflow-hidden rounded-[28px] bg-transparent text-left",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70",
                )}
                style={{ minHeight: isActive ? 420 : 200 }}
              >
                <div className="absolute inset-0">
                  <img
                    src={step.image}
                    alt={step.title}
                    className={cn(
                      "h-full w-full object-cover transition-opacity duration-300",
                      isActive ? "opacity-30" : "opacity-100",
                    )}
                  />
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key={`${step.id}-content`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute inset-0 z-10 flex h-full w-full flex-col justify-end bg-gradient-to-t from-[#090909] via-[#090909]/90 to-transparent px-8 pb-8"
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
