import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import type { DemoWidgetPayload } from "../ChatKitPanel";
import type { ActivityEvent } from "./types";

type WidgetDrawerProps = {
  payload: DemoWidgetPayload | null;
  onClear: () => void;
  activity: ActivityEvent[];
};

export function WidgetDrawer({ payload, onClear, activity }: WidgetDrawerProps) {
  return (
    <aside className="hidden w-80 flex-col border-l border-border/30 bg-surface-elevated/30 text-text xl:flex">
      <div className="flex items-center justify-between border-b border-border/20 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Insights</p>
          <p className="text-sm font-semibold text-text">Streaming widget</p>
        </div>
        <button
          type="button"
          className="text-xs font-medium text-text-muted transition hover:text-text"
          onClick={onClear}
          disabled={!payload}
        >
          Clear
        </button>
      </div>
      <div className="flex-1 px-5 py-4">
        <Tabs defaultValue="metrics" className="flex h-full flex-col">
          <TabsList className="grid h-10 grid-cols-3 rounded-full bg-surface-background/60 text-text-muted">
            <TabsTrigger value="metrics" className="rounded-full data-[state=active]:bg-accent/20 data-[state=active]:text-text">
              Metrics
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-full data-[state=active]:bg-accent/20 data-[state=active]:text-text">
              Activity
            </TabsTrigger>
            <TabsTrigger value="raw" className="rounded-full data-[state=active]:bg-accent/20 data-[state=active]:text-text">
              Raw
            </TabsTrigger>
          </TabsList>
          <TabsContent value="metrics" className="flex-1">
            <ScrollArea className="h-full rounded-2xl border border-border/20 bg-surface-background/60 p-4">
              {payload?.metrics?.length ? (
                <div className="space-y-3">
                  {payload.metrics.map((metric) => (
                    <div key={metric.id} className="rounded-xl border border-border/20 bg-surface-elevated/40 p-3">
                      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-text-muted">
                        <span>{metric.label}</span>
                        {metric.delta ? <Badge variant="outline" className="border-border/30 text-[10px] text-text-muted">{metric.delta}</Badge> : null}
                      </div>
                      <p className="mt-2 text-lg font-semibold text-text">{metric.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="Tool responses will render their KPIs here." />
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="activity" className="flex-1">
            <ScrollArea className="h-full rounded-2xl border border-border/20 bg-surface-background/60 p-4">
              {activity.length === 0 ? (
                <EmptyState message="System activity is tracked while you chat." />
              ) : (
                <ol className="space-y-3 text-xs">
                  {activity.map((event) => (
                    <li key={event.id} className="rounded-xl border border-border/20 bg-surface-elevated/40 p-3">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-text-muted">{event.kind}</p>
                      <p className="mt-1 text-sm font-medium text-text">{event.title}</p>
                      {event.meta ? <p className="mt-1 text-xs text-text-muted">{event.meta}</p> : null}
                      <p className="mt-2 text-[11px] text-text-muted">{new Date(event.timestamp).toLocaleTimeString()}</p>
                    </li>
                  ))}
                </ol>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="raw" className="flex-1">
            <ScrollArea className="h-full rounded-2xl border border-border/20 bg-surface-background/60 p-4">
              {payload ? (
                <pre className="text-[11px] leading-relaxed text-text-muted">{JSON.stringify(payload.raw, null, 2)}</pre>
              ) : (
                <EmptyState message="Select a widget event to inspect the raw payload." />
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="text-xs leading-relaxed text-text-muted">{message}</p>;
}
