# Repository Guidelines

## Project Structure & Module Organization
- `frontend/` contains the Vite + React client. Entry is `src/main.tsx`; UI lives in `src/components/`, hooks under `src/hooks/`, shared utilities in `src/lib/`, and marketing sections in `src/sections/`. Static assets belong in `public/`; build artifacts land in `dist/`.
- `backend/` hosts the FastAPI service. HTTP endpoints start at `app/main.py`, with agent logic in `app/chat.py`, `app/facts.py`, and `app/memory_store.py`. Tests reside in `backend/tests/`.
- `examples/` stores runnable usage samples—add new files instead of editing existing ones.

## Build, Test, and Development Commands
- Frontend dev server: `cd frontend && npm run dev` (served at http://127.0.0.1:5170).
- Frontend production flow: `cd frontend && npm run build` then `npm run preview` to verify the bundle.
- Frontend linting: `cd frontend && npm run lint` (ESLint + Prettier).
- Backend environment: `cd backend && uv sync` followed by `uv run uvicorn app.main:app --reload --port 8000`.
- Backend quality checks: `cd backend && uv run ruff check app` and `uv run mypy app`.
- Test suites: `cd frontend && npx vitest run`; `cd backend && uv run pytest`.

## Coding Style & Naming Conventions
- TypeScript uses 2-space indentation, functional components, and descriptive filenames (e.g., `UserAvatar.tsx`). Co-locate component styles. Formatting runs through `npm run lint`.
- Python code uses 4-space indentation, snake_case functions, PascalCase classes, and a 100-character line cap enforced by Ruff. Keep full typing to satisfy mypy.

## Testing Guidelines
- Frontend unit and snapshot tests live alongside sources as `*.test.ts(x)` and rely on helpers from `frontend/src/test/`.
- Backend tests live in `backend/tests/`; stub OpenAI and ChatKit calls for predictable results. Name suites by behavior (“should handle missing auth header”).
- Aim to touch both frontend and backend suites whenever changes cross the stack; capture command output in pull requests.

## Commit & Pull Request Guidelines
- Write commits in short, imperative form (`Add widget toolbar`). Reference issues with `fix: ...` or append `(#123)` when closing tickets.
- Pull requests should describe the problem, summarize the solution, attach test evidence (Vitest, pytest, lint), and flag config shifts (new env vars, Vite host changes). Request cross-stack review when modifying both service layers.

## Security & Configuration Tips
- Never commit secrets; load values like `OPENAI_API_KEY` or `VITE_CHATKIT_API_DOMAIN_KEY` from environment files or deployment settings.
- Keep deployment domains mirrored in `frontend/vite.config.ts` (`server.allowedHosts`) and the OpenAI allowlist.
- Validate user-provided tool payloads in `backend/app/chat.py` before invoking external services to avoid unsafe execution.
