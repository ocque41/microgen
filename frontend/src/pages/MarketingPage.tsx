import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { marketingTheme } from "@/lib/marketingTheme";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero.png";
import { HeroSection } from "@/sections/hero";
import { StorySections } from "@/sections/story";

const steps = [
  {
    title: "Clarify the brief",
    body: "Capture the workflow, guardrails, and success metrics in a shared template so teams stay aligned.",
    image: heroImage,
    alt: "Briefing workspace capturing workflow expectations.",
  },
  {
    title: "Approve the agent",
    body: "Share a guided review sandbox with transcript capture before production traffic ever hits the API.",
    image: heroImage,
    alt: "Approval sandbox view for responsible agent sign-off.",
  },
  {
    title: "Run with confidence",
    body: "Monitor accountability dashboards with retention-ready logs, safety events, and escalation summaries.",
    image: heroImage,
    alt: "Operational dashboard highlighting accountable agent metrics.",
  },
];

const featureTiles = [
  {
    title: "AI that understands",
    description: "Surface the context, policies, and past resolutions your teams rely on.",
    image: heroImage,
    alt: "AI workspace synthesizing context for operators.",
  },
  {
    title: "AI that organizes",
    description: "Segment channels, tickets, and logs so operators see what matters first.",
    image: heroImage,
    alt: "Structured view of prioritized operational queues.",
  },
  {
    title: "AI that builds",
    description: "Compose workflows that stay within evidence-based guardrails end-to-end.",
    image: heroImage,
    alt: "Workflow builder keeping teams within guardrails.",
  },
  {
    title: "AI that emails",
    description: "Draft respectful responses grounded in records, not improvisation.",
    image: heroImage,
    alt: "Email composition interface showcasing grounded messaging.",
  },
  {
    title: "AI that creates",
    description: "Prepare study packs, runbooks, and debriefs without losing accountability.",
    image: heroImage,
    alt: "Creative suite preparing operational documentation.",
  },
  {
    title: "AI that shops",
    description: "Evaluate vendor choices with sourced justifications and cost controls.",
    image: heroImage,
    alt: "Procurement dashboard comparing compliant vendors.",
  },
];

const marketingThemeStyles = {
  "--marketing-background-color": marketingTheme.background,
  "--surface-background": marketingTheme.background,
  backgroundColor: marketingTheme.background,
} as CSSProperties;

function IllustrationMedia({ alt, src, className }: { alt: string; src: string; className?: string }) {
  const [isBroken, setIsBroken] = useState(!src);

  if (isBroken) {
    return (
      <div
        role="img"
        aria-label={`${alt} (placeholder shown until hero.png is restored).`}
        className={cn("marketing-illustration marketing-illustration--fallback", className)}
      >
        <span className="marketing-illustration__message">Restore hero.png for full-fidelity art.</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setIsBroken(true)}
      className={cn("marketing-illustration", className)}
    />
  );
}

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

  const featureRows = featureTiles.reduce((rows, tile, index) => {
    if (index % 2 === 0) {
      rows.push([tile]);
    } else {
      rows[rows.length - 1]?.push(tile);
    }
    return rows;
  }, [] as Array<(typeof featureTiles)[number][]>);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-text" style={marketingThemeStyles}>
      <div className="mesh-background pointer-events-none" />
      <div className="relative">
        <section className="relative flex flex-col" aria-label="Navigation placeholder" />
        <HeroSection />
        <StorySections />

        <section className="px-6 py-24 lg:px-12">
          <div className="mx-auto w-full max-w-6xl space-y-16">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-2xl font-semibold">How Microagents works</h2>
              <p className="text-sm" style={{ color: "color-mix(in srgb, var(--text-primary) 70%, transparent)" }}>
                Every launch follows three accountable phases so operations, compliance, and product teams stay in lockstep.
              </p>
            </div>
            <div className="space-y-12">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="space-y-8 rounded-[5px] border border-[color:rgba(244,241,234,0.1)] bg-[color:rgba(23,23,23,0.78)] p-8 shadow-[0_50px_140px_-110px_rgba(0,0,0,0.85)]"
                >
                  <div className="space-y-4 text-left">
                    <span className="inline-flex rounded-[5px] bg-[color:rgba(244,241,234,0.08)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[color:rgba(244,241,234,0.75)]">
                      Step {index + 1}
                    </span>
                    <h3 className="text-3xl font-semibold">{step.title}</h3>
                    <p className="text-sm" style={{ color: "color-mix(in srgb, var(--text-primary) 75%, transparent)" }}>
                      {step.body}
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-[5px] border border-[color:rgba(244,241,234,0.08)] bg-[color:rgba(23,23,23,0.65)]">
                    <IllustrationMedia alt={step.alt} src={step.image} className="h-64 w-full object-cover md:h-80" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center px-6 py-20 lg:px-12">
          <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[5px] border border-[color:rgba(244,241,234,0.08)] bg-[color:rgba(23,23,23,0.78)] p-12 shadow-[0_60px_160px_-110px_rgba(0,0,0,0.9)]">
            <div className="mx-auto flex max-w-4xl flex-col gap-12 text-left">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold">Craft pricing with your micro agent</h2>
                <p className="text-sm" style={{ color: "color-mix(in srgb, var(--text-primary) 70%, transparent)" }}>
                  Describe your workloads, compliance needs, and support expectations directly to a Microagents pricing specialist—powered by a conversational agent builders trust every day. The agent assembles a deployment mix and commercial terms that fit how you operate.
                </p>
              </div>
              <div className="grid gap-6 text-left md:grid-cols-3">
                <div className="rounded-[5px] border border-[color:rgba(244,241,234,0.1)] bg-[color:rgba(23,23,23,0.65)] p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[color:rgba(244,241,234,0.45)]">Outline</p>
                  <h3 className="mt-4 text-xl font-semibold">Map your operations</h3>
                  <p className="mt-3 text-sm" style={{ color: "color-mix(in srgb, var(--text-primary) 70%, transparent)" }}>
                    Share channels, volume expectations, and the accountability rules your assistants must uphold.
                  </p>
                </div>
                <div className="rounded-[5px] border border-[color:rgba(244,241,234,0.1)] bg-[color:rgba(23,23,23,0.65)] p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[color:rgba(244,241,234,0.45)]">Co-create</p>
                  <h3 className="mt-4 text-xl font-semibold">Tune safeguards live</h3>
                  <p className="mt-3 text-sm" style={{ color: "color-mix(in srgb, var(--text-primary) 70%, transparent)" }}>
                    Adjust policy guardrails, review cadences, and retention settings as the agent drafts your bundle.
                  </p>
                </div>
                <div className="rounded-[5px] border border-[color:rgba(244,241,234,0.1)] bg-[color:rgba(23,23,23,0.65)] p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[color:rgba(244,241,234,0.45)]">Confirm</p>
                  <h3 className="mt-4 text-xl font-semibold">Approve your build</h3>
                  <p className="mt-3 text-sm" style={{ color: "color-mix(in srgb, var(--text-primary) 70%, transparent)" }}>
                    Receive a contract-ready package that mirrors the assistant footprint and support depth you confirmed.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <TransitionLink
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-8 py-3 text-sm font-semibold text-[color:var(--accent-inverse)] transition hover:bg-[color:var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--accent)]"
                >
                  Get Started
                </TransitionLink>
              </div>
            </div>
          </div>
        </section>

        {featureRows.map((row, rowIndex) => (
          <section
            key={`feature-row-${rowIndex}`}
            className="flex min-h-screen items-center px-6 py-16 lg:px-12"
          >
            <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-2">
              {rowIndex === 0 && (
                <div className="md:col-span-2 space-y-3 text-center">
                  <h2 className="text-3xl font-semibold">What Microagents delivers</h2>
                  <p className="text-sm" style={{ color: "color-mix(in srgb, var(--text-primary) 70%, transparent)" }}>
                    Evidence-first assistance across every operational lane, packaged for responsible teams.
                  </p>
                </div>
              )}
              {row.map((tile) => (
                <article
                  key={tile.title}
                  className="flex h-full flex-col justify-between gap-8 rounded-[5px] border border-[color:rgba(244,241,234,0.1)] bg-[color:rgba(23,23,23,0.78)] p-9 text-left shadow-[0_70px_180px_-110px_rgba(0,0,0,0.9)]"
                >
                  <div className="overflow-hidden rounded-[5px] border border-[color:rgba(244,241,234,0.08)] bg-[color:rgba(23,23,23,0.65)]">
                    <IllustrationMedia alt={tile.alt} src={tile.image} className="h-[340px] w-full object-cover" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-semibold">{tile.title}</h3>
                    <p className="text-sm" style={{ color: "color-mix(in srgb, var(--text-primary) 70%, transparent)" }}>
                      {tile.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <footer className="flex min-h-screen flex-col justify-between px-6 py-14 text-[color:rgba(244,241,234,0.78)] lg:px-12">
          <div className="flex flex-1 flex-col justify-between gap-16">
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
              <div className="max-w-sm space-y-3 text-left">
                <span className="text-xs uppercase tracking-[0.4em] text-[color:rgba(244,241,234,0.5)]">Microagents</span>
                <p className="text-sm text-[color:rgba(244,241,234,0.62)]">
                  Operational AI for accountable teams delivering evidence-first assistance across every workflow.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 text-left text-sm text-[color:rgba(244,241,234,0.68)] sm:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[color:rgba(244,241,234,0.45)]">Resources</p>
                  <TransitionLink to="/research" className="block transition hover:text-[color:var(--accent)]">Research</TransitionLink>
                  <TransitionLink to="/safety" className="block transition hover:text-[color:var(--accent)]">Safety</TransitionLink>
                  <TransitionLink to="/api" className="block transition hover:text-[color:var(--accent)]">API</TransitionLink>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[color:rgba(244,241,234,0.45)]">Company</p>
                  <TransitionLink to="/about" className="block transition hover:text-[color:var(--accent)]">About</TransitionLink>
                  <TransitionLink to="/careers" className="block transition hover:text-[color:var(--accent)]">Careers</TransitionLink>
                  <TransitionLink to="/press" className="block transition hover:text-[color:var(--accent)]">Press</TransitionLink>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[color:rgba(244,241,234,0.45)]">Terms &amp; policies</p>
                  <TransitionLink to="/terms" className="block transition hover:text-[color:var(--accent)]">Terms of use</TransitionLink>
                  <TransitionLink to="/privacy" className="block transition hover:text-[color:var(--accent)]">Privacy policy</TransitionLink>
                  <TransitionLink to="/usage" className="block transition hover:text-[color:var(--accent)]">Usage policy</TransitionLink>
                </div>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <h2 className="text-[min(18vw,220px)] font-semibold leading-none tracking-tight text-[color:rgba(244,241,234,0.12)]">
                Microagents
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-6 text-xs text-[color:rgba(244,241,234,0.45)] md:flex-row md:items-center md:justify-between">
            <span>© {new Date().getFullYear()} Microagents, Inc. All rights reserved.</span>
            <div className="flex flex-wrap gap-4">
              <TransitionLink to="/legal" className="transition hover:text-[color:var(--accent)]">Legal</TransitionLink>
              <TransitionLink to="/status" className="transition hover:text-[color:var(--accent)]">Status</TransitionLink>
              <TransitionLink to="/docs" className="transition hover:text-[color:var(--accent)]">Docs</TransitionLink>
              <TransitionLink to="/contact" className="transition hover:text-[color:var(--accent)]">Contact</TransitionLink>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
