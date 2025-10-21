"""Routes for managing micro agent subscriptions."""

from __future__ import annotations

import logging
import uuid

import stripe
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import get_settings
from ..dependencies import get_current_user
from ..database import get_session
from ..models import MicroAgent, MicroAgentStatus, User
from ..schemas import (
    CheckoutSessionResponse,
    MicroAgentResponse,
    MicroAgentSubscribeRequest,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/microagents", tags=["micro-agents"])
settings = get_settings()

def _require_stripe_key() -> str:
    key = settings.stripe_secret_key
    if not key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Stripe secret key is not configured",
        )
    stripe.api_key = key
    return key


@router.post("/subscribe", response_model=CheckoutSessionResponse, status_code=status.HTTP_201_CREATED)
async def subscribe_micro_agent(
    payload: MicroAgentSubscribeRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> CheckoutSessionResponse:
    _require_stripe_key()

    micro_agent = MicroAgent(
        user_id=current_user.id,
        agent_name=payload.agent_name,
        workflow_id=payload.workflow_id,
        stripe_price_id=payload.price_id,
        status=MicroAgentStatus.PENDING,
    )
    session.add(micro_agent)
    await session.flush()

    try:
        checkout_session = stripe.checkout.Session.create(
            mode="subscription",
            success_url=settings.stripe_success_url,
            cancel_url=settings.stripe_cancel_url,
            line_items=[{"price": payload.price_id, "quantity": 1}],
            customer_email=current_user.email,
            metadata={
                "micro_agent_id": str(micro_agent.id),
                "user_id": str(current_user.id),
                "workflow_id": payload.workflow_id,
            },
        )
    except stripe.error.StripeError as exc:  # pragma: no cover - network failure path
        await session.rollback()
        logger.exception("Stripe checkout creation failed")
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Stripe error") from exc

    await session.commit()

    return CheckoutSessionResponse(
        checkout_url=checkout_session.url,
        micro_agent_id=micro_agent.id,
    )


@router.get("/me", response_model=list[MicroAgentResponse])
async def list_micro_agents(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> list[MicroAgentResponse]:
    result = await session.execute(select(MicroAgent).where(MicroAgent.user_id == current_user.id))
    agents = result.scalars().all()
    return [MicroAgentResponse.model_validate(agent) for agent in agents]


@router.post("/{micro_agent_id}/cancel", response_model=MicroAgentResponse)
async def cancel_micro_agent(
    micro_agent_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> MicroAgentResponse:
    _require_stripe_key()

    micro_agent = await session.get(MicroAgent, micro_agent_id)
    if micro_agent is None or micro_agent.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Micro agent not found")

    if micro_agent.status == MicroAgentStatus.CANCELED:
        return MicroAgentResponse.model_validate(micro_agent)

    if micro_agent.stripe_subscription_id:
        try:
            stripe.Subscription.delete(micro_agent.stripe_subscription_id)
        except stripe.error.InvalidRequestError as exc:  # pragma: no cover - cleanup failure
            logger.warning(
                "Stripe subscription cancellation failed for %s", micro_agent.stripe_subscription_id, exc_info=exc
            )

    micro_agent.status = MicroAgentStatus.CANCELED
    await session.commit()
    await session.refresh(micro_agent)
    return MicroAgentResponse.model_validate(micro_agent)
