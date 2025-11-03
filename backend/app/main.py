"""FastAPI entrypoint wiring the ChatKit server and REST endpoints."""

from __future__ import annotations

import asyncio
import logging
from typing import Any
from uuid import UUID, uuid4

import openai
from chatkit.server import StreamingResult
from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from openai import OpenAIError
from pydantic import AliasChoices, BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import JSONResponse

from .chat import (
    FactAssistantServer,
    create_chatkit_server,
)
from .clients import openai_client
from .config import get_settings
from .constants import WORKFLOW_ID, WORKFLOW_VERSION
from .database import get_session
from .dependencies import get_current_user
from .facts import fact_store
from .models import ChatTranscriptMessage, User
from .routes import auth as auth_routes
from .routes import microagents as microagent_routes
from .routes import rum as rum_routes
from .routes import webhooks as webhook_routes
from .schemas import ChatTranscriptMessageRead
from .vector_store import get_or_create_user_vector_store

settings = get_settings()

app = FastAPI(title="ChatKit API")

def _dedupe(items: list[str]) -> list[str]:
    return list(dict.fromkeys(items))


def _build_allowed_origins() -> list[str]:
    defaults = [
        "https://microagents.cumulush.com",
        "https://microgen.vercel.app",
        # Add preview deployments here if you test them, e.g.:
        # "https://microgen-git-main-<hash>-<team>.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    env_overrides = [origin for origin in settings.allowed_origins if origin]
    origins = env_overrides if env_overrides else defaults
    if settings.app_base_url:
        origins.append(settings.app_base_url)
    return _dedupe(origins)


ALLOWED_ORIGINS = _build_allowed_origins()

ALLOWED_ORIGIN_REGEX = (
    settings.allowed_origin_regex
    or r"https://microgen-git-[\w-]+-.*\.vercel\.app"
)

EXPOSED_HEADERS = ["set-cookie", "content-type"]

STREAMING_HEADERS = {
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
}

logger = logging.getLogger(__name__)

# plan-step[1]: ensure session data is set up before wrapping everything with CORS.
app.add_middleware(SessionMiddleware, secret_key=settings.session_secret)

# plan-step[1]: place CORSMiddleware last so it executes first and handles preflights.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=EXPOSED_HEADERS,
    max_age=86400,
)

app.include_router(auth_routes.router)
app.include_router(microagent_routes.router)
app.include_router(rum_routes.router)
app.include_router(webhook_routes.router)


@app.on_event("startup")
async def _verify_stack_auth_configuration() -> None:
    """Fail fast when the Stack exchange cannot possibly succeed."""

    # plan-step[2]: Guard against deployments that omit Stack credentials.
    if not settings.stack_project_id or not settings.stack_secret_key:
        logger.error(
            "Stack Auth credentials are missing; set STACK_PROJECT_ID and "
            "STACK_SECRET_KEY before deployment."
        )
        raise RuntimeError(
            "Stack Auth credentials are required to service /api/auth/stack/exchange requests."
        )

    openai_version = getattr(openai, "__version__", "unknown")
    logger.info(
        "plan-step[3]: OpenAI SDK version %s loaded for ChatKit vector store operations",
        openai_version,
    )

    if WORKFLOW_ID:
        logger.info(
            "ChatKit workflow configured",
            extra={
                "workflow_id": WORKFLOW_ID,
                "workflow_version": WORKFLOW_VERSION,
            },
        )
    else:
        logger.error(
            "ChatKit workflow ID missing; set OPENAI_WORKFLOW_ID before serving chat endpoints"
        )


class WorkflowOptions(BaseModel):
    """Options that influence which workflow powers the ChatKit session."""

    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    workflow_id: str | None = Field(
        default=None,
        validation_alias=AliasChoices("workflow_id", "workflowId"),
        description="Override the default workflow identifier published from Agent Builder.",
    )
    workflow_version: str | None = Field(
        default=None,
        validation_alias=AliasChoices("workflow_version", "workflowVersion"),
        description="Optional workflow version identifier.",
    )
    workflow_state: dict[str, str | bool | int | float] | None = Field(
        default=None,
        validation_alias=AliasChoices("workflow_state", "state_variables", "stateVariables"),
        description="Key-value state variables forwarded to the workflow run.",
    )


class SessionRequest(WorkflowOptions):
    """Request payload for creating a ChatKit session."""

    pass


class RefreshRequest(WorkflowOptions):
    session_id: str | None = Field(
        default=None,
        validation_alias=AliasChoices("session_id", "sessionId"),
        description="Existing session identifier to rotate before minting a new secret.",
    )


def _ensure_workflow_id(candidate: str | None) -> str:
    configured = WORKFLOW_ID
    if configured:
        if candidate and candidate != configured:
            logger.warning(
                "Ignoring workflow override in request; enforcing configured workflow",
                extra={"requested_workflow_id": candidate, "configured_workflow_id": configured},
            )
        workflow_id = configured
    else:
        workflow_id = candidate
    if not workflow_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "WORKFLOW_ID is not configured. Set the environment variable to the published "
                "Agent Builder workflow ID before creating ChatKit sessions."
            ),
        )
    return workflow_id


def _to_workflow_payload(
    options: WorkflowOptions,
    *,
    extra_state: dict[str, Any] | None = None,
) -> dict[str, Any]:
    workflow_id = _ensure_workflow_id(options.workflow_id)
    payload: dict[str, Any] = {"id": workflow_id}
    version = options.workflow_version or WORKFLOW_VERSION
    if version:
        payload["version"] = version
    state_variables: dict[str, Any] = {}
    if options.workflow_state:
        state_variables.update(options.workflow_state)
    if extra_state:
        state_variables.update(extra_state)
    if state_variables:
        payload["state_variables"] = state_variables
    return payload


def _resolve_user_id(user_id: str | UUID | None) -> str:
    if isinstance(user_id, UUID):
        return str(user_id)
    if user_id:
        return str(user_id)
    return f"user_{uuid4().hex[:12]}"


async def _create_session(
    user_id: str,
    workflow: dict[str, Any],
) -> Any:
    def _call() -> Any:
        logger.info(
            "Creating ChatKit session",
            extra={
                "workflow_id": workflow.get("id"),
                "workflow_version": workflow.get("version"),
                "user_id": user_id,
            },
        )
        return openai_client.beta.chatkit.sessions.create(
            user=user_id,
            workflow=workflow,
        )

    try:
        return await asyncio.to_thread(_call)
    except OpenAIError as exc:  # pragma: no cover - network failure path
        logger.exception("Failed to create ChatKit session")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to create ChatKit session.",
        ) from exc


async def _cancel_session(session_id: str) -> None:
    def _call() -> None:
        openai_client.beta.chatkit.sessions.cancel(session_id)

    try:
        await asyncio.to_thread(_call)
    except OpenAIError as exc:  # pragma: no cover - best-effort cleanup
        logger.warning("Failed to cancel ChatKit session %s", session_id, exc_info=exc)

_chatkit_server: FactAssistantServer | None = create_chatkit_server()


def get_chatkit_server() -> FactAssistantServer:
    if _chatkit_server is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "ChatKit dependencies are missing. Install the ChatKit Python "
                "package to enable the conversational endpoint."
            ),
        )
    return _chatkit_server


@app.post("/chatkit")
async def chatkit_endpoint(
    request: Request,
    server: FactAssistantServer = Depends(get_chatkit_server),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> Response:
    payload = await request.body()
    # plan-step[2]: guarantee each user has a vector store record before
    # delegating to the ChatKit server, preventing missing-table lookups and
    # ensuring new users get provisioned automatically.
    vector_store_id = await get_or_create_user_vector_store(db, current_user.id)
    logger.info(
        "Processing ChatKit payload",
        extra={
            "user_id": str(current_user.id),
            "vector_store_id": vector_store_id,
            "payload_bytes": len(payload),
        },
    )
    result = await server.process(
        payload,
        {
            "request": request,
            "user": current_user,
            "vector_store_id": vector_store_id,
            "workflow_id": _ensure_workflow_id(None),
        },
    )
    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream", headers=STREAMING_HEADERS)
    if hasattr(result, "json"):
        return Response(content=result.json, media_type="application/json")
    return JSONResponse(result)
def _session_payload(session: Any) -> dict[str, Any]:
    return {
        "client_secret": session.client_secret,
        "session_id": session.id,
        "expires_at": session.expires_at,
        "status": session.status,
        "user": session.user,
        "max_requests_per_1_minute": getattr(session, "max_requests_per_1_minute", None),
    }


@app.post("/api/chatkit/session")
async def create_chatkit_session(
    payload: SessionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> dict[str, Any]:
    vector_store_id = await get_or_create_user_vector_store(db, current_user.id)
    workflow = _to_workflow_payload(
        payload,
        extra_state={
            "vector_store_id": vector_store_id,
            "user_id": str(current_user.id),
        },
    )
    user_id = _resolve_user_id(current_user.id)
    session = await _create_session(user_id, workflow)
    logger.info("Created ChatKit session %s for %s", session.id, session.user)
    return _session_payload(session)


@app.post("/api/chatkit/refresh")
async def refresh_chatkit_session(
    payload: RefreshRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> dict[str, Any]:
    if payload.session_id:
        await _cancel_session(payload.session_id)
    vector_store_id = await get_or_create_user_vector_store(db, current_user.id)
    workflow = _to_workflow_payload(
        payload,
        extra_state={
            "vector_store_id": vector_store_id,
            "user_id": str(current_user.id),
        },
    )
    user_id = _resolve_user_id(current_user.id)
    session = await _create_session(user_id, workflow)
    logger.info(
        "Refreshed ChatKit session %s for %s", session.id, session.user
    )
    return _session_payload(session)


@app.get("/api/chatkit/transcript", response_model=list[ChatTranscriptMessageRead])
async def list_chat_transcript(
    thread_id: str | None = None,
    limit: int = 200,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
) -> list[ChatTranscriptMessageRead]:
    capped_limit = max(1, min(limit, 500))
    stmt = select(ChatTranscriptMessage).where(ChatTranscriptMessage.user_id == current_user.id)
    if thread_id:
        stmt = stmt.where(ChatTranscriptMessage.thread_id == thread_id)
    stmt = stmt.order_by(ChatTranscriptMessage.created_at.desc()).limit(capped_limit)
    result = await db.execute(stmt)
    records = result.scalars().all()
    # plan-step[3]: expose an audit-friendly transcript surface in chronological order.
    return [
        ChatTranscriptMessageRead.model_validate(record)
        for record in reversed(records)
    ]


@app.get("/facts")
async def list_facts() -> dict[str, Any]:
    facts = await fact_store.list_saved()
    return {"facts": [fact.as_dict() for fact in facts]}


@app.post("/facts/{fact_id}/save")
async def save_fact(fact_id: str) -> dict[str, Any]:
    fact = await fact_store.mark_saved(fact_id)
    if fact is None:
        raise HTTPException(status_code=404, detail="Fact not found")
    return {"fact": fact.as_dict()}


@app.post("/facts/{fact_id}/discard")
async def discard_fact(fact_id: str) -> dict[str, Any]:
    fact = await fact_store.discard(fact_id)
    if fact is None:
        raise HTTPException(status_code=404, detail="Fact not found")
    return {"fact": fact.as_dict()}


@app.get("/", include_in_schema=False)
async def root() -> dict[str, str]:
    """Lightweight health probe for Render and other uptime checks."""

    return {"status": "ok"}


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy"}
