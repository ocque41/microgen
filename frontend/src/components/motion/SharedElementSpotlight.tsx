import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useMotionSuppressed } from "@/lib/viewTransitions";

const CARDS = [
  {
    id: "brief",
    title: "Brief",
    description: "Summarize the policy frame and guardrails the agent must respect.",
    accent: "rgba(99,168,255,0.18)",
  },
  {
    id: "review",
    title: "Review",
    description: "Capture sign-off moments with traceable evidence.",
    accent: "rgba(79,209,197,0.22)",
  },
  {
    id: "handoff",
    title: "Handoff",
    description: "Deliver a receipt and escalation checklist before the session closes.",
    accent: "rgba(248,184,120,0.22)",
  },
] as const;

const TRANSITION = { duration: 0.2, ease: [0.4, 0, 0.2, 1] } as const;

export function SharedElementSpotlight() {
  const [activeId, setActiveId] = useState<(typeof CARDS)[number]["id"] | null>(CARDS[0]?.id ?? null);
  const motionSuppressed = useMotionSuppressed();

  const transition = useMemo(() => (motionSuppressed ? { duration: 0.01 } : TRANSITION), [motionSuppressed]);

  return (
    <div className="relative flex flex-col gap-6 md:flex-row">
      <ul className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
        {CARDS.map((card) => {
          const isActive = card.id === activeId;
          return (
            <motion.button
              key={card.id}
              type="button"
              layoutId={`card-${card.id}`}
              onClick={() => setActiveId(card.id)}
              className={
                "group relative flex min-h-[160px] flex-col justify-between rounded-2xl border border-[color:var(--border-glass)] bg-[color:rgba(10,14,22,0.9)] p-5 text-left shadow-[0_30px_90px_-70px_rgba(0,0,0,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--accent)]"
              }
              style={{
                boxShadow: isActive
                  ? "0 30px 90px -60px rgba(99,168,255,0.45)"
                  : "0 24px 80px -68px rgba(8,12,20,0.75)",
              }}
              transition={transition}
            >
              <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[color:rgba(226,232,240,0.55)]">
                {card.id}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{card.title}</h3>
                <p className="mt-3 text-sm text-[color:var(--text-muted)]">{card.description}</p>
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 bottom-4 h-1 rounded-full opacity-70 transition-opacity group-hover:opacity-100"
                style={{ background: card.accent }}
              />
            </motion.button>
          );
        })}
      </ul>
      <AnimatePresence>
        {activeId ? (
          <motion.section
            key={activeId}
            layoutId={`card-${activeId}`}
            aria-live="polite"
            className="relative flex min-h-[200px] flex-1 flex-col justify-between rounded-3xl border border-[color:var(--border-strong)] bg-[color:rgba(16,20,32,0.92)] p-6 text-left shadow-[0_60px_120px_-90px_rgba(0,0,0,0.9)]"
            initial={motionSuppressed ? { opacity: 1, scale: 1 } : { opacity: 0.92, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={motionSuppressed ? { opacity: 1, scale: 1 } : { opacity: 0.92, scale: 0.98 }}
            transition={transition}
          >
            <header>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[color:rgba(226,232,240,0.55)]">Active step</p>
              <h3 className="mt-2 text-xl font-semibold text-[color:var(--text-primary)]">
                {CARDS.find((card) => card.id === activeId)?.title}
              </h3>
            </header>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--text-muted)]">
              {CARDS.find((card) => card.id === activeId)?.description}
            </p>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 bottom-6 h-[2px] rounded-full"
              style={{
                background:
                  CARDS.find((card) => card.id === activeId)?.accent ?? "rgba(99,168,255,0.18)",
              }}
            />
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
