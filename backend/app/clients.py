"""Shared client instances."""

from __future__ import annotations

from openai import OpenAI

openai_client = OpenAI()

__all__ = ["openai_client"]
