# Repository Guidelines

## Project Structure & Module Organization
The repository is split between a Vite + React client in `frontend/` and a FastAPI service in `backend/`. Start React work from `frontend/src/main.tsx`; UI modules live under `components/`, shared utilities in `lib/`, and hooks in `hooks/`. Backend routes are wired in `backend/app/main.py`, with supporting agents in `chat.py`, `facts.py`, and `memory_store.py`. Place new examples under `examples/` and avoid editing the existing samples directly.

## Build, Test, and Development Commands
Run the client locally with `cd frontend && npm run dev` (served at http://127.0.0.1:5170). Ship builds via `npm run build` followed by `npm run preview`. Install backend dependencies through `cd backend && uv sync`, then launch the API with `uv run uvicorn app.main:app --reload --port 8000`. Lint front-end code using `npm run lint`; check backend quality with `uv run ruff check app` and keep static typing healthy using `uv run mypy app` (include `dev` extras first).

## Coding Style & Naming Conventions
Use 2-space indentation for TypeScript, keep React components functional, and name files descriptively (for example, `UserAvatar.tsx`). Co-locate component-specific styling. Python modules follow 4-space indentation, snake_case functions, and PascalCase classes. Ruff enforces import sorting and a 100-character line limit—honor auto-fixes before committing. Prefer small, single-purpose modules.

## Testing Guidelines
Place front-end tests next to source files as `*.test.ts` or `*.test.tsx`, and run them with `cd frontend && npx vitest run` for CI-style output. Backend HTTP tests belong in `backend/tests/`; execute them via `uv run pytest` once the dev dependency is configured. Stub outbound services (ChatKit, OpenAI) with fixtures or MSW to keep suites deterministic.

## Commit & Pull Request Guidelines
Write concise, imperative commit titles such as `Add widget toolbar` or `Fix fact ingestion`. Reference issues with `fix:` prefixes or trailing `(#123)` when closing tickets. Each PR should explain the problem, summarize the solution, attach test evidence (logs, screenshots, or vitest output), and call out configuration changes like new env vars or Vite host entries. Request cross-stack review whenever a change spans frontend and backend code paths.

## Security & Configuration Tips
Keep secrets out of Git and export them locally (for example, `OPENAI_API_KEY` and `VITE_CHATKIT_API_DOMAIN_KEY`). Mirror deployment domains in `frontend/vite.config.ts` (`server.allowedHosts`) and the OpenAI domain allowlist before shipping. Validate any user-provided tool payloads in `backend/app/chat.py` before invoking external services.
