# MarketPulse

MarketPulse is a Vite + React + TypeScript market-intelligence app for operators. It tracks market signals, shows the evidence behind opportunities, turns recommendations into decisions, and publishes report/briefing artifacts from the latest research mission.

## What Is Real Today

- The frontend has a dashboard, Market Research cockpit, trends, recommendations, accepted/rejected decision libraries, history, reports, and briefings.
- The AI server exposes mission control, dashboard, trends, recommendations, semantic search, AI inference, and TTS routes.
- InsForge is the live backend path for auth, database, realtime, and mission data when credentials are configured.
- `MARKETPULSE_DEMO_MODE=1` runs a local, honest demo path with seeded evidence, agents, recommendations, reports, and briefings without external credentials.
- Recommendation decisions persist through InsForge `recommendation_decisions` when that schema is applied, with a local/demo fallback so accepted ideas still appear in the accepted-ideas library across route loads.

## Local Setup

Prerequisites:

- Node.js `>=22.9.0`
- pnpm

Install dependencies:

```bash
pnpm install
```

This repo includes `pnpm-workspace.yaml` with `allowBuilds.esbuild: true` so Vite can build under pnpm's build-script approval policy.

## Run The Demo

One command:

```bash
pnpm dev:demo
```

Then open:

```text
http://127.0.0.1:3000
```

The runner starts both the deterministic demo AI server and Vite, and stops both when you press `Ctrl-C`.

If ports `3000` or `3001` are occupied, choose another pair:

```bash
MARKETPULSE_FRONTEND_PORT=3300 MARKETPULSE_AI_PORT=3301 pnpm dev:demo
```

Manual two-terminal equivalent:

```bash
MARKETPULSE_DEMO_MODE=1 AI_SERVER_PORT=3001 node server/ai-server.mjs
```

```bash
VITE_API_BASE_URL=http://127.0.0.1:3001 pnpm exec vite --host 127.0.0.1 --port 3000 --strictPort
```

Then open:

```text
http://127.0.0.1:3000
```

The Playwright harness uses isolated ports `3210` and `3211`.

## Demo Path

1. Sign in through the mocked/e2e auth path or use a configured InsForge session.
2. Open Market Research.
3. Launch a mission such as `AI wellness apps for Gen Z`.
4. Inspect discoveries and the Source Evidence section in the results modal.
5. Open Recommendations and accept `Launch Gen Z Recovery Planner`.
6. Confirm the decision appears in Accepted Ideas.
7. Open Report and Briefing to see generated strategy artifacts from the same mission.

## Environment Variables

Live mode:

```bash
VITE_INSFORGE_URL=...
VITE_INSFORGE_ANON_KEY=...
MASTERBUILD_INSFORGE_URL=...  # optional server-side override for mission runtime
INSFORGE_SERVICE_ROLE_KEY=... # optional server-side privileged key; local scripts can also use ignored .insforge/project.json
OPENAI_API_KEY=...            # required for live OpenAI recommendation/analysis generation
OPENAI_BASE_URL=...           # optional OpenAI-compatible gateway URL
OPENAI_BROWSER_BASE_URL=...   # optional browser-agent OpenAI-compatible gateway URL
MONGODB_URI=...               # optional semantic/vector search
MONGODB_DB_NAME=...
ELEVENLABS_API_KEY=...        # optional audio generation
MINIMAX_API_KEY=...           # optional prompt dictation/TTS
BRAVE_SEARCH_API_KEY=...      # optional background refresh
```

Demo mode only needs the checked-in Vite InsForge development values plus:

```bash
MARKETPULSE_DEMO_MODE=1
```

Missing live secrets should degrade to clear API errors or demo/empty states rather than crashing the whole frontend.

## Health Check

The AI server exposes a readiness report:

```bash
curl -fsS http://127.0.0.1:3001/health
```

The response includes `ok`, `demoMode`, `missingRequired`, and per-integration checks for InsForge, OpenAI, the Python mission worker, MongoDB vector search, TTS, Brave Search, and the runtime preview directory. The InsForge check performs a lightweight database probe against the configured app backend. In demo mode, missing or unreachable live-only services are reported as degraded checks instead of failing the server.

The Market Research cockpit also shows this status in-app so demo readiness, live backend degradation, and live worker blockers are visible before a user trusts a mission result. The strip also calls the worker preflight route and shows the exact current action when live mission execution is blocked.

For the exact Python worker preflight used by the CLI script:

```bash
curl -fsS http://127.0.0.1:3001/api/worker/preflight
```

Add `?strict=1` to make the API fail until both InsForge and a live LLM provider are ready.

## Live Worker

The Python mission worker reads the same local InsForge env surfaces as the Node server:

- `MASTERBUILD_INSFORGE_URL` / `MASTERBUILD_INSFORGE_TOKEN`
- `INSFORGE_SERVICE_ROLE_KEY`
- `VITE_INSFORGE_URL` / `VITE_INSFORGE_ANON_KEY`
- `NEXT_PUBLIC_INSFORGE_URL` / `NEXT_PUBLIC_INSFORGE_ANON_KEY`
- ignored `.insforge/project.json` when it matches the selected backend

Check live-worker prerequisites without printing secrets:

```bash
pnpm worker:preflight
```

Run it with `--strict` when you want a failing exit code until a live LLM provider is configured:

```bash
python scripts/verify-live-worker-preflight.py --strict
```

Start the worker:

```bash
pnpm worker:live
```

Without `OPENAI_API_KEY` or `MINIMAX_API_KEY`, the worker can reach InsForge but marks live missions and agents as blocked with a visible missing-LLM log instead of silently leaving queued work behind. `OPENAI_BASE_URL` and `OPENAI_BROWSER_BASE_URL` are supported for OpenAI-compatible gateways, but a provider credential is still required for the current worker path.

## Mission API Contract

The shared dashboard contract lives in `src/lib/masterbuild-contract.ts`.

`GET /api/dashboard` returns:

```text
mission | recentMissions | agents | discoveries | logs | signals | thoughts | memory | businessPlans
```

The frontend validates that shape before normalizing it for React views. `POST /api/mission/create` returns an `ok` response with `mission.mission_id`, `prompt`, `status`, and `supersededMissionIds`. `POST /api/agent/retry` accepts `{ missionId?, agentId }`, writes a `retry_agent` control command, requeues the selected agent with visible retry status, and reopens terminal missions to `queued` so the cockpit can recover a failed channel without clearing the whole mission.

## InsForge Schema

The desired live schema is tracked in:

```bash
insforge/schema.sql
insforge/masterbuild_schema.sql
```

Apply it to the InsForge project before relying on live decision persistence or live agent mission persistence. The newer `recommendation_decisions` table intentionally stores AI-generated recommendation snapshots without requiring those generated recommendations to exist in the seeded `market_recommendations` table. The masterbuild schema includes the richer agent lifecycle fields used by the Market Research cockpit: status detail, failure reason, retry count, confidence, and heartbeat.

To verify the configured backend has the required tables and columns:

```bash
pnpm schema:verify:masterbuild
```

This command uses the app env (`VITE_INSFORGE_URL`/`VITE_INSFORGE_ANON_KEY` or service-role equivalents) rather than the currently selected MCP project, so it catches accidental backend mismatches.

To prove generated recommendation decisions can actually write, update, read, and delete against the configured backend:

```bash
pnpm schema:verify:decisions
```

That verifier creates a temporary auth user to satisfy the real `auth.users` foreign key, writes a disposable `recommendation_decisions` row, updates it from accepted to dismissed, reads it back, then deletes both records.

The checked-in development env now points at the active replacement MarketPulse backend used for local proof. If you intentionally switch back to another backend, link that backend locally or export an explicit override before live schema/runtime proof:

```bash
MASTERBUILD_INSFORGE_URL=https://your-app.region.insforge.app \
INSFORGE_SERVICE_ROLE_KEY=... \
pnpm schema:verify:masterbuild
```

## Verification

Static and build checks:

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

End-to-end checks:

```bash
pnpm exec playwright test
```

The e2e suite starts the demo AI server on `3211` and Vite on `3210`, then proves login routing, dashboard navigation, Market Research command/observe views, mobile Market Research visibility, mission launch, agent failed/stale states, lifecycle metadata, evidence inspection, decision acceptance, accepted idea history, report view, briefing view, and AI-server API smoke endpoints.

## Current Notes

- Styling is pinned to Tailwind CSS 3.4.17 with PostCSS, `tailwind.config.cjs`, and `tailwindcss-animate`; the v4-only `@tailwindcss/vite`, `@theme`, and `tw-animate-css` path has been removed to match the project instructions.
- Live recommendations require live mission data and AI credentials. Demo mode is intentionally labeled and deterministic for local proof.
- A live InsForge mission-queue smoke has been proven against the active replacement backend without ad-hoc env overrides: `/health` showed InsForge ready, `/api/mission/create` wrote real mission/agent rows, and `/api/dashboard` read them back. Full live worker execution still needs `OPENAI_API_KEY`.
- The Python worker now reaches that active backend without command-prefix overrides. Current preflight shows InsForge ready and the live LLM provider missing, so full worker output remains blocked on `OPENAI_API_KEY` or `MINIMAX_API_KEY`.
- A live InsForge decision-persistence smoke has been proven against the same active replacement backend with `pnpm schema:verify:decisions`.
- Browser-authenticated decision persistence can be verified on the disposable active backend with `pnpm smoke:decision:browser`. That smoke temporarily disables email verification on the disposable backend, signs up through the real UI, accepts the demo recommendation, verifies the accepted row in InsForge, then restores auth config and deletes the smoke records.
- Audio generation gracefully fails if ElevenLabs/MiniMax keys are absent; report and briefing text remain usable.
