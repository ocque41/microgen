"""Stack Auth client helpers for verifying user sessions."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any

import httpx
from pydantic import BaseModel, EmailStr, ValidationError

from .config import get_settings


def _resolve_email(payload: dict[str, Any]) -> str | None:
    """Extract a usable email address from Stack Auth API payloads."""

    def _coerce(value: Any) -> str | None:
        if isinstance(value, str) and value.strip():
            return value.strip()
        if isinstance(value, dict):
            for key in ("email", "address", "value"):
                candidate = value.get(key)
                if isinstance(candidate, str) and candidate.strip():
                    return candidate.strip()
        return None

    direct = _coerce(payload.get("email"))
    if direct:
        return direct

    for key in ("primary_email", "primaryEmail", "primary_email_address"):
        resolved = _coerce(payload.get(key))
        if resolved:
            return resolved

    for key in ("emails", "email_addresses", "emailsList"):
        entries = payload.get(key)
        if not isinstance(entries, list):
            continue
        for entry in entries:
            resolved = _coerce(entry)
            if resolved:
                return resolved

    return None


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

        base = self._base_url.rstrip("/")
        url = f"{base}/api/v1/users/me"
        headers = {
            "X-Stack-Access-Type": "server",
            "X-Stack-Project-Id": self._project_id,
            "X-Stack-Secret-Server-Key": self._secret_key,
            "X-Stack-Access-Token": access_token,
        }
        if refresh_token:
            headers["X-Stack-Refresh-Token"] = refresh_token

        needs_close = False
        if client is None:
            client = httpx.AsyncClient(timeout=self._timeout)
            needs_close = True

        try:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            detail = exc.response.text if exc.response is not None else ""
            message = "Stack Auth rejected the provided tokens"
            if detail:
                message = f"{message}: {detail}"
            raise StackAuthError(message) from exc
        except httpx.RequestError as exc:  # pragma: no cover - network failure handled by caller
            raise StackAuthError("Failed to contact Stack Auth") from exc
        finally:
            if needs_close:
                await client.aclose()

        data = response.json()
        try:
            user_payload: dict[str, Any] | None = None
            if isinstance(data, dict):
                candidate = data.get("user") or data
                if isinstance(candidate, dict):
                    user_payload = candidate.copy()
            if user_payload is None:
                raise KeyError("user")

            normalized_email = _resolve_email(user_payload)
            if normalized_email:
                user_payload.setdefault("email", normalized_email)

            user = StackAuthUser.model_validate(user_payload)
            session = StackAuthSession(
                id=None,
                expires_at=None,
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
