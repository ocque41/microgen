import type { FocusEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Clarify the brief",
    body: "Capture the workflow, guardrails, and success metrics in a shared template so teams stay aligned.",
    image: "/hero.png",
    alt: "Briefing workspace capturing workflow expectations.",
  },
  {
    title: "Approve the agent",
    body: "Share a guided review sandbox with transcript capture before production traffic ever hits the API.",
    image: "/hero.png",
    alt: "Approval sandbox view for responsible agent sign-off.",
  },
  {
    title: "Run with confidence",
    body: "Monitor accountability dashboards with retention-ready logs, safety events, and escalation summaries.",
    image: "/hero.png",
    alt: "Operational dashboard highlighting accountable agent metrics.",
  },
];

const featurePhrases = [
  "policy-bound workflows",
  "evidence-ready reports",
  "risk-aware escalations",
  "documented summaries",
  "guardrailed rollouts",
  "exception routing cues",
  "audit-linked transcripts",
  "SLA steady follow-ups",
  "permissioned tool runs",
  "metrics-led retrospectives",
];

const featureTiles = [
  {
    title: "AI that understands",
    description: "Surface the context, policies, and past resolutions your teams rely on.",
    image: "/hero.png",
    alt: "AI workspace synthesizing context for operators.",
  },
  {
    title: "AI that organizes",
    description: "Segment channels, tickets, and logs so operators see what matters first.",
    image: "/hero.png",
    alt: "Structured view of prioritized operational queues.",
  },
  {
    title: "AI that builds",
    description: "Compose workflows that stay within evidence-based guardrails end-to-end.",
    image: "/hero.png",
    alt: "Workflow builder keeping teams within guardrails.",
  },
  {
    title: "AI that emails",
    description: "Draft respectful responses grounded in records, not improvisation.",
    image: "/hero.png",
    alt: "Email composition interface showcasing grounded messaging.",
  },
  {
    title: "AI that creates",
    description: "Prepare study packs, runbooks, and debriefs without losing accountability.",
    image: "/hero.png",
    alt: "Creative suite preparing operational documentation.",
  },
  {
    title: "AI that shops",
    description: "Evaluate vendor choices with sourced justifications and cost controls.",
    image: "/hero.png",
    alt: "Procurement dashboard comparing compliant vendors.",
  },
];

export function MarketingPage() {
  const [featureIndex, setFeatureIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMenuOpen = () => {
    clearCloseTimeout();
    setIsMenuOpen(true);
  };

  const scheduleMenuClose = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsMenuOpen(false);
      closeTimeoutRef.current = null;
    }, 120);
  };

  const handleMenuCloseImmediate = () => {
    clearCloseTimeout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    clearCloseTimeout();
    setIsMenuOpen((prev) => !prev);
  };
  const handleMenuBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      handleMenuCloseImmediate();
    }
  };

  useEffect(() => {
    let fadeTimeoutId: number;
    const intervalId = window.setInterval(() => {
      setIsVisible(false);
      fadeTimeoutId = window.setTimeout(() => {
        setFeatureIndex((prev) => (prev + 1) % featurePhrases.length);
        setIsVisible(true);
      }, 250);
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(fadeTimeoutId);
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, []);

  const currentFeature = featurePhrases[featureIndex];
  const featureRows = featureTiles.reduce((rows, tile, index) => {
    if (index % 2 === 0) {
      rows.push([tile]);
    } else {
      rows[rows.length - 1]?.push(tile);
    }
    return rows;
  }, [] as Array<(typeof featureTiles)[number][]>);

  return (
    <div className="relative min-h-screen overflow-hidden text-brand-text">
      <div className="mesh-background pointer-events-none" />
      <div className="relative">
        <section className="relative flex min-h-screen flex-col">
          <nav className="relative flex flex-col items-center gap-6 border-b border-[color:rgba(244,241,234,0.08)] bg-transparent px-6 pb-6 pt-8 text-[color:var(--accent-inverse)] lg:flex-row lg:gap-0 lg:px-12 lg:pb-4 lg:pt-10">
            <div className="flex w-full flex-1 justify-start lg:w-auto">
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.55em] text-[color:rgba(244,241,234,0.6)]">
                Microagents
              </span>
            </div>
            <div className="flex w-full flex-1 justify-center lg:w-auto">
              <div
                className="relative inline-flex"
                onMouseEnter={handleMenuOpen}
                onMouseLeave={scheduleMenuClose}
                onFocusCapture={handleMenuOpen}
                onBlurCapture={handleMenuBlur}
              >
                <button
                  type="button"
                  aria-expanded={isMenuOpen}
                  onClick={toggleMenu}
                  className="px-1 text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--accent-inverse)] transition-colors duration-200 hover:text-[color:var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--accent)]"
                >
                  Menu
                </button>
                <div
                  className={cn(
                    "pointer-events-none invisible absolute left-1/2 top-full z-10 mt-1 w-[min(500px,96vw)] -translate-x-1/2 translate-y-2 rounded-[10px] border border-[color:rgba(244,241,234,0.12)] bg-[color:rgba(23,23,23,0.95)] px-6 py-7 opacity-0 shadow-[0_55px_140px_-110px_rgba(0,0,0,0.85)] transition-all duration-200",
                    isMenuOpen && "pointer-events-auto visible translate-y-0 opacity-100"
                  )}
                  onClickCapture={handleMenuCloseImmediate}
                  onMouseEnter={handleMenuOpen}
                  onMouseLeave={scheduleMenuClose}
                >
                  <div className="grid grid-cols-1 gap-6 text-left text-[0.78rem] text-[color:rgba(244,241,234,0.82)] divide-y divide-[color:rgba(244,241,234,0.08)] md:grid-cols-3 md:gap-0 md:divide-x md:divide-y-0">
                    <div className="space-y-3 md:px-6 md:first:pl-0 md:last:pr-6">
                      <p className="whitespace-nowrap text-[0.63rem] uppercase tracking-[0.2em] text-[color:rgba(244,241,234,0.55)]">
                        Business
                      </p>
                      <ul className="space-y-2">
                        <li><Link to="/overview" className="transition hover:text-[color:var(--accent)]">Overview</Link></li>
                        <li><Link to="/contact" className="transition hover:text-[color:var(--accent)]">Contact sales</Link></li>
                        <li><Link to="/merchants" className="transition hover:text-[color:var(--accent)]">Merchants</Link></li>
                      </ul>
                    </div>
                    <div className="space-y-3 pt-6 md:px-6 md:pt-0">
                      <p className="text-[0.63rem] uppercase tracking-[0.2em] text-[color:rgba(244,241,234,0.55)] leading-snug">
                        AI solutions<wbr /> for
                      </p>
                      <ul className="space-y-2">
                        <li><Link to="/engineering" className="transition hover:text-[color:var(--accent)]">Engineering</Link></li>
                        <li><Link to="/marketing" className="transition hover:text-[color:var(--accent)]">Sales marketing</Link></li>
                        <li><Link to="/finance" className="transition hover:text-[color:var(--accent)]">Finance</Link></li>
                      </ul>
                    </div>
                    <div className="space-y-3 pt-6 md:px-6 md:pt-0 md:last:pr-0">
                      <p className="whitespace-nowrap text-[0.63rem] uppercase tracking-[0.2em] text-[color:rgba(244,241,234,0.55)]">
                        Plans
                      </p>
                      <ul className="space-y-2">
                        <li><Link to="/business" className="transition hover:text-[color:var(--accent)]">Business</Link></li>
                        <li><Link to="/education" className="transition hover:text-[color:var(--accent)]">Education</Link></li>
                        <li><Link to="/enterprise" className="transition hover:text-[color:var(--accent)]">Enterprise</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-1 justify-end lg:w-auto" aria-hidden="true">
              <span className="hidden text-[0.65rem] uppercase tracking-[0.3em] text-transparent md:block">Menu</span>
            </div>
          </nav>

          <div className="relative flex flex-1 flex-col justify-center gap-12 px-6 pb-12 pt-10 text-left lg:gap-16 lg:px-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
              <div className="flex flex-col items-start gap-6">
                <blockquote
                  className="w-full border-l-2 border-[color:rgba(244,241,234,0.25)] pl-5 text-2xl italic text-[color:rgba(244,241,234,0.9)]"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Accountable employees orchestrating{" "}
                  <span
                    className={`inline-block font-semibold text-[color:var(--accent)] transition duration-300 ${
                      isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                    }`}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {currentFeature}
                  </span>
                </blockquote>
                <Button
                  asChild
                  className="rounded-full bg-[color:var(--accent)] px-6 py-2 text-sm font-semibold text-[color:var(--accent-inverse)] transition hover:bg-[color:var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--accent)]"
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
            <div className="relative mx-auto mt-6 w-full max-w-[94vw] md:mt-4 md:max-w-[80vw] lg:max-w-[70vw]">
              <div className="relative h-[65vh] min-h-[360px] w-full overflow-hidden rounded-[5px] shadow-[0_80px_200px_-120px_rgba(0,0,0,0.75)]">
                <img
                  src="/hero.png"
                  alt="Microagents interface showcasing accountable workflows."
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 lg:px-12">
          <div className="mx-auto w-full max-w-6xl space-y-16">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <h2 className="text-2xl font-semibold">How Microagents works</h2>
              <p className="text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
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
                    <p className="text-sm" style={{ color: "rgba(244, 241, 234, 0.75)" }}>
                      {step.body}
                    </p>
                  </div>
                  <div className="overflow-hidden rounded-[5px] border border-[color:rgba(244,241,234,0.08)] bg-[color:rgba(23,23,23,0.65)]">
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="h-64 w-full object-cover md:h-80"
                    />
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
                <p className="text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
                  Describe your workloads, compliance needs, and support expectations directly to a Microagents pricing specialist—powered by a conversational agent builders trust every day. The agent assembles a deployment mix and commercial terms that fit how you operate.
                </p>
              </div>
              <div className="grid gap-6 text-left md:grid-cols-3">
                <div className="rounded-[5px] border border-[color:rgba(244,241,234,0.1)] bg-[color:rgba(23,23,23,0.65)] p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[color:rgba(244,241,234,0.45)]">Outline</p>
                  <h3 className="mt-4 text-xl font-semibold">Map your operations</h3>
                  <p className="mt-3 text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
                    Share channels, volume expectations, and the accountability rules your assistants must uphold.
                  </p>
                </div>
                <div className="rounded-[5px] border border-[color:rgba(244,241,234,0.1)] bg-[color:rgba(23,23,23,0.65)] p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[color:rgba(244,241,234,0.45)]">Co-create</p>
                  <h3 className="mt-4 text-xl font-semibold">Tune safeguards live</h3>
                  <p className="mt-3 text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
                    Adjust policy guardrails, review cadences, and retention settings as the agent drafts your bundle.
                  </p>
                </div>
                <div className="rounded-[5px] border border-[color:rgba(244,241,234,0.1)] bg-[color:rgba(23,23,23,0.65)] p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[color:rgba(244,241,234,0.45)]">Confirm</p>
                  <h3 className="mt-4 text-xl font-semibold">Approve your build</h3>
                  <p className="mt-3 text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
                    Receive a contract-ready package that mirrors the assistant footprint and support depth you confirmed.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-8 py-3 text-sm font-semibold text-[color:var(--accent-inverse)] transition hover:bg-[color:var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--accent)]"
                >
                  Get Started
                </Link>
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
                  <p className="text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
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
                    <img
                      src={tile.image}
                      alt={tile.alt}
                      className="h-[340px] w-full object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-semibold">{tile.title}</h3>
                    <p className="text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
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
                  <Link to="/research" className="block transition hover:text-[color:var(--accent)]">Research</Link>
                  <Link to="/safety" className="block transition hover:text-[color:var(--accent)]">Safety</Link>
                  <Link to="/api" className="block transition hover:text-[color:var(--accent)]">API</Link>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[color:rgba(244,241,234,0.45)]">Company</p>
                  <Link to="/about" className="block transition hover:text-[color:var(--accent)]">About</Link>
                  <Link to="/careers" className="block transition hover:text-[color:var(--accent)]">Careers</Link>
                  <Link to="/press" className="block transition hover:text-[color:var(--accent)]">Press</Link>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[color:rgba(244,241,234,0.45)]">Terms &amp; policies</p>
                  <Link to="/terms" className="block transition hover:text-[color:var(--accent)]">Terms of use</Link>
                  <Link to="/privacy" className="block transition hover:text-[color:var(--accent)]">Privacy policy</Link>
                  <Link to="/usage" className="block transition hover:text-[color:var(--accent)]">Usage policy</Link>
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
              <Link to="/legal" className="transition hover:text-[color:var(--accent)]">Legal</Link>
              <Link to="/status" className="transition hover:text-[color:var(--accent)]">Status</Link>
              <Link to="/docs" className="transition hover:text-[color:var(--accent)]">Docs</Link>
              <Link to="/contact" className="transition hover:text-[color:var(--accent)]">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
