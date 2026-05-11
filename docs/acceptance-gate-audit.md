# MarketPulse Acceptance Gate Audit

Last updated: 2026-05-11

Objective audited: follow `plans_losaltoshacks.md` by pushing MarketPulse toward a serious autonomous market-intelligence operating system through real shipped code, tests, runtime proof, honest docs, and visible product improvement.

## Current Verdict

Not complete yet.

Most local/demo gates are satisfied with strong evidence. The remaining blockers are external or high-risk infrastructure items:

- Full live Python/browser worker execution with live OpenAI inference is not proven because no live LLM credential is configured for the worker path (`OPENAI_API_KEY` is missing, and the MiniMax fallback is also missing).

## Prompt-To-Artifact Checklist

| Requirement | Evidence | Status |
| --- | --- | --- |
| Inspect real repo/runtime before changes | `docs/mega-build-continuation.md` records repo status, command outputs, backend findings, live smoke results, and known gaps. | Satisfied |
| Ship concrete code/tests/docs each loop | New/updated scripts, schemas, server routes, hooks, UI components, Playwright specs, README, Devpost copy, and continuation docs. | Satisfied |
| Fetch InsForge docs before InsForge work | InsForge instructions plus REST DB/auth docs fetched before verifier/smoke work. | Satisfied |
| Keep demo honest, not fake live claims | `MARKETPULSE_DEMO_MODE=1`, runtime health strip, README notes, and `/health` distinguish demo readiness from live degradation. | Satisfied |
| One command or documented pair to run locally | `pnpm dev:demo` in `scripts/run-demo.mjs`; README also documents two-terminal equivalent. | Satisfied |
| Health checks for required/optional services | `/health` checks AI server, InsForge DB probe, OpenAI, Python worker readiness, MongoDB vector, TTS, Brave Search, and runtime dir; `/api/worker/preflight` runs the real Python preflight with strict mode support and short cache/dedupe for repeated UI/API checks. | Satisfied |
| Server dashboard contract cleanup | `src/lib/masterbuild-contract.ts`, `useMasterBuildDashboard`, and Playwright API contract assertion. | Satisfied |
| Evidence visible beyond Market Research | Evidence surfaces in recommendations, final options, reports, briefings, accepted/rejected flows; `src/lib/evidence.ts` normalizes source metadata, `src/lib/evidence-quality.ts` scores final-option source quality plus freshness warnings, and `src/lib/briefing-trust.ts` summarizes briefing source/platform coverage. | Satisfied |
| Opportunity ranking inspectable and actionable | `src/lib/opportunity-scoring.ts` deterministically scores final mission options from evidence diversity, confidence, timing, execution load, risk, contradiction pressure, and missing channels; `FinalOptionsPanel` shows score drivers/warnings and `Research Evidence Gap` launches a targeted follow-up mission from `src/lib/followup-research.ts`; e2e asserts the scorecard and follow-up flow. | Satisfied for final mission options |
| Strategic decision libraries | `src/lib/decision-library.ts` summarizes stored decisions, evidence-backed counts, review debt, review cadence, and per-card decision/rejection memos; Accepted Ideas and Rejected Ideas now show those library surfaces, and Playwright covers both accepted and dismissed paths. | Satisfied for accepted/rejected flows |
| Recommendation follow-up missions | `src/lib/recommendation-followup.ts`, `useRecommendationFollowUpMission`, and `RecDetailModal` let open, accepted, and rejected recommendations launch a pressure-test mission from the recommendation evidence and decision context; Playwright covers the rejected decision-library path. | Satisfied for recommendation details |
| Executive briefing trust controls | `BriefingTrustLedger` shows source count, platform count, recommendation evidence coverage, risk, and warnings; `Regenerate using stricter evidence` filters briefing inputs to cited trends/recommendations, and audio generation waits for explicit playback. | Satisfied for briefing trust/readiness |
| Trend memory and forecasting | `src/lib/trend-memory.ts` classifies trend lifecycle, detection age, momentum change, forecast confidence, source/platform mix, watch window, next checks, and warnings; Trend Detail renders the memory panel and Playwright opens a generated trend from `/trends` to verify it. | Satisfied for Trend Detail |
| AI output audit trails | `src/lib/ai-output-audit.ts` and `AiOutputAuditTrail` expose artifact mode, model/source mode, prompt summary, source inputs, input counts, generated time, output token estimate, uncertainty label, and warnings on Report and Briefing. | Satisfied for report/briefing artifacts |
| Agent lifecycle inspectable | Agent statuses, detail, failure reason, retry count, confidence, heartbeat, timeline phases, trust audit warnings, mission-level recovery, and per-agent retry control flow through schema/server/worker/UI. | Satisfied |
| Accept/reject decision workflow persists | Local/demo fallback, InsForge table, service-role decision verifier, and browser-auth smoke on disposable backend. | Satisfied with caveat |
| Core user flow e2e tested | `e2e/app.spec.ts` core demo flow launches mission, inspects evidence, accepts opportunity, checks Accepted Ideas, Report, and Briefing. | Satisfied |
| Missing-LLM worker state visible | Runtime health strip surfaces `python-worker: missing-llm`, calls `/api/worker/preflight`, shows `worker-preflight: llm-missing`, and displays the OpenAI/MiniMax action text; focused Playwright coverage injects the real blocked-worker dashboard state and verifies `BLOCKED`, `5 needs review`, `Mission Error`, plus visible `Clear Mission` and `Retry Prompt` recovery controls. | Satisfied |
| Browser-auth decision persistence proof | `pnpm smoke:decision:browser` signs up through real UI, accepts `Launch Gen Z Recovery Planner`, verifies InsForge row, and cleans up. | Satisfied on disposable backend |
| Live mission queue proof | Live API server wrote/read real `missions`, `agents`, and `logs` rows against `r5em4tn7`; latest proof runs without ad-hoc env overrides and cleans its smoke rows. | Satisfied |
| Full live worker proof | Python worker preflight reaches `r5em4tn7` without command-prefix overrides and a disposable worker smoke marks missions/agents blocked when LLM credentials are absent. Live OpenAI-generated discoveries/plans/final options are not run end-to-end. | Blocked by missing live OpenAI/MiniMax credential |
| Design feels professional and responsive | Playwright desktop/mobile specs, mobile width/scroll regression assertion, manual screenshots, runtime health strip smoke. | Satisfied for current slice |
| Devpost story truthful | `docs/devpost-submission.md` updated to describe current real/demo/live state and next gaps. | Satisfied |
| Unsupported/mocked behavior identified | README and continuation docs call out demo mode, historical paused official backend, OpenAI/TTS/MongoDB optional/missing states, and remaining live-worker gaps. | Satisfied |
| Tailwind 3.4 project-doc requirement | Tailwind is pinned to 3.4.17 with PostCSS and `tailwind.config.cjs`; v4-only `@tailwindcss/vite`, `@theme`, and `tw-animate-css` usage has been removed. | Satisfied |

## Acceptance Gates

### Gate A: App Builds Cleanly

Evidence:

- `pnpm type-check` passed.
- `pnpm lint` passed.
- `pnpm test` passed; `src/env.test.ts` remains intentionally skipped.
- `pnpm build` passed with the existing large-chunk warning.

Status: satisfied.

### Gate B: Local Runtime Works

Evidence:

- `pnpm dev:demo` starts the deterministic AI server and Vite together.
- Smoke on ports `3330`/`3331` proved frontend and `/health` respond.
- `/api/dashboard` is covered by Playwright API smoke.
- `/health` reports missing live services as explicit checks instead of crashing.

Status: satisfied for demo/local runtime. Live runtime is degraded without a configured live LLM provider.

### Gate C: Core User Flow Works

Evidence:

- Playwright core demo flow covers user reaches app, mocked auth dashboard, Market Research, mission launch, agent states, evidence inspection, recommendation acceptance, Accepted Ideas, Report, and Briefing.
- The briefing segment of the core flow now verifies `Briefing Trust Ledger`, local draft mode, the strict-evidence regeneration control, strict-evidence mode, and the strict local source line.
- The core flow now also verifies report/briefing `AI Output Audit Trail`, local deterministic draft mode, source inputs, output token estimates, and strict-evidence local draft mode.
- Generated-trend Playwright coverage launches the deterministic mission through the API, opens `Recovery Routine Planners` from `/trends`, and verifies the Trend Detail memory panel.
- The same core flow now covers the final-results follow-up loop: `Research Evidence Gap` closes the result modal and launches a generated pressure-test prompt for the missing source coverage.
- Focused Playwright coverage dismisses a generated opportunity and verifies it becomes a rejected decision-library record with evidence and revisit guidance.
- The rejected decision-library Playwright path opens the recommendation detail, clicks `Research Follow-up`, and verifies a new Market Research mission prompt is launched from that decision context.
- Browser-auth decision smoke covers a real InsForge signup/accept/persist cycle on `r5em4tn7`.

Status: satisfied for demo plus disposable-backend auth smoke.

### Gate D: Evidence Is First-Class

Evidence:

- Evidence model and UI surfaces in `src/lib/evidence.ts`, `src/lib/evidence-quality.ts`, `RecDetailModal`, `DiscoveryGrid`, `FinalOptionsPanel`, `Report`, `Briefing`, and decision pages.
- Tests assert evidence appears in recommendation and research flows.
- Empty evidence states display warnings, and final-option source cards now expose deterministic quality scores plus missing-freshness warnings.
- Final-result evidence gaps are actionable through `buildFollowUpResearchPrompt`, which carries missing platforms, score warnings, and current signals into a new mission prompt.
- Accepted/rejected decision libraries now keep evidence counts, review debt, and decision/rejection memos visible after the user acts on an opportunity.
- Recommendation detail follow-up prompts carry attached evidence titles, confidence, priority, linked trend, current rationale, and action plan into a new mission.
- Executive briefings now include a trust ledger built from the briefing's trend, recommendation, and source inputs. Strict evidence mode filters unsupported briefing inputs and makes that stricter source boundary visible in the draft source line and warning copy.
- Trend Detail now translates the selected trend into a memory snapshot with lifecycle, detection age, source mix, forecast confidence, watch items, and evidence warnings.
- Reports and briefings now carry an explicit AI output audit trail so users can see generation mode, model/source mode, prompt summary, input/source counts, token estimate, uncertainty, and warnings before acting on the generated artifact.

Status: satisfied for the current shipped slice. Final mission options now have inspectable deterministic opportunity scoring, source-level quality/freshness warnings, a rendered follow-up mission path for evidence gaps, accepted/rejected decision-library review context, recommendation-level follow-up mission launch, briefing-level trust controls, trend-level memory/forecast context, and report/briefing output audit trails; deeper evidence-level credibility, novelty, and contradiction scoring remains future work.

### Gate E: Agent System Is Inspectable

Evidence:

- `insforge/masterbuild_schema.sql`, `server/ai-server.mjs`, `agents/masterbuild_runtime.py`, `useAgentData`, and research components support normalized states, heartbeats, failure reasons, retries, confidence, and partial results.
- `POST /api/agent/retry` writes a `retry_agent` control command, requeues the selected agent, logs the action, and has UI plus API Playwright coverage.
- `MissionTimeline` derives intake, source coverage, synthesis, decision package, and recovery phases from the dashboard payload and is covered in empty and partial mission Playwright states.
- `MissionTrustAudit` derives evidence diversity, missing channels, agent issues, stale heartbeats, confidence, and decision-readiness warnings from the same dashboard payload and is covered in empty and partial mission Playwright states.
- Playwright covers empty, partial, failed, stale, and completed/demo states.

Status: satisfied for inspectability. Replay-from-checkpoint controls are still future work; blocked/error mission clear, prompt retry, and failed-agent retry are now covered.

### Gate F: Design Feels Professional

Evidence:

- Desktop and mobile Playwright coverage.
- Mobile regression coverage asserts the page stays within the 390px viewport and can scroll from mission controls into Browser Sessions and Discoveries.
- Manual screenshots documented in `docs/mega-build-continuation.md`.
- Runtime health strip and mission controls verified at mobile width.
- Briefing trust ledger and strict evidence mode were rendered at desktop and 390px mobile widths with no horizontal overflow.
- Trend memory was rendered at desktop and 390px mobile widths with no horizontal overflow.
- Report and briefing AI output audit trails were rendered at desktop and 390px mobile widths with no horizontal overflow.

Status: satisfied for the current shipped slice. Tailwind is reconciled to the project-doc Tailwind 3.4 requirement, and the responsive shell bug found during visual QA is covered by e2e.

### Gate G: Documentation Is Honest

Evidence:

- README documents setup, demo command, env vars, health, schema verification, decision verification, browser-auth smoke, and current notes.
- `docs/devpost-submission.md` now matches the actual demo/live boundary.
- `docs/mega-build-continuation.md` records exact commands, live backend state, blockers, and next steps.
- The latest continuation entry records the briefing trust screenshots, the strict-evidence rendered QA, and the on-demand audio behavior.
- The latest continuation entry also records the trend memory screenshots, rendered Playwright fallback reason, and the new generated-trend e2e proof.
- The latest continuation entry records the AI output audit screenshots, rendered fallback reason, console health, and full verification ladder.

Status: satisfied.

## Commands Covered By The Latest Verification

```bash
node --check scripts/run-demo.mjs
node --check scripts/smoke-browser-decision.mjs
node --check server/ai-server.mjs
python -m py_compile agents/masterbuild_runtime.py agents/orchestrator.py agents/agent_context.py agents/builder_agent.py
node --check server/ai-server.mjs
pnpm worker:preflight
curl -fsS http://127.0.0.1:3224/health
curl -fsS http://127.0.0.1:3224/api/worker/preflight
pnpm schema:verify:masterbuild
pnpm schema:verify:decisions
pnpm smoke:decision:browser
pnpm type-check
pnpm lint
pnpm test
pnpm build
pnpm exec playwright test e2e/app.spec.ts -g "mobile command"
pnpm exec playwright test e2e/app.spec.ts -g "command view renders|mobile command|health endpoint|blocked live-worker"
pnpm exec playwright test e2e/app.spec.ts -g "blocked live-worker"
pnpm exec playwright test e2e/app.spec.ts -g "blocked live-worker|blocked mission"
pnpm exec playwright test e2e/app.spec.ts -g "failed agents can be retried|agent retry rejects"
pnpm exec playwright test e2e/app.spec.ts -g "observe view shows tabs|agent status taxonomy"
pnpm test -- src/lib/followup-research.test.ts src/lib/opportunity-scoring.test.ts src/lib/evidence-quality.test.ts
pnpm test -- src/lib/decision-library.test.ts
pnpm test -- src/lib/recommendation-followup.test.ts src/lib/decision-library.test.ts
pnpm test -- src/lib/briefing-trust.test.ts
pnpm test -- src/lib/trend-memory.test.ts
pnpm test -- src/lib/ai-output-audit.test.ts
pnpm exec playwright test e2e/app.spec.ts -g "core demo flow"
pnpm exec playwright test e2e/app.spec.ts -g "generated trend detail"
pnpm exec playwright test e2e/app.spec.ts -g "core demo flow|dismissed opportunities"
pnpm exec playwright test e2e/app.spec.ts -g "dismissed opportunities"
pnpm exec playwright test
git diff --check
```

Additional current smoke/verification commands recorded in `docs/mega-build-continuation.md`:

```bash
pnpm schema:verify:masterbuild
pnpm schema:verify:decisions
pnpm dev:demo
```

## Remaining Work Before Goal Completion

1. Provide/configure `OPENAI_API_KEY` plus optional `OPENAI_BASE_URL` / `OPENAI_BROWSER_BASE_URL` for an OpenAI-compatible gateway (or `MINIMAX_API_KEY` for the worker fallback), run `python scripts/verify-live-worker-preflight.py --strict`, then run the Python/browser worker in live mode and prove live discoveries, business plans, final options, recommendations, report, and briefing are generated from the real queue.
