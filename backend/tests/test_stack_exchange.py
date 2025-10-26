"""Tests for the Stack Auth exchange endpoint."""

from __future__ import annotations

from datetime import datetime, timezone

import pytest
from sqlalchemy import select

from app.models import User
from app.routes import auth as auth_routes
from app.stack_auth import StackAuthError, StackAuthSession, StackAuthUser

pytestmark = pytest.mark.anyio


def _override_stack_client(monkeypatch: pytest.MonkeyPatch, client: object) -> None:
    if hasattr(auth_routes._get_stack_client, "cache_clear"):
        auth_routes._get_stack_client.cache_clear()
    monkeypatch.setattr(auth_routes, "_get_stack_client", lambda: client)


class _SuccessfulClient:
    def __init__(self, email: str) -> None:
        self._email = email

    async def verify_tokens(self, *, access_token: str, refresh_token: str | None = None, client=None):
        return StackAuthSession(
            id="session-id",
            expires_at=datetime.now(timezone.utc),
            user=StackAuthUser(id="stack-user-id", email=self._email),
        )


class _FailingClient:
    async def verify_tokens(self, *, access_token: str, refresh_token: str | None = None, client=None):
        raise StackAuthError("invalid tokens")


async def test_stack_exchange_creates_user(async_client, session_factory, monkeypatch: pytest.MonkeyPatch):
    _override_stack_client(monkeypatch, _SuccessfulClient(email="TestUser@Example.com"))

    response = await async_client.post(
        "/api/auth/stack/exchange",
        json={"access_token": "access", "refresh_token": "refresh"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["user"]["email"] == "testuser@example.com"
    assert payload["token_type"] == "bearer"
    assert isinstance(payload["expires_in"], int)

    async with session_factory() as session:
        users = (await session.execute(select(User))).scalars().all()
        assert len(users) == 1
        assert users[0].email == "testuser@example.com"


async def test_stack_exchange_reuses_existing_user(async_client, session_factory, monkeypatch: pytest.MonkeyPatch):
    async with session_factory() as session:
        user = User(email="existing@example.com")
        session.add(user)
        await session.commit()
        await session.refresh(user)
        existing_id = user.id

    _override_stack_client(monkeypatch, _SuccessfulClient(email="Existing@example.com"))

    response = await async_client.post(
        "/api/auth/stack/exchange",
        json={"access_token": "access", "refresh_token": "refresh"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["user"]["id"] == str(existing_id)

    async with session_factory() as session:
        users = (await session.execute(select(User))).scalars().all()
        assert len(users) == 1
        assert users[0].id == existing_id


async def test_stack_exchange_invalid_tokens_returns_unauthorized(
    async_client,
    session_factory,
    monkeypatch: pytest.MonkeyPatch,
):
    _override_stack_client(monkeypatch, _FailingClient())

    response = await async_client.post(
        "/api/auth/stack/exchange",
        json={"access_token": "bad", "refresh_token": "refresh"},
    )

    assert response.status_code == 401

    async with session_factory() as session:
        users = (await session.execute(select(User))).scalars().all()
        assert users == []
