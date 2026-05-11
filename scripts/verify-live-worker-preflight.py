from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "agents"))

from masterbuild_runtime import InsForgeRuntimeClient, MasterBuildAI  # noqa: E402


def configured(name: str) -> bool:
    return bool(os.getenv(name, "").strip())


async def run_preflight(*, strict: bool) -> int:
    client: InsForgeRuntimeClient | None = None
    ai: MasterBuildAI | None = None
    result: dict[str, Any] = {
        "ok": False,
        "strict": strict,
        "insforge": {"status": "unknown"},
        "liveLlm": {"status": "unknown"},
        "workerCanStart": False,
        "liveMissionReady": False,
    }

    try:
        client = InsForgeRuntimeClient()
        rows = await client.list_records("missions", params={"limit": "1"}, retry_on_429=False)
        result["insforge"] = {
            "status": "ready",
            "baseUrl": client.base_url,
            "missionReadOk": isinstance(rows, list),
        }
        result["workerCanStart"] = True
    except Exception as error:
        result["insforge"] = {
            "status": "error",
            "message": str(error),
        }

    try:
        ai = MasterBuildAI()
        openai_ready = configured("OPENAI_API_KEY")
        minimax_ready = configured("MINIMAX_API_KEY")
        llm_ready = bool(ai._client or ai._openai_fallback)
        result["liveLlm"] = {
            "status": "ready" if llm_ready else "missing",
            "openaiConfigured": openai_ready,
            "openaiBaseUrl": ai._openai_base_url,
            "openaiModel": ai._openai_model,
            "minimaxConfigured": minimax_ready,
            "minimaxBaseUrl": ai.base_url,
            "minimaxModel": ai.model,
            "browserUseCloudConfigured": configured("BROWSER_USE_API_KEY"),
            "braveSearchConfigured": configured("BRAVE_SEARCH_API_KEY"),
            "action": "" if llm_ready else (
                "Set OPENAI_API_KEY for live OpenAI inference, or MINIMAX_API_KEY "
                "to let the Python worker use its MiniMax fallback."
            ),
        }
    except Exception as error:
        result["liveLlm"] = {
            "status": "error",
            "message": str(error),
        }

    result["liveMissionReady"] = (
        result["workerCanStart"] and result["liveLlm"].get("status") == "ready"
    )
    result["ok"] = result["liveMissionReady"] if strict else result["workerCanStart"]

    print(json.dumps(result, indent=2))

    if ai is not None:
        await ai.close()
    if client is not None:
        await client.close()

    return 0 if result["ok"] else 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Check live MarketPulse Python worker prerequisites.")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Fail unless both InsForge and a live LLM provider are configured.",
    )
    args = parser.parse_args()
    return asyncio.run(run_preflight(strict=args.strict))


if __name__ == "__main__":
    raise SystemExit(main())
