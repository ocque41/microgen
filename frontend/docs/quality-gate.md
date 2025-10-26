# Quality Gate Dashboard

The `/qa` route visualizes Core Web Vitals telemetry captured through the web-vitals RUM client. Metrics stream to the backend endpoint at `/api/rum/vitals`, which stores a short rolling history for Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS) while keeping other sampled metrics visible for context.

## Budgets

- **LCP** – ≤ 2.5 seconds
- **INP** – < 200 milliseconds
- **CLS** – ≤ 0.1

Samples exceeding these thresholds flip the corresponding badge to “Failing” so you can investigate before merging changes. The backend responds with **HTTP 422** when a new sample blows past a budget, which lets CI or local logs flag regressions immediately.

## How to verify

1. Start the FastAPI backend (`uv run uvicorn app.main:app --reload --port 8000`) and the Vite dev server (`npm run dev`).
2. Visit `/qa` in the browser. Interact with the app (navigate between routes, run the workbench demo) to generate new samples. The “Updated” pill shows the timestamp of the latest metric.
3. Toggle reduced motion — either enable the OS setting or add the `.motion-disabled` class to `<html>` — and refresh `/qa`. Scroll-driven animations should pause while the dashboard continues to receive telemetry.
4. Run `npm run test` to execute Vitest. Axe-core assertions validate the shadcn/ui primitives (Dialog, Command, Select/Combobox) and dedicated hero tests confirm that reduced motion swaps scroll timelines for posters.
5. Run `npm run check:media` to verify hero assets remain under budget. CI fails if media or metrics checks regress.

## Troubleshooting

- If `/qa` shows “No samples”, confirm the frontend is calling `initWebVitals()` (wired in `src/main.tsx`) and that the backend logs requests to `/api/rum/vitals`.
- Requests are sampled at 100% in development. Adjust `VITE_RUM_ENDPOINT` or the optional `sampleRate` argument in `initWebVitals()` if you need to test alternate pipelines.
- The in-memory store keeps the most recent 50 samples per metric. Restarting the backend clears the cache.
