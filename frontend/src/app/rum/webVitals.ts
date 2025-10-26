import type { Metric } from "web-vitals";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

type WebVitalsOptions = {
  endpoint?: string;
  sampleRate?: number;
};

type BudgetKeys = "CLS" | "INP" | "LCP";

type BudgetConfig = Record<BudgetKeys, number>;

const DEFAULT_ENDPOINT = "/api/rum/vitals";
const DEFAULT_SAMPLE_RATE = 1;
const CORE_WEB_VITAL_BUDGETS: BudgetConfig = {
  LCP: 2500,
  INP: 200,
  CLS: 0.1,
};

let initialized = false;

function shouldSample(sampleRate: number) {
  if (sampleRate >= 1) {
    return true;
  }
  return Math.random() < sampleRate;
}

function createTransport(endpoint: string) {
  return (metric: Metric) => {
    const body = JSON.stringify({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      rating: metric.rating,
      navigationType: metric.navigationType,
      createdAt: Date.now(),
      href: typeof window !== "undefined" ? window.location.href : undefined,
    });

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const queued = navigator.sendBeacon(endpoint, body);
      if (queued) {
        return;
      }
    }

    void fetch(endpoint, {
      body,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
    }).catch((error) => {
      if (import.meta.env.DEV) {
        console.warn("[web-vitals] Failed to report metric", metric.name, error);
      }
    });
  };
}

function enforceBudgets(metric: Metric) {
  const budget = CORE_WEB_VITAL_BUDGETS[metric.name as BudgetKeys];
  if (budget === undefined) {
    return;
  }

  if (metric.value > budget) {
    const formattedValue = metric.name === "CLS" ? metric.value.toFixed(3) : `${Math.round(metric.value)}ms`;
    const formattedBudget = metric.name === "CLS" ? budget.toFixed(2) : `${Math.round(budget)}ms`;
    console.error(
      `[web-vitals] ${metric.name} budget exceeded: ${formattedValue} (budget ${formattedBudget}).`
    );
  }
}

export function initWebVitals(options?: WebVitalsOptions) {
  if (initialized || typeof window === "undefined") {
    return;
  }
  initialized = true;

  const endpoint = options?.endpoint ?? import.meta.env.VITE_RUM_ENDPOINT ?? DEFAULT_ENDPOINT;
  const sampleRate = options?.sampleRate ?? DEFAULT_SAMPLE_RATE;

  if (!shouldSample(sampleRate)) {
    if (import.meta.env.DEV) {
      console.info("[web-vitals] Skipping metric collection because of sampling.");
    }
    return;
  }

  const transport = createTransport(endpoint);
  const handler = (metric: Metric) => {
    enforceBudgets(metric);
    transport(metric);
  };

  onCLS(handler);
  onFCP(handler);
  onINP(handler);
  onLCP(handler);
  onTTFB(handler);
}
