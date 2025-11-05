import { Cpu, Server, Sparkles, User } from "lucide-react";
import type { ActivityEvent } from "./types";

type ConversationTimelineProps = {
  events: ActivityEvent[];
};

export function ConversationTimeline({ events }: ConversationTimelineProps) {
  if (events.length === 0) {
    return null;
  }

  const recent = events.slice(0, 6);

  return (
    <div className="pointer-events-none absolute inset-y-8 left-6 hidden w-52 px-2 xl:flex">
      <div className="relative w-full">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40" />
        <ul className="relative flex flex-col gap-5">
          {recent.map((event) => (
            <li key={event.id} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-border/40 bg-surface-elevated/60 text-text">
                {resolveIcon(event.kind)}
              </span>
              <div className="flex-1 text-xs text-text">
                <p className="font-medium leading-tight">{event.title}</p>
                {event.meta ? <p className="text-[11px] text-text-muted">{event.meta}</p> : null}
                <p className="mt-1 text-[10px] uppercase tracking-wide text-text-muted">{formatTime(event.timestamp)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function resolveIcon(kind: ActivityEvent["kind"]) {
  if (kind === "assistant") {
    return <Sparkles className="h-3.5 w-3.5" aria-hidden />;
  }
  if (kind === "tool") {
    return <Cpu className="h-3.5 w-3.5" aria-hidden />;
  }
  if (kind === "system") {
    return <Server className="h-3.5 w-3.5" aria-hidden />;
  }
  return <User className="h-3.5 w-3.5" aria-hidden />;
}

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "--";
  }
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}
