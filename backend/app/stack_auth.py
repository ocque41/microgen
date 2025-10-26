"""Stack Auth client helpers for verifying user sessions."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

import httpx
from pydantic import BaseModel, EmailStr, ValidationError

from .config import get_settings


class StackAuthError(RuntimeError):
    """Raised when Stack Auth verification fails."""


class StackAuthUser(BaseModel):
    """Normalized user payload returned by Stack Auth."""

    id: str
    email: EmailStr


class StackAuthSession(BaseModel):
    """Session details extracted from Stack Auth verification."""

    id: str | None = None
    expires_at: datetime | None = None
    user: StackAuthUser


@dataclass(slots=True)
class StackAuthClient:
    """Minimal client for verifying Stack Auth access tokens."""

    _base_url: str
    _project_id: str
    _secret_key: str
    _timeout: float

    @classmethod
    def from_settings(cls) -> "StackAuthClient":
        settings = get_settings()
        project_id, secret_key = settings.require_stack_credentials()
        base_url = settings.stack_api_base_url.rstrip("/")
        timeout = settings.stack_timeout_seconds
        return cls(
            _base_url=base_url,
            _project_id=project_id,
            _secret_key=secret_key,
            _timeout=timeout,
        )

    async def verify_tokens(
        self,
        *,
        access_token: str,
        refresh_token: str | None = None,
        client: httpx.AsyncClient | None = None,
    ) -> StackAuthSession:
        """Validate Stack Auth tokens and return the associated session."""

        payload: dict[str, Any] = {"access_token": access_token}
        if refresh_token:
            payload["refresh_token"] = refresh_token

        url = f"{self._base_url}/projects/{self._project_id}/sessions/verify"
        headers = {"Authorization": f"Bearer {self._secret_key}"}

        needs_close = False
        if client is None:
            client = httpx.AsyncClient(timeout=self._timeout)
            needs_close = True

        try:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise StackAuthError("Stack Auth rejected the provided tokens") from exc
        except httpx.RequestError as exc:  # pragma: no cover - network failure handled by caller
            raise StackAuthError("Failed to contact Stack Auth") from exc
        finally:
            if needs_close:
                await client.aclose()

        data = response.json()
        try:
            session_payload = data.get("session") or {}
            user_payload = data.get("user") or session_payload.get("user")
            if user_payload is None:
                raise KeyError("user")

            user = StackAuthUser.model_validate(user_payload)
            session = StackAuthSession(
                id=session_payload.get("id"),
                expires_at=session_payload.get("expires_at"),
                user=user,
            )
            return session
        except (KeyError, TypeError, ValidationError, ValueError) as exc:
            raise StackAuthError("Unexpected response from Stack Auth") from exc


__all__ = [
    "StackAuthClient",
    "StackAuthError",
    "StackAuthSession",
    "StackAuthUser",
]
