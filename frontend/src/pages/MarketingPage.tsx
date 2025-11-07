import ReactLenis from "lenis/react";
import type { CSSProperties } from "react";
import { useEffect } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { ProgressiveBlur } from "@/components/effects/ProgressiveBlur";
import { marketingTheme } from "@/lib/marketingTheme";
import { HeroSection } from "@/sections/hero";
import { HowItWorksSection } from "@/sections/how-it-works";
import PricingParallax from "@/components/PricingParallax";

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
    <ReactLenis root>
      <div className="relative min-h-screen overflow-x-hidden text-text" style={marketingThemeStyles}>
        <ProgressiveBlur position="top" className="z-[1]" />
        <ProgressiveBlur position="bottom" className="z-[1]" />
        <div className="relative">
        <section className="relative isolate z-[12000] flex justify-center" aria-label="Primary navigation">
          <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex w-full justify-center px-3 sm:px-6">
            <nav
              className="pointer-events-auto relative z-[10000] flex w-full max-w-[26rem] items-center gap-3 rounded-full px-5 py-2 text-sm md:max-w-[22rem] md:gap-1.5 md:px-3 md:py-1.5 md:text-xs"
              aria-label="Main navigation"
            >
              <TransitionLink
                to="/"
                className="relative flex h-12 w-12 shrink-0 items-center justify-center transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9f9f9] md:h-10 md:w-10"
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
                <TransitionLink to="/pricing" className="text-[#f9f9f9] transition-opacity duration-200 hover:opacity-80 whitespace-nowrap">
                  Models
                </TransitionLink>
                <TransitionLink to="/login" className="text-[#f9f9f9] transition-opacity duration-200 hover:opacity-80 whitespace-nowrap">
                  Login
                </TransitionLink>
              </div>
              <TransitionLink
                to="/signup"
                className="ml-auto inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-semibold text-[#f9f9f9] transition-transform duration-200 hover:scale-105 whitespace-nowrap md:ml-0 md:px-4 md:py-1.5 md:text-sm"
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
        <PricingParallax />

        <footer className="relative z-[12000] mt-64 flex min-h-screen flex-col justify-between px-6 py-14 text-[color:rgba(244,241,234,0.78)] sm:mt-80 md:mt-88 lg:px-12 xl:mt-[calc(120px+18vw)]">
          {/* Plan Spacing Step 3: elevated top margin keeps footer distinct from pricing block. */}
          {/* Plan V10 Step 2: footer offset increased to maintain section rhythm after hero expansion. */}
          {/* Plan V11 Step 2: footer offset increased again to track the taller hero. */}
          {/* Plan V11 Step 3: documented spacing update to mirror hero adjustments. */}
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
            <div className="relative flex flex-1 items-center justify-center overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="pointer-events-none absolute inset-0 h-[220%] w-[220%] max-w-none object-cover opacity-35 blur-3xl"
                src="/insignia.mov"
                aria-hidden="true"
              />
              <h2
                className="relative text-4xl font-semibold tracking-tight text-[#f9f9f9] sm:text-5xl"
                style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
              >
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
    </ReactLenis>
  );
}
