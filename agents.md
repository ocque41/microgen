# Repository Guidelines

## Project Structure & Module Organization
- `frontend/`: Vite + React client. Entry at `src/main.tsx`; UI lives in `src/components/`, hooks in `src/hooks/`, shared helpers in `src/lib/`, sections such as the hero in `src/sections/`, and tests beside sources as `*.test.ts(x)`. Static assets and generated builds are under `public/` and `dist/` respectively.
- `backend/`: FastAPI service rooted at `app/main.py` with supporting agents in `app/chat.py`, `app/facts.py`, and `app/memory_store.py`. HTTP tests belong in `tests/`.
- `examples/`: Add new usage samples here instead of editing existing ones. Avoid storing secrets in repo files.

## Build, Test, and Development Commands
- Frontend dev server: `cd frontend && npm run dev` (http://127.0.0.1:5170).
- Frontend build & preview: `npm run build` then `npm run preview` inside `frontend/`.
- Backend setup: `cd backend && uv sync` to install dependencies; run the API with `uv run uvicorn app.main:app --reload --port 8000`.
- Linting: `npm run lint` for the frontend; `uv run ruff check app` and `uv run mypy app` for backend style and typing.
- Tests: `cd frontend && npx vitest run` for CI output; `cd backend && uv run pytest` once test deps are installed.

## Coding Style & Naming Conventions
- TypeScript/React: 2-space indentation, functional components, descriptive filenames (e.g., `UserAvatar.tsx`). Co-locate component-specific styles. ESLint and Prettier run via `npm run lint`.
- Python: 4-space indentation, snake_case functions, PascalCase classes. Ruff enforces import sorting and a 100-character limit. Respect typing via mypy.
- Assets: keep SVG/PNG under `frontend/public/`; reference via `/asset-name` paths.

## Testing Guidelines
- Snapshot/unit tests live adjacent to sources (`Component.test.tsx`). Use Vitest utilities already configured in `src/test/`.
- Backend HTTP and agent tests go in `backend/tests/`. Stub outbound APIs (OpenAI, ChatKit) to keep runs deterministic.
- Name tests after behavior (“should handle missing auth header”) and ensure suites run clean before pushing.

## Commit & Pull Request Guidelines
- Commits use short, imperative titles (`Add widget toolbar`, `Fix fact ingestion`). Reference issues with `fix: ...` or append `(#123)` when closing tickets.
- Pull requests should describe the problem, summarize the solution, list test evidence (logs, vitest output, screenshots), and note config changes (env vars, Vite host updates). Request cross-stack review when changes span frontend and backend.

## Security & Configuration Tips
- Never commit secrets; set `OPENAI_API_KEY`, `VITE_CHATKIT_API_DOMAIN_KEY`, and similar values locally.
- Mirror deployment domains in `frontend/vite.config.ts` (`server.allowedHosts`) and the OpenAI domain allowlist before deploys.
- Validate user-provided tool payloads in `backend/app/chat.py` prior to invoking external services to avoid unsafe executions.

## Home page palette

| Token | Hex | Notes |
| ----- | --- | ----- |
| `Canvas` | `#090909` | Primary marketing background and mesh base. |
| `Surface` | `#242423` | Hero glass shells, core cards. |
| `Surface muted` | `#333533` | Secondary cards, placeholders. |
| `Surface glow` | `#3a7ca5` | Accent washes, hero glow, mesh highlights. |
| `Copy` | `#d9dcd6` | Headlines, navigation, iconography. |
| `Copy secondary` | `#c5c9c2` | Body copy, supporting UI text. |
| `Accent` | `#0091ad` | Primary CTAs, interactive links. |
| `Accent strong` | `color-mix(in srgb, #0091ad 78%, #22aecd 22%)` | Hover intensification, active states. |
| `Accent soft` | `color-mix(in srgb, #0091ad 20%, transparent)` | Pills, tinted fills. |
| `Border` | `#001427` | Card outlines, layout dividers. |
| `Border strong` | `color-mix(in srgb, #001427 65%, #ffffff 15%)` | High-contrast separators. |
| `Critical` | `#eb6424` | Error states, destructive confirmations. |
| `Positive` | `#9ceaef` | Success messaging. |
| `Warning` | `#fa9500` | Pending attention banners. |
| `Info` | `#1b9aaa` | Informational tags, secondary metrics. |
