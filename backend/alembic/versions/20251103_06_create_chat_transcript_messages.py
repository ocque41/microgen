"""create chat transcript storage table"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy import text
from sqlalchemy.dialects import postgresql


revision = "20251103_06"
down_revision = "20251102_05"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "chat_transcript_messages",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("thread_id", sa.String(length=255), nullable=False),
        sa.Column("item_id", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=32), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("item_id", name="uq_chat_transcript_messages_item_id"),
    )
    op.create_index(
        "ix_chat_transcript_messages_user_id",
        "chat_transcript_messages",
        ["user_id"],
    )
    op.create_index(
        "ix_chat_transcript_messages_thread_id",
        "chat_transcript_messages",
        ["thread_id"],
    )

    op.execute(
        text(
            """
            CREATE TRIGGER set_updated_at_on_chat_transcript_messages
            BEFORE UPDATE ON public.chat_transcript_messages
            FOR EACH ROW
            EXECUTE FUNCTION public.set_current_timestamp_updated_at();
            """
        )
    )


def downgrade() -> None:
    op.execute(
        text(
            "DROP TRIGGER IF EXISTS set_updated_at_on_chat_transcript_messages ON public.chat_transcript_messages"
        )
    )
    op.drop_index("ix_chat_transcript_messages_thread_id", table_name="chat_transcript_messages")
    op.drop_index("ix_chat_transcript_messages_user_id", table_name="chat_transcript_messages")
    op.drop_table("chat_transcript_messages")
