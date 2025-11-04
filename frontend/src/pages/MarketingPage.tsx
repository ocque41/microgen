import type { CSSProperties } from "react";
import { useEffect } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { ProgressiveBlur } from "@/components/effects/ProgressiveBlur";
import { marketingTheme } from "@/lib/marketingTheme";
import { HeroSection } from "@/sections/hero";
import { HowItWorksSection } from "@/sections/how-it-works";

const marketingThemeStyles = {
  "--marketing-background-color": marketingTheme.background,
  "--surface-background": marketingTheme.background,
  backgroundColor: marketingTheme.background,
} as CSSProperties;

export function MarketingPage() {
  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const root = document.documentElement;
    const previousSurfaceBackground = root.style.getPropertyValue("--surface-background");
    const previousBodyBackground = document.body.style.backgroundColor;

    root.style.setProperty("--surface-background", marketingTheme.background);
    document.body.style.backgroundColor = marketingTheme.background;

    return () => {
      if (previousSurfaceBackground) {
        root.style.setProperty("--surface-background", previousSurfaceBackground);
      } else {
        root.style.removeProperty("--surface-background");
      }

      document.body.style.backgroundColor = previousBodyBackground;
    };
  }, [marketingTheme.background]);

  

  return (
    <div className="relative min-h-screen overflow-x-hidden text-text" style={marketingThemeStyles}>
      <div className="mesh-background pointer-events-none" />
      <ProgressiveBlur
        position="bottom"
        strategy="fixed"
        blurAmount="22px"
        height="220px"
        className="z-[9000]"
        backgroundColor="rgba(9,9,9,0.98)"
      />
      {/* Plan Step 2: fixed bottom blur now layered under navigation shell. */}
      <div className="relative">
        <section className="relative isolate z-[998] flex justify-center" aria-label="Primary navigation">
          <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex w-full justify-center px-3 sm:px-6">
            <nav
              className="pointer-events-auto relative z-[10000] flex w-full max-w-[22rem] items-center gap-1.5 rounded-full border border-[color:rgba(255,255,255,0.08)] bg-[#090909] px-3 py-1.5 text-xs shadow-[0_25px_70px_-60px_rgba(0,0,0,0.9)] backdrop-blur-sm"
              aria-label="Main navigation"
            >
              <TransitionLink
                to="/"
                className="relative flex h-10 w-10 shrink-0 items-center justify-center transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3a7ca5]"
                aria-label="Microagents home"
              >
                <img
                  src="/logo-4.png"
                  alt="Microagents logo"
                  className="h-9 w-9 object-contain"
                  loading="lazy"
                />
              </TransitionLink>
              <div className="flex flex-1 items-center justify-center gap-2 font-medium text-[#f9f9f9]">
                <TransitionLink to="/pricing" className="text-[#f9f9f9] transition-colors duration-200 hover:text-white whitespace-nowrap">
                  Models
                </TransitionLink>
                <TransitionLink to="/login" className="text-[#f9f9f9] transition-colors duration-200 hover:text-white whitespace-nowrap">
                  Login
                </TransitionLink>
              </div>
              <TransitionLink
                to="/signup"
                className="inline-flex items-center justify-center rounded-full bg-[#3a7ca5] px-4 py-1.5 font-semibold text-white transition-transform duration-200 hover:scale-105 whitespace-nowrap"
              >
                Get Started
              </TransitionLink>
            </nav>
          </div>
          {/* Plan Step 3: anchored marketing nav to bottom edge for persistent CTA visibility. */}
        </section>
        <HeroSection />
        <HowItWorksSection />

        <section className="flex min-h-screen items-center px-6 py-20 lg:px-12">
          <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[5px] border border-[color:rgba(244,241,234,0.08)] bg-[#090909] p-12 shadow-[0_60px_160px_-110px_rgba(0,0,0,0.9)]">
            <div className="mx-auto flex max-w-3xl flex-col gap-12 text-left">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl">Pricing crafted as you build</h2>
                <p className="text-base sm:text-lg" style={{ color: "color-mix(in srgb, var(--text-primary) 70%, transparent)" }}>
                  Every engagement begins with a live conversation inside your microagent workspace. Share priorities with a pricing co-pilot that listens, models usage, and assembles a commercial path while you shape the agent itself.
                </p>
              </div>
              <article className="space-y-6 rounded-[5px] border border-[color:rgba(244,241,234,0.1)] bg-[#090909] p-8">
                <h3 className="text-2xl font-semibold sm:text-3xl md:text-4xl">How the pilot personalizes your plan</h3>
                <div className="overflow-hidden rounded-[5px] border border-[color:rgba(244,241,234,0.08)]">
                  <img
                    src="/gradient2.png"
                    alt="Gradient accent for pricing flow"
                    className="h-[420px] w-full object-cover object-center transition-transform duration-500 ease-out"
                  />
                </div>
                <ul className="space-y-3 text-base sm:text-lg" style={{ color: "color-mix(in srgb, var(--text-primary) 70%, transparent)" }}>
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-[color:rgba(244,241,234,0.45)]">
                      Frame your goals
                    </span>
                    Surface workloads, compliance mandates, and stakeholder expectations as the agent maps capacity.
                  </li>
                </ul>
                <p className="text-base sm:text-lg" style={{ color: "color-mix(in srgb, var(--text-primary) 70%, transparent)" }}>
                  Your static tier will be per agent, plan your agent and team endorse.
                </p>
                {/* Plan Step 1 refinement: matched typography scale with How It Works section */}
              </article>
              <div className="flex justify-center">
                <TransitionLink
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-8 py-3 text-sm font-semibold text-[color:var(--accent-inverse)] transition hover:bg-[color:var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--accent)]"
                >
                  Get Started
                </TransitionLink>
              </div>
              {/* Plan Step 2 complete: refreshed CTA copy */}
            </div>
          </div>
        </section>

        <footer className="flex min-h-screen flex-col justify-between px-6 py-14 text-[color:rgba(244,241,234,0.78)] lg:px-12">
          <div className="flex flex-1 flex-col justify-between gap-16">
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
              {/* Footer refresh step: replaced wordmark text with brand icon for consistent branding */}
              <div className="max-w-sm space-y-3 text-left">
                <img
                  src="/logo-4.png"
                  alt="Microagents logo"
                  className="h-9 w-9 object-contain"
                  loading="lazy"
                />
                <p className="text-sm text-[color:rgba(244,241,234,0.62)]">
                  Operational AI for accountable teams delivering evidence-first assistance across every workflow.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 text-left text-sm text-[color:rgba(244,241,234,0.68)] sm:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[color:rgba(244,241,234,0.45)]">Resources</p>
                  <TransitionLink to="/research" className="block text-[#f9f9f9] transition hover:text-white">Research</TransitionLink>
                  <TransitionLink to="/safety" className="block text-[#f9f9f9] transition hover:text-white">Safety</TransitionLink>
                  <TransitionLink to="/api" className="block text-[#f9f9f9] transition hover:text-white">API</TransitionLink>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[color:rgba(244,241,234,0.45)]">Company</p>
                  <TransitionLink to="/about" className="block text-[#f9f9f9] transition hover:text-white">About</TransitionLink>
                  <TransitionLink to="/careers" className="block text-[#f9f9f9] transition hover:text-white">Careers</TransitionLink>
                  <TransitionLink to="/press" className="block text-[#f9f9f9] transition hover:text-white">Press</TransitionLink>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[color:rgba(244,241,234,0.45)]">Terms &amp; policies</p>
                  <TransitionLink to="/terms" className="block text-[#f9f9f9] transition hover:text-white">Terms of use</TransitionLink>
                  <TransitionLink to="/privacy" className="block text-[#f9f9f9] transition hover:text-white">Privacy policy</TransitionLink>
                  <TransitionLink to="/usage" className="block text-[#f9f9f9] transition hover:text-white">Usage policy</TransitionLink>
                </div>
              </div>
              <img
                src="/logo-4.png"
                alt="Microagents logo"
                className="hidden h-9 w-9 object-contain md:block md:self-start"
                loading="lazy"
              />
              {/* Plan Step 5: unified nav/footer branding with logo (4). */}
            </div>
            <div className="flex flex-1 items-center justify-center">
              <h2 className="hero__title text-[color:rgba(244,241,234,0.12)]">
                MICROAGENTS
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-6 text-xs text-[color:rgba(244,241,234,0.45)] md:flex-row md:items-center md:justify-between">
            <span>© {new Date().getFullYear()} Microagents, Inc. All rights reserved.</span>
            <div className="flex flex-wrap gap-4">
              <TransitionLink to="/legal" className="text-[#f9f9f9] transition hover:text-white">Legal</TransitionLink>
              <TransitionLink to="/status" className="text-[#f9f9f9] transition hover:text-white">Status</TransitionLink>
              <TransitionLink to="/docs" className="text-[#f9f9f9] transition hover:text-white">Docs</TransitionLink>
              <TransitionLink to="/contact" className="text-[#f9f9f9] transition hover:text-white">Contact</TransitionLink>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
