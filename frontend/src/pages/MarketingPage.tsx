import { Link } from "react-router-dom";

export function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <header className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 pb-16 pt-20 text-center">
        <span className="rounded-full border border-slate-200/60 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/80 dark:text-slate-300">
          Microgen Platform
        </span>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Launch AI micro-agents without the infrastructure burden
        </h1>
        <p className="max-w-3xl text-lg text-slate-600 dark:text-slate-300">
          Microgen pairs ChatKit with a curated library of agent templates so teams can onboard assistants in days, not months.
          Handle authentication, billing, and analytics from a single dashboard while your customers enjoy conversational experiences they trust.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/handler/sign-up"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Sign up
          </Link>
          <Link
            to="/handler/sign-in"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
          >
            Log in
          </Link>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-20 md:grid-cols-3">
        {[
          {
            title: "Templates that convert",
            body: "Choose from a catalog of high-performing micro-agents or bring your own prompt. Every template is optimized for measurable outcomes.",
          },
          {
            title: "Observability built-in",
            body: "Monitor conversation quality with transcript search, CSAT insights, and safe rollout controls.",
          },
          {
            title: "Secure by default",
            body: "SOC2-aligned authentication with JWT, OAuth, and domain allowlisting keeps your customer data protected.",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-[0_40px_70px_-50px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70"
          >
            <h2 className="text-xl font-semibold">{feature.title}</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{feature.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:flex-row md:items-center">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-semibold">Pricing that scales with your agents</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Start experimenting for free, then choose the usage tier that matches your customer footprint.
            </p>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li>• Starter: Deploy up to 2 agents with 10k monthly interactions.</li>
              <li>• Growth: Unlock automation workflows and live analytics.</li>
              <li>• Enterprise: Dedicated support, SSO, and compliance reviews.</li>
            </ul>
          </div>
          <div className="flex flex-1 flex-col gap-4 rounded-3xl border border-slate-200/60 bg-slate-900 p-10 text-white shadow-[0_30px_60px_-40px_rgba(15,23,42,0.65)] dark:border-slate-700">
            <h3 className="text-2xl font-semibold">Book a strategy session</h3>
            <p className="text-sm text-slate-200">
              Need to migrate a legacy assistant or integrate billing? Our solutions team will map the quickest path to launch.
            </p>
            <Link
              to="/handler/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Reserve your spot
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
