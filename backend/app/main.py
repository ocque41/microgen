"""FastAPI entrypoint wiring the ChatKit server and REST endpoints."""

from __future__ import annotations

import asyncio
import logging
from typing import Any
from uuid import uuid4

from chatkit.server import StreamingResult
from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from openai import OpenAI, OpenAIError
from pydantic import AliasChoices, BaseModel, ConfigDict, Field
from starlette.responses import JSONResponse

from .chat import (
    FactAssistantServer,
    create_chatkit_server,
)
from .constants import WORKFLOW_ID, WORKFLOW_VERSION
from .facts import fact_store

app = FastAPI(title="ChatKit API")

# Allow production, preview, and local frontends to reach the API.
ALLOWED_ORIGINS = [
    "https://microagents.cumulush.com",
    "https://microgen.vercel.app",
    # Add preview deployments here if you test them, e.g.:
    # "https://microgen-git-main-<hash>-<team>.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
ALLOWED_ORIGIN_REGEX = r"https://microgen-git-[\w-]+-.*\.vercel\.app"

STREAMING_HEADERS = {
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
}

logger = logging.getLogger(__name__)
openai_client = OpenAI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    user_id: str | None = Field(
        default=None,
        validation_alias=AliasChoices("user_id", "userId", "user"),
        description="Application-scoped identifier for the end user.",
    )


class RefreshRequest(WorkflowOptions):
    session_id: str | None = Field(
        default=None,
        validation_alias=AliasChoices("session_id", "sessionId"),
        description="Existing session identifier to rotate before minting a new secret.",
    )
    user_id: str | None = Field(
        default=None,
        validation_alias=AliasChoices("user_id", "userId", "user"),
        description="Application-scoped identifier for the end user.",
    )


def _ensure_workflow_id(candidate: str | None) -> str:
    workflow_id = candidate or WORKFLOW_ID
    if not workflow_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "WORKFLOW_ID is not configured. Set the environment variable to the published "
                "Agent Builder workflow ID before creating ChatKit sessions."
            ),
        )
    return workflow_id


def _to_workflow_payload(options: WorkflowOptions) -> dict[str, Any]:
    workflow_id = _ensure_workflow_id(options.workflow_id)
    payload: dict[str, Any] = {"id": workflow_id}
    version = options.workflow_version or WORKFLOW_VERSION
    if version:
        payload["version"] = version
    if options.workflow_state:
        payload["state_variables"] = options.workflow_state
    return payload


def _resolve_user_id(user_id: str | None) -> str:
    return user_id or f"user_{uuid4().hex[:12]}"


async def _create_session(
    user_id: str,
    workflow: dict[str, Any],
) -> Any:
    def _call() -> Any:
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


@app.options("/chatkit")
async def chatkit_options() -> Response:
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/chatkit")
async def chatkit_endpoint(
    request: Request, server: FactAssistantServer = Depends(get_chatkit_server)
) -> Response:
    payload = await request.body()
    result = await server.process(payload, {"request": request})
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
async def create_chatkit_session(payload: SessionRequest) -> dict[str, Any]:
    workflow = _to_workflow_payload(payload)
    user_id = _resolve_user_id(payload.user_id)
    session = await _create_session(user_id, workflow)
    logger.info("Created ChatKit session %s for %s", session.id, session.user)
    return _session_payload(session)


@app.post("/api/chatkit/refresh")
async def refresh_chatkit_session(payload: RefreshRequest) -> dict[str, Any]:
    if payload.session_id:
        await _cancel_session(payload.session_id)
    workflow = _to_workflow_payload(payload)
    user_id = _resolve_user_id(payload.user_id)
    session = await _create_session(user_id, workflow)
    logger.info(
        "Refreshed ChatKit session %s for %s", session.id, session.user
    )
    return _session_payload(session)


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


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy"}
