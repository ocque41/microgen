"""Tests for environment-driven configuration fallbacks."""

from __future__ import annotations

from app.config import Settings


def test_stack_env_fallbacks(monkeypatch) -> None:
    """Settings should read alternate Stack env names when primaries are absent."""

    monkeypatch.delenv("STACK_PROJECT_ID", raising=False)
    monkeypatch.delenv("STACK_SECRET_KEY", raising=False)
    monkeypatch.setenv("VITE_STACK_PROJECT_ID", "vite-stack-project")
    monkeypatch.setenv("STACK_SECRET_SERVER_KEY", "server-secret")

    settings = Settings()

    assert settings.stack_project_id == "vite-stack-project"
    assert settings.stack_secret_key == "server-secret"
    # plan-step[2]: Guard alternate Stack env handling with a regression test.
