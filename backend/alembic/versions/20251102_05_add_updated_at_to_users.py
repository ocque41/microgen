"""Add updated_at column to users"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect, text


revision = "20251102_05"
down_revision = "20250312_04"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    columns = {column["name"] for column in inspector.get_columns("users", schema="public")}

    if "updated_at" not in columns:
        op.add_column(
            "users",
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        )
        op.execute(text("UPDATE public.users SET updated_at = created_at"))
        op.alter_column(
            "users",
            "updated_at",
            server_default=sa.text("CURRENT_TIMESTAMP"),
            existing_type=sa.DateTime(timezone=True),
        )
        op.alter_column(
            "users",
            "updated_at",
            nullable=False,
            existing_type=sa.DateTime(timezone=True),
        )

    op.execute(
        text(
            """
            CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
            RETURNS trigger AS $$
            BEGIN
              NEW.updated_at = NOW();
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            """
        )
    )
    op.execute(text("DROP TRIGGER IF EXISTS set_updated_at_on_users ON public.users"))
    op.execute(
        text(
            """
            CREATE TRIGGER set_updated_at_on_users
            BEFORE UPDATE ON public.users
            FOR EACH ROW
            EXECUTE FUNCTION public.set_current_timestamp_updated_at();
            """
        )
    )


def downgrade() -> None:
    op.execute(text("DROP TRIGGER IF EXISTS set_updated_at_on_users ON public.users"))
    op.execute(text("DROP FUNCTION IF EXISTS public.set_current_timestamp_updated_at"))
    op.drop_column("users", "updated_at")
