import { useEffect, useRef } from "react";
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
  "focusComposer" | "setThreadId" | "fetchUpdates" | "sendCustomAction" | "setComposerValue" | "sendUserMessage"
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
  onResponseStart?: () => void;
  onThreadChange?: (threadId: string | null) => void;
  onThreadLoadStart?: (threadId: string) => void;
  onThreadLoadEnd?: (threadId: string) => void;
  onLogEvent?: (entry: { name: string; data?: Record<string, unknown> }) => void;
};

export function ChatKitPanel({
  onWidgetAction,
  onResponseEnd,
  onThemeRequest,
  onReady,
  onWidgetPayload,
  onResponseStart,
  onThreadChange,
  onThreadLoadStart,
  onThreadLoadEnd,
  onLogEvent,
}: ChatKitPanelProps) {
  const processedFacts = useRef(new Set<string>());
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
          hue: 45,
          tint: 8,
          shade: -2,
        },
        accent: {
          primary: "#e8cca3",
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
          onWidgetPayload?.(payload);
          return { success: true };
        }
        return { success: false };
      }

      return { success: false };
    },
    onResponseStart: () => {
      onResponseStart?.();
    },
    onResponseEnd: () => {
      onResponseEnd();
    },
    onThreadChange: ({ threadId }) => {
      processedFacts.current.clear();
      onWidgetPayload?.(null);
      onThreadChange?.(threadId ?? null);
    },
    onThreadLoadStart: ({ threadId }) => {
      onThreadLoadStart?.(threadId);
    },
    onThreadLoadEnd: ({ threadId }) => {
      onThreadLoadEnd?.(threadId);
    },
    onError: ({ error }) => {
      // ChatKit handles displaying the error to the user
      console.error("ChatKit error", error);
    },
    onLog: (event) => {
      onLogEvent?.(event);
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
      setComposerValue: chatkit.setComposerValue,
      sendUserMessage: chatkit.sendUserMessage,
    };
    onReady(api);

    return () => {
      onReady(null);
    };
  }, [chatkit.focusComposer, chatkit.setThreadId, chatkit.fetchUpdates, chatkit.sendCustomAction, chatkit.setComposerValue, chatkit.sendUserMessage, onReady]);

  return <ChatKit control={chatkit.control} className="block h-full w-full" />;
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
