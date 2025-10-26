Repository Guidelines
======================

Project Structure & Module Organization
---------------------------------------
- `frontend/`: Vite + React client; entry at `src/main.tsx`, UI in `components/`, shared helpers in `lib/`, reusable hooks in `hooks/`.
- `backend/`: FastAPI agent service; `app/main.py` wires routes, while `chat.py`, `facts.py`, and `memory_store.py` provide agent tools and storage helpers.
- `examples/`: reference applications—copy patterns from here instead of editing them directly.
- Place frontend tests beside components as `*.test.tsx`; backend tests live under `backend/tests/` when added.

Build, Test, and Development Commands
-------------------------------------
- `cd frontend && npm run dev`: start the client on http://127.0.0.1:5170 with hot reload.
- `cd frontend && npm run build && npm run preview`: produce and review a production bundle.
- `cd frontend && npm run lint`: run ESLint with React rules.
- `cd backend && uv sync`: install backend dependencies.
- `cd backend && uv run uvicorn app.main:app --reload --port 8000`: launch the API locally.
- `cd backend && uv run ruff check app`: lint Python modules; add `uv run mypy app` once `dev` extras are installed.

Coding Style & Naming Conventions
---------------------------------
- TypeScript: 2-space indentation, function components, descriptive filenames (e.g., `UserAvatar.tsx`), colocated styles.
- Python: 4-space indentation, snake_case functions, PascalCase classes, one responsibility per module.
- Keep imports sorted; Ruff enforces a 100-character limit and sorted imports (`ruff check`).

Testing Guidelines
------------------
- Frontend: use Vitest; colocate tests as `Component.test.tsx`. Run `cd frontend && npx vitest run` for CI-friendly output.
- Backend: add FastAPI/HTTPX tests under `backend/tests/` and execute with `cd backend && uv run pytest` when available.
- Stub external ChatKit calls with fixtures or MSW to keep tests deterministic.

Commit & Pull Request Guidelines
--------------------------------
- Write imperative commit titles (`Add widget toolbar`, `Fix fact ingestion`); reference issues with `fix:` prefixes or trailing `(#123)`.
- PRs should describe the problem, summarize the solution, attach test evidence (logs or screenshots), and flag configuration updates such as new env vars or Vite hosts.
- Request cross-stack review when touching both frontend and backend; keep scopes tight.

Security & Configuration Tips
-----------------------------
- Export `OPENAI_API_KEY` and `VITE_CHATKIT_API_DOMAIN_KEY` locally; rotate real values via your secret manager and exclude them from Git.
- Mirror deployed domains in `frontend/vite.config.ts` (`server.allowedHosts`) and in the OpenAI domain allowlist before shipping.
- Validate user-supplied tool payloads inside `backend/app/chat.py` before invoking external services.

Stack Auth Integration
----------------------
- Configure `STACK_PROJECT_ID` and `STACK_SECRET_KEY` for the FastAPI service; optional overrides include `STACK_API_BASE_URL` and `STACK_TIMEOUT_SECONDS`.
- Frontend clients should call `POST /api/auth/stack/exchange` with the Stack access/refresh tokens to receive the existing backend JWT (`access_token`, `token_type`, `expires_in`, and `user`).
- Cache the returned JWT on the client and attach `Authorization: Bearer <token>` when invoking `/chatkit` and `/api/chatkit/*` routes; refresh the JWT by re-posting to the exchange endpoint on 401s.
