# ChatKit Frontend

This Vite + React client wraps the ChatKit web component in a slim list UI so you can focus on iterating with the backend agent. It mirrors the root README tone while surfacing the project paths and configuration you need day to day.

## Quick Reference
- App entry point & routing shell: `src/main.tsx` and `src/App.tsx`
- Auth state: `src/contexts/AuthContext.tsx`
- Marketing and auth pages: `src/pages/*.tsx`
- ChatKit config helper: `src/lib/config.ts`
- Styling: `src/index.css` (Tailwind layers)

## Requirements
- Node.js 20+
- Backend API running locally (defaults to `http://127.0.0.1:8000`).

## Environment Variables

Optional overrides include `VITE_CHATKIT_API_URL` and `VITE_FACTS_API_URL`. If you change them, restart `npm run dev` so Vite reloads the new values.

## Routes

- `/` – marketing landing page with features and pricing
- `/login`, `/signup`, `/forgot-password` – authentication flows (email + OAuth placeholders)
- `/chat` – ChatKit experience, protected behind authentication
- `/dashboard` – customer portal for managing purchased micro-agents
- `/workbench` – split-pane workbench demo with streaming loaders and a command palette
- `/qa` – local quality gate dashboard for Core Web Vitals telemetry

## Install & Run

```bash
npm install
npm run dev
```

The dev server is available at `http://127.0.0.1:5170`, which works for local development. To test remote access flows, you can temporarily expose the app with a tunnel (for example `ngrok http 5170`) after allowlisting that hostname.

For production deployments, host the app on infrastructure you control behind a managed domain. Register that domain on the [domain allowlist page](https://platform.openai.com/settings/organization/security/domain-allowlist), add it to `frontend/vite.config.ts` under `server.allowedHosts`, and set the resulting key via `VITE_CHATKIT_API_DOMAIN_KEY`.

Need backend guidance? See the root README for FastAPI setup and domain allowlisting steps.

## Verify Changes

Run these commands locally before submitting changes:

```bash
npm run lint
npm run build
npm run restore:hero-media
npm run check:media
npm run test
```

`npm run restore:hero-media` rehydrates the hero video/poster/background bundle from commit `11a2b8a141b1a9df9f76efda544287ebf46b206e` without staging binaries so the media budget check can run locally.

Authentication calls hit `/api/auth/*` on the FastAPI backend and persist JWTs in `localStorage` under `microgen-auth-token`. Protected routes automatically redirect unauthenticated users to `/login`.

### Hero demo QA

- Scroll the landing page hero to confirm the device frame scrubs the demo while respecting the reduced-motion kill switch.
- Toggle `prefers-reduced-motion: reduce` (or add the `.motion-disabled` class) to verify the static poster + “Play demo” button appear.
- Measure performance with Lighthouse (Mobile • Simulated Slow 4G). Largest Contentful Paint should remain ≤ 2.5 s; see `frontend/docs/hero-performance.md` for the latest run notes.

### Workbench QA

- Visit `/workbench` and confirm the sidebar and detail panes show skeletons while their loaders stream.
- Open the command palette (`⌘K`/`Ctrl+K`) to run the refresh action, jump between tasks, and focus the ChatKit composer.
- Change a task’s status or add a note to observe optimistic updates while the deferred action completes.
- Trigger a `show_demo_widget` client tool (for example through the ChatKit Playground) and verify the payload renders inside the ChatKit overlay and the demo widget card. See `frontend/docs/workbench.md` for the full checklist.

### QA dashboard QA

- Visit `/qa` to confirm Core Web Vitals samples stream into the dashboard and that each budget badge transitions to “Passing” once metrics fall within thresholds (LCP ≤ 2.5 s, INP < 200 ms, CLS ≤ 0.1).
- Enable the reduced-motion kill switch (or set `prefers-reduced-motion: reduce`) to ensure scroll timelines pause while the dashboard continues to receive updates.
- Run `npm run test` to execute axe-core and motion regression coverage. Additional verification steps are documented in `frontend/docs/quality-gate.md`.
