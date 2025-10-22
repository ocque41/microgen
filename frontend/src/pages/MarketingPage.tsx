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

export function MarketingPage() {
  return (
    <div className="min-h-screen bg-brand-background text-brand-text">
      <section className="border-b border-brand-border bg-brand-background">
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-24 text-center">
          <div className="flex max-w-3xl flex-col items-center">
            <span className="inline-flex items-center rounded-full border border-brand-border bg-brand-backgroundElevated px-4 py-1 text-xs text-brand-textMuted">
              Microagents
            </span>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Microagents that work for you.</h1>
            <p className="mt-4 max-w-2xl text-lg text-brand-textMuted">
              Deploy accountable assistants with formal guardrails, audited actions, and predictable integrations. Microagents keeps the brand voice, security posture, and documentation aligned across every surface.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/handler/sign-up"
                className="inline-flex items-center justify-center rounded-full border border-brand-accent bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-accentInverse shadow-card transition hover:bg-brand-background hover:text-brand-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent focus-visible:outline-offset-2"
              >
                Request access
              </Link>
              <Link
                to="/handler/sign-in"
                className="inline-flex items-center justify-center rounded-full border border-brand-border px-6 py-3 text-sm font-semibold text-brand-text transition hover:border-brand-accent hover:text-brand-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent focus-visible:outline-offset-2"
              >
                Sign in
              </Link>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=960&q=80"
            alt="Microagents console showing structured analytics and deployment controls."
            className="h-auto w-full max-w-md rounded-3xl border border-brand-border object-cover shadow-card"
            loading="lazy"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="rounded-3xl border border-brand-border bg-brand-backgroundElevated p-10">
          <h2 className="text-2xl font-semibold">How Microagents works</h2>
          <p className="mt-3 text-sm text-brand-textMuted">
            Every launch follows three accountable phases so operations, compliance, and product teams stay in lockstep.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.title} className="rounded-2xl border border-brand-border bg-brand-background px-6 py-6">
                <h3 className="text-lg font-semibold text-brand-text">{step.title}</h3>
                <p className="mt-3 text-sm text-brand-textMuted">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-border bg-brand-backgroundElevated py-20">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:flex-row md:items-start">
          <div className="flex-1 space-y-5">
            <h2 className="text-3xl font-semibold">Transparent pricing, formal support</h2>
            <p className="text-sm text-brand-textMuted">
              Select a plan that reflects your deployment posture. Scale usage with predictable billing aligned to active assistants.
            </p>
            <ul className="space-y-3 text-sm text-brand-textMuted">
              <li>Starter: launch one supervised agent with audit-ready logging.</li>
              <li>Growth: add automation workflows, document sync, and change reviews.</li>
              <li>Enterprise: dedicated security reviews, SSO, and prioritized response times.</li>
            </ul>
          </div>
          <aside className="flex flex-1 flex-col gap-4 rounded-3xl border border-brand-border bg-brand-background p-10 shadow-card">
            <h3 className="text-2xl font-semibold text-brand-text">Plan a deployment session</h3>
            <p className="text-sm text-brand-textMuted">
              Reserve a one-hour consultation with the Microagents solutions team to map prerequisites, rollout sequencing, and governance controls.
            </p>
              <Link
                to="/handler/sign-up"
                className="inline-flex items-center justify-center rounded-full border border-brand-accent bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-accentInverse transition hover:bg-brand-background hover:text-brand-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent focus-visible:outline-offset-2"
              >
                Book time
              </Link>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 pb-24">
        <blockquote className="rounded-2xl border border-brand-border bg-brand-backgroundElevated p-10">
          <p className="text-lg text-brand-text">
            “Microagents catalogues every agent decision, links evidence, and keeps the team in control. The result is dependable automation that respects our standards.”
          </p>
          <footer className="mt-4 text-sm text-brand-textMuted">Director of Operations, pilot cohort</footer>
        </blockquote>
      </section>
    </div>
  );
}
