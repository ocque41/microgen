"""Email delivery helper that stores messages in the database (Neon-backed)."""

from __future__ import annotations

import json

from sqlalchemy.ext.asyncio import AsyncSession

from .models import OutboundEmail


async def queue_email(
    session: AsyncSession,
    *,
    to_address: str,
    subject: str,
    body: str,
    metadata: dict[str, str] | None = None,
) -> OutboundEmail:
    """Persist an email in the outbound queue table."""

    email = OutboundEmail(
        to_address=to_address,
        subject=subject,
        body=body,
        metadata=json.dumps(metadata or {}),
    )
    session.add(email)
    await session.flush()
    return email


__all__ = ["queue_email"]
