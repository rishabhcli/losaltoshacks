# Deci-Centennial System Evolution & Integrity Audit

**Target:** `losaltoshacks` — "Maygoals VentureLab / MarketPulse"
**Stack:** React 19 + Vite SPA (`src/`), single-file Node AI server (`server/ai-server.mjs`, 4,491 lines), Python agent runtime (`agents/masterbuild_runtime.py`, 5,231 lines), InsForge (Postgres) backend (`insforge/*.sql`), MongoDB Atlas vector layer (`server/lib/mongodb-vector.mjs`), browser-localStorage as the primary domain datastore (`src/lib/venture-portfolio.ts`, 19,314 lines).
**Audit date:** 2026-06-12. Every finding below was verified by reading the cited source.

---

## Phase 1 — The 50-Point Critique

### Category A: Architecture, State Management & Scaling Anti-Patterns

> ### [Issue #1]: Authoritative application state lives in browser `localStorage`, not a database
> * **Category:** A
> * **SystemicImpact:** The entire venture portfolio — theses, experiments, decisions, audit ledgers — is single-device, single-browser, ~5 MB-capped, un-synced, un-backed-up, and invisible to the server. No multi-user, multi-device, or team scenario is possible. This is an existential ceiling on the product.
> * **TechnicalBreakdown:** `src/lib/venture-portfolio.ts` (19,314 lines, 375 `export`s) reads and writes everything through `window.localStorage` (`browserStorage()` at line 3367; `storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next))` repeated at lines 4437, 4480, 4528, 4579, 4638, 4691, 4748, 4862…). `VentureLab.tsx` loads via `loadVenturePortfolio(ownerKey)` (line 5123). The InsForge tables exist but are used for the *agent mission* side; the founder-facing portfolio never reaches them.
> * **RemediationParadigm:** Promote a server-side, owner-scoped persistence service (Postgres/InsForge with per-row ownership) as the system of record. Reduce `localStorage` to an offline cache hydrated from and reconciled against the server. Model the portfolio as an event log so edits become append-only facts, not blob overwrites.

> ### [Issue #2]: Server holds request-spanning state in module-level memory — horizontal scaling is impossible
> * **Category:** A
> * **SystemicImpact:** The moment a second instance is started behind a load balancer, caches diverge, in-flight de-duplication breaks, and the demo dashboard state is per-process. The server can never scale past one box without behavior changing.
> * **TechnicalBreakdown:** `server/ai-server.mjs` keeps `let workerPreflightCache` / `workerPreflightInFlight` (lines 153–154), `let dashboardSnapshotCache` / `dashboardSnapshotFetchedAt` / `dashboardSnapshotInFlight` (569–571), `let demoDashboardState` (576), and `let recsCache` + `const recsInflightByKey = new Map()` (2393–2396). All are process-local mutable state mutated from concurrent async request handlers.
> * **RemediationParadigm:** Externalize shared state to Redis (or equivalent) for caches and in-flight coalescing; make handlers stateless. Adopt a request-coalescing library backed by a shared store, not a module `Map`.

> ### [Issue #3]: A `setInterval` background job runs *per process*, so N replicas = N× duplicate paid work
> * **Category:** A
> * **SystemicImpact:** The background refresh (web search + LLM synthesis, real cost) fires from every instance's own timer. Scaling to 5 instances silently quintuples API spend and write contention with no coordination.
> * **TechnicalBreakdown:** `server/ai-server.mjs:3919` schedules a startup run at 60 s, then `setInterval(() => { runBackgroundDataRefresh()… }, BG_JOB_INTERVAL_MS)` (line 3924) every 12 h — embedded in the web process itself.
> * **RemediationParadigm:** Move periodic work to a dedicated, singleton scheduler (cron job, queue worker with leader election, or a managed scheduler) decoupled from the request-serving process.

> ### [Issue #4]: God-module — `venture-portfolio.ts` is 19,314 lines / 375 exports
> * **Category:** A
> * **SystemicImpact:** No human or AI agent can safely reason about, test, or refactor a 19k-line module with 375 exported symbols. Every change risks the entire domain. This is the single largest maintainability bottleneck for a decade-long autonomous-management goal.
> * **TechnicalBreakdown:** `wc -l src/lib/venture-portfolio.ts` → 19,314; `grep -c "^export "` → 375. It mixes types, storage I/O, business rules, and dozens of sub-domains (deployment escalation, demand-source blockers, breach-process regressions, atlas validation…).
> * **RemediationParadigm:** Decompose by bounded context into independently testable packages with explicit interfaces; enforce a `max-lines` lint ceiling; forbid storage I/O inside domain logic (ports-and-adapters).

> ### [Issue #5]: God-component — `VentureLab.tsx` is 12,212 lines with 199 `useState` hooks
> * **Category:** A
> * **SystemicImpact:** A single React component with 199 pieces of local state and 70+ child panels re-renders enormous trees on any change, defeats memoization, and is untestable in isolation. Performance and correctness both degrade super-linearly with feature growth.
> * **TechnicalBreakdown:** `wc -l src/pages/VentureLab.tsx` → 12,212; `grep -c useState` → 199; `grep -c useEffect` → 8. It orchestrates 70+ panel components from `src/components/research/` (72 `.tsx` files there).
> * **RemediationParadigm:** Split into route-level sub-features with their own state containers; lift shared state into a store (Zustand/Jotai/React Query cache) keyed by entity; lazy-load panels; replace ad-hoc `useState` with derived/server state.

> ### [Issue #6]: Frontend polls every 3 seconds instead of streaming — wasteful and stale
> * **Category:** A
> * **SystemicImpact:** Live dashboards re-fetch the full snapshot on a 3 s timer regardless of change, multiplying server/DB load by active-tab count and still showing data up to 3 s stale. At scale this is a self-inflicted DDoS.
> * **TechnicalBreakdown:** `src/hooks/useMasterBuildDashboard.ts:493` runs `setInterval(..., 3000)` and `:483` schedules a 2 s retry; each tick reloads the whole dashboard.
> * **RemediationParadigm:** Replace polling with server-sent events / WebSocket push (InsForge realtime already exists per `AGENTS.md`) and delta updates; fall back to backoff polling only when the stream drops.

> ### [Issue #7]: Single 4,491-line untyped `.mjs` server with a 23-branch `if`-chain router
> * **Category:** A
> * **SystemicImpact:** All 23 endpoints, business logic, caching, scheduling, and provider integrations live in one untyped file routed by sequential string compares. There is no module boundary, no middleware pipeline, and no type contract — the server cannot be safely evolved by autonomous agents.
> * **TechnicalBreakdown:** Routes are matched by `if (request.method === … && url.pathname === …)` (lines 3953–4430, 23 branches). No framework, no router, no schema layer.
> * **RemediationParadigm:** Adopt a typed server (TypeScript + a real router/framework), split handlers into modules, introduce middleware for auth/validation/logging, and generate the route table from a typed contract.

> ### [Issue #8]: Request bodies are fully buffered in memory and `JSON.parse`d on the event loop with no size limit
> * **Category:** A
> * **SystemicImpact:** A single large or malicious payload blocks the event loop (synchronous parse) and can exhaust process memory, stalling *all* concurrent requests on that instance. There is no backpressure.
> * **TechnicalBreakdown:** `readJsonBody` (lines 93–101) does `for await (const chunk of request) chunks.push(chunk)` then `Buffer.concat(chunks).toString("utf8")` and `JSON.parse(raw)` — no `Content-Length`/`MAX_BODY` cap (grep for body-size guards returns none).
> * **RemediationParadigm:** Enforce a strict body-size limit with a streaming parser, reject oversized payloads with 413, and offload heavy parsing to worker threads.

> ### [Issue #9]: No process supervision — the AI server and Python orchestrator have no restart story
> * **Category:** A
> * **SystemicImpact:** A crash takes the system down until a human notices. `uncaughtException` calls `process.exit(1)` with nothing to restart it; the Python runtime is a bare `asyncio.run` with no supervisor. This is incompatible with the "self-healing, zero-human-intervention" north star.
> * **TechnicalBreakdown:** `server/ai-server.mjs:23` — `process.on("uncaughtException", … process.exit(1))`. Dev scripts use `nohup vite … &` (`package.json:90–91`). `agents/orchestrator.py` is just `asyncio.run(run_masterbuild())` with no supervision.
> * **RemediationParadigm:** Run under a supervisor/orchestrator (systemd, PM2, or Kubernetes with liveness/readiness probes and restart policies); add graceful shutdown on SIGTERM and health-gated rolling deploys.

> ### [Issue #10]: Four competing "sources of truth" with no defined authority
> * **Category:** A
> * **SystemicImpact:** Data is split across InsForge Postgres, MongoDB Atlas, browser `localStorage`, and a `MARKETPULSE_DEMO_MODE` synthetic path — with no documented ownership. Reconciliation bugs and contradictory reads are inevitable as data grows.
> * **TechnicalBreakdown:** Mission/agent data → InsForge (`insforge/*.sql`); vectors/discoveries → Mongo (`server/lib/mongodb-vector.mjs`); founder portfolio → `localStorage` (`venture-portfolio.ts`); demo dashboard → in-memory `demoDashboardState` toggled by `DEMO_MODE` (`ai-server.mjs:574`). Two package managers are also committed (`package-lock.json` *and* `pnpm-lock.yaml`).
> * **RemediationParadigm:** Declare one system of record per bounded context, document the data-flow topology, and make every other store a derived/cache projection with explicit sync direction.

### Category B: Cognitive Friction, Interaction Flow & Next-Gen UX Debt

> ### [Issue #11]: Internal/Palantir-flavored jargon is the user-facing vocabulary
> * **Category:** B
> * **SystemicImpact:** A founder cannot understand "Atlas Validation Result Ledger," "No-Send Email Gate Worklist," "Demand Source Blocker Packet Triage Queue," or "Breach Process Regression Escalation Audit." The product reads as built for insiders; comprehension and adoption collapse.
> * **TechnicalBreakdown:** These are real component/route names surfaced in the UI — see `vite.config.ts:35–93` chunk map and `README.md` section headers (e.g., "No-Send Email Gate Worklist," "Atlas Validation Command Packs"). 72 such panel files exist in `src/components/research/`.
> * **RemediationParadigm:** Run a domain-language pass that maps every internal term to plain founder language; gate UI copy behind a glossary/i18n layer; user-test labels before shipping.

> ### [Issue #12]: One page renders 70+ panels with no onboarding, empty state, or progressive disclosure
> * **Category:** B
> * **SystemicImpact:** First-run users face a wall of dozens of dense panels and 199 stateful controls with zero guidance. Time-to-first-value is effectively infinite; this is a retention killer.
> * **TechnicalBreakdown:** `VentureLab.tsx` (12,212 lines, 199 `useState`) mounts 70+ `research/*` panels at once; there is no first-run flow or guided empty state.
> * **RemediationParadigm:** Introduce a guided onboarding, role-based progressive disclosure, and meaningful empty states; default to a minimal "cockpit" and reveal advanced ledgers on demand.

> ### [Issue #13]: No way to cancel any long-running AI operation
> * **Category:** B
> * **SystemicImpact:** Mission runs and briefing/report synthesis take tens of seconds with no cancel and no ETA. A user who started the wrong run must wait it out (and pay for it). Perceived freezes drive abandonment.
> * **TechnicalBreakdown:** `AbortController` appears in exactly one file (`src/hooks/useWorkerPreflight.ts`) — a health check. No AI mutation path threads an abort signal; UI shows indeterminate spinners only.
> * **RemediationParadigm:** Thread `AbortController` through every async action, expose a Cancel control, and show progress/ETA from server-streamed phase events.

> ### [Issue #14]: `localStorage` writes are unguarded — quota exhaustion silently destroys work
> * **Category:** B
> * **SystemicImpact:** When the ~5 MB quota is hit (easy given multi-kB blobs per sub-domain), `setItem` throws `QuotaExceededError`, the save is lost, and the user is never told. Hours of editing vanish.
> * **TechnicalBreakdown:** Save paths in `venture-portfolio.ts` (e.g., lines 4437–4862) and `osdk-shims.ts` call `setItem` with no surrounding `try/catch`. The only `catch` is on the *load* side (`venture-portfolio.ts:4419`), which silently resets to empty.
> * **RemediationParadigm:** Wrap writes, detect quota errors, surface a clear toast, and fail over to server persistence; add autosave + restore.

> ### [Issue #15]: No multi-tab synchronization — concurrent tabs clobber each other
> * **Category:** B
> * **SystemicImpact:** Two tabs (a normal user pattern) silently overwrite each other's portfolio because neither listens for `storage` events. Last write wins; the other tab's edits are lost with no warning.
> * **TechnicalBreakdown:** No `window.addEventListener("storage", …)` exists in `src/`; `VentureLab.tsx` loads once per mount (lines 5123/5193/5213) and never reconciles.
> * **RemediationParadigm:** Listen to `storage` events to reconcile, or move to server state with optimistic concurrency (version/ETag) and conflict surfacing.

> ### [Issue #16]: Destructive deletes have no confirmation and no undo
> * **Category:** B
> * **SystemicImpact:** With `localStorage` as the only store, an accidental delete is irreversible — there is no server copy to recover from. One stray click destroys a venture record and its evidence.
> * **TechnicalBreakdown:** `VentureLab.tsx` has 8 delete-style handlers/`Trash2` usages but `grep` for `window.confirm`/`AlertDialog` in that file returns 0 confirmations.
> * **RemediationParadigm:** Require confirmation for destructive actions, implement soft-delete + undo (trash/restore), and back deletes with a server-side audit trail.

> ### [Issue #17]: Network/AI failures are swallowed with no user feedback
> * **Category:** B
> * **SystemicImpact:** Users get no signal when an action silently fails; they retry blindly or assume the feature is broken. Trust erodes.
> * **TechnicalBreakdown:** `VoiceButton.tsx` `catch { setState("idle") }` (no toast); `MarketResearch.tsx:32–38` posts theme with `.catch(() => {})`. The `sonner` toast system exists but isn't wired to these failures.
> * **RemediationParadigm:** Standardize an error-presentation layer (toast + inline) for every mutation; never swallow a user-initiated failure.

> ### [Issue #18]: Only one app-shell error boundary — a single panel crash blanks the cockpit
> * **Category:** B
> * **SystemicImpact:** With 70+ panels in one tree under a single boundary (`src/components/market/ErrorBoundary.tsx` in `AppLayout.tsx`), one panel's render throw takes down the entire workspace instead of degrading locally.
> * **TechnicalBreakdown:** `ErrorBoundary` is mounted once at the layout level; there are no per-panel/per-route boundaries around the `research/*` panels.
> * **RemediationParadigm:** Wrap each lazily-loaded panel/route in its own boundary with a localized fallback and a "reload this panel" affordance.

> ### [Issue #19]: OAuth callback is a stub that redirects without validating the session
> * **Category:** B
> * **SystemicImpact:** Real auth exists (`LoginPage.tsx` uses `insforge.auth.signInWithPassword`/`signUp`/`signInWithOAuth`), but the callback discards the result. A failed OAuth exchange still lands the user on home, producing confusing half-authenticated states.
> * **TechnicalBreakdown:** `src/AuthCallback.tsx` simply `navigate("/", { replace: true })` in a `useEffect` with no token/error/state handling.
> * **RemediationParadigm:** Validate the OAuth state and session in the callback, handle errors explicitly, and route to a clear error screen on failure.

> ### [Issue #20]: Fixed pixel widths break the layout on small screens
> * **Category:** B
> * **SystemicImpact:** Hardcoded `min-w-[180px]`/`min-w-[220px]` selects inside dense rows overflow on phones/tablets, creating horizontal-scroll traps and unusable controls for mobile users.
> * **TechnicalBreakdown:** e.g., `src/components/research/DemandSourceBlockerDrilldownPanel.tsx:60` (`h-8 min-w-[180px] …`) and similar in `VentureLab.tsx`. No responsive variants accompany them.
> * **RemediationParadigm:** Replace fixed widths with fluid/responsive constraints, add container queries, and test against mobile breakpoints in CI.

### Category C: Boundary Conditions, Edge Cases & Data Corruption Faults

> ### [Issue #21]: Read-modify-write on `localStorage` loses updates under concurrency
> * **Category:** C
> * **SystemicImpact:** Every mutation loads the whole portfolio, mutates in memory, and writes the whole blob back. Two interleaved operations (two tabs, or a fast user) drop one update entirely.
> * **TechnicalBreakdown:** `loadVenturePortfolio` (line 4407) → mutate → `storage.setItem(getVenturePortfolioStorageKey(ownerKey), JSON.stringify(next))` (e.g., 4437). The load→mutate→save is non-atomic with no version check.
> * **RemediationParadigm:** Move to per-entity records with optimistic concurrency (version stamps) on a transactional store; never serialize the whole domain as one blob.

> ### [Issue #22]: No schema versioning — a parse failure silently wipes stored data
> * **Category:** C
> * **SystemicImpact:** When a stored blob predates a code change or is partially corrupted, the loader returns `[]`/`{}` and the app proceeds as if the data never existed — silent, total loss for that key.
> * **TechnicalBreakdown:** Loaders do `try { JSON.parse } catch { return [] }` (e.g., `venture-portfolio.ts:4419`; dozens of similar loaders in `VentureLab.tsx`). No version field, no migration step.
> * **RemediationParadigm:** Stamp every persisted blob with a schema version, run forward-migrations on read, and quarantine (don't discard) unparseable data with user-visible recovery.

> ### [Issue #23]: Entity IDs are minted from `Date.now()` — collisions corrupt records
> * **Category:** C
> * **SystemicImpact:** Two records created in the same millisecond (batch import, rapid actions) get identical IDs and silently overwrite each other.
> * **TechnicalBreakdown:** `VentureLab.tsx` uses `Date.now()`-based IDs in 8 places, e.g., `id: \`portfolio-import-audit-${Date.now()}\`` (line 5950), `\`deployment-escalation-view-${Date.now()}\`` (7719), `\`${view.id}-imported-copy-${Date.now()}-${index}\`` (2909/2959).
> * **RemediationParadigm:** Use `crypto.randomUUID()` (already mandated by the ESLint `no-Math.random` rule) for all IDs; never derive identity from a timestamp.

> ### [Issue #24]: Server inputs are never validated — wrong shapes reach providers and DB
> * **Category:** C
> * **SystemicImpact:** Missing/huge/mistyped fields flow straight into LLM calls, Mongo queries, and file writes, producing provider errors, malformed writes, or memory pressure. No defense at the boundary.
> * **TechnicalBreakdown:** No schema-validation dependency exists (no `zod`/`ajv`/`joi`/`yup` in `package.json`); handlers read `body.systemPrompt`, `body.imageUrl`, etc. directly (e.g., `/api/ai/infer`, `ai-server.mjs:4155–4170`).
> * **RemediationParadigm:** Define request/response schemas (Zod) at every endpoint, reject invalid input with 4xx, and derive TypeScript types from the schemas.

> ### [Issue #25]: Malformed LLM output is silently coerced to `{}` — downstream renders garbage
> * **Category:** C
> * **SystemicImpact:** When a model returns prose, fenced JSON, or truncated output, the parser returns an empty object and the pipeline proceeds with missing fields — corrupt artifacts with no error and no retry.
> * **TechnicalBreakdown:** `server/lib/openai.mjs:8–17` `parseJson` does `try { JSON.parse(text) } catch { return {} }`; `server/lib/gemini.mjs:35–40` does the same. No fence-stripping, schema check, or repair/retry.
> * **RemediationParadigm:** Use structured-output/JSON-mode, strip code fences, validate against a schema, and retry with a repair prompt on failure instead of swallowing it.

> ### [Issue #26]: File writes are non-atomic — a crash mid-write leaves partial/corrupt files
> * **Category:** C
> * **SystemicImpact:** Generated app scaffolds and runtime artifacts can be left half-written if the process dies during a write, corrupting the materialized output.
> * **TechnicalBreakdown:** `scripts/materialize-generated-app.mjs:152` calls `fs.writeFileSync(file.fullPath, file.content)` directly (after `mkdirSync`), with no temp-file + atomic `rename`.
> * **RemediationParadigm:** Write to a temp file then `fs.rename` (atomic on the same filesystem); fsync where durability matters; checksum-verify after write.

> ### [Issue #27]: 69 broad `except Exception` blocks hide failures in the agent runtime
> * **Category:** C
> * **SystemicImpact:** The Python runtime catches nearly everything generically, masking the real failure mode. Corrupted state and silent partial completions accumulate with no signal.
> * **TechnicalBreakdown:** `grep -c "except Exception" agents/masterbuild_runtime.py` → 69, scattered across LLM calls, file I/O, and provider fallbacks (lines 288, 726, 1191, 1270…).
> * **RemediationParadigm:** Catch specific exceptions, attach structured context, re-raise or route to a typed error channel, and alert on swallowed failures.

> ### [Issue #28]: Fire-and-forget promises drop errors on both client and server
> * **Category:** C
> * **SystemicImpact:** Async work whose result/rejection is ignored leaves the system in an undefined state — a write may have failed while the UI shows success.
> * **TechnicalBreakdown:** Client: `MarketResearch.tsx:32–38` `fetch(...).catch(() => {})`. Server: the unhandled-rejection handler (below) only logs, so floated rejections are non-fatal and invisible.
> * **RemediationParadigm:** `await` and handle every promise; lint with `no-floating-promises`; make unhandled rejections fail loudly in non-prod.

> ### [Issue #29]: `unhandledRejection` only logs while `uncaughtException` hard-exits — worst of both
> * **Category:** C
> * **SystemicImpact:** Rejected promises leave the process running in a possibly-corrupt state (no recovery), while any uncaught throw kills the process outright with no restart — so the failure modes are "silent corruption" and "sudden death," neither handled.
> * **TechnicalBreakdown:** `ai-server.mjs:19–26` — `unhandledRejection` → `console.error` only; `uncaughtException` → `console.error` + `process.exit(1)`.
> * **RemediationParadigm:** Treat both as fatal under a supervisor that restarts cleanly; drain in-flight requests, emit an alert, and exit for a fresh, healthy process.

> ### [Issue #30]: Numeric/limit parsing trusts query input and provider output
> * **Category:** C
> * **SystemicImpact:** Unbounded or `NaN` values from query strings and unverified numeric fields propagate into slicing, formatting, and DB limits, producing wrong results or runtime errors deep in the pipeline.
> * **TechnicalBreakdown:** e.g., `Number.parseInt(url.searchParams.get("limit") || "20", 10)` (`ai-server.mjs:4060` area) has no upper bound or `NaN` guard; numeric fields from LLM/DB are used without validation (ties to #24/#25).
> * **RemediationParadigm:** Clamp and validate all numeric inputs (min/max, `Number.isFinite`), centralize a safe-parse helper, and reject out-of-range values at the boundary.

### Category D: Security Posture, Data Leakage & Zero-Trust Violations

> ### [Issue #31]: Live InsForge **service** API key is committed in `.mcp.json`
> * **Category:** D
> * **SystemicImpact:** A service-level key (`ik_4813bbb8…`) plus its backend URL are checked into the repo. Anyone with repo access can read/write the backend with elevated privileges. This is the single highest-severity finding.
> * **TechnicalBreakdown:** `.mcp.json:10–11` — `"API_KEY": "ik_4813bbb8…"`, `"API_BASE_URL": "https://mdd528ty.us-west.insforge.app"`. The file is tracked by git.
> * **RemediationParadigm:** Revoke and rotate the key immediately, purge it from git history, move all secrets to a secrets manager / untracked env, and add secret-scanning to CI and pre-commit.

> ### [Issue #32]: InsForge anon JWT and live URL committed in `.env.development`
> * **Category:** D
> * **SystemicImpact:** A working anon token and production-style backend URL are in the repo, giving anyone anon-level access to the live backend and a target to attack.
> * **TechnicalBreakdown:** `.env.development:2–3` — `VITE_INSFORGE_URL=https://r5em4tn7.us-west.insforge.app`, `VITE_INSFORGE_ANON_KEY=eyJhbGciOiJIUzI1NiIs…` (tracked by git).
> * **RemediationParadigm:** Treat even anon keys as environment config, not source; rotate, untrack, and inject at deploy time; document that `VITE_`-prefixed values are public-by-design and must never be privileged.

> ### [Issue #33]: Row-Level Security is `USING (true)` for every table — total BOLA
> * **Category:** D
> * **SystemicImpact:** Any authenticated user can SELECT/INSERT/UPDATE/DELETE *every other user's* missions, agents, discoveries, logs, business plans, and builder outputs. There is no per-owner isolation — a multi-tenant data breach by design.
> * **TechnicalBreakdown:** `insforge/masterbuild_rls_policies.sql` — every policy is `FOR … TO authenticated USING (true) WITH CHECK (true)` (lines 22–168, all 10 tables). No `owner_id = auth.uid()` predicate anywhere.
> * **RemediationParadigm:** Add an `owner_id` to each table and rewrite policies as `USING (owner_id = auth.uid())`; separate a service role for the runtime from the user role; test policies with a per-tenant matrix.

> ### [Issue #34]: Every API endpoint is unauthenticated — open LLM/TTS proxy (wallet draining)
> * **Category:** D
> * **SystemicImpact:** Anyone who can reach the server can call `/api/ai/infer`, `/api/ai/analyze`, `/api/ai/tts`, `/api/ai/tts-minimax`, and `/api/search/semantic`, spending the owner's OpenAI/MiniMax/ElevenLabs/Brave budget without limit. Cost-amplification and abuse are trivial.
> * **TechnicalBreakdown:** No inbound `Authorization` check exists on any handler (`ai-server.mjs` route block 3953–4430); the only `Bearer` usage is *outbound* to providers (line 260). 23 routes, 0 auth gates.
> * **RemediationParadigm:** Require authenticated, scoped tokens on every endpoint; attribute usage to a user; enforce per-user budgets and quotas server-side.

> ### [Issue #35]: Wildcard CORS (`Access-Control-Allow-Origin: *`) on all responses
> * **Category:** D
> * **SystemicImpact:** Combined with no auth (#34), any website can invoke the API from a victim's browser, enabling drive-by cost amplification and data access.
> * **TechnicalBreakdown:** `ai-server.mjs:75` sets `"Access-Control-Allow-Origin": "*"` globally, repeated at 4096/4133/4265/4275.
> * **RemediationParadigm:** Restrict CORS to an explicit allow-list of trusted origins; never combine `*` with credentialed or cost-bearing endpoints.

> ### [Issue #36]: No rate limiting on any HTTP endpoint
> * **Category:** D
> * **SystemicImpact:** A single client can flood paid endpoints or the event loop. There is no throttle, no per-IP/per-user cap, no circuit breaker — DoS and cost-blowout are one loop away.
> * **TechnicalBreakdown:** The only "rate limit" is an internal config for the background search loop (`ai-server.mjs:2772`); no middleware limits inbound request rate.
> * **RemediationParadigm:** Add per-IP and per-user rate limiting / token buckets at the edge and in-app, plus provider-call circuit breakers and spend caps.

> ### [Issue #37]: SSRF — `/api/ai/infer` forwards a caller-supplied `imageUrl`
> * **Category:** D
> * **SystemicImpact:** A caller can supply an arbitrary URL that the backend (or the downstream provider) fetches, enabling probing of internal/metadata endpoints and use of the server as a fetch proxy.
> * **TechnicalBreakdown:** `ai-server.mjs:4160` passes `imageUrl: body.imageUrl` into `inferWithOpenAI`, which embeds it in the message (`server/lib/openai.mjs` `image_url: { url: imageUrl }`) with no allow-list/scheme validation.
> * **RemediationParadigm:** Validate and allow-list URL schemes/hosts, block private/link-local ranges, and proxy media through a vetted fetcher with timeouts and size caps.

> ### [Issue #38]: User-controlled prompts drive code generation written to disk (prompt-injection → code execution surface)
> * **Category:** D
> * **SystemicImpact:** User text flows verbatim into LLM prompts whose output is materialized as source files; a crafted prompt can steer generated code that later runs in dev/CI. The trust boundary between "user input" and "executed artifact" is missing.
> * **TechnicalBreakdown:** `/api/ai/infer` forwards `body.systemPrompt`/`body.userPrompt` unmodified; `scripts/materialize-generated-app.mjs` writes model output to files (line 152). (`safeFilePath` constrains the path, which is good — but content is untrusted.)
> * **RemediationParadigm:** Treat all LLM output as untrusted; sandbox generation, require human review before materialization, scan generated code, and never auto-execute it.

> ### [Issue #39]: Critical-severity dependency vulnerability — `vitest < 3.2.6` (RCE)
> * **Category:** D
> * **SystemicImpact:** `npm audit` reports a critical advisory (GHSA-5xrq-8626-4rwp) allowing arbitrary file read/exec when the Vitest UI server is listening, plus moderate `ws` memory-disclosure issues — a real risk on dev machines and CI.
> * **TechnicalBreakdown:** `npm audit --omit=dev` → "vitest <3.2.6 … Severity: critical" and "ws 8.0.0–8.20.0 … moderate"; 6 vulnerabilities total (5 moderate, 1 critical).
> * **RemediationParadigm:** Run `npm audit fix`, pin patched versions, and add automated dependency scanning (Dependabot/Renovate) with a fail-the-build policy on critical advisories.

> ### [Issue #40]: Sensitive artifacts committed — `logs/dev-server.log` and an 811 KB progress dump with absolute paths
> * **Category:** D
> * **SystemicImpact:** Committed logs and a 811 KB `.codex-maygoals-progress.md` leak internal paths (`/Users/rishabhbansal/…`), tooling details, and references to keys/tokens — useful reconnaissance for an attacker and an information-disclosure hazard.
> * **TechnicalBreakdown:** `git ls-files` tracks `logs/dev-server.log` and `.codex-maygoals-progress.md`; the latter contains 19 `api[_-]?key|token|secret` mentions and absolute user paths.
> * **RemediationParadigm:** Remove from history, add to `.gitignore`, scrub absolute paths, and forbid committing logs/progress dumps via pre-commit hooks.

### Category E: Observability, Maintainability & Technical Decay

> ### [Issue #41]: Structured logging is off by default — production runs are effectively blind
> * **Category:** E
> * **SystemicImpact:** When an LLM call fails at 3 a.m., nothing alerts and little is queryable: there are no metrics, no traces, no alerting, and the structured-log path is disabled unless an env flag is set. Autonomous operation is impossible without telemetry.
> * **TechnicalBreakdown:** `ai-server.mjs:29–34` — `structuredLog` is a no-op unless `MASTERBUILD_LOG_STRUCTURED` ∈ {1,true,yes} (unset by default). Otherwise observability is 45 ad-hoc `console.*` calls; no `/metrics`, no tracing.
> * **RemediationParadigm:** Adopt structured logging on by default, OpenTelemetry traces, RED/USE metrics, and alerting on error rates and provider failures; propagate the existing `requestId` end-to-end.

> ### [Issue #42]: The 4,491-line server and all Python agents have zero unit tests
> * **Category:** E
> * **SystemicImpact:** The most security- and cost-sensitive code (routing, provider calls, caching, scheduling, the agent runtime) has no automated coverage. Any change is unverifiable; regressions ship freely.
> * **TechnicalBreakdown:** Tests target pure portfolio functions only — `venture-portfolio.test.ts` is 8,678 lines but covers `src/lib` logic, not `server/ai-server.mjs` or `agents/*.py` (no `.py` tests exist; no server test file exists).
> * **RemediationParadigm:** Add unit/contract tests for every endpoint and provider adapter, and `pytest` coverage for the agent runtime; gate merges on coverage thresholds for those packages.

> ### [Issue #43]: The CI gate runs a cherry-picked subset, not the full suite
> * **Category:** E
> * **SystemicImpact:** `verify:maygoals` runs one unit test file and a `-g`-filtered handful of e2e tests, so most of the codebase's behavior is never exercised in CI. Green CI does not mean working software.
> * **TechnicalBreakdown:** `package.json:105` — `pnpm test -- src/lib/venture-portfolio.test.ts` then `playwright test e2e/app.spec.ts -g "accessibility smoke|sidebar navigation…|core demo flow"`. The e2e tests run against mock auth (`mockAuthAndSetup`) and DEMO data.
> * **RemediationParadigm:** Run the full test suite in CI, separate fast/slow lanes, and add real (non-mock) integration tests against an ephemeral backend.

> ### [Issue #44]: Three divergent InsForge schema files with manual apply-order comments
> * **Category:** E
> * **SystemicImpact:** `schema.sql` (298 lines), `masterbuild_schema.sql` (357), and `masterbuild_schema_v2.sql` (142, additive) must be applied in a specific human-remembered order with no migration tooling. Drift between environments is guaranteed.
> * **TechnicalBreakdown:** `masterbuild_schema_v2.sql` is comment-ordered "Apply AFTER masterbuild_schema.sql"; the RLS file says "Apply AFTER … v2 … Already applied … on 2026-04-05." No migration runner ties them together.
> * **RemediationParadigm:** Adopt a versioned migration tool (single ordered, checksummed migration history) and delete ad-hoc schema files; make the DB schema reproducible from zero.

> ### [Issue #45]: The 4,491-line server is untyped JavaScript and lint strictness is relaxed
> * **Category:** E
> * **SystemicImpact:** No compile-time guarantees on the highest-risk code; refactors are blind. Combined with relaxed settings, decay accelerates and AI agents cannot rely on types to navigate.
> * **TechnicalBreakdown:** `server/ai-server.mjs` is plain `.mjs` (no TS). `tsconfig.app.json` sets `"noUnusedLocals": false`. ESLint covers `src/**` only (not `server/`).
> * **RemediationParadigm:** Port the server to TypeScript with `strict` on, extend lint/type-check to `server/` and `scripts/`, and forbid untyped new modules.

> ### [Issue #46]: Vestigial Palantir/OSDK identity and dead config files
> * **Category:** E
> * **SystemicImpact:** The package masquerades as `@palantir/pilot-template` and ships a 595-line OSDK shim plus Java/Gradle and stray files that have nothing to do with the app — confusing every future human and AI maintainer about what the system actually is.
> * **TechnicalBreakdown:** `package.json` name `@palantir/pilot-template` v0.78.0; `src/lib/osdk-shims.ts` (595 lines) emulates `@osdk/react`; `gradle.properties`, `test_browser.py`, `browserconfig.txt`, `fields.txt`, `templateConfig.json` sit at root unreferenced by the app.
> * **RemediationParadigm:** Rename the package to its real identity, delete dead shims/config, and document the true architecture in a single authoritative README.

> ### [Issue #47]: Documentation tells four contradictory stories about what the system is
> * **Category:** E
> * **SystemicImpact:** `maygoals.md` ("autonomous economy engine"), `README.md` ("MarketPulse" market-research app), `AGENTS.md` (InsForge SDK template), and the package name (Palantir pilot template) describe four different products. No source of truth means onboarding and autonomous reasoning start from confusion.
> * **TechnicalBreakdown:** Verified by reading the headers of each: `maygoals.md:1` "The Impossible MarketPulse Mandate"; `README.md:1` "# MarketPulse"; `AGENTS.md` "InsForge SDK Documentation"; `plans_losaltoshacks.md` embeds hardcoded `/Users/m3-max/…` paths.
> * **RemediationParadigm:** Establish one canonical `README` + architecture doc, demote the rest to dated design notes, and remove machine-specific paths.

> ### [Issue #48]: Hardcoded model names scattered through the code with no abstraction
> * **Category:** E
> * **SystemicImpact:** When a model is deprecated (a near-certain event over a decade), the system breaks in multiple files at once with no single switch. Model choice is policy, not config.
> * **TechnicalBreakdown:** Literals across `server/`: `MiniMax-M2.7` (×7), `gpt-4o` (×6), `text-embedding-3-small` (×1), plus `gemini-*` in `server/lib/gemini.mjs` and `claude-sonnet-4.6` in `.env.example`.
> * **RemediationParadigm:** Centralize a model registry/config with capability-based selection and per-environment overrides; reference models by role ("reasoner," "embedder"), not by literal.

> ### [Issue #49]: Hand-maintained 97-line per-component chunk map and 72 near-duplicate panels
> * **Category:** E
> * **SystemicImpact:** `vite.config.ts` hand-lists ~60 individual components for manual chunking; each new panel requires editing the build config. With 72 structurally similar `research/*` panels, the duplication and config coupling are unmaintainable by humans or agents.
> * **TechnicalBreakdown:** `vite.config.ts:34–104` is a giant `manualChunks` `if`-ladder enumerating component paths; `src/components/research/` holds 72 `.tsx` panels following one template.
> * **RemediationParadigm:** Replace manual chunk rules with route-based code-splitting/`React.lazy`, and collapse the panel family into a config-driven, data-described generic panel.

> ### [Issue #50]: Three commits of history, no CODEOWNERS, and a dead Husky setup
> * **Category:** E
> * **SystemicImpact:** With effectively no version history, no ownership metadata, and broken pre-commit enforcement, there is no review trail, no bisect-ability, and no automated guardrails — the project cannot be safely co-maintained or audited over time.
> * **TechnicalBreakdown:** `git log` shows 3 large commits; no `CODEOWNERS`; `husky` is a dependency but no `.husky/` directory exists (hooks are not installed), so the intended pre-commit checks never run.
> * **RemediationParadigm:** Establish a real branching/PR workflow with required reviews and `CODEOWNERS`, install working pre-commit hooks (lint/type-check/secret-scan), and keep commits small and reviewable.

---

## Phase 2 — The 10-Year Strategic Master Blueprint

### Years 1–2: Foundation Remediation & Decoupling
*Goal: eradicate the 50 flaws and make the system safe, typed, and tenant-isolated.*

- **Stop the bleeding (Quarter 1):** Rotate and purge the committed InsForge service key (#31) and anon JWT (#32); remove `logs/` and the 811 KB progress dump from history (#40); add secret-scanning + working Husky pre-commit hooks (#50); `npm audit fix` the critical Vitest RCE (#39).
- **Establish a real backend boundary:** Add authentication and per-user rate limiting to every endpoint (#34, #36), lock CORS to an allow-list (#35), validate all inputs with Zod (#24), and rewrite RLS to `owner_id = auth.uid()` with a separate service role (#33).
- **Pick one system of record:** Promote owner-scoped Postgres/InsForge as authoritative for the venture portfolio; demote `localStorage` to a synced cache with schema-versioned blobs and atomic, optimistic-concurrency writes (#1, #10, #21, #22).
- **Decompose the monoliths:** Break `venture-portfolio.ts` (#4) and `VentureLab.tsx` (#5) into bounded contexts and lazily-loaded, individually-error-bounded panels (#18, #49); port `ai-server.mjs` to a typed, modular, middleware-based server (#7, #45).
- **Make failures visible:** Turn on structured logging + tracing + alerting by default (#41); replace silent `catch`/`{}` swallows with surfaced errors and retries (#17, #25, #27, #28, #29); add server and agent test suites and run the *full* suite in CI (#42, #43).
- **Adopt migrations & one identity:** Replace the three SQL files with a versioned migration history (#44); rename the package, delete OSDK/Gradle vestiges, and write one canonical architecture doc (#46, #47).

### Years 3–5: Cognitive Automation & Edge Migration
*Goal: shift from polling/monolith to push/streaming, distributed compute, and a coherent product.*

- **Push, not poll:** Replace 3 s polling with realtime streams and delta updates (#6); thread `AbortController`/progress/ETA through every AI action (#13).
- **Edge & caching:** Move read-heavy projections and static assets to the edge; externalize caches/coalescing and the periodic refresh to a singleton scheduler + queue so replicas scale linearly without duplicate spend (#2, #3).
- **A model-agnostic AI layer:** Introduce a model registry with capability-based routing, structured outputs, SSRF-safe media handling, and sandboxed, human-reviewed code generation (#25, #37, #38, #48).
- **Earn the user's trust:** Domain-language pass to kill jargon, real onboarding/empty states, responsive layouts, confirmation + soft-delete/undo, multi-tab reconciliation, and a validating OAuth callback (#11, #12, #15, #16, #19, #20).
- **Semantic telemetry:** Correlate request IDs, model calls, costs, and outcomes into a queryable spine that feeds both ops dashboards and the agents' own learning loop.

### Years 6–10: The Sovereign Autonomous Era
*Goal: self-healing, self-optimizing operation with humans on the loop, not in it.*

- **Self-healing runtime:** Supervised, health-gated, auto-restarting services with automated load-shedding and circuit breakers; failed components recover without paging a human (#9, #29, #36).
- **Autonomous maintenance:** With small modules, full types, full tests, structured telemetry, versioned migrations, and one canonical identity in place (the Year 1–2 work), agents can safely refactor, run experiments behind flags, and roll changes forward/back automatically.
- **Continuous structural refactoring:** Per-context ownership, contract tests, and migration tooling let the system reshape its own schema and code with zero-downtime, evidence-gated rollouts.
- **Cost- and risk-aware autonomy:** Per-user budgets, spend caps, and tenant isolation (Years 1–2) become the guardrails inside which the system can synthesize features from real user-behavior signals — automation bounded by the very controls the early epochs installed.

---

*Closing note:* the decade-scale "sovereign autonomous" vision is gated entirely on the unglamorous Year 1–2 remediation. An autonomous system built on committed secrets, `USING (true)` RLS, unauthenticated paid endpoints, a 19k-line god-module, and zero server tests would automate its own failures at scale. Fix the foundation first; the autonomy compounds from there.
