# OpenAI ChatKit Advanced Samples

This repository contains a few advanced examples, which serve a complete [ChatKit](https://github.com/openai/chatkit-js) playground that pairs a FastAPI backend with a Vite + React frontend.

The top-level [**backend**](backend) and [**frontend**](frontend) directories provide a basic project template that demonstrates ChatKit UI, widgets, and client tools.

- It runs a custom ChatKit server built with [ChatKit Python SDK](https://github.com/openai/chatkit-python) and [OpenAI Agents SDK for Python](https://github.com/openai/openai-agents-python).
- Available agent tools: `get_weather` for rendering a widget, `switch_theme` and `record_fact` as client tools

The Vite server proxies all `/chatkit` traffic straight to the local FastAPI service so you can develop the client and server in tandem without extra wiring.

## Quickstart

1. Start FastAPI backend API.
2. Configure the frontend's domain key and launch the Vite app.
3. Explore the demo flow.

Each step is detailed below.

### 1. Start FastAPI backend API

From the repository root you can bootstrap the backend in one step:

```bash
npm run backend
```

This command runs `uv sync` for `backend/` and launches Uvicorn on `http://127.0.0.1:8000`. Make sure [uv](https://docs.astral.sh/uv/getting-started/installation/) is installed and the following environment variables are exported beforehand: `OPENAI_API_KEY`, `WORKFLOW_ID`, `DATABASE_URL`, and `JWT_SECRET`. Configure optional secrets like Stripe and OAuth credentials as needed.

If you prefer running the backend from inside `backend/`, follow the manual steps:

```bash
cd backend
uv sync
export OPENAI_API_KEY=sk-proj-...
export WORKFLOW_ID=workflow_...
export DATABASE_URL=postgresql+asyncpg://...
export JWT_SECRET=super-secret-value
uv run uvicorn app.main:app --reload --port 8000
```

If you don't have uv, you can do the same with:

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e .
export OPENAI_API_KEY=sk-proj-...
export WORKFLOW_ID=workflow_...
export DATABASE_URL=postgresql+asyncpg://...
export JWT_SECRET=super-secret-value
uvicorn app.main:app --reload
```

The development API listens on `http://127.0.0.1:8000`.

### 2. Run Vite + React frontend

From the repository root you can start the frontend directly:

```bash
npm run frontend
```

This script launches Vite on `http://127.0.0.1:5170`.

To configure and run the frontend manually:

```bash
cd frontend
npm install
npm run dev
```

Optional configuration hooks live in [`frontend/src/lib/config.ts`](frontend/src/lib/config.ts) if you want to tweak API URLs or UI defaults.

To launch both the backend and frontend together from the repository root, you can use `npm start`. This command also requires `uv` plus the necessary environment variables (for example `OPENAI_API_KEY`, `WORKFLOW_ID`, `DATABASE_URL`, and `JWT_SECRET`) to be set beforehand.

The Vite dev server runs at `http://127.0.0.1:5170`, and this works fine for local development. However, for production deployments:

1. Host the frontend on infrastructure you control behind a managed domain.
2. Register that domain on the [domain allowlist page](https://platform.openai.com/settings/organization/security/domain-allowlist) and add it to [`frontend/vite.config.ts`](frontend/vite.config.ts) under `server.allowedHosts`.
3. Set `VITE_CHATKIT_API_DOMAIN_KEY` to the value returned by the allowlist page.

If you want to verify this remote access during development, temporarily expose the app with a tunnel (e.g. `ngrok http 5170` or `cloudflared tunnel --url http://localhost:5170`) and add that hostname to your domain allowlist before testing.

### 3. Explore the demo flow

With the app reachable locally or via a tunnel, open it in the browser and try a few interactions. The sample ChatKit UI ships with three tools that trigger visible actions in the pane:

1. **Fact Recording** - prompt: `My name is Kaz`
2. **Weather Info** - prompt: `What's the weather in San Francisco today?`
3. **Theme Switcher** - prompt: `Change the theme to dark mode` 

### Authentication & subscriptions

The backend now includes production-ready scaffolding for user management and Stripe billing:

- `POST /api/auth/signup` and `POST /api/auth/login` return JWTs for new and existing users.
- `POST /api/auth/forgot-password` and `POST /api/auth/reset-password` power password recovery flows.
- OAuth routes under `/api/auth/oauth/{provider}` support Google and Apple sign-in once credentials are configured.
- `POST /api/microagents/subscribe` mints a Stripe Checkout session for the selected micro-agent, while `GET /api/microagents/me` lists active subscriptions and `POST /api/microagents/{id}/cancel` stops billing.
- Stripe events sent to `POST /api/webhooks/stripe` keep micro-agent status in sync after successful payments or cancellations.
- Password reset emails are queued in the Neon-backed `outbound_emails` table so you can plug in your delivery worker or inspect messages during development (defaults use the `Microagents` sender name and `hi@cumulush.com`).
- Each user is assigned their own OpenAI vector store (tracked in Neon) so the agent can stash and recall durable facts during future sessions.
- In Agent Builder, declare `vector_store_id` and `user_id` as workflow state variables and point File Search (or custom nodes) to `{{vector_store_id}}` so saved facts are retrieved automatically.

Run `alembic upgrade head` after configuring `DATABASE_URL` so the new tables (users, password reset tokens, micro agents) are available before serving requests.

## What's next

Under the [`examples`](examples) directory, you'll find three more sample apps that ground the starter kit in real-world scenarios:

1. [**Customer Support**](examples/customer-support): airline customer support workflow.
2. [**Knowledge Assistant**](examples/knowledge-assistant): knowledge-base agent backed by OpenAI's File Search tool.
3. [**Marketing Assets**](examples/marketing-assets): marketing creative workflow.

Each example under [`examples/`](examples) includes the helper scripts (`npm start`, `npm run frontend`, `npm run backend`) pre-configured with its dedicated ports, so you can `cd` into an example and run `npm start` to boot its backend and frontend together. Please note that when you run `npm start`, `uv` must already be installed and all required environment variables should be exported.
