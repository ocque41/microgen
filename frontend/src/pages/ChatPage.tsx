import { useCallback, useMemo, useRef, useState } from "react";
import { useUser } from "@stackframe/react";
import type { StartScreenPrompt } from "@openai/chatkit";
import { Loader2, LogOut, Menu } from "lucide-react";

import {
  ChatKitPanel,
  type ChatKitRegisteredApi,
  type DemoWidgetPayload,
} from "../components/ChatKitPanel";
import { ChatSidebar, ChatSidebarContent } from "../components/chat/ChatSidebar";
import { SystemStatusTray } from "../components/chat/SystemStatusTray";
import { WidgetDrawer } from "../components/chat/WidgetDrawer";
import { ConversationTimeline } from "../components/chat/ConversationTimeline";
import { QuickActionsBar } from "../components/chat/QuickActionsBar";
import type { ActivityEvent, ThreadSummary } from "../components/chat/types";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { useBackendAuth } from "../contexts/BackendAuthContext";
import { useColorScheme } from "../hooks/useColorScheme";
import { useFacts, type FactAction } from "../hooks/useFacts";
import { STARTER_PROMPTS } from "../lib/config";
import type { FactRecord } from "../lib/facts";

type ChatPageProps = {
  initialFacts?: FactRecord[];
};

export function ChatPage({ initialFacts = [] }: ChatPageProps) {
  const { scheme, setScheme } = useColorScheme();
  const { facts, performAction, refresh } = useFacts(initialFacts);
  const { clearAuthorization } = useBackendAuth();
  const user = useUser({ or: "throw" });

  const [signingOut, setSigningOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [widgetPayload, setWidgetPayload] = useState<DemoWidgetPayload | null>(null);
  const [threadSummaries, setThreadSummaries] = useState<ThreadSummary[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [quotaStatus, setQuotaStatus] = useState<string | null>(null);
  const [chatApi, setChatApi] = useState<ChatKitRegisteredApi | null>(null);
  const responseTimerRef = useRef<number | null>(null);

  const pushActivity = useCallback(
    (entry: Omit<ActivityEvent, "id" | "timestamp"> & { timestamp?: string }) => {
      const id = createId();
      const timestamp = entry.timestamp ?? new Date().toISOString();
      setActivity((current) => [{ id, timestamp, ...entry }, ...current].slice(0, 20));
    },
    [],
  );

  const handleSignOut = useCallback(async () => {
    if (signingOut) {
      return;
    }
    setSigningOut(true);
    try {
      await user.signOut();
    } finally {
      clearAuthorization();
      setSigningOut(false);
    }
  }, [clearAuthorization, signingOut, user]);

  const handleWidgetAction = useCallback(
    async (action: FactAction) => {
      await performAction(action);
      if (action.type === "save" && action.factText) {
        pushActivity({ kind: "tool", title: "Fact captured", meta: action.factText });
      }
      if (action.type === "discard") {
        pushActivity({ kind: "tool", title: "Fact discarded" });
      }
    },
    [performAction, pushActivity],
  );

  const handleWidgetPayload = useCallback(
    (payload: DemoWidgetPayload | null) => {
      setWidgetPayload(payload);
      if (payload) {
        pushActivity({ kind: "tool", title: payload.title, meta: payload.caption ?? "Widget update" });
      }
    },
    [pushActivity],
  );

  const handleResponseStart = useCallback(() => {
    responseTimerRef.current = typeof performance !== "undefined" ? performance.now() : Date.now();
    setIsGenerating(true);
    setStatusMessage("Assistant composing in real time…");
    pushActivity({ kind: "assistant", title: "Assistant responding" });
  }, [pushActivity]);

  const handleResponseEnd = useCallback(() => {
    const started = responseTimerRef.current;
    const ended = typeof performance !== "undefined" ? performance.now() : Date.now();
    const elapsed = typeof started === "number" ? Math.max(0, ended - started) : null;
    setLatencyMs(elapsed);
    setIsGenerating(false);
    setStatusMessage(`Response delivered at ${new Date().toLocaleTimeString()}`);
    if (elapsed != null) {
      pushActivity({ kind: "assistant", title: "Assistant response delivered", meta: formatLatencyLabel(elapsed) });
    } else {
      pushActivity({ kind: "assistant", title: "Assistant response delivered" });
    }
    refresh();
  }, [pushActivity, refresh]);

  const handleThreadChange = useCallback(
    (threadId: string | null) => {
      setCurrentThreadId(threadId);
      setThreadSummaries((current) => updateThreadSummaries(current, threadId));
      pushActivity({
        kind: "system",
        title: threadId ? "Switched thread" : "New conversation",
        meta: threadId ? deriveThreadLabel(threadId) : undefined,
      });
    },
    [pushActivity],
  );

  const handleThreadLoadStart = useCallback((threadId: string) => {
    setStatusMessage(`Loading ${deriveThreadLabel(threadId)}…`);
  }, []);

  const handleThreadLoadEnd = useCallback((threadId: string) => {
    setStatusMessage(`${deriveThreadLabel(threadId)} ready`);
  }, []);

  const handleLogEvent = useCallback((entry: { name: string; data?: Record<string, unknown> }) => {
    const maybeModel = extractString(entry.data, "model");
    if (maybeModel) {
      setModelName(maybeModel);
    }
    const maybeQuota = extractString(entry.data, "rate_limit_state") ?? extractString(entry.data, "rate_limit");
    if (maybeQuota) {
      setQuotaStatus(maybeQuota);
    }
  }, []);

  const handleReady = useCallback((api: ChatKitRegisteredApi | null) => {
    setChatApi(api);
  }, []);

  const handlePromptSelect = useCallback(
    (prompt: StartScreenPrompt) => {
      if (!chatApi) {
        return;
      }
      void chatApi.setComposerValue({ text: prompt.prompt });
      chatApi.focusComposer();
      pushActivity({ kind: "user", title: "Prompt queued", meta: prompt.label });
    },
    [chatApi, pushActivity],
  );

  const handleFocusComposer = useCallback(() => {
    chatApi?.focusComposer();
  }, [chatApi]);

  const handleSelectThread = useCallback(
    (threadId: string | null) => {
      if (chatApi) {
        void chatApi.setThreadId(threadId);
      } else {
        setCurrentThreadId(threadId);
        setThreadSummaries((current) => updateThreadSummaries(current, threadId));
      }
    },
    [chatApi],
  );

  const handleNewThread = useCallback(() => {
    handleSelectThread(null);
  }, [handleSelectThread]);

  const handleDiscardFact = useCallback(
    (factId: string) => {
      void performAction({ type: "discard", factId });
      pushActivity({ kind: "tool", title: "Fact cleared" });
    },
    [performAction, pushActivity],
  );

  const currentThreadLabel = useMemo(() => {
    if (!currentThreadId) {
      return "New conversation";
    }
    const existing = threadSummaries.find((entry) => entry.id === currentThreadId);
    return existing ? existing.label : deriveThreadLabel(currentThreadId);
  }, [currentThreadId, threadSummaries]);

  const userName = user.displayName ?? user.primaryEmail ?? "Operator";
  const userEmail = user.primaryEmail ?? null;

  return (
    <div className="flex min-h-screen bg-surface-background text-text">
      <ChatSidebar
        userName={userName}
        userEmail={userEmail}
        signingOut={signingOut}
        onSignOut={handleSignOut}
        prompts={STARTER_PROMPTS}
        onPromptSelect={handlePromptSelect}
        facts={facts}
        onDiscardFact={handleDiscardFact}
        threads={threadSummaries}
        currentThreadId={currentThreadId}
        onSelectThread={handleSelectThread}
        onNewThread={handleNewThread}
        scheme={scheme}
        onThemeChange={setScheme}
      />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 bg-surface-background/80 px-4 pt-4 pb-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="xl:hidden">
                    <Menu className="h-5 w-5" aria-hidden />
                    <span className="sr-only">Toggle navigation</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] overflow-y-auto bg-surface-background text-text">
                  <SheetHeader>
                    <SheetTitle>Control center</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 pb-10">
                    <ChatSidebarContent
                      userName={userName}
                      userEmail={userEmail}
                      signingOut={signingOut}
                      onSignOut={handleSignOut}
                      prompts={STARTER_PROMPTS}
                      onPromptSelect={handlePromptSelect}
                      facts={facts}
                      onDiscardFact={handleDiscardFact}
                      threads={threadSummaries}
                      currentThreadId={currentThreadId}
                      onSelectThread={(threadId) => {
                        setSidebarOpen(false);
                        handleSelectThread(threadId);
                      }}
                      onNewThread={() => {
                        setSidebarOpen(false);
                        handleNewThread();
                      }}
                      scheme={scheme}
                      onThemeChange={setScheme}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Operations</p>
                <p className="text-sm font-semibold text-text">Microagents control center</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full border-border/40 bg-transparent text-xs text-text xl:hidden"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <LogOut className="h-4 w-4" aria-hidden />}
              Sign out
            </Button>
          </div>
          <div className="mt-4">
            <SystemStatusTray
              threadLabel={currentThreadLabel}
              latencyMs={latencyMs}
              isGenerating={isGenerating}
              modelName={modelName}
              quotaStatus={quotaStatus}
              statusMessage={statusMessage}
            />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 px-4 pb-10 pt-6 lg:px-8">
          <div className="relative flex flex-1 overflow-hidden rounded-3xl border border-border/40 bg-surface-elevated/40 shadow-[0_40px_120px_-90px_rgba(0,0,0,0.85)]">
            <ConversationTimeline events={activity} />
            <div className="flex h-full w-full overflow-hidden rounded-3xl bg-surface-background/30 xl:pl-56">
              <div className="flex-1 overflow-hidden">
                <ChatKitPanel
                  onWidgetAction={handleWidgetAction}
                  onResponseEnd={handleResponseEnd}
                  onThemeRequest={setScheme}
                  onReady={handleReady}
                  onWidgetPayload={handleWidgetPayload}
                  onResponseStart={handleResponseStart}
                  onThreadChange={handleThreadChange}
                  onThreadLoadStart={handleThreadLoadStart}
                  onThreadLoadEnd={handleThreadLoadEnd}
                  onLogEvent={handleLogEvent}
                />
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <QuickActionsBar
              prompts={STARTER_PROMPTS}
              onPromptPick={handlePromptSelect}
              onFocusComposer={handleFocusComposer}
              isBusy={isGenerating}
            />
          </div>
        </main>
      </div>
      <WidgetDrawer
        payload={widgetPayload}
        onClear={() => {
          setWidgetPayload(null);
          pushActivity({ kind: "tool", title: "Widget sidebar cleared" });
        }}
        activity={activity}
      />
    </div>
  );
}

function updateThreadSummaries(entries: ThreadSummary[], threadId: string | null): ThreadSummary[] {
  const now = new Date().toISOString();
  const label = threadId ? deriveThreadLabel(threadId) : "New conversation";
  const next: ThreadSummary = { id: threadId, label, lastActiveAt: now };
  const filtered = entries.filter((entry) => entry.id !== threadId).slice(0, 5);
  return [next, ...filtered];
}

function deriveThreadLabel(threadId: string): string {
  if (!threadId) {
    return "New conversation";
  }
  const suffix = threadId.slice(-4).toUpperCase();
  return `Session ${suffix}`;
}

function formatLatencyLabel(latencyMs: number): string {
  if (latencyMs < 1000) {
    return `${Math.round(latencyMs)}ms`;
  }
  return `${(latencyMs / 1000).toFixed(1)}s`;
}

function extractString(source: Record<string, unknown> | undefined, key: string): string | null {
  if (!source) {
    return null;
  }
  const value = source[key];
  return typeof value === "string" ? value : null;
}

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `evt-${Math.random().toString(16).slice(2)}`;
}
