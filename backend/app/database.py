"""Async SQLAlchemy database session management."""

from __future__ import annotations

import logging
from typing import AsyncIterator

from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from .config import get_settings


class Base(DeclarativeBase):
    """Declarative base for ORM models."""


logger = logging.getLogger(__name__)

settings = get_settings()

raw_database_url = settings.require_database_url()
url = make_url(raw_database_url)

if url.drivername in {"postgres", "postgresql"}:
    url = url.set(drivername="postgresql+asyncpg")
elif url.drivername.startswith("postgresql") and "+asyncpg" not in url.drivername:
    url = url.set(drivername="postgresql+asyncpg")

query = dict(url.query)
connect_args: dict[str, object] = {}

sslmode = query.pop("sslmode", None)
if isinstance(sslmode, str):
    sslmode_lower = sslmode.lower()
    if sslmode_lower in {"require", "verify-full", "verify-ca"}:
        connect_args["ssl"] = True
    elif sslmode_lower in {"disable", "allow"}:
        connect_args["ssl"] = False
    else:
        connect_args["ssl"] = sslmode

url = url.set(query=query)

database_dsn = url.render_as_string(hide_password=False)
engine = create_async_engine(database_dsn, pool_pre_ping=True, connect_args=connect_args)

logger.info(
    "Configured async engine",
    extra={
        "driver": url.drivername,
        "host": url.host,
        "database": url.database,
        "ssl": connect_args.get("ssl"),
    },
)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_session() -> AsyncIterator[AsyncSession]:
    """Yield an async SQLAlchemy session bound to the configured engine."""

    async with SessionLocal() as session:
        yield session


__all__ = ["Base", "engine", "get_session", "SessionLocal"]
