"""Security helpers for password hashing and JWT tokens."""

from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import get_settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()


def hash_password(password: str) -> str:
    """Return a hashed representation of the provided password."""

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify that the provided password matches the stored hash."""

    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(*, user_id: uuid.UUID) -> str:
    """Create a signed JWT for the given user identifier."""

    secret = settings.require_jwt_secret()
    expire = datetime.now(timezone.utc) + timedelta(seconds=settings.jwt_expires_seconds)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict[str, str]:
    """Decode a JWT and return its payload."""

    try:
        return jwt.decode(
            token,
            settings.require_jwt_secret(),
            algorithms=[settings.jwt_algorithm],
        )
    except JWTError as exc:  # pragma: no cover - defensive branch
        raise ValueError("Invalid token") from exc


__all__ = [
    "create_access_token",
    "decode_token",
    "hash_password",
    "verify_password",
]
