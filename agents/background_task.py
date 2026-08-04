"""Helpers for making scheduled asyncio work observable."""

from __future__ import annotations

import asyncio
from typing import Any


def observe_task(task: asyncio.Task[Any], *, label: str) -> None:
    """Consume a task's result so unexpected background failures are visible."""

    def report(completed: asyncio.Task[Any]) -> None:
        try:
            completed.result()
        except asyncio.CancelledError:
            return
        except Exception as error:
            print(f"[background-task] {label} failed: {error}")

    task.add_done_callback(report)
