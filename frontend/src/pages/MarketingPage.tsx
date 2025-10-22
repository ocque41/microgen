import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Clarify the brief",
    body: "Capture the workflow, guardrails, and success metrics in a shared template so teams stay aligned.",
  },
  {
    title: "Approve the agent",
    body: "Share a guided review sandbox with transcript capture before production traffic ever hits the API.",
  },
  {
    title: "Run with confidence",
    body: "Monitor accountability dashboards with retention-ready logs, safety events, and escalation summaries.",
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
        <nav className="flex items-center justify-start px-6 pt-10 lg:px-12">
          <span className="text-sm font-medium tracking-[0.6em] text-[color:var(--accent-inverse)]">
            Microagents
          </span>
        </nav>

        <div className="relative flex flex-1 flex-col justify-center gap-12 px-6 pb-12 pt-10 text-left lg:gap-14 lg:px-12">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">Microagents</h1>
              <Link
                to="/handler/sign-up"
                className="inline-flex items-center justify-center px-10 py-3 text-5xl font-semibold transition hover:opacity-80"
                style={{
                  backgroundColor: "rgba(244,241,234,0.06)",
                  color: "#F4F1EA",
                  borderRadius: "20px",
                  backdropFilter: "blur(18px)",
                  border: "1px solid rgba(244,241,234,0.18)",
                  boxShadow: "0 25px 60px -40px rgba(0,0,0,0.7)",
                }}
              >
                Get Started
              </Link>
            </div>
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
          </div>
          <div className="relative mx-auto mt-6 w-full max-w-[94vw] md:mt-4 md:max-w-[80vw] lg:max-w-[70vw]">
            <div className="relative h-[65vh] min-h-[360px] w-full overflow-hidden rounded-[2.75rem] shadow-[0_80px_200px_-120px_rgba(0,0,0,0.75)]">
              <img
                src="/hero.png"
                alt="Microagents interface showcasing accountable workflows."
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center px-6 py-20 lg:px-12">
        <div className="mx-auto w-full max-w-5xl space-y-12">
          <div className="space-y-3 text-center">
            <h2 className="text-2xl font-semibold">How Microagents works</h2>
            <p className="text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
              Every launch follows three accountable phases so operations, compliance, and product teams stay in lockstep.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.title}
                className="rounded-2xl px-6 py-6 text-left shadow-[0_30px_90px_-80px_rgba(0,0,0,0.9)]"
                style={{
                  backgroundColor: "rgba(244,241,234,0.06)",
                }}
              >
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm" style={{ color: "rgba(244, 241, 234, 0.75)" }}>
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center px-6 py-20 lg:px-12">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 md:flex-row md:items-start">
          <div className="flex-1 space-y-5">
            <h2 className="text-3xl font-semibold">Transparent pricing, formal support</h2>
            <p className="text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
              Select a plan that reflects your deployment posture. Scale usage with predictable billing aligned to active assistants.
            </p>
            <ul className="space-y-3 text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
              <li>Starter: launch one supervised agent with audit-ready logging.</li>
              <li>Growth: add automation workflows, document sync, and change reviews.</li>
              <li>Enterprise: dedicated security reviews, SSO, and prioritized response times.</li>
            </ul>
          </div>
          <aside
            className="flex flex-1 flex-col gap-5 rounded-3xl p-10 shadow-[0_30px_90px_-80px_rgba(0,0,0,0.9)]"
            style={{
              backgroundColor: "rgba(244,241,234,0.06)",
            }}
          >
            <h3 className="text-2xl font-semibold">Plan a deployment session</h3>
            <p className="text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
              Reserve a one-hour consultation with the Microagents solutions team to map prerequisites, rollout sequencing, and governance controls.
            </p>
            <Link
              to="/handler/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-[color:var(--accent-inverse)] transition hover:bg-[color:var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--accent)]"
            >
              Book time
            </Link>
          </aside>
        </div>
      </section>

      <section className="flex min-h-screen items-center px-6 pb-24 lg:px-12">
        <div
          className="mx-auto w-full max-w-4xl rounded-[2rem] px-10 py-12 text-left shadow-[0_40px_120px_-90px_rgba(0,0,0,0.9)]"
          style={{
            backgroundColor: "rgba(244,241,234,0.06)",
          }}
        >
          <p className="text-lg">
            “Microagents catalogues every agent decision, links evidence, and keeps the team in control. The result is dependable automation that respects our standards.”
          </p>
          <footer className="mt-4 text-sm" style={{ color: "rgba(244, 241, 234, 0.72)" }}>
            Director of Operations, pilot cohort
          </footer>
        </div>
      </section>

      <footer className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 pb-16 text-center lg:px-12">
        <span className="text-xs uppercase tracking-[0.45em] text-[color:rgba(244,241,234,0.45)]">Microagents</span>
        <p className="max-w-xl text-sm text-[color:rgba(244,241,234,0.7)]">
          Built for operators who demand accountability from automation. Microagents aligns assistants with brand guardrails, evidence, and human oversight.
        </p>
        <div className="text-xs text-[color:rgba(244,241,234,0.45)]">
          © {new Date().getFullYear()} Microagents, Inc. All rights reserved.
        </div>
      </footer>
      </div>
    </div>
  );
}
