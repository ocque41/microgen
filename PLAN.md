# Sprint 1 Plan

## Goal
Expand the Vite + React frontend to support marketing, authentication, chat, and dashboard flows with protected routing while preserving existing ChatKit integration.

## Work Items

1. **Routing & App Structure Refresh**
   - *Acceptance Criteria*
     - `src/main.tsx` uses `BrowserRouter` with routes for marketing, auth, chat, and dashboard pages.
     - Existing ChatKit configuration and theming utilities remain functional within the new routing structure.
   - *Status*: ✅ Completed — BrowserRouter wraps the app, and ChatKitPanel still receives theme handlers via `ChatPage`.

2. **Marketing & Auth Pages**
   - *Acceptance Criteria*
     - New marketing, login, signup, and forgot-password pages render responsive layouts with forms wired to API endpoints.
     - Auth flows show validation feedback and placeholder OAuth triggers for Google and Apple providers.
   - *Status*: ✅ Completed — Marketing hero plus all auth forms target `/api/auth/*`, handle errors, and expose OAuth buttons.

3. **Chat & Dashboard Experiences**
   - *Acceptance Criteria*
     - Chat route renders the existing `ChatKitPanel` experience without regressions.
     - Dashboard route fetches micro-agent data and exposes rename and cancel actions against `/api/microagents/me` endpoints.
   - *Status*: ✅ Completed — Chat route focuses on `ChatKitPanel`; dashboard integrates fetch, rename, and cancel workflows.

4. **Authentication Context & Route Protection**
   - *Acceptance Criteria*
     - Auth state persists JWT tokens in `localStorage` and exposes login/logout helpers.
     - Protected routes redirect unauthenticated users from chat and dashboard flows to the login page.
   - *Status*: ✅ Completed — `AuthContext` stores JWTs in `localStorage`, while `ProtectedRoute` enforces redirects.

5. **Documentation & Quality Gates**
   - *Acceptance Criteria*
     - Frontend README documents new routes plus run/verify instructions for auth-protected pages.
     - `npm run build` and `npm run lint` succeed locally before shipping.
   - *Status*: ✅ Completed — README lists routing updates and verification steps; lint/build run clean locally.
