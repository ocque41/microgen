"""FastAPI entrypoint wiring the ChatKit server and REST endpoints."""

from __future__ import annotations

from typing import Any

from chatkit.server import StreamingResult
from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from starlette.responses import JSONResponse

from .chat import (
    FactAssistantServer,
    create_chatkit_server,
)
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    request: Request, server: FactAssistantServer = Depends(get_chatkit_server)
) -> Response:
    payload = await request.body()
    result = await server.process(payload, {"request": request})
    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream")
    if hasattr(result, "json"):
        return Response(content=result.json, media_type="application/json")
    return JSONResponse(result)


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
