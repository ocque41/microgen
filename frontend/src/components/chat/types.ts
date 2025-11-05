export type ThreadSummary = {
  id: string | null;
  label: string;
  lastActiveAt: string;
};

export type ActivityEvent = {
  id: string;
  kind: "user" | "assistant" | "tool" | "system";
  title: string;
  timestamp: string;
  meta?: string;
};
