import { useEffect, useRef, useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import {
  CHATKIT_API_URL,
  CHATKIT_API_DOMAIN_KEY,
  STARTER_PROMPTS,
  PLACEHOLDER_INPUT,
  GREETING,
} from "../lib/config";
import type { FactAction } from "../hooks/useFacts";
import type { ColorScheme } from "../hooks/useColorScheme";
import { useBackendAuth } from "../contexts/BackendAuthContext";

import type { UseChatKitReturn } from "@openai/chatkit-react";

export type ChatKitRegisteredApi = Pick<
  UseChatKitReturn,
  "focusComposer" | "setThreadId" | "fetchUpdates" | "sendCustomAction"
>;

export type DemoWidgetMetric = {
  id: string;
  label: string;
  value: string;
  trend?: "up" | "down" | "flat";
  delta?: string;
};

export type DemoWidgetPayload = {
  id: string;
  title: string;
  caption?: string;
  metrics?: DemoWidgetMetric[];
  raw: Record<string, unknown>;
  receivedAt: string;
};

type ChatKitPanelProps = {
  onWidgetAction: (action: FactAction) => Promise<void>;
  onResponseEnd: () => void;
  onThemeRequest: (scheme: ColorScheme) => void;
  onReady?: (api: ChatKitRegisteredApi | null) => void;
  onWidgetPayload?: (payload: DemoWidgetPayload | null) => void;
};

export function ChatKitPanel({
  onWidgetAction,
  onResponseEnd,
  onThemeRequest,
  onReady,
  onWidgetPayload,
}: ChatKitPanelProps) {
  const processedFacts = useRef(new Set<string>());
  const [widgetPreview, setWidgetPreview] = useState<DemoWidgetPayload | null>(null);
  const { authenticatedFetch } = useBackendAuth();

  const chatkit = useChatKit({
    api: {
      url: CHATKIT_API_URL,
      domainKey: CHATKIT_API_DOMAIN_KEY,
      fetch: authenticatedFetch,
    },
    theme: {
      colorScheme: "dark",
      color: {
        grayscale: {
          hue: 220,
          tint: 6,
          shade: -2,
        },
        accent: {
          primary: "#0091ad",
          level: 2,
        },
      },
      radius: "round",
      typography: {
        fontFamily: '"InterVariable", "Inter", "Helvetica Neue", Arial, sans-serif',
      },
    },
    startScreen: {
      greeting: GREETING,
      prompts: STARTER_PROMPTS,
    },
    composer: {
      placeholder: PLACEHOLDER_INPUT,
    },
    threadItemActions: {
      feedback: false,
    },
    onClientTool: async (invocation) => {
      if (invocation.name === "switch_theme") {
        const requested = invocation.params.theme;
        if (requested === "light" || requested === "dark") {
          if (import.meta.env.DEV) {
            console.debug("[ChatKitPanel] switch_theme", requested);
          }
          onThemeRequest(requested);
          return { success: true };
        }
        return { success: false };
      }

      if (invocation.name === "record_fact") {
        const id = String(invocation.params.fact_id ?? "");
        const text = String(invocation.params.fact_text ?? "");
        if (!id || processedFacts.current.has(id)) {
          return { success: true };
        }
        processedFacts.current.add(id);
        void onWidgetAction({
          type: "save",
          factId: id,
          factText: text.replace(/\s+/g, " ").trim(),
        });
        return { success: true };
      }

      if (invocation.name === "show_demo_widget") {
        const payload = normalizeDemoWidget(invocation.params);
        if (payload) {
          setWidgetPreview(payload);
          onWidgetPayload?.(payload);
          return { success: true };
        }
        return { success: false };
      }

      return { success: false };
    },
    onResponseEnd: () => {
      onResponseEnd();
    },
    onThreadChange: () => {
      processedFacts.current.clear();
      setWidgetPreview(null);
      onWidgetPayload?.(null);
    },
    onError: ({ error }) => {
      // ChatKit handles displaying the error to the user
      console.error("ChatKit error", error);
    },
  });

  useEffect(() => {
    if (!onReady) {
      return;
    }

    const api: ChatKitRegisteredApi = {
      focusComposer: chatkit.focusComposer,
      setThreadId: chatkit.setThreadId,
      fetchUpdates: chatkit.fetchUpdates,
      sendCustomAction: chatkit.sendCustomAction,
    };
    onReady(api);

    return () => {
      onReady(null);
    };
  }, [chatkit.focusComposer, chatkit.setThreadId, chatkit.fetchUpdates, chatkit.sendCustomAction, onReady]);

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-3xl shadow-[0_40px_120px_-90px_rgba(0,0,0,0.85)]"
      style={{
        backgroundColor: "color-mix(in srgb, var(--text-primary) 14%, transparent)",
      }}
    >
      {widgetPreview ? (
        <div className="pointer-events-auto absolute inset-x-4 top-4 z-10 space-y-3 rounded-2xl border border-border/40 bg-surface-background/80 p-4 backdrop-blur">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Streaming widget</p>
              <p className="text-sm font-semibold text-text">{widgetPreview.title}</p>
              {widgetPreview.caption ? <p className="text-xs text-text-muted">{widgetPreview.caption}</p> : null}
            </div>
            <button
              type="button"
              className="text-xs font-medium text-text-muted transition hover:text-text"
              onClick={() => {
                setWidgetPreview(null);
                onWidgetPayload?.(null);
              }}
            >
              Clear
            </button>
          </div>
          {widgetPreview.metrics?.length ? (
            <div className="grid gap-2">
              {widgetPreview.metrics.map((metric) => (
                <div key={metric.id} className="flex items-baseline justify-between rounded-xl border border-border/30 bg-surface-elevated/30 px-3 py-2 text-xs">
                  <span className="text-text-muted">{metric.label}</span>
                  <span className="text-sm font-semibold text-text">{metric.value}</span>
                </div>
              ))}
            </div>
          ) : null}
          <details className="rounded-xl border border-border/20 bg-surface-elevated/20 p-2 text-[11px] text-text-muted">
            <summary className="cursor-pointer text-text">Raw payload</summary>
            <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap text-[10px] leading-relaxed">
              {JSON.stringify(widgetPreview.raw, null, 2)}
            </pre>
          </details>
        </div>
      ) : null}
      <ChatKit control={chatkit.control} className="block h-full w-full" />
    </div>
  );
}

function normalizeDemoWidget(params: Record<string, unknown>): DemoWidgetPayload | null {
  if (!params || typeof params !== "object") {
    return null;
  }

  const payload = params as Record<string, unknown>;
  const widget = typeof payload.widget === "object" && payload.widget !== null ? (payload.widget as Record<string, unknown>) : payload;

  const titleCandidate = widget.title ?? widget.heading ?? widget.name;
  if (typeof titleCandidate !== "string" || titleCandidate.trim().length === 0) {
    return null;
  }

  const captionCandidate = widget.caption ?? widget.subtitle ?? widget.description;
  const metricsSource = Array.isArray(widget.metrics)
    ? widget.metrics
    : Array.isArray(widget.stats)
      ? widget.stats
      : undefined;

  const metrics = Array.isArray(metricsSource)
    ? (metricsSource
        .map((entry, index) => {
          if (!entry || typeof entry !== "object") {
            return null;
          }
          const metricRecord = entry as Record<string, unknown>;
          const labelCandidate = metricRecord.label ?? metricRecord.name ?? `Metric ${index + 1}`;
          const valueCandidate = metricRecord.value ?? metricRecord.text;
          if (typeof labelCandidate !== "string" || typeof valueCandidate !== "string") {
            return null;
          }
          const metric: DemoWidgetMetric = {
            id: String(metricRecord.id ?? index),
            label: labelCandidate,
            value: valueCandidate,
          };
          if (typeof metricRecord.delta === "string") {
            metric.delta = metricRecord.delta;
          }
          if (typeof metricRecord.trend === "string") {
            const trend = metricRecord.trend as DemoWidgetMetric["trend"];
            if (trend === "up" || trend === "down" || trend === "flat") {
              metric.trend = trend;
            }
          }
          return metric;
        })
        .filter(Boolean) as DemoWidgetMetric[])
    : undefined;

  return {
    id: typeof widget.id === "string" ? widget.id : createWidgetId(),
    title: titleCandidate.trim(),
    caption: typeof captionCandidate === "string" ? captionCandidate : undefined,
    metrics,
    raw: payload,
    receivedAt: new Date().toISOString(),
  };
}

function createWidgetId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `widget-${Math.random().toString(16).slice(2)}`;
}
