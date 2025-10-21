"""Runtime configuration loaded from environment variables."""

from __future__ import annotations

import os
import secrets
from functools import lru_cache

from pydantic import BaseModel, ConfigDict, Field


class Settings(BaseModel):
    """Application settings sourced from environment variables."""

    model_config = ConfigDict(extra="ignore")

    database_url: str | None = Field(default=os.getenv("DATABASE_URL"))
    jwt_secret: str | None = Field(default=os.getenv("JWT_SECRET"))
    jwt_algorithm: str = Field(default=os.getenv("JWT_ALGORITHM", "HS256"))
    jwt_expires_seconds: int = Field(default=int(os.getenv("JWT_EXPIRES_IN", "3600")))
    session_secret: str = Field(
        default=os.getenv("SESSION_SECRET")
        or os.getenv("JWT_SECRET")
        or secrets.token_urlsafe(32)
    )

    stripe_secret_key: str | None = Field(default=os.getenv("STRIPE_SECRET_KEY"))
    stripe_webhook_secret: str | None = Field(default=os.getenv("STRIPE_WEBHOOK_SECRET"))
    stripe_success_url: str = Field(
        default=os.getenv("STRIPE_CHECKOUT_SUCCESS_URL", "http://localhost:5173/success")
    )
    stripe_cancel_url: str = Field(
        default=os.getenv("STRIPE_CHECKOUT_CANCEL_URL", "http://localhost:5173/cancel")
    )

    google_client_id: str | None = Field(default=os.getenv("GOOGLE_CLIENT_ID"))
    google_client_secret: str | None = Field(default=os.getenv("GOOGLE_CLIENT_SECRET"))

    apple_client_id: str | None = Field(default=os.getenv("APPLE_CLIENT_ID"))
    apple_client_secret: str | None = Field(default=os.getenv("APPLE_CLIENT_SECRET"))
    apple_team_id: str | None = Field(default=os.getenv("APPLE_TEAM_ID"))
    apple_key_id: str | None = Field(default=os.getenv("APPLE_KEY_ID"))
    apple_private_key: str | None = Field(default=os.getenv("APPLE_PRIVATE_KEY"))

    app_base_url: str | None = Field(default=os.getenv("APP_BASE_URL"))

    allowed_origin_regex: str | None = Field(default=os.getenv("ALLOWED_ORIGIN_REGEX"))

    email_sender_name: str = Field(default=os.getenv("EMAIL_SENDER_NAME", "Microagents"))
    email_sender_address: str = Field(default=os.getenv("EMAIL_SENDER_ADDRESS", "hi@cumulush.com"))

    def require_database_url(self) -> str:
        if not self.database_url:
            raise RuntimeError("DATABASE_URL environment variable must be configured.")
        return self.database_url

    def require_jwt_secret(self) -> str:
        if not self.jwt_secret:
            raise RuntimeError("JWT_SECRET environment variable must be configured.")
        return self.jwt_secret


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return cached settings instance."""

    return Settings()


__all__ = ["Settings", "get_settings"]
