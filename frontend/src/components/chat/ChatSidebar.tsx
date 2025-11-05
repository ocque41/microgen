import { StartScreenPrompt } from "@openai/chatkit";
import { Loader2, LogOut, MessageSquarePlus, Pin, Sparkles, StickyNote } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { ThemeToggle } from "../ThemeToggle";
import type { FactRecord } from "../../lib/facts";
import type { ColorScheme } from "../../hooks/useColorScheme";
import type { ThreadSummary } from "./types";

type ChatSidebarProps = {
  userName: string;
  userEmail?: string | null;
  signingOut: boolean;
  onSignOut: () => void;
  prompts: StartScreenPrompt[];
  onPromptSelect: (prompt: StartScreenPrompt) => void;
  facts: FactRecord[];
  onDiscardFact: (factId: string) => void;
  threads: ThreadSummary[];
  currentThreadId: string | null;
  onSelectThread: (threadId: string | null) => void;
  onNewThread: () => void;
  scheme: ColorScheme;
  onThemeChange: (scheme: ColorScheme) => void;
};

export function ChatSidebar(props: ChatSidebarProps) {
  return (
    <aside className="hidden w-80 flex-col border-r border-border/30 bg-surface-elevated/30 text-text xl:flex">
      <ChatSidebarContent {...props} />
    </aside>
  );
}

export function ChatSidebarContent({
  userName,
  userEmail,
  signingOut,
  onSignOut,
  prompts,
  onPromptSelect,
  facts,
  onDiscardFact,
  threads,
  currentThreadId,
  onSelectThread,
  onNewThread,
  scheme,
  onThemeChange,
}: ChatSidebarProps) {
  const displayName = userName || userEmail || "Operator";

  return (
    <div className="flex h-full flex-col text-text">
      <div className="flex items-center gap-3 px-6 py-6">
        <Avatar className="h-11 w-11 border border-border/40 bg-surface-elevated">
          <AvatarFallback className="bg-surface-elevated/40 text-sm font-semibold uppercase tracking-wide text-text">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text">{displayName}</p>
          {userEmail ? <p className="truncate text-xs text-text-muted">{userEmail}</p> : null}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-text-muted hover:text-text"
          onClick={onSignOut}
          disabled={signingOut}
        >
          {signingOut ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <LogOut className="h-4 w-4" aria-hidden />}
          <span className="sr-only">Sign out</span>
        </Button>
      </div>
      <Separator className="border-border/20" />
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-14">
          <section>
            <header className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Threads</p>
                <p className="text-sm font-semibold text-text">Control room</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-2 rounded-full border-border/40 bg-transparent text-xs text-text"
                onClick={onNewThread}
              >
                <MessageSquarePlus className="h-4 w-4" aria-hidden />
                New
              </Button>
            </header>
            <div className="space-y-2">
              {threads.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border/30 bg-surface-background/40 px-4 py-3 text-xs text-text-muted">
                  Your first conversation will appear here. Start a prompt to populate history.
                </p>
              ) : (
                threads.map((thread) => (
                  <button
                    key={thread.id ?? "draft"}
                    type="button"
                    onClick={() => onSelectThread(thread.id)}
                    className={`group flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      thread.id === currentThreadId
                        ? "border-accent/60 bg-accent/10 text-text"
                        : "border-border/20 bg-surface-background/40 text-text-muted hover:border-border/50 hover:text-text"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-tight">{thread.label}</span>
                      <span className="text-[11px] uppercase tracking-wide text-text-muted group-hover:text-text-muted/80">{formatRelativeTime(thread.lastActiveAt)}</span>
                    </div>
                    <Badge variant="outline" className="border-border/30 bg-transparent text-[10px] uppercase tracking-wide text-text-muted">
                      {thread.id ? "Active" : "Draft"}
                    </Badge>
                  </button>
                ))
              )}
            </div>
          </section>

          <section>
            <header className="mb-4 flex items-center gap-2">
              <Pin className="h-4 w-4 text-text-muted" aria-hidden />
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Pinned prompts</p>
            </header>
            <div className="grid gap-2">
              {prompts.map((prompt) => (
                <Button
                  key={prompt.label}
                  type="button"
                  variant="ghost"
                  className="justify-start gap-3 rounded-xl border border-border/20 bg-surface-background/30 px-4 py-3 text-left text-sm text-text hover:border-border/50 hover:bg-surface-elevated/30"
                  onClick={() => onPromptSelect(prompt)}
                >
                  <Sparkles className="h-4 w-4 text-accent" aria-hidden />
                  <div>
                    <p className="font-medium">{prompt.label}</p>
                    <p className="text-xs text-text-muted">Prefill the composer with this scenario.</p>
                  </div>
                </Button>
              ))}
            </div>
          </section>

          <section>
            <header className="mb-4 flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-text-muted" aria-hidden />
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Captured facts</p>
            </header>
            <div className="space-y-3">
              {facts.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border/30 bg-surface-background/40 px-4 py-3 text-xs text-text-muted">
                  As tools report facts, they will live here for quick reference.
                </p>
              ) : (
                facts.map((fact) => (
                  <div key={fact.id} className="group rounded-xl border border-border/30 bg-surface-background/60 p-3 shadow-[0_10px_40px_-30px_rgba(0,0,0,0.8)]">
                    <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wide text-text-muted">
                      <span>{formatTimestamp(fact.createdAt)}</span>
                      <button
                        type="button"
                        onClick={() => onDiscardFact(fact.id)}
                        className="text-text-muted transition hover:text-text"
                      >
                        Clear
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed text-text">{fact.text}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </ScrollArea>
      <Separator className="border-border/20" />
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Appearance</p>
          <p className="text-sm font-medium text-text">Theme</p>
        </div>
        <ThemeToggle value={scheme} onChange={onThemeChange} />
      </div>
    </div>
  );
}

function getInitials(value: string): string {
  const segments = value.trim().split(/\s+/);
  if (segments.length === 0) {
    return "OP";
  }
  if (segments.length === 1) {
    return segments[0].slice(0, 2).toUpperCase();
  }
  return `${segments[0][0] ?? ""}${segments[segments.length - 1][0] ?? ""}`.toUpperCase();
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "Moments ago";
  }
  const now = Date.now();
  const diff = Math.max(0, now - date.getTime());
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) {
    return "Just now";
  }
  if (diff < hour) {
    const minutes = Math.round(diff / minute);
    return `${minutes}m ago`;
  }
  if (diff < day) {
    const hours = Math.round(diff / hour);
    return `${hours}h ago`;
  }
  return date.toLocaleDateString();
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }
  const now = Date.now();
  const diff = Math.max(0, now - date.getTime());
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) {
    return "Active now";
  }
  if (diff < hour) {
    const minutes = Math.round(diff / minute);
    return `${minutes}m ago`;
  }
  if (diff < day) {
    const hours = Math.round(diff / hour);
    return `${hours}h ago`;
  }
  return date.toLocaleDateString();
}
