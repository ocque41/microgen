export type WorkbenchTaskStatus = "planning" | "active" | "review" | "shipped";

export type WorkbenchTaskSummary = {
  id: string;
  title: string;
  summary: string;
  status: WorkbenchTaskStatus;
  owner: string;
  updatedAt: string;
  unreadCount: number;
  tags: string[];
};

export type WorkbenchTaskDetail = WorkbenchTaskSummary & {
  descriptionSegments: Array<{
    id: string;
    delayMs: number;
    text: string;
  }>;
  timeline: Array<{
    id: string;
    at: string;
    actor: string;
    summary: string;
  }>;
  metrics: Array<{
    id: string;
    label: string;
    value: string;
    delta?: string;
    trend?: "up" | "down" | "flat";
  }>;
  notes: string[];
};

export type UpdateWorkbenchTaskInput = {
  id: string;
  status?: WorkbenchTaskStatus;
  note?: string;
};

type WorkbenchTaskRecord = WorkbenchTaskDetail;

const tasks = new Map<string, WorkbenchTaskRecord>();

function seedTask(task: WorkbenchTaskRecord) {
  tasks.set(task.id, task);
}

function simulateLatency(min = 180, max = 420) {
  const duration = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise<void>((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    window.setTimeout(resolve, duration);
  });
}

function cloneTask(task: WorkbenchTaskRecord): WorkbenchTaskRecord {
  return {
    ...task,
    descriptionSegments: task.descriptionSegments.map((segment) => ({ ...segment })),
    timeline: task.timeline.map((item) => ({ ...item })),
    metrics: task.metrics.map((metric) => ({ ...metric })),
    notes: [...task.notes],
    tags: [...task.tags],
  };
}

export async function fetchWorkbenchSummaries(): Promise<WorkbenchTaskSummary[]> {
  if (tasks.size === 0) {
    primeTasks();
  }

  await simulateLatency();

  return Array.from(tasks.values()).map(toSummary);
}

export async function fetchWorkbenchDetail(id: string): Promise<WorkbenchTaskDetail> {
  if (tasks.size === 0) {
    primeTasks();
  }

  await simulateLatency(240, 540);

  const record = tasks.get(id);
  if (!record) {
    throw new Response("Task not found", { status: 404 });
  }

  return cloneTask(record);
}

export async function updateWorkbenchTask(input: UpdateWorkbenchTaskInput): Promise<WorkbenchTaskDetail> {
  if (tasks.size === 0) {
    primeTasks();
  }

  const record = tasks.get(input.id);
  if (!record) {
    throw new Response("Task not found", { status: 404 });
  }

  const updated: WorkbenchTaskRecord = cloneTask(record);

  if (input.status && input.status !== updated.status) {
    updated.status = input.status;
    updated.timeline.unshift({
      id: randomId("status"),
      actor: "System",
      at: new Date().toISOString(),
      summary: `Status changed to ${input.status.toUpperCase()}`,
    });
  }

  if (input.note) {
    const note = input.note.trim();
    if (note.length > 0) {
      updated.notes = [note, ...updated.notes].slice(0, 6);
      updated.timeline.unshift({
        id: randomId("note"),
        actor: "You",
        at: new Date().toISOString(),
        summary: note,
      });
    }
  }

  tasks.set(input.id, updated);
  await simulateLatency(220, 360);

  return cloneTask(updated);
}

function toSummary(task: WorkbenchTaskRecord): WorkbenchTaskSummary {
  return {
    id: task.id,
    title: task.title,
    summary: task.summary,
    status: task.status,
    owner: task.owner,
    updatedAt: task.updatedAt,
    unreadCount: task.unreadCount,
    tags: [...task.tags],
  };
}

function primeTasks() {
  const now = new Date();
  const iso = (offsetMinutes: number) => new Date(now.getTime() - offsetMinutes * 60_000).toISOString();

  const taskA: WorkbenchTaskRecord = {
    id: "demo-brief",
    title: "Refine onboarding brief",
    summary: "Polish the onboarding walkthrough with real-time widget updates and demos.",
    status: "active",
    owner: "Mira", // product design lead
    updatedAt: iso(12),
    unreadCount: 3,
    tags: ["design", "widgets"],
    descriptionSegments: [
      {
        id: "brief-1",
        delayMs: 80,
        text: "Start with the hero moment—users should understand Microagents within the first 15 seconds.",
      },
      {
        id: "brief-2",
        delayMs: 420,
        text: "Layer in demo widgets that animate progress as ChatKit responses stream in.",
      },
      {
        id: "brief-3",
        delayMs: 720,
        text: "Close with a concrete next step and optional integrations from the command palette.",
      },
    ],
    timeline: [
      {
        id: "timeline-brief-1",
        at: iso(32),
        actor: "Ishan",
        summary: "Connected the command palette hook to ChatKit actions.",
      },
      {
        id: "timeline-brief-2",
        at: iso(46),
        actor: "System",
        summary: "Status changed to ACTIVE",
      },
    ],
    metrics: [
      { id: "brief-m1", label: "Activation", value: "68%", delta: "+6.4%", trend: "up" },
      { id: "brief-m2", label: "Time to Value", value: "2m 41s", delta: "-22s", trend: "up" },
      { id: "brief-m3", label: "Drop-off", value: "9%", delta: "-1.2%", trend: "down" },
    ],
    notes: [
      "Add reduced-motion posters for the demo timeline.",
      "QA focus rings on the optimistic update buttons.",
    ],
  };

  const taskB: WorkbenchTaskRecord = {
    id: "demo-canvas",
    title: "Prototype split-pane canvas",
    summary: "Demo a persistent workbench with streaming panes and command shortcuts.",
    status: "review",
    owner: "Noah",
    updatedAt: iso(90),
    unreadCount: 1,
    tags: ["ux", "review"],
    descriptionSegments: [
      {
        id: "canvas-1",
        delayMs: 120,
        text: "Audit skeleton coverage—list and detail panes need independent placeholders.",
      },
      {
        id: "canvas-2",
        delayMs: 520,
        text: "Connect optimistic updates so status changes feel instant even before streaming completes.",
      },
    ],
    timeline: [
      {
        id: "timeline-canvas-1",
        at: iso(110),
        actor: "Noah",
        summary: "Filed review feedback for pane focus management on mobile.",
      },
      {
        id: "timeline-canvas-2",
        at: iso(240),
        actor: "System",
        summary: "Status changed to REVIEW",
      },
    ],
    metrics: [
      { id: "canvas-m1", label: "Pane Focus", value: "100%", delta: "", trend: "flat" },
      { id: "canvas-m2", label: "Latency", value: "380ms", delta: "-40ms", trend: "up" },
    ],
    notes: ["Document command palette shortcuts for QA."],
  };

  const taskC: WorkbenchTaskRecord = {
    id: "demo-stream",
    title: "Streamed response QA",
    summary: "Verify streaming widget payload rendering from show_demo_widget.",
    status: "planning",
    owner: "Ada",
    updatedAt: iso(210),
    unreadCount: 0,
    tags: ["qa", "chat"],
    descriptionSegments: [
      {
        id: "stream-1",
        delayMs: 160,
        text: "Capture widget payloads from client tools and render them alongside ChatKit responses.",
      },
      {
        id: "stream-2",
        delayMs: 640,
        text: "Log payload JSON so developers can validate schema changes quickly.",
      },
    ],
    timeline: [
      {
        id: "timeline-stream-1",
        at: iso(310),
        actor: "Ada",
        summary: "Drafted schema guard for show_demo_widget payloads.",
      },
    ],
    metrics: [
      { id: "stream-m1", label: "Widget Coverage", value: "75%", delta: "+25%", trend: "up" },
      { id: "stream-m2", label: "Schema Drift", value: "0 issues", delta: "", trend: "flat" },
    ],
    notes: ["Coordinate with API team on payload versioning."],
  };

  const taskD: WorkbenchTaskRecord = {
    id: "demo-handoff",
    title: "Automation handoff",
    summary: "Route automation events into the dashboard workbench with healthy defaults.",
    status: "shipped",
    owner: "Elena",
    updatedAt: iso(540),
    unreadCount: 0,
    tags: ["automation"],
    descriptionSegments: [
      {
        id: "handoff-1",
        delayMs: 200,
        text: "Ensure new events appear at the top of the list with optimistic placeholders.",
      },
      {
        id: "handoff-2",
        delayMs: 560,
        text: "Document view transition expectations for cross-route navigation.",
      },
    ],
    timeline: [
      {
        id: "timeline-handoff-1",
        at: iso(640),
        actor: "System",
        summary: "Status changed to SHIPPED",
      },
      {
        id: "timeline-handoff-2",
        at: iso(810),
        actor: "Elena",
        summary: "Announced automation handoff in #launches.",
      },
    ],
    metrics: [
      { id: "handoff-m1", label: "Automation Coverage", value: "92%", delta: "+8%", trend: "up" },
      { id: "handoff-m2", label: "Escalations", value: "1 open", delta: "-3", trend: "down" },
    ],
    notes: ["Plan a retro on the automation pipeline."],
  };

  seedTask(taskA);
  seedTask(taskB);
  seedTask(taskC);
  seedTask(taskD);
}

function randomId(seed: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${seed}-${Math.random().toString(16).slice(2)}`;
}

