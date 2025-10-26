# Split-Pane Workbench QA

The workbench route (`/workbench`) demonstrates a persistent split-pane layout with streaming loaders, optimistic actions, and a command palette wired to ChatKit. Use this guide to verify accessibility, motion, and performance guardrails.

## Launching the demo

1. Install dependencies and start the Vite dev server:

   ```bash
   npm install
   npm run dev
   ```

2. Open http://localhost:5173/workbench. The sidebar renders immediately with its skeletons while the task list streams in via a deferred loader.

## Checklist

- **Skeleton coverage** – With a throttled network (e.g., Chrome DevTools “Fast 3G”), reload `/workbench` and confirm:
  - The sidebar displays the `WorkbenchListSkeleton` placeholders until the task summaries resolve.
  - Selecting a task triggers the detail-pane skeleton while the deferred task loader resolves.

- **Command palette** – Press `⌘K`/`Ctrl+K` to open the shadcn/ui command palette. Validate that:
  - “Refresh data” revalidates the loaders without leaving the route.
  - “New chat thread” focuses the ChatKit composer when the widget is mounted.
  - Task entries navigate with View Transitions enabled.

- **Optimistic updates** – Inside a task detail:
  - Change the status with the dropdown; the new status renders instantly while the action completes.
  - Add a note; it appears at the top of the notes list immediately and persists after the mutation finishes.

- **Streaming description** – The “Creative brief” section animates text in sequence. Toggle `prefers-reduced-motion` (or apply the `.motion-disabled` class) to confirm the streaming falls back to a static render.

- **ChatKit widget payloads** – Invoke a `show_demo_widget` client tool (e.g., through the ChatKit Playground) and confirm the payload appears:
  - Inside the ChatKit panel overlay.
  - In the “Demo widget” card next to the chat, including the raw JSON payload for QA.

- **Mobile shell** – Collapse the viewport below 768px. The sidebar becomes a Sheet, retains keyboard focus management, and the command palette remains accessible.

Document any failures or deviations in `PLAN.md` before shipping.

