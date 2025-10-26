import { Suspense, useEffect, useMemo, useState } from "react";
import {
  Await,
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { Loader2 } from "lucide-react";

import { ChatKitPanel } from "@/components/ChatKitPanel";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import {
  fetchWorkbenchDetail,
  updateWorkbenchTask,
  type UpdateWorkbenchTaskInput,
  type WorkbenchTaskDetail,
  type WorkbenchTaskStatus,
} from "./data";
import type { WorkbenchContextValue } from "./layout";
import type { DemoWidgetPayload } from "@/components/ChatKitPanel";

type LoaderResult = {
  task: Promise<WorkbenchTaskDetail>;
};

type ActionResult = {
  task: WorkbenchTaskDetail;
};

export function workbenchDetailLoader({ params }: LoaderFunctionArgs) {
  const taskId = params.taskId;
  if (!taskId) {
    throw new Response("Task id missing", { status: 400 });
  }

  return {
    task: fetchWorkbenchDetail(taskId),
  } satisfies LoaderResult;
}

export async function workbenchDetailAction({ request, params }: ActionFunctionArgs) {
  const taskId = params.taskId;
  if (!taskId) {
    throw new Response("Task id missing", { status: 400 });
  }

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const payload: UpdateWorkbenchTaskInput = { id: taskId };

  if (intent === "update-status") {
    const status = formData.get("status");
    if (typeof status === "string") {
      payload.status = status as WorkbenchTaskStatus;
    }
  }

  if (intent === "add-note") {
    const note = formData.get("note");
    if (typeof note === "string") {
      payload.note = note;
    }
  }

  const task = await updateWorkbenchTask(payload);
  return { task } satisfies ActionResult;
}

export function WorkbenchDetailRoute() {
  const { task } = useLoaderData() as LoaderResult;

  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center p-12">Loading detail…</div>}>
      <Await resolve={task}>{(record) => <WorkbenchDetailContent task={record} />}</Await>
    </Suspense>
  );
}

type WorkbenchDetailContentProps = {
  task: WorkbenchTaskDetail;
};

function WorkbenchDetailContent({ task }: WorkbenchDetailContentProps) {
  const fetcher = useFetcher<ActionResult>();
  const context = useOutletContext<WorkbenchContextValue>();
  const params = useParams();

  const pendingIntent = fetcher.formData?.get("intent") ?? null;
  const pendingStatus = (fetcher.formData?.get("status") as WorkbenchTaskStatus | null) ?? null;
  const pendingNote = (fetcher.formData?.get("note") as string | null)?.trim() ?? "";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      context.revalidateTasks();
    }
  }, [context, fetcher.data, fetcher.state]);

  useEffect(() => {
    if (fetcher.state === "idle" && pendingIntent === "add-note") {
      const noteField = document.querySelector<HTMLTextAreaElement>("#workbench-note");
      if (noteField) {
        noteField.value = "";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, pendingIntent]);

  const [segments, setSegments] = useState<string[]>(() => task.descriptionSegments.slice(0, 1).map((segment) => segment.text));

  useEffect(() => {
    if (typeof window === "undefined") {
      setSegments(task.descriptionSegments.map((segment) => segment.text));
      return;
    }

    setSegments([]);
    const timers: number[] = [];
    let totalDelay = 0;
    task.descriptionSegments.forEach((segment) => {
      totalDelay += segment.delayMs;
      const timer = window.setTimeout(() => {
        setSegments((current) => {
          if (current.includes(segment.text)) {
            return current;
          }
          return [...current, segment.text];
        });
      }, totalDelay);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [task.descriptionSegments, task.id]);

  const optimisticStatus = pendingStatus ?? task.status;
  const optimisticNotes = pendingIntent === "add-note" && pendingNote ? [pendingNote, ...task.notes] : task.notes;

  const optimisticTimeline = useMemo(() => {
    const entries = [...task.timeline];
    if (pendingIntent === "update-status" && pendingStatus) {
      entries.unshift({
        id: "optimistic-status",
        actor: "You",
        at: new Date().toISOString(),
        summary: `Updating status to ${pendingStatus.toUpperCase()}`,
      });
    }
    if (pendingIntent === "add-note" && pendingNote) {
      entries.unshift({
        id: "optimistic-note",
        actor: "You",
        at: new Date().toISOString(),
        summary: pendingNote,
      });
    }
    return entries;
  }, [pendingIntent, pendingNote, pendingStatus, task.timeline]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="grid flex-1 gap-6 overflow-y-auto p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-3xl border border-border/40 bg-surface-background/70 p-6 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.6)] backdrop-blur">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-text-muted">Task</p>
                <h2 className="text-2xl font-semibold">{task.title}</h2>
                <p className="max-w-2xl text-sm text-text-muted">{task.summary}</p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={optimisticStatus}
                  onValueChange={(next) => {
                    const data = new FormData();
                    data.set("intent", "update-status");
                    data.set("status", next);
                    fetcher.submit(data, { method: "post", action: `/workbench/${params.taskId ?? task.id}` });
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="review">In review</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                  </SelectContent>
                </Select>
                {fetcher.state !== "idle" ? <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden /> : null}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {task.metrics.map((metric) => (
                <Card key={metric.id} className="rounded-2xl border-border/40 bg-surface-elevated/30 p-4">
                  <p className="text-xs text-text-muted">{metric.label}</p>
                  <p className="mt-2 text-xl font-semibold">{metric.value}</p>
                  {metric.delta ? (
                    <p className="text-xs text-text-subtle">{metric.delta}</p>
                  ) : null}
                </Card>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-text-muted">Creative brief</p>
              <div className="space-y-2 rounded-2xl border border-border/30 bg-surface-elevated/20 p-4">
                {segments.length === 0 ? (
                  <p className="text-sm text-text-muted">Streaming guidance…</p>
                ) : (
                  segments.map((segment) => (
                    <p key={segment} className="text-sm leading-relaxed text-text">
                      {segment}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
          <Tabs defaultValue="timeline" className="space-y-4">
            <TabsList className="bg-surface-elevated/40">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="space-y-3 rounded-3xl border border-border/40 bg-surface-background/60 p-4">
              <ScrollArea className="max-h-64">
                <ul className="space-y-3">
                  {optimisticTimeline.map((entry) => (
                    <li key={entry.id} className="rounded-2xl border border-border/20 bg-surface-elevated/20 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{entry.actor}</p>
                      <p className="text-sm text-text">{entry.summary}</p>
                      <p className="text-[11px] text-text-subtle">{new Date(entry.at).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="notes" className="space-y-4 rounded-3xl border border-border/40 bg-surface-background/60 p-4">
              <fetcher.Form method="post" className="space-y-3">
                <input type="hidden" name="intent" value="add-note" />
                <Textarea
                  id="workbench-note"
                  name="note"
                  placeholder="Add a note that streams with the task"
                  className="min-h-[96px]"
                  aria-label="Add a note"
                  required
                />
                <Button type="submit" className="self-start">
                  Save note
                </Button>
              </fetcher.Form>
              <Separator />
              <ul className="space-y-3">
                {optimisticNotes.map((note, index) => (
                  <li key={`${note}-${index}`} className="rounded-2xl border border-border/20 bg-surface-elevated/20 p-3 text-sm leading-relaxed">
                    {note}
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </div>
        <aside className="flex flex-col gap-4">
          <div className="rounded-3xl border border-border/40 bg-surface-background/60 p-4 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.6)]">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">Chat demo</p>
                <h3 className="text-sm font-semibold">ChatKit streaming</h3>
              </div>
              <TransitionLink to="/chat" className="text-xs font-medium text-accent" viewTransition>
                Open chat
              </TransitionLink>
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border/30">
              <ChatKitPanel
                onWidgetAction={() => Promise.resolve()}
                onResponseEnd={() => {}}
                onThemeRequest={() => {}}
                onReady={context.registerChatApi}
                onWidgetPayload={context.setLatestWidget}
              />
            </div>
          </div>
          {context.latestWidget ? <DemoWidgetCard widget={context.latestWidget} /> : null}
        </aside>
      </div>
    </div>
  );
}

type DemoWidgetCardProps = {
  widget: DemoWidgetPayload;
};

function DemoWidgetCard({ widget }: DemoWidgetCardProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-border/30 bg-surface-background/70 p-5 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.6)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">Demo widget</p>
          <h4 className="text-sm font-semibold">{widget.title}</h4>
          {widget.caption ? <p className="mt-1 text-xs text-text-muted">{widget.caption}</p> : null}
        </div>
        <span className="text-[10px] text-text-subtle">{new Date(widget.receivedAt).toLocaleTimeString()}</span>
      </div>
      {widget.metrics?.length ? (
        <div className="grid gap-3">
          {widget.metrics.map((metric) => (
            <div key={metric.id} className="flex items-baseline justify-between rounded-2xl border border-border/20 bg-surface-elevated/20 px-3 py-2">
              <span className="text-xs text-text-muted">{metric.label}</span>
              <span className="text-sm font-semibold text-text">{metric.value}</span>
            </div>
          ))}
        </div>
      ) : null}
      <details className="rounded-2xl border border-border/20 bg-surface-elevated/20 p-3 text-xs text-text-muted">
        <summary className="cursor-pointer text-text">Raw payload</summary>
        <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-[11px] leading-relaxed">
          {JSON.stringify(widget.raw, null, 2)}
        </pre>
      </details>
    </div>
  );
}

