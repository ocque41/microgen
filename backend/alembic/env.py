"""Alembic environment configuration for async migrations."""

from __future__ import annotations

import asyncio
from logging.config import fileConfig
import pathlib
import sys

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection, make_url
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

BASE_DIR = pathlib.Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:  # pragma: no cover - runtime path setup
    sys.path.insert(0, str(BASE_DIR))

from app.config import get_settings
from app.database import Base

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

if config.config_file_name is not None:  # pragma: no cover - configuration side effect
    fileConfig(config.config_file_name)

target_metadata = Base.metadata
settings = get_settings()


def _make_sync_url(url: str) -> str:
    if url.startswith("postgresql+asyncpg"):
        return url.replace("postgresql+asyncpg", "postgresql", 1)
    return url


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""

    url = _make_sync_url(settings.require_database_url())
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""

    raw_url = settings.require_database_url()
    url = make_url(raw_url)

    if url.drivername in {"postgres", "postgresql"}:
        url = url.set(drivername="postgresql+asyncpg")
    elif url.drivername.startswith("postgresql") and "+asyncpg" not in url.drivername:
        url = url.set(drivername="postgresql+asyncpg")

    connect_args: dict[str, object] = {}
    query = dict(url.query)
    sslmode = query.pop("sslmode", None)
    if isinstance(sslmode, str):
        lowered = sslmode.lower()
        if lowered in {"require", "verify-full", "verify-ca"}:
            connect_args["ssl"] = True
        elif lowered in {"disable", "allow"}:
            connect_args["ssl"] = False
        else:
            connect_args["ssl"] = sslmode

    url = url.set(query=query)

    connectable = create_async_engine(
        url.render_as_string(hide_password=False),
        poolclass=pool.NullPool,
        connect_args=connect_args,
    )

    async def _run_migrations(connection: Connection) -> None:
        context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)

        with context.begin_transaction():
            context.run_migrations()

    async def _run() -> None:
        async with connectable.connect() as connection:
            await connection.run_sync(_run_migrations)

    try:
        asyncio.run(_run())
    finally:
        connectable.sync_engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
