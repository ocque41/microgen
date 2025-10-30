# Repository Guidelines

## Project Structure & Module Organization
- `frontend/`: Vite + React client. Entry at `src/main.tsx`; components live in `src/components/`, hooks in `src/hooks/`, shared helpers in `src/lib/`, and marketing sections such as the hero under `src/sections/`. Static assets sit in `public/`; production builds are emitted to `dist/`.
- `backend/`: FastAPI service rooted at `app/main.py`, with agents split across `app/chat.py`, `app/facts.py`, and `app/memory_store.py`. HTTP and agent tests live in `backend/tests/`.
- `examples/`: Add new usage samples rather than modifying the existing ones, and keep sensitive values out of version control.

## Build, Test, and Development Commands
- Frontend dev server: `cd frontend && npm run dev` (serves at http://127.0.0.1:5170).
- Frontend build and preview: `cd frontend && npm run build` then `npm run preview`.
- Frontend linting: `cd frontend && npm run lint`.
- Backend environment: `cd backend && uv sync` to install dependencies, then `uv run uvicorn app.main:app --reload --port 8000`.
- Backend quality checks: `cd backend && uv run ruff check app` and `uv run mypy app`.
- Tests: `cd frontend && npx vitest run`; `cd backend && uv run pytest` once test extras are installed.

## Coding Style & Naming Conventions
- TypeScript/React uses 2-space indentation, functional components, and descriptive filenames such as `UserAvatar.tsx`. Co-locate component-specific styles. ESLint + Prettier run via `npm run lint`.
- Python adopts 4-space indentation, snake_case for functions, PascalCase for classes, and a 100-character limit enforced by Ruff. Maintain full typing to keep mypy green.

## Testing Guidelines
- Frontend unit and snapshot tests live beside sources as `*.test.ts(x)` and rely on Vitest utilities in `frontend/src/test/`.
- Backend HTTP and agent tests live in `backend/tests/`. Stub external services (OpenAI, ChatKit) for deterministic runs. Name suites after the behavior under test (e.g., “should handle missing auth header”).

## Commit & Pull Request Guidelines
- Write commits in short, imperative form (`Add widget toolbar`). Reference issues with `fix: ...` or append `(#123)` when closing tickets.
- Pull requests should spell out the problem, summarize the solution, list test evidence (Vitest output, pytest logs), and mention config changes such as new env vars or Vite host updates. Request cross-stack review when touching both frontend and backend.

## Security & Configuration Tips
- Never commit secrets; set `OPENAI_API_KEY`, `VITE_CHATKIT_API_DOMAIN_KEY`, and similar values through local environment files or deployment platforms.
- Mirror deployment domains in `frontend/vite.config.ts` (`server.allowedHosts`) and the OpenAI allowlist before release.
- Validate user-provided tool payloads in `backend/app/chat.py` prior to dispatching external services to prevent unsafe executions.
