import { TransitionLink } from "@/components/motion/TransitionLink";

import heroShowcase from "@/assets/hero.png";

export function HeroSection() {
  return (
    <section
      className="relative isolate overflow-hidden px-6 pb-24 pt-20 text-center text-[color:var(--text-primary)] md:px-12 lg:pb-32 lg:pt-28"
      style={{ background: "radial-gradient(circle at top, rgba(32,123,255,0.28), transparent 55%), radial-gradient(circle at bottom, rgba(99,76,255,0.18), rgba(9,9,9,0.92))" }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(12,18,32,0.9),rgba(5,7,12,0.96))]" />
      <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-64 w-64 rounded-full bg-[color:rgba(35,94,255,0.25)] blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-72 w-72 rounded-full bg-[color:rgba(173,103,255,0.24)] blur-3xl" />

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10">
        <div className="space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.45em] text-[color:rgba(244,241,234,0.6)]">
            Operational AI Platform
          </p>
          <h1 className="text-balance text-[clamp(3.5rem,6vw+1rem,6rem)] font-semibold leading-[0.95] text-[color:var(--text-primary)]">
            microagents
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-base text-[color:rgba(244,241,234,0.7)] md:text-lg">
            Bring curated multi-agent workflows to every browser tab. Automate research, execution, and reporting while staying fully in control of privacy and policy.
          </p>
        </div>

        <TransitionLink
          to="/signup"
          className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-10 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-[color:var(--accent-inverse)] transition-colors duration-200 hover:bg-[color:var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--accent)]"
        >
          Get Started
        </TransitionLink>

        <div className="relative w-full max-w-5xl">
          <div className="absolute inset-0 -z-10 translate-y-8 rounded-[36px] bg-[color:rgba(7,14,26,0.65)] blur-3xl" aria-hidden="true" />
          <div className="overflow-hidden rounded-[28px] border border-[color:rgba(244,241,234,0.08)] bg-[color:rgba(18,24,34,0.92)] shadow-[0_90px_180px_-80px_rgba(15,23,42,0.8)]">
            <img
              src={heroShowcase}
              alt="Microagents workspace showcasing browser-scale flows."
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
