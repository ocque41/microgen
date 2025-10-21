"""Alembic environment configuration for async migrations."""

from __future__ import annotations

import asyncio
from logging.config import fileConfig
import pathlib
import sys

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
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

    connectable = create_async_engine(
        settings.require_database_url(),
        poolclass=pool.NullPool,
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
