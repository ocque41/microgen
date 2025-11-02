"""Authentication and OAuth routes."""

from __future__ import annotations

import logging
import secrets
from datetime import datetime, timedelta, timezone
from functools import lru_cache
from typing import Union

from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi import APIRouter, Body, Depends, Header, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import get_settings
from ..database import get_session
from ..dependencies import get_current_user
from ..email import queue_email
from ..models import PasswordResetToken, User
from ..schemas import (
    ForgotPasswordRequest,
    LoginRequest,
    ResetPasswordRequest,
    SignupRequest,
    StackTokenExchangeRequest,
    TokenResponse,
    UserRead,
)
from ..security import create_access_token, hash_password, verify_password
from ..stack_auth import StackAuthClient, StackAuthError

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["auth"])

oauth = OAuth()
settings = get_settings()


if settings.google_client_id and settings.google_client_secret:
    oauth.register(
        name="google",
        client_id=settings.google_client_id,
        client_secret=settings.google_client_secret,
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )


if settings.apple_client_id and settings.apple_client_secret:
    oauth.register(
        name="apple",
        client_id=settings.apple_client_id,
        client_secret=settings.apple_client_secret,
        server_metadata_url="https://appleid.apple.com/.well-known/openid-configuration",
        client_kwargs={"scope": "name email", "response_mode": "form_post"},
    )


def _lower_email(email: str) -> str:
    return email.strip().lower()


def _token_response(user: Union[User, UserRead]) -> TokenResponse:
    # Plan step A: allow token responses from ORM instances and lightweight projections
    if isinstance(user, UserRead):
        user_read = user
        user_id = user.id
    else:
        user_read = UserRead.model_validate(user)
        user_id = user.id

    token = create_access_token(user_id=user_id)
    return TokenResponse(
        access_token=token,
        expires_in=settings.jwt_expires_seconds,
        user=user_read,
    )


@lru_cache(maxsize=1)
def _get_stack_client() -> StackAuthClient:
    return StackAuthClient.from_settings()


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    payload: SignupRequest,
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    email = _lower_email(payload.email)
    existing = await session.scalar(select(User).where(User.email == email))
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed = hash_password(payload.password)
    user = User(email=email, hashed_password=hashed)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return _token_response(user)


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    email = _lower_email(payload.email)
    user = await session.scalar(select(User).where(User.email == email))
    if user is None or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return _token_response(user)


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
async def forgot_password(
    payload: ForgotPasswordRequest,
    session: AsyncSession = Depends(get_session),
) -> None:
    email = _lower_email(payload.email)
    user = await session.scalar(select(User).where(User.email == email))
    if not user:
        logger.info("Password reset requested for unknown email %s", email)
        return

    token_value = secrets.token_urlsafe(48)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    token = PasswordResetToken(user_id=user.id, token=token_value, expires_at=expires_at)
    session.add(token)
    await session.flush()

    reset_link = f"{settings.app_base_url or 'http://localhost:5173'}/reset-password?token={token_value}"
    subject = "Reset your password"
    body = (
        "We received a request to reset your password. Use the link below to set a new password:\n\n"
        f"{reset_link}\n\nIf you did not request this change, you can safely ignore this email."
    )
    await queue_email(
        session,
        to_address=user.email,
        subject=subject,
        body=body,
        metadata={
            "token_id": str(token.id),
            "sender_name": settings.email_sender_name,
            "sender_address": settings.email_sender_address,
        },
    )

    await session.commit()
    logger.info("Password reset email queued for user %s", user.id)


@router.post(
    "/reset-password",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
async def reset_password(
    payload: ResetPasswordRequest,
    session: AsyncSession = Depends(get_session),
) -> Response:
    token_stmt = select(PasswordResetToken).where(PasswordResetToken.token == payload.token)
    reset_record = await session.scalar(token_stmt)
    if reset_record is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    if reset_record.consumed_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token already used")

    if reset_record.expires_at < datetime.now(timezone.utc):
        await session.delete(reset_record)
        await session.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token expired")

    user = await session.get(User, reset_record.user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User no longer exists")

    user.hashed_password = hash_password(payload.password)
    reset_record.consumed_at = datetime.now(timezone.utc)
    await session.delete(reset_record)
    await session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(current_user)


@router.post("/stack/exchange", response_model=TokenResponse)
async def stack_exchange(
    payload: StackTokenExchangeRequest | None = Body(default=None),
    stack_access_token: str | None = Header(default=None, alias="X-Stack-Access-Token"),
    stack_refresh_token: str | None = Header(default=None, alias="X-Stack-Refresh-Token"),
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    access_token = stack_access_token or (payload.access_token if payload else None)
    refresh_token = stack_refresh_token or (payload.refresh_token if payload else None)

    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Stack access token missing")
    try:
        stack_client = _get_stack_client()
    except RuntimeError as exc:
        logger.exception("Stack Auth integration missing configuration")
        raise HTTPException(  # pragma: no cover - misconfiguration path
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Stack Auth integration is not configured.",
        ) from exc

    try:
        stack_session = await stack_client.verify_tokens(
            access_token=access_token,
            refresh_token=refresh_token,
        )
    except StackAuthError as exc:
        logger.info("Stack Auth token exchange failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Stack tokens") from exc

    stack_email = stack_session.user.email.strip().lower()

    try:
        # Plan step A: fetch only stable columns to avoid missing-field errors while migrations roll out
        user_lookup = (
            select(User.id, User.email, User.created_at, getattr(User, "updated_at", User.created_at))
            .where(User.email == stack_email)
        )
        lookup_result = await session.execute(user_lookup)
        existing_mapping = lookup_result.mappings().first()
        existing_user = dict(existing_mapping) if existing_mapping is not None else None

        if existing_user is None:
            db_user = User(email=stack_email)
            session.add(db_user)
            await session.commit()
            await session.refresh(db_user)
            logger.info("Created user %s from Stack Auth exchange", db_user.id)
        else:
            user_read = UserRead(
                id=existing_user["id"],
                email=existing_user["email"],
                created_at=existing_user["created_at"],
                updated_at=existing_user.get("updated_at", existing_user["created_at"]),
            )
            return _token_response(user_read)
    except Exception as exc:  # pragma: no cover - database outage path
        logger.exception("Failed to resolve Stack user against database", exc_info=exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to reach user store while exchanging Stack tokens.",
        )

    return _token_response(db_user)


@router.get("/oauth/{provider}")
async def oauth_authorize(provider: str, request: Request):
    client = oauth.create_client(provider)
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unsupported provider")

    redirect_uri = request.url_for("oauth_callback", provider=provider)
    return await client.authorize_redirect(request, redirect_uri)


@router.get("/oauth/{provider}/callback", name="oauth_callback")
async def oauth_callback(
    provider: str,
    request: Request,
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    client = oauth.create_client(provider)
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unsupported provider")

    try:
        token = await client.authorize_access_token(request)
    except OAuthError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"OAuth error: {exc.error}") from exc

    userinfo: dict[str, str] | None = None
    if provider == "google":
        userinfo = token.get("userinfo")
        if not userinfo:
            userinfo = await client.parse_id_token(request, token)
    elif provider == "apple":
        userinfo = await client.parse_id_token(request, token)
    if not userinfo or "email" not in userinfo:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OAuth provider did not return an email")

    email = _lower_email(userinfo["email"])
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(email=email, hashed_password=None)
        session.add(user)
        await session.commit()
        await session.refresh(user)

    return _token_response(user)
