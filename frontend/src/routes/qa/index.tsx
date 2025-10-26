import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";

import { QaSkeleton } from "@/components/skeletons/QaSkeleton";

const METRIC_LABELS: Record<string, string> = {
  LCP: "Largest Contentful Paint",
  INP: "Interaction to Next Paint",
  CLS: "Cumulative Layout Shift",
  FCP: "First Contentful Paint",
  TTFB: "Time to First Byte",
};

type QaMetricSample = {
  id: string;
  name: string;
  value: number;
  rating?: string | null;
  navigationType?: string | null;
  createdAt: number;
  href?: string | null;
};

type QaMetricSummary = {
  name: string;
  budget?: number | null;
  average?: number | null;
  p75?: number | null;
  latest?: QaMetricSample | null;
  exceedsBudget: boolean;
  samples: QaMetricSample[];
};

type QaDashboardPayload = {
  updatedAt?: number | null;
  metrics: QaMetricSummary[];
};

type QaLoaderResult = {
  metrics: Promise<QaDashboardPayload>;
};

async function fetchQualityMetrics(): Promise<QaDashboardPayload> {
  try {
    const response = await fetch("/api/rum/vitals", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to load metrics: ${response.status}`);
    }

    const payload = (await response.json()) as Partial<QaDashboardPayload>;

    return {
      updatedAt: payload.updatedAt ?? null,
      metrics: Array.isArray(payload.metrics) ? payload.metrics : [],
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[qa] Falling back to empty metrics", error);
    }

    return {
      updatedAt: null,
      metrics: [],
    };
  }
}

function formatMillis(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return `${Math.round(value)} ms`;
}

function formatCls(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return value.toFixed(3);
}

function resolveMetricLabel(name: string): string {
  return METRIC_LABELS[name] ?? name;
}

function resolveMetricValue(metric: QaMetricSummary): string {
  const latestValue = metric.latest?.value ?? null;

  if (metric.name === "CLS") {
    return formatCls(latestValue);
  }

  return formatMillis(latestValue);
}

function resolveBudgetValue(metric: QaMetricSummary): string {
  if (metric.budget === null || metric.budget === undefined) {
    return "—";
  }

  if (metric.name === "CLS") {
    return formatCls(metric.budget);
  }

  return formatMillis(metric.budget);
}

type StatusToken = "pass" | "fail" | "pending";

function getStatus(metric: QaMetricSummary): StatusToken {
  if (!metric.latest) {
    return "pending";
  }

  return metric.exceedsBudget ? "fail" : "pass";
}

function statusTone(token: StatusToken): string {
  switch (token) {
    case "pass":
      return "bg-[color:rgba(42,191,150,0.18)] text-[color:rgba(118,255,212,0.88)] border-[color:rgba(96,255,210,0.4)]";
    case "fail":
      return "bg-[color:rgba(221,83,83,0.18)] text-[color:rgba(255,174,174,0.92)] border-[color:rgba(255,122,122,0.4)]";
    default:
      return "bg-[color:rgba(125,142,181,0.14)] text-[color:rgba(190,204,235,0.82)] border-[color:rgba(158,178,214,0.32)]";
  }
}

function statusLabel(status: StatusToken): string {
  switch (status) {
    case "pass":
      return "Passing";
    case "fail":
      return "Failing";
    default:
      return "No samples";
  }
}

function QaMetricCard({ metric }: { metric: QaMetricSummary }) {
  const status = getStatus(metric);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[color:rgba(255,255,255,0.08)] bg-[color:rgba(17,20,30,0.78)] p-6 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.8)]">
      <header className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-xs uppercase tracking-[0.32em] text-[color:rgba(214,220,228,0.58)]">
            {metric.name}
          </span>
          <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">
            {resolveMetricLabel(metric.name)}
          </h2>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusTone(status)}`}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-current" aria-hidden="true" />
          {statusLabel(status)}
        </span>
      </header>
      <dl className="grid gap-3 text-sm text-[color:var(--text-muted)]">
        <div className="flex items-center justify-between gap-4">
          <dt>Latest sample</dt>
          <dd className="font-semibold text-[color:var(--text-primary)]">{resolveMetricValue(metric)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt>Budget</dt>
          <dd>{resolveBudgetValue(metric)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt>Average</dt>
          <dd>{metric.name === "CLS" ? formatCls(metric.average ?? null) : formatMillis(metric.average ?? null)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt>75th percentile</dt>
          <dd>{metric.name === "CLS" ? formatCls(metric.p75 ?? null) : formatMillis(metric.p75 ?? null)}</dd>
        </div>
      </dl>
      {metric.latest?.href ? (
        <p className="rounded-xl border border-[color:rgba(255,255,255,0.08)] bg-[color:rgba(14,18,28,0.6)] p-3 text-[0.75rem] text-[color:rgba(186,196,214,0.85)]">
          Last measurement from
          <span className="ml-1 font-medium text-[color:rgba(214,220,228,0.9)]">{metric.latest.href}</span>
        </p>
      ) : null}
    </article>
  );
}

function QaDashboard({ payload }: { payload: QaDashboardPayload }) {
  const { metrics, updatedAt } = payload;
  const hasSamples = metrics.some((metric) => metric.samples.length > 0);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 text-left text-[color:var(--text-muted)] lg:px-8">
      <header className="flex flex-col gap-4 text-left">
        <p className="text-xs uppercase tracking-[0.32em] text-[color:rgba(214,220,228,0.58)]">Quality gate</p>
        <h1 className="text-3xl font-semibold text-[color:var(--text-primary)]">Runtime telemetry dashboard</h1>
        <p className="max-w-2xl text-sm leading-relaxed">
          These readings reflect the most recent Core Web Vitals captured from the local session. Budgets enforce Largest
          Contentful Paint ≤ 2.5 s, Interaction to Next Paint &lt; 200 ms, and Cumulative Layout Shift ≤ 0.1. Fix any failing
          metrics before shipping to production.
        </p>
        <dl className="flex flex-wrap items-center gap-3 text-xs text-[color:rgba(190,204,235,0.8)]">
          <div className="flex items-center gap-2 rounded-full border border-[color:rgba(255,255,255,0.12)] bg-[color:rgba(18,20,30,0.72)] px-3 py-1">
            <dt className="font-medium text-[color:rgba(214,220,228,0.9)]">Updated</dt>
            <dd>{updatedAt ? new Date(updatedAt).toLocaleTimeString() : "Awaiting samples"}</dd>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[color:rgba(255,255,255,0.12)] bg-[color:rgba(18,20,30,0.72)] px-3 py-1">
            <dt className="font-medium text-[color:rgba(214,220,228,0.9)]">Sessions tracked</dt>
            <dd>{hasSamples ? "Current browser" : "Pending first visit"}</dd>
          </div>
        </dl>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {metrics.length ? (
          metrics.map((metric) => <QaMetricCard key={metric.name} metric={metric} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-[color:rgba(255,255,255,0.12)] bg-[color:rgba(18,20,30,0.45)] p-6 text-sm text-[color:rgba(190,204,235,0.78)]">
            No metrics have been reported yet. Keep the tab open and interact with the app to generate samples, then refresh to
            confirm budgets.
          </div>
        )}
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-[color:rgba(255,255,255,0.08)] bg-[color:rgba(12,16,26,0.6)] p-6">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">Verification checklist</h2>
          <span className="text-xs uppercase tracking-[0.28em] text-[color:rgba(214,220,228,0.52)]">AA+ contrast</span>
        </header>
        <ul className="grid gap-3 text-sm leading-relaxed">
          <li>
            <span className="font-medium text-[color:var(--text-primary)]">Reduced motion</span> — enable the kill switch or set
            prefers-reduced-motion: reduce. Scroll animations should pause, hero loops should swap to posters, and the QA
            dashboard should still report metrics.
          </li>
          <li>
            <span className="font-medium text-[color:var(--text-primary)]">Command palette</span> — open with
            <kbd className="ml-1 rounded border border-[color:rgba(255,255,255,0.18)] bg-[color:rgba(20,22,32,0.6)] px-1 py-0.5 text-[0.7rem]">
              ⌘K
            </kbd>
            /
            <kbd className="ml-1 rounded border border-[color:rgba(255,255,255,0.18)] bg-[color:rgba(20,22,32,0.6)] px-1 py-0.5 text-[0.7rem]">
              Ctrl+K
            </kbd>
            and traverse the list via keyboard. Confirm axe checks pass locally.
          </li>
          <li>
            <span className="font-medium text-[color:var(--text-primary)]">Media budgets</span> — run <code className="rounded bg-[color:rgba(20,22,32,0.6)] px-1 py-0.5">
              npm run check:media
            </code>{" "}
            to ensure hero assets remain under budget. CI will fail on regressions.
          </li>
        </ul>
      </section>
    </section>
  );
}

export function QaRoute() {
  const { metrics } = useLoaderData() as QaLoaderResult;

  return (
    <Suspense fallback={<QaSkeleton />}>
      <Await resolve={metrics} errorElement={<QaSkeleton />}>
        {(payload) => <QaDashboard payload={payload} />}
      </Await>
    </Suspense>
  );
}

export function qaLoader() {
  return { metrics: fetchQualityMetrics() };
}
