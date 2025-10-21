"""create auth and micro agent tables"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

pg = sa.dialects.postgresql


revision = "20250308_01"
down_revision = None
branch_labels = None
depends_on = None


MICRO_AGENT_STATUS_ENUM = sa.Enum(
    "pending",
    "active",
    "canceled",
    "past_due",
    name="micro_agent_status",
)


def upgrade() -> None:
    MICRO_AGENT_STATUS_ENUM.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            server_onupdate=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "password_reset_tokens",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", pg.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("token", sa.String(length=255), nullable=False, unique=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("consumed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            server_onupdate=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )
    op.create_index("ix_password_reset_tokens_token", "password_reset_tokens", ["token"], unique=True)

    op.create_table(
        "micro_agents",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", pg.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("agent_name", sa.String(length=255), nullable=False),
        sa.Column("workflow_id", sa.String(length=255), nullable=False),
        sa.Column("stripe_price_id", sa.String(length=255), nullable=False),
        sa.Column("stripe_subscription_id", sa.String(length=255), nullable=True),
        sa.Column(
            "status",
            MICRO_AGENT_STATUS_ENUM,
            nullable=False,
            server_default=sa.text("'pending'::micro_agent_status"),
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            server_onupdate=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )
    op.create_index("ix_micro_agents_user_id", "micro_agents", ["user_id"])
    op.create_index("ix_micro_agents_subscription", "micro_agents", ["stripe_subscription_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_micro_agents_subscription", table_name="micro_agents")
    op.drop_index("ix_micro_agents_user_id", table_name="micro_agents")
    op.drop_table("micro_agents")

    op.drop_index("ix_password_reset_tokens_token", table_name="password_reset_tokens")
    op.drop_table("password_reset_tokens")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")

    MICRO_AGENT_STATUS_ENUM.drop(op.get_bind(), checkfirst=True)
