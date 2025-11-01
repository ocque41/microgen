"""Endpoints for capturing and reporting Core Web Vitals telemetry."""

from __future__ import annotations

import asyncio
import logging
import math
from collections import defaultdict, deque
from typing import DefaultDict, Deque, Sequence

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, ConfigDict, Field, HttpUrl, ValidationError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/rum", tags=["rum"])

BUDGETS: dict[str, float] = {
    "LCP": 2500,
    "INP": 200,
    "CLS": 0.1,
}

METRIC_ORDER: dict[str, int] = {name: index for index, name in enumerate(BUDGETS)}
MAX_HISTORY = 50


class MetricSample(BaseModel):
    """Representation of a single Core Web Vitals sample."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    value: float
    delta: float | None = None
    rating: str | None = None
    navigation_type: str | None = Field(default=None, alias="navigationType")
    created_at: int = Field(alias="createdAt")
    href: HttpUrl | None = None


class MetricSummary(BaseModel):
    """Aggregated statistics for a single metric."""

    model_config = ConfigDict(populate_by_name=True)

    name: str
    budget: float | None = None
    average: float | None = None
    p75: float | None = Field(default=None, alias="p75")
    latest: MetricSample | None = None
    exceeds_budget: bool = Field(default=False, alias="exceedsBudget")
    samples: list[MetricSample] = Field(default_factory=list)


class QualityGatePayload(BaseModel):
    """Response payload returned to the frontend QA dashboard."""

    model_config = ConfigDict(populate_by_name=True)

    updated_at: int | None = Field(default=None, alias="updatedAt")
    metrics: list[MetricSummary] = Field(default_factory=list)


class MetricIngestResponse(BaseModel):
    """Status response returned after ingesting a metric."""

    model_config = ConfigDict(populate_by_name=True)

    status: str = "accepted"
    exceeds_budget: bool = Field(default=False, alias="exceedsBudget")


class _MetricStore:
    """Thread-safe in-memory store for recent Core Web Vitals samples."""

    def __init__(self, *, maxlen: int = MAX_HISTORY) -> None:
        self._metrics: DefaultDict[str, Deque[MetricSample]] = defaultdict(lambda: deque(maxlen=maxlen))
        self._lock = asyncio.Lock()
        self._updated_at: int | None = None

    async def add(self, sample: MetricSample) -> MetricSummary:
        async with self._lock:
            samples = self._metrics[sample.name]
            samples.append(sample)
            self._updated_at = sample.created_at
            return self._summarize(sample.name, list(samples))

    async def summary(self) -> QualityGatePayload:
        async with self._lock:
            names = set(self._metrics.keys()) | set(BUDGETS.keys())
            ordered = sorted(names, key=lambda metric: (METRIC_ORDER.get(metric, len(METRIC_ORDER)), metric))
            metrics = [self._summarize(name, list(self._metrics.get(name, []))) for name in ordered]
            return QualityGatePayload(updated_at=self._updated_at, metrics=metrics)

    def _summarize(self, name: str, samples: Sequence[MetricSample]) -> MetricSummary:
        average, percentile_75 = self._aggregate(samples)
        latest = samples[-1] if samples else None
        budget = BUDGETS.get(name)
        exceeds_budget = bool(latest and budget is not None and latest.value > budget)
        return MetricSummary(
            name=name,
            budget=budget,
            average=average,
            p75=percentile_75,
            latest=latest,
            exceeds_budget=exceeds_budget,
            samples=list(samples),
        )

    @staticmethod
    def _aggregate(samples: Sequence[MetricSample]) -> tuple[float | None, float | None]:
        if not samples:
            return None, None
        values = [sample.value for sample in samples]
        average = sum(values) / len(values)
        sorted_values = sorted(values)
        index = max(0, math.ceil(0.75 * len(sorted_values)) - 1)
        percentile_75 = sorted_values[index]
        return average, percentile_75


_store = _MetricStore()


async def _parse_metric(request: Request) -> MetricSample:
    """Parse incoming vitals payloads that may be sent as JSON or plain text."""

    raw = await request.body()
    if not raw:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty vitals payload")

    content_type = request.headers.get("content-type", "").lower()
    try:
        if "application/json" in content_type:
            return MetricSample.model_validate_json(raw.decode("utf-8"))
        text_payload = raw.decode("utf-8")
        if not text_payload:
            raise ValueError("blank text payload")
        return MetricSample.model_validate_json(text_payload)
    except (ValueError, ValidationError) as exc:
        logger.debug("Rejected vitals payload", exc_info=exc)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid vitals payload") from exc


@router.post("/vitals", status_code=status.HTTP_202_ACCEPTED, response_model=MetricIngestResponse)
async def record_metric(sample: MetricSample = Depends(_parse_metric)) -> MetricIngestResponse:
    """Record a Core Web Vitals sample sent from the frontend."""

    summary = await _store.add(sample)
    if summary.exceeds_budget:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "message": f"{sample.name} exceeded its budget",  # pragma: no mutate - descriptive budget failure
                "metric": summary.model_dump(mode="json"),
            },
        )
    return MetricIngestResponse()


@router.get("/vitals", response_model=QualityGatePayload)
async def read_metrics() -> QualityGatePayload:
    """Return aggregated Core Web Vitals metrics for the QA dashboard."""

    return await _store.summary()
