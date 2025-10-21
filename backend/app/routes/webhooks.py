"""Stripe webhook endpoint for subscription lifecycle events."""

from __future__ import annotations

import logging
import uuid

import stripe
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import get_settings
from ..database import get_session
from ..models import MicroAgent, MicroAgentStatus
from ..schemas import StripeWebhookResponse

logger = logging.getLogger(__name__)
router = APIRouter(tags=["webhooks"])
settings = get_settings()

if settings.stripe_secret_key:
    stripe.api_key = settings.stripe_secret_key


async def _update_micro_agent_status(
    session: AsyncSession,
    agent_id: uuid.UUID,
    status_value: MicroAgentStatus,
    subscription_id: str | None = None,
) -> None:
    micro_agent = await session.get(MicroAgent, agent_id)
    if micro_agent is None:
        logger.warning("Micro agent %s not found for status update", agent_id)
        return

    micro_agent.status = status_value
    if subscription_id:
        micro_agent.stripe_subscription_id = subscription_id
    await session.commit()


@router.post("/api/webhooks/stripe", response_model=StripeWebhookResponse)
async def stripe_webhook(
    request: Request,
    session: AsyncSession = Depends(get_session),
    stripe_signature: str | None = Header(default=None, alias="Stripe-Signature"),
) -> StripeWebhookResponse:
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Stripe secret key not configured")
    if not settings.stripe_webhook_secret:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Webhook secret not configured")

    if stripe_signature is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing Stripe signature header")

    payload = await request.body()

    stripe.api_key = settings.stripe_secret_key

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=stripe_signature,
            secret=settings.stripe_webhook_secret,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payload") from exc
    except stripe.error.SignatureVerificationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signature") from exc

    event_type = event.get("type")
    data_object = event.get("data", {}).get("object", {})

    if event_type == "checkout.session.completed":
        metadata = data_object.get("metadata", {})
        micro_agent_id = metadata.get("micro_agent_id")
        subscription_id = data_object.get("subscription")
        if micro_agent_id:
            try:
                agent_uuid = uuid.UUID(micro_agent_id)
            except ValueError:
                logger.warning("Invalid micro agent UUID %s from metadata", micro_agent_id)
            else:
                await _update_micro_agent_status(
                    session, agent_uuid, MicroAgentStatus.ACTIVE, subscription_id=subscription_id
                )
    elif event_type == "invoice.paid":
        subscription_id = data_object.get("subscription")
        if subscription_id:
            result = await session.execute(
                select(MicroAgent).where(MicroAgent.stripe_subscription_id == subscription_id)
            )
            agent = result.scalar_one_or_none()
            if agent:
                await _update_micro_agent_status(session, agent.id, MicroAgentStatus.ACTIVE)
    elif event_type in {"customer.subscription.deleted", "invoice.payment_failed"}:
        subscription_id = data_object.get("id") or data_object.get("subscription")
        if subscription_id:
            result = await session.execute(
                select(MicroAgent).where(MicroAgent.stripe_subscription_id == subscription_id)
            )
            agent = result.scalar_one_or_none()
            if agent:
                new_status = (
                    MicroAgentStatus.CANCELED
                    if event_type == "customer.subscription.deleted"
                    else MicroAgentStatus.PAST_DUE
                )
                await _update_micro_agent_status(session, agent.id, new_status)

    return StripeWebhookResponse(received=True)
