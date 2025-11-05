import type { CSSProperties } from "react";
import { useEffect } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { ProgressiveBlur } from "@/components/effects/ProgressiveBlur";
import { publicAsset } from "@/lib/publicAsset";
import { marketingTheme } from "@/lib/marketingTheme";
import { HeroSection } from "@/sections/hero";
import { HowItWorksSection } from "@/sections/how-it-works";

const marketingThemeStyles = {
  "--marketing-background-color": marketingTheme.background,
  "--surface-background": marketingTheme.background,
  backgroundColor: marketingTheme.background,
} as CSSProperties;

const VIEWPORT_MAX_WIDTH = "min(1600px, 94vw)";

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
        <section className="relative isolate z-[12000] flex justify-center" aria-label="Primary navigation">
          <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex w-full justify-center px-3 sm:px-6">
            <nav
              className="pointer-events-auto relative z-[10000] flex w-full max-w-[26rem] items-center gap-3 rounded-full bg-[rgba(9,9,9,0.82)] px-5 py-2 text-sm shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-sm md:max-w-[22rem] md:gap-1.5 md:bg-transparent md:px-3 md:py-1.5 md:text-xs md:shadow-none"
              aria-label="Main navigation"
            >
              <TransitionLink
                to="/"
                className="relative flex h-12 w-12 shrink-0 items-center justify-center transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3a7ca5] md:h-10 md:w-10"
                aria-label="Microagents home"
              >
                <img
                  src="/logo-4.png"
                  alt="Microagents logo"
                  className="h-10 w-10 object-contain md:h-9 md:w-9"
                  loading="lazy"
                />
              </TransitionLink>
              <div className="hidden flex-1 items-center justify-center gap-2 font-medium text-[#f9f9f9] md:flex">
                <TransitionLink to="/pricing" className="text-[#f9f9f9] transition-colors duration-200 hover:text-white whitespace-nowrap">
                  Models
                </TransitionLink>
                <TransitionLink to="/login" className="text-[#f9f9f9] transition-colors duration-200 hover:text-white whitespace-nowrap">
                  Login
                </TransitionLink>
              </div>
              <TransitionLink
                to="/signup"
                className="ml-auto inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-[#3a7ca5] transition-transform duration-200 hover:scale-105 whitespace-nowrap md:ml-0 md:px-4 md:py-1.5 md:text-sm"
              >
                Get Started
              </TransitionLink>
            </nav>
          </div>
          {/* Plan Step 3: anchored marketing nav to bottom edge for persistent CTA visibility. */}
          {/* Plan V7 Step 3: mobile nav condensed to logo + CTA with larger tap targets. */}
        </section>
        <HeroSection />
        <HowItWorksSection />

        <section
          className="relative mt-48 flex w-full flex-col justify-center bg-[#090909] px-6 py-24 sm:px-10 md:mt-64 lg:px-16 xl:mt-72 xl:px-20"
          style={{ minHeight: "100vh", height: "100svh", boxSizing: "border-box" }}
        >
          {/* Plan Spacing Step 2: top margin added so pricing stage has clear separation from previous section. */}
          {/* Plan V10 Step 2: margin increased to account for taller hero above. */}
          {/* Plan Step 3: pricing stage locks to viewport height while padding respects box model. */}
          <div
            className="mx-auto flex w-full flex-1 flex-col justify-center gap-16 text-left"
            style={{ maxWidth: VIEWPORT_MAX_WIDTH }}
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold sm:text-4xl md:text-5xl">Pricing crafted as you build</h2>
              <p className="text-base sm:text-lg" style={{ color: "color-mix(in srgb, var(--text-primary) 70%, transparent)" }}>
                Every engagement begins with a live conversation inside your microagent workspace. Share priorities with a pricing co-pilot that listens, models usage, and assembles a commercial path while you shape the agent itself.
              </p>
            </div>
            <div className="grid gap-12 rounded-[5px] bg-[#090909]">
              <article className="space-y-6">
                <h3 className="text-2xl font-semibold sm:text-3xl md:text-4xl">How the pilot personalizes your plan</h3>
                <div className="overflow-hidden rounded-[5px]">
                  <div className="flex min-h-[420px] w-full items-center justify-center bg-[#090909] px-8 py-12">
                    <video
                      src={publicAsset("insignia.mov")}
                      className="w-full max-w-3xl object-contain transition-transform duration-500 ease-out"
                      autoPlay
                      loop
                      muted
                      playsInline
                      aria-label="Insignia animation illustrating pricing flow"
                    />
                  </div>
                </div>
                <ul className="space-y-1.5 text-base sm:text-lg" style={{ color: "color-mix(in srgb, var(--text-primary) 70%, transparent)" }}>
                  <li>
                    <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-[color:rgba(244,241,234,0.45)]">
                      Frame your goals
                    </span>
                    Surface workloads, compliance mandates, and stakeholder expectations as the agent maps capacity.
                  </li>
                </ul>
                <p className="text-base sm:text-lg" style={{ color: "color-mix(in srgb, var(--text-primary) 70%, transparent)", marginTop: "0.65rem" }}>
                  Your static tier will be per agent, plan your agent and team endorse.
                </p>
                {/* Plan Step 1 refinement: matched typography scale with How It Works section */}
              </article>
              <div className="flex justify-start">
                <TransitionLink
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-3 text-xl font-semibold text-[#3a7ca5] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3a7ca5]"
                >
                  Get Started
                </TransitionLink>
              </div>
            </div>
            {/* Plan Step 2 complete: refreshed CTA copy */}
          </div>
        </section>
        {/* Plan Step 3: pricing container now anchors to viewport dimensions with flex centering. */}

        <footer className="relative z-[12000] mt-48 flex min-h-screen flex-col justify-between px-6 py-14 text-[color:rgba(244,241,234,0.78)] sm:mt-56 md:mt-64 lg:px-12 xl:mt-72">
          {/* Plan Spacing Step 3: elevated top margin keeps footer distinct from pricing block. */}
          {/* Plan V10 Step 2: footer offset increased to maintain section rhythm after hero expansion. */}
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
              <h2 className="hero__title text-[#3a7ca5]">
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
        {/* Plan Step 1: elevated footer z-index so legal links sit above fixed progressive blur. */}
      </div>
    </div>
  );
}
