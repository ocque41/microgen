import { Suspense, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Await, Outlet, useLoaderData, useLocation, useNavigate, useRevalidator } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WorkbenchDetailSkeleton, WorkbenchListSkeleton } from "@/components/skeletons/WorkbenchSkeleton";
import { navigateWithViewTransition, useMotionSuppressed } from "@/lib/viewTransitions";
import type { ChatKitRegisteredApi, DemoWidgetPayload } from "@/components/ChatKitPanel";

import { fetchWorkbenchSummaries, type WorkbenchTaskSummary } from "./data";
import { WorkbenchListPane } from "./list-pane";

export type WorkbenchContextValue = {
  registerChatApi: (api: ChatKitRegisteredApi | null) => void;
  openCommandPalette: () => void;
  setLatestWidget: (payload: DemoWidgetPayload | null) => void;
  latestWidget: DemoWidgetPayload | null;
  tasks: WorkbenchTaskSummary[];
  revalidateTasks: () => void;
};

const WorkbenchContext = createContext<WorkbenchContextValue | null>(null);

export function useWorkbenchContext(): WorkbenchContextValue {
  const value = useContext(WorkbenchContext);
  if (!value) {
    throw new Error("useWorkbenchContext must be used within the workbench layout");
  }
  return value;
}

export type WorkbenchLoaderResult = {
  tasks: Promise<WorkbenchTaskSummary[]>;
};

export function workbenchLoader() {
  return {
    tasks: fetchWorkbenchSummaries(),
  } satisfies WorkbenchLoaderResult;
}

export function WorkbenchLayout() {
  const { tasks } = useLoaderData() as WorkbenchLoaderResult;
  const [resolvedTasks, setResolvedTasks] = useState<WorkbenchTaskSummary[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [chatApi, setChatApi] = useState<ChatKitRegisteredApi | null>(null);
  const [latestWidget, setLatestWidget] = useState<DemoWidgetPayload | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const revalidator = useRevalidator();
  const motionSuppressed = useMotionSuppressed();

  useEffect(() => {
    let active = true;
    tasks.then((list) => {
      if (active) {
        setResolvedTasks(list);
      }
    });
    return () => {
      active = false;
    };
  }, [tasks]);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  const openCommandPalette = useCallback(() => {
    setCommandOpen(true);
  }, []);

  const commandItems = useMemo(() => resolvedTasks, [resolvedTasks]);
  const revalidateTasks = useCallback(() => {
    revalidator.revalidate();
  }, [revalidator]);

  const contextValue = useMemo<WorkbenchContextValue>(
    () => ({
      registerChatApi: setChatApi,
      openCommandPalette,
      setLatestWidget,
      latestWidget,
      tasks: commandItems,
      revalidateTasks,
    }),
    [commandItems, latestWidget, openCommandPalette, revalidateTasks]
  );

  const handleNavigate = useCallback(
    (target: string) => {
      setCommandOpen(false);
      navigateWithViewTransition(navigate, target);
    },
    [navigate]
  );

  const handleRefresh = useCallback(() => {
    revalidator.revalidate();
  }, [revalidator]);

  const chatReady = Boolean(chatApi);

  return (
    <WorkbenchContext.Provider value={contextValue}>
      <SidebarProvider className="bg-surface-background text-text">
        <div className="flex min-h-screen">
          <Sidebar collapsible="icon" className="border-r border-border/40 bg-surface-elevated/10">
          <SidebarHeader className="gap-3 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">Workbench</p>
              <p className="text-sm text-text-muted">Streamed list &amp; detail demo</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="justify-start gap-2"
              onClick={() => setCommandOpen(true)}
            >
              <span className="font-medium">Command Palette</span>
              <span className="rounded-full bg-surface-elevated/40 px-2 py-0.5 text-xs text-text-muted">⌘K</span>
            </Button>
          </SidebarHeader>
          <SidebarContent className="px-2">
            <Suspense fallback={<WorkbenchListSkeleton />}>
              <Await resolve={tasks}>
                {(items: WorkbenchTaskSummary[]) => (
                  <WorkbenchListPane
                    items={items}
                    currentPath={location.pathname}
                    onOpenCommandPalette={openCommandPalette}
                  />
                )}
              </Await>
            </Suspense>
          </SidebarContent>
        </Sidebar>
          <SidebarInset className="bg-surface-background/80">
          <header className="flex items-center justify-between border-b border-border/40 bg-surface-background/70 px-6 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-text-muted" />
              <div>
                <h1 className="text-lg font-semibold">Split-pane workbench</h1>
                <p className="text-sm text-text-muted">Persistent navigation, streaming detail, and optimistic updates.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip disableHoverableContent={motionSuppressed}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setCommandOpen(true)}>
                    Command
                    <span className="ml-2 rounded-full bg-surface-elevated/40 px-2 py-0.5 text-xs text-text-muted">⌘K</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={8}>Quick actions and navigation</TooltipContent>
              </Tooltip>
              <Tooltip disableHoverableContent={motionSuppressed}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (chatApi) {
                        void chatApi.focusComposer();
                      }
                      setCommandOpen(true);
                    }}
                    disabled={!chatReady}
                  >
                    Focus chat
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={8}>Send cursor to ChatKit composer</TooltipContent>
              </Tooltip>
            </div>
          </header>
          <main className="flex h-full flex-1 flex-col overflow-hidden">
            <Suspense fallback={<WorkbenchDetailSkeleton />}>
              <Await resolve={tasks}>
                {() => <Outlet context={contextValue} />}
              </Await>
            </Suspense>
          </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Jump to a task or run an action…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Workbench">
            <CommandItem
              value="revalidate"
              onSelect={() => {
                handleRefresh();
                setCommandOpen(false);
              }}
            >
              Refresh data
              <CommandShortcut>R</CommandShortcut>
            </CommandItem>
            <CommandItem
              value="open-chat"
              onSelect={() => {
                if (chatApi) {
                  chatApi.setThreadId(null);
                  void chatApi.focusComposer();
                }
                setCommandOpen(false);
              }}
              disabled={!chatReady}
            >
              New chat thread
            </CommandItem>
            <CommandItem
              value="chat-focus"
              onSelect={() => {
                if (chatApi) {
                  void chatApi.focusComposer();
                }
                setCommandOpen(false);
              }}
              disabled={!chatReady}
            >
              Focus chat composer
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Tasks">
            {commandItems.map((task) => (
              <CommandItem
                key={task.id}
                value={task.title}
                onSelect={() => handleNavigate(`/workbench/${task.id}`)}
              >
                {task.title}
                <CommandShortcut>{task.status.toUpperCase()}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </WorkbenchContext.Provider>
  );
}

