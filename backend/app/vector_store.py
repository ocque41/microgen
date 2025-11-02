"""Helpers for managing user-specific vector stores in OpenAI."""

from __future__ import annotations

import asyncio
import json
from io import BytesIO
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .clients import openai_client
from .database import SessionLocal
from .models import UserVectorStore


async def _create_vector_store(name: str) -> str:
    def _call() -> str:
        # plan-step[3]: use the stable vector store endpoint from the 1.x SDK surface
        store = openai_client.vector_stores.create(name=name)
        return store.id

    return await asyncio.to_thread(_call)


async def _upload_fact(vector_store_id: str, content: str, metadata: dict[str, Any]) -> None:
    filename = f"memory-{uuid4().hex}.json"
    file_bytes = content.encode("utf-8")

    def _create_and_attach() -> None:
        file = openai_client.files.create(
            file=(filename, BytesIO(file_bytes)),
            purpose="assistants",
        )
        openai_client.vector_stores.files.create(
            vector_store_id=vector_store_id,
            file_id=file.id,
            metadata=metadata,
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
) -> None:
    async with SessionLocal() as session:
        vector_store_id = await get_or_create_user_vector_store(session, user_id)
        payload = json.dumps({
            "fact": fact_text,
            **(metadata or {}),
        }, ensure_ascii=False)
        await _upload_fact(
            vector_store_id,
            content=payload,
            metadata={"user_id": str(user_id), **(metadata or {})},
        )
        await session.commit()


__all__ = [
    "append_fact_for_user",
    "get_or_create_user_vector_store",
    "get_user_vector_store_id",
]
