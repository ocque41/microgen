"""Database models for authentication and micro-agents."""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SqlEnum, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class TimestampMixin:
    """Shared timestamp columns for ORM models."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


class User(Base, TimestampMixin):
    """Registered application user."""

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)

    reset_tokens: Mapped[list["PasswordResetToken"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    micro_agents: Mapped[list["MicroAgent"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    vector_store: Mapped["UserVectorStore" | None] = relationship(
        back_populates="user", cascade="all, delete-orphan", uselist=False
    )


class PasswordResetToken(Base, TimestampMixin):
    """Password reset token issued to a user."""

    __tablename__ = "password_reset_tokens"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    token: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    consumed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped[User] = relationship(back_populates="reset_tokens")


class MicroAgentStatus(str, Enum):
    """Subscription lifecycle states."""

    PENDING = "pending"
    ACTIVE = "active"
    CANCELED = "canceled"
    PAST_DUE = "past_due"


class MicroAgent(Base, TimestampMixin):
    """User-owned micro agent subscription metadata."""

    __tablename__ = "micro_agents"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    agent_name: Mapped[str] = mapped_column(String(255), nullable=False)
    workflow_id: Mapped[str] = mapped_column(String(255), nullable=False)
    stripe_price_id: Mapped[str] = mapped_column(String(255), nullable=False)
    stripe_subscription_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[MicroAgentStatus] = mapped_column(
        SqlEnum(MicroAgentStatus, name="micro_agent_status"),
        default=MicroAgentStatus.PENDING,
        nullable=False,
    )
    user: Mapped[User] = relationship(back_populates="micro_agents")


class UserVectorStore(Base, TimestampMixin):
    """Mapping of application users to their OpenAI vector store identifiers."""

    __tablename__ = "user_vector_store"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True, nullable=False
    )
    vector_store_id: Mapped[str] = mapped_column(String(255), nullable=False)

    user: Mapped[User] = relationship(back_populates="vector_store")


class OutboundEmail(Base, TimestampMixin):
    """Email messages queued for delivery (stored in Neon)."""

    __tablename__ = "outbound_emails"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False
    )
    to_address: Mapped[str] = mapped_column(String(255), nullable=False)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    metadata: Mapped[str | None] = mapped_column(Text, nullable=True)


__all__ = [
    "MicroAgent",
    "MicroAgentStatus",
    "OutboundEmail",
    "UserVectorStore",
    "PasswordResetToken",
    "User",
]
