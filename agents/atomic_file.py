"""Crash-safe local file writes for worker runtime artifacts."""

from __future__ import annotations

import os
import tempfile
import fcntl
from pathlib import Path
from typing import Union


PathLike = Union[str, os.PathLike[str]]


def _sync_directory(directory: Path) -> None:
    try:
        descriptor = os.open(directory, os.O_RDONLY)
        try:
            os.fsync(descriptor)
        finally:
            os.close(descriptor)
    except OSError:
        # Directory fsync is not supported by every filesystem.
        pass


def write_text_atomic(path: PathLike, content: str, *, encoding: str = "utf-8") -> Path:
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=f".{target.name}.",
        suffix=".tmp",
        dir=target.parent,
        text=True,
    )
    temporary = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "w", encoding=encoding) as stream:
            stream.write(content)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, target)
        _sync_directory(target.parent)
        return target
    finally:
        try:
            temporary.unlink()
        except FileNotFoundError:
            pass


def append_text_atomic(path: PathLike, content: str, *, encoding: str = "utf-8") -> Path:
    """Append while serializing read/replace cycles across worker processes."""
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    lock_path = target.with_name(f".{target.name}.lock")
    with lock_path.open("a+", encoding="utf-8") as lock:
        fcntl.flock(lock.fileno(), fcntl.LOCK_EX)
        try:
            current = target.read_text(encoding=encoding) if target.is_file() else ""
            return write_text_atomic(target, current + content, encoding=encoding)
        finally:
            fcntl.flock(lock.fileno(), fcntl.LOCK_UN)
