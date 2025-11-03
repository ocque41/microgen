"""Helpers for managing user-specific vector stores in OpenAI."""

from __future__ import annotations

import asyncio
import json
import logging
from functools import lru_cache
from io import BytesIO
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .clients import openai_client
from .database import SessionLocal
from .models import ChatTranscriptMessage, UserVectorStore

logger = logging.getLogger(__name__)


class _VectorStoreClients(tuple[Any, Any, str]):
    __slots__ = ()


@lru_cache(maxsize=1)
def _resolve_vector_store_clients() -> _VectorStoreClients:
    vector_store_surface = "top_level"
    vector_store_client = getattr(openai_client, "vector_stores", None)
    if vector_store_client is None:
        beta_client = getattr(openai_client, "beta", None)
        if beta_client is not None:
            vector_store_client = getattr(beta_client, "vector_stores", None)
            vector_store_surface = "beta"
    if vector_store_client is None:
        raise RuntimeError(
            "OpenAI SDK does not expose vector store APIs; pin openai>=1.66.0 or adjust the integration."
        )
    files_client = getattr(vector_store_client, "files", None)
    if files_client is None:
        raise RuntimeError("OpenAI SDK vector store client is missing the files sub-resource.")
    logger.info(
        "Detected OpenAI vector store surface",
        extra={"vector_store_surface": vector_store_surface},
    )
    return _VectorStoreClients((vector_store_client, files_client, vector_store_surface))


async def _create_vector_store(name: str) -> str:
    def _call() -> str:
        vector_store_client, _, _ = _resolve_vector_store_clients()
        store = vector_store_client.create(name=name)
        return store.id

    return await asyncio.to_thread(_call)


async def _upload_fact(vector_store_id: str, content: str, metadata: dict[str, Any]) -> None:
    filename = f"memory-{uuid4().hex}.json"
    file_bytes = content.encode("utf-8")

    def _create_and_attach() -> None:
        _, files_client, _ = _resolve_vector_store_clients()
        file = openai_client.files.create(
            file=(filename, BytesIO(file_bytes)),
            purpose="assistants",
        )
        try:
            files_client.create(
                vector_store_id=vector_store_id,
                file_id=file.id,
                metadata=metadata,
            )
        except TypeError:
            files_client.create(
                vector_store_id=vector_store_id,
                file_id=file.id,
            )

    await asyncio.to_thread(_create_and_attach)


async def get_or_create_user_vector_store(
    session: AsyncSession,
    user_id: UUID,
) -> str:
    record = await session.get(UserVectorStore, user_id)
    if record is not None:
        return record.vector_store_id

    vector_store_id = await _create_vector_store(name=f"user-{user_id}-memory")
    record = UserVectorStore(user_id=user_id, vector_store_id=vector_store_id)
    session.add(record)
    await session.commit()
    return vector_store_id


async def get_user_vector_store_id(user_id: UUID) -> str | None:
    async with SessionLocal() as session:
        record = await session.get(UserVectorStore, user_id)
        return record.vector_store_id if record else None


async def append_fact_for_user(
    user_id: UUID,
    fact_text: str,
    metadata: dict[str, Any] | None = None,
    *,
    payload_key: str = "fact",
) -> None:
    async with SessionLocal() as session:
        vector_store_id = await get_or_create_user_vector_store(session, user_id)
        payload = json.dumps(
            {
                payload_key: fact_text,
                **(metadata or {}),
            },
            ensure_ascii=False,
        )
        await _upload_fact(
            vector_store_id,
            content=payload,
            metadata={"user_id": str(user_id), **(metadata or {})},
        )
        await session.commit()


async def record_chat_message(
    user_id: UUID,
    *,
    thread_id: str,
    item_id: str,
    role: str,
    message: str,
    metadata: dict[str, Any] | None = None,
) -> None:
    """Persist a chat message to OpenAI vector store and Neon history."""

    meta = {
        "type": "chat_message",
        "role": role,
        "thread_id": thread_id,
        "item_id": item_id,
        **(metadata or {}),
    }

    await append_fact_for_user(
        user_id,
        message,
        metadata=meta,
        payload_key="message",
    )

    async with SessionLocal() as session:
        existing = await session.scalar(
            select(ChatTranscriptMessage).where(ChatTranscriptMessage.item_id == item_id)
        )
        if existing:
            existing.message = message
            existing.role = role
            existing.thread_id = thread_id
        else:
            session.add(
                ChatTranscriptMessage(
                    user_id=user_id,
                    thread_id=thread_id,
                    item_id=item_id,
                    role=role,
                    message=message,
                )
            )
        await session.commit()


__all__ = [
    "append_fact_for_user",
    "get_or_create_user_vector_store",
    "record_chat_message",
    "get_user_vector_store_id",
]
