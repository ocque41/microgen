import type React from "react";
import { Activity, Clock3, Cpu, ShieldCheck } from "lucide-react";

type SystemStatusTrayProps = {
  threadLabel: string;
  latencyMs: number | null;
  isGenerating: boolean;
  modelName?: string | null;
  quotaStatus?: string | null;
  statusMessage?: string | null;
};

export function SystemStatusTray({
  threadLabel,
  latencyMs,
  isGenerating,
  modelName,
  quotaStatus,
  statusMessage,
}: SystemStatusTrayProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/40 bg-surface-elevated/40 px-4 py-3 text-sm text-text shadow-[0_30px_90px_-70px_rgba(0,0,0,0.9)] lg:px-6">
      <StatusPill icon={<Activity className="h-4 w-4" aria-hidden />} label="Thread" value={threadLabel} />
      <StatusPill
        icon={<Clock3 className="h-4 w-4" aria-hidden />}
        label={isGenerating ? "Generating" : "Latency"}
        value={formatLatency(latencyMs, isGenerating)}
      />
      <StatusPill icon={<Cpu className="h-4 w-4" aria-hidden />} label="Model" value={modelName ?? "Adaptive"} />
      <StatusPill icon={<ShieldCheck className="h-4 w-4" aria-hidden />} label="Quota" value={quotaStatus ?? "Healthy"} />
      {statusMessage ? <p className="w-full text-xs text-text-muted lg:w-auto">{statusMessage}</p> : null}
    </div>
  );
}

type StatusPillProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function StatusPill({ icon, label, value }: StatusPillProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-surface-background/40 px-3 py-2 text-xs uppercase tracking-wide text-text-muted">
      <span className="text-text">{icon}</span>
      <div className="flex flex-col">
        <span>{label}</span>
        <span className="text-[11px] text-text">{value}</span>
      </div>
    </div>
  );
}

function formatLatency(latencyMs: number | null, active: boolean): string {
  if (active) {
    return "Streaming";
  }
  if (latencyMs == null) {
    return "--";
  }
  if (latencyMs < 1000) {
    return `${Math.round(latencyMs)}ms`;
  }
  const seconds = latencyMs / 1000;
  return `${seconds.toFixed(1)}s`;
}
