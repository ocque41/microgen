"""Pydantic schemas for request and response bodies."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from .models import MicroAgentStatus


class UserRead(BaseModel):
    """Serialized representation of an authenticated user."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    created_at: datetime
    updated_at: datetime


class TokenResponse(BaseModel):
    """Access token response envelope."""

    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserRead


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=256)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(min_length=8, max_length=256)


class StackTokenExchangeRequest(BaseModel):
    """Exchange Stack Auth tokens for a backend JWT."""

    access_token: str = Field(min_length=1)
    refresh_token: str | None = None


class MicroAgentSubscribeRequest(BaseModel):
    agent_name: str
    workflow_id: str
    price_id: str


class MicroAgentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    agent_name: str
    workflow_id: str
    stripe_price_id: str
    stripe_subscription_id: str | None
    status: MicroAgentStatus
    created_at: datetime
    updated_at: datetime


class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    micro_agent_id: uuid.UUID


class StripeWebhookResponse(BaseModel):
    received: bool


__all__ = [
    "CheckoutSessionResponse",
    "ForgotPasswordRequest",
    "LoginRequest",
    "MicroAgentResponse",
    "MicroAgentSubscribeRequest",
    "ResetPasswordRequest",
    "SignupRequest",
    "StackTokenExchangeRequest",
    "StripeWebhookResponse",
    "TokenResponse",
    "UserRead",
]
