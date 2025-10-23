import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  },
  {
    title: "AI that organizes",
    description: "Segment channels, tickets, and logs so operators see what matters first.",
  },
  {
    title: "AI that builds",
    description: "Compose workflows that stay within evidence-based guardrails end-to-end.",
  },
  {
    title: "AI that emails",
    description: "Draft respectful responses grounded in records, not improvisation.",
  },
  {
    title: "AI that creates",
    description: "Prepare study packs, runbooks, and debriefs without losing accountability.",
  },
  {
    title: "AI that shops",
    description: "Evaluate vendor choices with sourced justifications and cost controls.",
  },
];

export function MarketingPage() {
  const [featureIndex, setFeatureIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

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
    };
  }, []);

  const currentFeature = featurePhrases[featureIndex];

  return (
    <div className="relative min-h-screen overflow-hidden text-brand-text">
      <div className="mesh-background pointer-events-none" />
      <div className="relative">
        <section className="relative flex min-h-screen flex-col">
          <nav className="flex items-center justify-between px-6 pt-10 lg:px-12">
            <span className="text-sm font-medium tracking-[0.6em] text-[color:var(--accent-inverse)]">
              Microagents
            </span>
            <div className="group relative">
              <Link
                to="/for-business"
                className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium text-[color:var(--accent-inverse)] transition-colors duration-200 group-hover:bg-[color:rgba(244,241,234,0.08)]"
              >
                For business
              </Link>
              <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-4 w-[min(420px,92vw)] -translate-x-1/2 rounded-[5px] border border-[color:rgba(244,241,234,0.08)] bg-[color:rgba(23,23,23,0.96)] p-6 opacity-0 shadow-[0_45px_120px_-90px_rgba(0,0,0,0.9)] transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                <div className="grid grid-cols-3 gap-6 text-left text-sm text-[color:rgba(244,241,234,0.82)]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[color:rgba(244,241,234,0.45)]">Business</p>
                    <ul className="mt-3 space-y-2">
                      <li><Link to="/overview" className="transition hover:text-[color:var(--accent)]">Overview</Link></li>
                      <li><Link to="/contact" className="transition hover:text-[color:var(--accent)]">Contact sales</Link></li>
                      <li><Link to="/merchants" className="transition hover:text-[color:var(--accent)]">Merchants</Link></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[color:rgba(244,241,234,0.45)]">AI solutions for</p>
                    <ul className="mt-3 space-y-2">
                      <li><Link to="/engineering" className="transition hover:text-[color:var(--accent)]">Engineering</Link></li>
                      <li><Link to="/marketing" className="transition hover:text-[color:var(--accent)]">Sales marketing</Link></li>
                      <li><Link to="/finance" className="transition hover:text-[color:var(--accent)]">Finance</Link></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[color:rgba(244,241,234,0.45)]">Plans</p>
                    <ul className="mt-3 space-y-2">
                      <li><Link to="/business" className="transition hover:text-[color:var(--accent)]">Business</Link></li>
                      <li><Link to="/education" className="transition hover:text-[color:var(--accent)]">Education</Link></li>
                      <li><Link to="/enterprise" className="transition hover:text-[color:var(--accent)]">Enterprise</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="relative flex flex-1 flex-col justify-center gap-12 px-6 pb-12 pt-10 text-left lg:gap-16 lg:px-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
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

        <section className="flex min-h-screen flex-col justify-center px-6 py-20 lg:px-12">
          <div className="mx-auto w-full max-w-5xl space-y-4 text-center">
            <h2 className="text-2xl font-semibold">How Microagents works</h2>
            <p className="text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
              Every launch follows three accountable phases so operations, compliance, and product teams stay in lockstep.
            </p>
          </div>
        </section>

        {steps.map((step, index) => (
          <section
            key={step.title}
            className="flex min-h-screen items-center px-6 py-16 lg:px-12"
          >
            <div
              className={`mx-auto flex w-full max-w-6xl flex-col items-center gap-12 md:flex-row ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1 text-left">
                <span className="inline-flex rounded-[5px] bg-[color:rgba(244,241,234,0.08)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[color:rgba(244,241,234,0.75)]">
                  Step {index + 1}
                </span>
                <h3 className="mt-6 text-3xl font-semibold">{step.title}</h3>
                <p className="mt-4 text-sm" style={{ color: "rgba(244, 241, 234, 0.75)" }}>
                  {step.body}
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="h-[320px] w-full overflow-hidden rounded-[5px] border border-[color:rgba(244,241,234,0.08)] bg-[color:rgba(23,23,23,0.65)]">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        ))}

        <section className="flex min-h-screen items-center px-6 py-20 lg:px-12">
          <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-[5px] border border-[color:rgba(244,241,234,0.08)] bg-[color:rgba(23,23,23,0.78)] p-10 shadow-[0_60px_160px_-110px_rgba(0,0,0,0.9)]">
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
              <div className="max-w-xl text-left">
                <h2 className="text-3xl font-semibold">Transparent pricing, formal support</h2>
                <p className="mt-4 text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
                  Select a plan that reflects your deployment posture. Scale usage with predictable billing aligned to active assistants.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 text-sm text-[color:rgba(244,241,234,0.75)] md:items-end">
                <span className="text-4xl font-semibold text-[color:var(--accent)]">Plan with certainty</span>
                <span>Billing aligns to active agents and evidence retention.</span>
                <Link
                  to="/handler/sign-up"
                  className="mt-3 inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-[color:var(--accent-inverse)] transition hover:bg-[color:var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--accent)]"
                >
                  Book time
                </Link>
              </div>
            </div>
            <div className="mt-12 grid gap-6 text-left md:grid-cols-3">
              <div className="rounded-[5px] border border-[color:rgba(244,241,234,0.1)] p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[color:rgba(244,241,234,0.45)]">Starter</p>
                <h3 className="mt-4 text-xl font-semibold">Supervised launches</h3>
                <p className="mt-3 text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
                  Launch one supervised agent with audit-ready logging and transcript retention.
                </p>
              </div>
              <div className="rounded-[5px] border border-[color:rgba(244,241,234,0.1)] p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[color:rgba(244,241,234,0.45)]">Growth</p>
                <h3 className="mt-4 text-xl font-semibold">Scaling oversight</h3>
                <p className="mt-3 text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
                  Add automation workflows, document sync, and change reviews with routed approvals.
                </p>
              </div>
              <div className="rounded-[5px] border border-[color:rgba(244,241,234,0.1)] p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[color:rgba(244,241,234,0.45)]">Enterprise</p>
                <h3 className="mt-4 text-xl font-semibold">Dedicated assurance</h3>
                <p className="mt-3 text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
                  Secure rigorous reviews, SSO, and prioritized response times for critical workloads.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center px-6 py-20 lg:px-12">
          <div className="mx-auto w-full max-w-6xl space-y-12 text-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold">What Microagents delivers</h2>
              <p className="text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
                Evidence-first assistance across every operational lane, packaged for responsible teams.
              </p>
            </div>
            <div className="grid gap-6 text-left md:grid-cols-2 lg:grid-cols-3">
              {featureTiles.map((tile) => (
                <div
                  key={tile.title}
                  className="flex h-full flex-col justify-between gap-4 rounded-[5px] border border-[color:rgba(244,241,234,0.1)] bg-[color:rgba(23,23,23,0.7)] p-6"
                >
                  <h3 className="text-xl font-semibold">{tile.title}</h3>
                  <p className="text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
                    {tile.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="flex min-h-screen flex-col px-6 py-14 text-[color:rgba(244,241,234,0.78)] lg:px-12">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[color:rgba(244,241,234,0.2)] text-lg font-semibold text-[color:var(--accent-inverse)]">
                  Ma
                </span>
                <span className="text-sm uppercase tracking-[0.4em] text-[color:rgba(244,241,234,0.5)]">Microagents</span>
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
            <div className="flex flex-col gap-6 text-xs text-[color:rgba(244,241,234,0.45)] md:flex-row md:items-center md:justify-between">
              <span>© {new Date().getFullYear()} Microagents, Inc. All rights reserved.</span>
              <div className="flex flex-wrap gap-4">
                <Link to="/legal" className="transition hover:text-[color:var(--accent)]">Legal</Link>
                <Link to="/status" className="transition hover:text-[color:var(--accent)]">Status</Link>
                <Link to="/docs" className="transition hover:text-[color:var(--accent)]">Docs</Link>
                <Link to="/contact" className="transition hover:text-[color:var(--accent)]">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
