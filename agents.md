# Repository Guidelines

## Project Structure & Module Organization
- `frontend/` houses the Vite + React client; start at `frontend/src/main.tsx`, with UI modules under `components/`, shared helpers in `lib/`, and reusable hooks in `hooks/`.
- `backend/` runs the FastAPI agent service; `app/main.py` wires routes, while `chat.py`, `facts.py`, and `memory_store.py` hold agent tools and storage helpers.
- `examples/` includes reference apps—copy patterns from here instead of modifying them directly.

## Build, Test, and Development Commands
- Frontend dev server: `cd frontend && npm run dev` (http://127.0.0.1:5170 with hot reload) and ship builds with `npm run build` followed by `npm run preview`.
- Frontend lint: `npm run lint` for ESLint + React rules.
- Backend dependencies: `cd backend && uv sync`; launch the API with `uv run uvicorn app.main:app --reload --port 8000` and guard quality via `uv run ruff check app` or `uv run mypy app` (install optional `dev` extras first).

## Coding Style & Naming Conventions
- TypeScript: 2-space indentation, function components, and descriptive filenames like `UserAvatar.tsx`; colocate component-specific styles.
- Python: 4-space indentation, snake_case for functions, PascalCase for classes, and short modules focused on a single responsibility.
- Run ESLint and Ruff before pushing; Ruff enforces sorted imports (`I`) and a 100-character limit.

## Testing Guidelines
- Place frontend unit tests next to source files as `*.test.ts(x)` and run `cd frontend && npx vitest run` for CI-friendly output.
- Stub ChatKit requests with fixtures or MSW to keep Vitest deterministic.
- Add backend FastAPI/HTTPX tests under `backend/tests/`; execute via `uv run pytest` once it is added as a dev dependency.

## Commit & Pull Request Guidelines
- Write concise, imperative commit titles (`Add widget toolbar`, `Fix fact ingestion`) as seen in history.
- Reference issues with `fix:` prefixes or trailing `(#123)` when closing tickets; use the body for rationale and follow-ups.
- PRs should explain the problem, summarize the solution, attach test evidence (logs or screenshots), and flag config updates such as new env vars or Vite hosts.
- Request cross-stack reviews when touching both frontend and backend; keep PRs narrowly scoped to ease review.

## Security & Configuration Tips
- Export `OPENAI_API_KEY` and `VITE_CHATKIT_API_DOMAIN_KEY` locally, rotate real values through your secret manager, and keep secrets out of Git-tracked files.
- Mirror deploy domains in `frontend/vite.config.ts` (`server.allowedHosts`) and the OpenAI domain allowlist before shipping.
- Validate user-supplied tool payloads inside `backend/app/chat.py` before invoking external services.
