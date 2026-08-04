"""Validation for structured model responses used by the Python worker."""

from __future__ import annotations

import math
from typing import Any


class StructuredModelOutputError(ValueError):
    """Raised when a model response cannot be treated as a valid artifact."""


PLAN_TEXT_FIELDS = (
    "market_opportunity",
    "competitive_landscape",
    "revenue_models",
    "user_acquisition",
    "risk_analysis",
    "executive_summary",
)


def _require_text(value: Any, field: str, *, max_length: int = 4000) -> str:
    if not isinstance(value, str) or not value.strip():
        raise StructuredModelOutputError(f"{field} must be a non-empty string")
    if len(value) > max_length:
        raise StructuredModelOutputError(f"{field} exceeds {max_length} characters")
    return value.strip()


def _require_confidence(value: Any) -> int | float:
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise StructuredModelOutputError("confidence_score must be a finite number")
    if value < 0 or value > 100:
        raise StructuredModelOutputError("confidence_score must be between 0 and 100")
    return value


def validate_business_plan(value: Any) -> dict[str, Any]:
    """Validate the complete business-plan shape before persistence or rendering."""
    if not isinstance(value, dict):
        raise StructuredModelOutputError("business plan must be an object")

    required = (*PLAN_TEXT_FIELDS, "confidence_score", "recommended_next_steps")
    missing = [field for field in required if field not in value]
    if missing:
        raise StructuredModelOutputError(f"business plan omitted fields: {', '.join(missing)}")

    normalized = dict(value)
    for field in PLAN_TEXT_FIELDS:
        normalized[field] = _require_text(value[field], field)
    normalized["confidence_score"] = _require_confidence(value["confidence_score"])

    next_steps = value["recommended_next_steps"]
    if not isinstance(next_steps, list) or not 3 <= len(next_steps) <= 5:
        raise StructuredModelOutputError("recommended_next_steps must contain 3 to 5 items")
    normalized_steps: list[str] = []
    for index, step in enumerate(next_steps):
        normalized_steps.append(_require_text(step, f"recommended_next_steps[{index}]", max_length=240))
    normalized["recommended_next_steps"] = normalized_steps
    return normalized
