"""Smoke tests for uptime endpoints."""

from __future__ import annotations

import pytest


@pytest.mark.anyio
async def test_root_endpoint_reports_ok(async_client) -> None:
    response = await async_client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.anyio
async def test_health_endpoint_reports_healthy(async_client) -> None:
    response = await async_client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
