"""ChatKit server that proxies requests to an OpenAI workflow."""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime
from typing import Any, AsyncIterator
from uuid import uuid4

from chatkit.server import ChatKitServer
from chatkit.types import (
    AssistantMessageContent,
    AssistantMessageItem,
    ErrorEvent,
    ThreadItemAddedEvent,
    ThreadItemDoneEvent,
    ThreadMetadata,
    ThreadStreamEvent,
    UserMessageItem,
)
from openai import OpenAIError

from .clients import openai_client
from .memory_store import MemoryStore

logger = logging.getLogger(__name__)


def _gen_id(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex[:8]}"


def _extract_text(parts: Any) -> str:
    """Coerce a list of ChatKit content parts into plain text."""

    chunks: list[str] = []
    for part in parts or []:
        text = getattr(part, "text", None)
        if isinstance(text, str) and text.strip():
            chunks.append(text.strip())
            continue
        if hasattr(part, "model_dump"):
            payload = part.model_dump()
        elif isinstance(part, dict):
            payload = part
        else:
            payload = {}
        for key in ("text", "value", "output_text", "input_text"):
            candidate = payload.get(key)
            if isinstance(candidate, str) and candidate.strip():
                chunks.append(candidate.strip())
                break
    return " ".join(chunks).strip()


async def _load_thread_messages(
    store: MemoryStore,
    thread_id: str,
    context: dict[str, Any],
) -> list[dict[str, Any]]:
    """Return conversation history formatted for the Responses API."""

    history: list[dict[str, Any]] = []
    try:
        items = await store.load_thread_items(thread_id, after=None, limit=250, order="asc", context=context)
    except Exception:  # pragma: no cover - defensive guard against store failure
        logger.exception("Failed to load thread history", extra={"thread_id": thread_id})
        return history

    for item in items.data:
        role: str | None = None
        text = ""
        if isinstance(item, UserMessageItem):
            role = "user"
            text = _extract_text(item.content)
        elif getattr(item, "type", None) == "assistant_message":
            role = "assistant"
            text = _extract_text(getattr(item, "content", []))

        if role and text:
            history.append(
                {
                    "role": role,
                    "content": [
                        {
                            "type": "input_text" if role == "user" else "output_text",
                            "text": text,
                        }
                    ],
                }
            )
    return history


def _extract_output_text(result: Any) -> str:
    """Best-effort extraction of assistant text from a workflow run response."""

    def _as_dict(value: Any) -> dict[str, Any]:
        if value is None:
            return {}
        if hasattr(value, "model_dump"):
            return value.model_dump()
        if hasattr(value, "dict") and callable(value.dict):
            return value.dict()
        if isinstance(value, dict):
            return value
        return {}

    payload = _as_dict(result)
    output_candidates: list[str] = []

    for key in ("output", "outputs", "response", "responses"):
        data = payload.get(key)
        if not data:
            continue

        items = data if isinstance(data, list) else [data]
        for entry in items:
            entry_dict = _as_dict(entry)
            role = entry_dict.get("role")
            if role and role != "assistant":
                continue
            content = entry_dict.get("content")
            if isinstance(content, list):
                output_text = _extract_text(content)
                if output_text:
                    output_candidates.append(output_text)
            elif isinstance(content, str) and content.strip():
                output_candidates.append(content.strip())
            text_value = entry_dict.get("text")
            if isinstance(text_value, str) and text_value.strip():
                output_candidates.append(text_value.strip())

    if not output_candidates:
        message = payload.get("message") or payload.get("error")
        if isinstance(message, str):
            logger.warning("Workflow run returned no assistant text", extra={"message": message})
        return ""

    return "\n\n".join(dict.fromkeys(output_candidates))


async def _invoke_workflow(
    *,
    workflow_id: str,
    workflow_version: str | None,
    messages: list[dict[str, Any]],
    vector_store_id: str | None,
    user_id: str | None,
    thread_id: str,
) -> Any:
    body: dict[str, Any] = {"input": {"messages": messages, "thread_id": thread_id}}
    if workflow_version:
        body["version"] = workflow_version
        body["input"]["workflow_version"] = workflow_version
    if vector_store_id:
        body["input"]["vector_store_id"] = vector_store_id
    if user_id:
        body["input"]["user_id"] = user_id

    path = f"/workflows/{workflow_id}/runs"

    def _call() -> Any:
        return openai_client.post(path, body=body)

    return await asyncio.to_thread(_call)


class FactAssistantServer(ChatKitServer[dict[str, Any]]):
    """ChatKit server that forwards requests to an Agent Builder workflow."""

    def __init__(self) -> None:
        self.store = MemoryStore()
        super().__init__(self.store)

    async def respond(
        self,
        thread: ThreadMetadata,
        input_user_message: UserMessageItem | None,
        context: dict[str, Any],
    ) -> AsyncIterator[ThreadStreamEvent]:
        workflow_id = context.get("workflow_id")
        workflow_version = context.get("workflow_version")
        vector_store_id = context.get("vector_store_id")
        user = context.get("user")

        if not workflow_id:
            logger.error("Workflow ID missing from context; cannot process request")
            yield ErrorEvent(message="Chat workflow is not configured.", allow_retry=False)
            return

        messages = await _load_thread_messages(self.store, thread.id, context)

        # Ensure the current user message is included even if the store has not yet persisted it.
        if input_user_message is not None:
            text = _extract_text(input_user_message.content)
            if text:
                if not messages or messages[-1]["role"] != "user" or messages[-1]["content"][0]["text"] != text:
                    messages.append(
                        {
                            "role": "user",
                            "content": [{"type": "input_text", "text": text}],
                        }
                    )

        try:
            result = await _invoke_workflow(
                workflow_id=workflow_id,
                workflow_version=workflow_version,
                messages=messages,
                vector_store_id=vector_store_id,
                user_id=str(getattr(user, "id", "")) or None,
                thread_id=thread.id,
            )
        except OpenAIError:  # pragma: no cover - network/HTTP errors
            logger.exception("Workflow execution failed")
            yield ErrorEvent(message="Assistant is temporarily unavailable.", allow_retry=True)
            return
        except Exception:  # pragma: no cover - unexpected client errors
            logger.exception("Unexpected error running workflow")
            yield ErrorEvent(message="Unexpected assistant error.", allow_retry=True)
            return

        response_text = _extract_output_text(result)
        logger.info(
            "Workflow run completed",
            extra={
                "workflow_id": workflow_id,
                "workflow_version": workflow_version,
                "thread_id": thread.id,
                "has_text": bool(response_text),
            },
        )
        if not response_text:
            yield ErrorEvent(message="Assistant returned an empty response.", allow_retry=True)
            return

        assistant_item = AssistantMessageItem(
            id=_gen_id("msg"),
            thread_id=thread.id,
            created_at=datetime.utcnow(),
            content=[AssistantMessageContent(text=response_text)],
        )

        await self.store.add_thread_item(thread.id, assistant_item, context)

        yield ThreadItemAddedEvent(item=assistant_item)
        yield ThreadItemDoneEvent(item=assistant_item)


def create_chatkit_server() -> FactAssistantServer | None:
    """Return a configured ChatKit server instance if dependencies are available."""

    return FactAssistantServer()
