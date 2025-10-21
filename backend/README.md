# ChatKit Python Backend

> For the steps to run both frontend and backend apps in this repo, please refer to the README.md at the top directory instead.

This FastAPI service wires up a minimal ChatKit server implementation with a single tool capable of recording short facts that users share in the conversation. Facts that are saved through the widget are exposed via the `/facts` REST endpoint so the frontend can render them alongside the chat experience.

## Features

- **ChatKit endpoint** at `POST /chatkit` that streams responses using the ChatKit protocol when the optional ChatKit Python package is installed.
- **Session token endpoints** at `POST /api/chatkit/session` and `POST /api/chatkit/refresh` to mint and rotate ChatKit client secrets for hosted API integrations.
- **Authentication APIs** under `/api/auth/*` for signup, login, password reset, OAuth callbacks, and retrieving the current user profile.
- **Micro-agent subscription APIs** under `/api/microagents/*` with Stripe checkout handling, listing, and cancellation.
- **Stripe webhook** at `POST /api/webhooks/stripe` that reconciles subscription lifecycle events with stored micro-agent records.
- **Neon-backed email queue** storing password reset notifications in the `outbound_emails` table for downstream delivery workers.
- **Vector store mapping** table (`user_vector_store`) tying each user to their personal OpenAI vector store so the agent can recall prior facts.
- **Fact recording tool** that renders a confirmation widget with _Save_ and _Discard_ actions.
- **Guardrail-ready system prompt** extracted into `app/constants.py` so it is easy to modify.
- **Simple fact store** backed by in-memory storage in `app/facts.py`.
- **REST helpers**
  - `GET  /facts` – list saved facts (used by the frontend list view)
  - `POST /facts/{fact_id}/save` – mark a fact as saved
  - `POST /facts/{fact_id}/discard` – discard a pending fact
  - `GET  /health` – surface a basic health indicator

## Configuration

Export these environment variables so the backend can reach OpenAI and your published workflow:

- `OPENAI_API_KEY` – standard OpenAI API key with access to the workflow and model you are using.
- `WORKFLOW_ID` – the workflow identifier from Agent Builder (`Publish` > `Workflow ID`). Required for the session and refresh endpoints.
- `WORKFLOW_VERSION` – optional override to pin the workflow to a specific deployed version.
- `DATABASE_URL` – Neon connection string (use the pooled variant for production).
- `JWT_SECRET` – symmetric signing key for JWTs.
- `SESSION_SECRET` – secret used by Starlette session middleware (falls back to `JWT_SECRET` when omitted).
- `STRIPE_SECRET_KEY` – Stripe API key for checkout and subscription management.
- `STRIPE_WEBHOOK_SECRET` – signing secret for the Stripe webhook endpoint.
- `STRIPE_CHECKOUT_SUCCESS_URL` / `STRIPE_CHECKOUT_CANCEL_URL` – URLs the user is sent to after checkout actions.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` – OAuth credentials for Google sign-in.
- `APPLE_CLIENT_ID` / `APPLE_CLIENT_SECRET` – Sign in with Apple credentials (client secret may be generated from your private key).
- `APP_BASE_URL` – Base URL for your deployed frontend (appended to CORS allowlist).
- `ALLOWED_ORIGIN_REGEX` – Optional regex to match additional deployment previews for CORS.
- `EMAIL_SENDER_NAME` / `EMAIL_SENDER_ADDRESS` – Optional metadata if you integrate a real mailer with the `outbound_emails` table (defaults to `Microagents` and `hi@cumulush.com`).
- `OPENAI_API_KEY` must be authorized for Vector Stores; each user gets a dedicated store referenced via Neon.

## Getting started

To enable the realtime assistant you need to install both the ChatKit Python package and the OpenAI SDK, then provide an `OPENAI_API_KEY` environment variable.

```bash
uv sync
export OPENAI_API_KEY=sk-proj-...
export WORKFLOW_ID=workflow_...
export DATABASE_URL=postgresql+asyncpg://...
export JWT_SECRET=super-secret-value
uv run uvicorn app.main:app --reload
```

### Database migrations

This project ships with Alembic. After installing dependencies, run migrations with:

```bash
alembic upgrade head
```

To create new migrations after updating ORM models:

```bash
alembic revision --autogenerate -m "describe change"
```

### Vector store workflow tips

- The `/api/chatkit/session` endpoint now ensures every authenticated user has a dedicated OpenAI Vector Store. The store identifier is persisted in the `user_vector_store` table and injected into ChatKit session `state_variables` as `vector_store_id` (alongside `user_id`).
- In Agent Builder, add matching state variables so workflow nodes (for example a File Search node) can reference `{{vector_store_id}}` and recall user memories.
- The `save_fact` tool persists each confirmed fact to both the in-memory fact store and the user’s vector store. Facts are stored as small JSON snippets, making them searchable during future conversations.
