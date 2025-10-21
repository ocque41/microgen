# Sprint 6 Plan

## Goal
Standardize the Microagents marketing and chat surfaces on Helvetica Neue while updating documentation and verifying quality gates.

## Work Items

1. **Enforce Helvetica Neue across marketing + chat**
   - *Acceptance Criteria*
     - Every font-family reference in marketing HTML, shared CSS tokens, and ChatKit theme uses "Helvetica Neue" without alternate named stacks.
     - Brand documentation and README reference the Helvetica Neue requirement, replacing prior serif/system stack guidance.
     - Frontend lint and build commands succeed after the typography update and the outcomes are noted here.
   - *Status*: ✅ Completed — Updated brand docs, marketing HTML/CSS, ChatKit theming, and example Tailwind configs to the Helvetica Neue stack, refreshed README guidance, and re-ran `npm --prefix frontend run lint` and `npm --prefix frontend run build`.

# Sprint 5 Plan

## Goal
Document the marketing font stack and ship an accessible theme toggle that defaults to the dark Microagents palette.

## Work Items

1. **Enable dark-first theming on the marketing site**
   - *Acceptance Criteria*
     - `site/index.html` exposes a keyboard-accessible theme toggle, persists the selection, and loads the dark palette by default.
     - CSS custom properties drive both dark and light palettes with WCAG AA contrast for text and interactive states.
     - The README marketing section notes the font stacks, dark-first behavior, and how to verify the toggle.
     - Frontend lint and build commands succeed after the update.
   - *Status*: ✅ Completed — Added the toggle with persistence, refreshed the CSS variables for both themes, documented fonts/dark mode in the README, and re-ran frontend lint/build.

# Sprint 4 Plan

## Goal
Remove binary marketing placeholders while keeping accessible, SEO-friendly stand-ins for the Microagents site.

## Work Items

1. **Swap binary placeholders for semantic fallbacks**
   - *Acceptance Criteria*
     - All JPEG placeholders under `site/assets/` are removed from version control without introducing new binary assets.
     - `site/index.html` renders hero and how-it-works visuals with CSS placeholders that expose informative `aria-label` text.
     - Documentation in `README.md` reflects the CSS-based placeholders and references the accessibility guidance that informs them.
     - Frontend lint and build commands succeed after the update.
   - *Status*: ✅ Completed — Removed the binary assets, refreshed the marketing markup to use CSS placeholders, updated the README, and re-ran lint/build.

# Sprint 2 Plan

## Goal
Implement the "Microagents" brand system across the static marketing surfaces and ensure documentation covers verification steps.

## Work Items

1. **Apply Microagents brand system to static marketing site**
   - *Acceptance Criteria*
     - A `site/brand.css` stylesheet defines the provided design tokens, base styles, and components and is imported by the static marketing entry points.
     - Marketing HTML (including `site/index.html` and `site/docs/index.html`) consumes the tokens for layout, updates imagery alt text for accessibility, and reflects the specified components such as buttons, cards, and footer.
     - ChatKit initialization uses theme options aligned with the brand tokens (dark scheme, accent color, radius, and font stack).
     - The project README documents how to preview the static marketing site and outlines the contrast/spacing verification performed.
   - *Status*: ✅ Completed — Added `site/brand.css`, wired marketing/docs pages, aligned ChatKit theme, and documented QA steps.

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
# Sprint 3 Plan

## Goal
Launch a minimal, formal marketing site for Microagents with SEO/SAO assets and crawler documentation as static files under `site/`.

## Work Items

1. **Ship the Microagents marketing microsite and crawler docs**
   - *Acceptance Criteria*
     - `site/index.html` implements the hero and how-it-works sections with the specified typography, spacing, and CTA behavior, includes structured data, and references locally hosted placeholder assets.
     - `site/docs/index.html`, `site/docs/ai.json`, `site/robots.txt`, and `site/sitemap.xml` exist with the required crawler guidance, rate-limit notes, and correct canonical links.
     - Placeholder image assets (`hero-placeholder.jpg`, `step1-placeholder.jpg`, `step2-placeholder.jpg`, `step3-placeholder.jpg`, and `og-image.jpg`) are present under `site/assets/` for future replacement and linked appropriately.
     - README documents how to view the static site and verify SEO artifacts; lint/build commands succeed locally and results are recorded.
   - *Status*: ✅ Completed — Marketing site, crawler docs, and placeholder imagery shipped with lint/build evidence recorded (CSS placeholders replaced the JPEGs in Sprint 4).

