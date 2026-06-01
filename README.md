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

## Startup Check

Verify the demo stack starts and passes health checks on isolated local ports:

```bash
pnpm startup:check
```

This command:
1. Picks two free local ports (default starting near 3300) and starts the full demo stack (`pnpm dev:demo`) bound to those ports.
2. Checks the frontend `/`: expects an HTML page containing `id="root"` and `/src/main.tsx`.
3. Checks the AI server `/health`: expects `ok: true` and `demoMode: true` with a `checks` array.
4. Checks the worker `/api/worker/preflight`: expects a `workerCanStart` boolean field; non-2xx responses are accepted when live external services are degraded in demo mode.
5. Shuts down the demo stack cleanly (SIGTERM, grace period, then SIGKILL if needed) and exits 0 on success or 1 on failure with a JSON error summary.

Degraded external live services (e.g. InsForge, live LLM) are tolerated in demo mode; the check reports them as `degradedChecks` in the summary but does not fail.

## API Contract Check

Verify deterministic demo AI server request/response contracts without starting the browser app:

```bash
pnpm api:contracts
```

This command starts `server/ai-server.mjs` in demo mode on an isolated local port, validates `/health`, `/api/worker/preflight`, `/api/mission/create`, `/api/dashboard`, `/api/agent/retry`, `/api/trends`, `/api/recommendations`, `/api/background/refresh/status`, `/api/background/refresh/readiness`, `/api/background/refresh/export`, `/api/background/refresh/exports`, `/api/background/refresh/import/inspect`, `/api/refresh`, `/api/mission/stop`, and `/api/mission/reset`, then shuts the server down. It accepts degraded live-worker readiness but fails if local demo route shapes drift.

Set `MASTERBUILD_LOG_STRUCTURED=1` when running the AI server to emit JSON-line runtime logs for HTTP responses, health checks, worker preflight degradation, mission create/stop/reset, and agent retry lifecycle events. `pnpm api:contracts` and `pnpm startup:check` enable these logs for their child server processes and include recent server output in failure summaries.

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

## Venture Timing Rationale

Market Research final options now produce a structured `whyNow` rationale in the Venture Operating Workspace. The rationale keeps the timing headline, evidence-backed drivers, missing timing risks, expiring-window note, confidence level, and source links with the saved venture JSON so exported/imported portfolios can search and audit why a thesis is urgent instead of treating "why now" as loose prose.

## Venture MVP Scope

Every generated or manual venture workspace also carries a structured `mvpScope` artifact with must-have features, deferred work, dependencies, time-to-MVP estimate, confidence, and source. Saved/imported portfolio records backfill this field for older JSON, portfolio search indexes it, and founder execution memos export it as an `MVP Scope` section.

## Venture Build And Evidence Confidence

Venture workspaces include structured `buildEstimate` and `evidenceConfidence` artifacts. Build estimates summarize effort score, effort level, time range, builder profile, complexity drivers, and risk adjustments. Evidence confidence summarizes source count, platform coverage, score, confidence label, supporting signals, and gaps. Both artifacts are backfilled for older saved/imported ventures, indexed by portfolio search, rendered in the Venture Operating Workspace, and exported through founder execution memos.

## Venture Reasoning Debate

Every generated or manual venture workspace carries a structured `reasoningDebate` artifact that exposes the bull case, bear case, lazy consensus, non-obvious insight, fatal assumption, fastest validation path, clearest kill reason, downside if wrong, confidence, and supporting source signals. Saved/imported portfolio records backfill the field for older JSON, portfolio search indexes every clause, the Venture Operating Workspace renders it as an accessible `Reasoning Debate` region, and founder execution memos export it as a `Reasoning Debate` section.

## Venture Evaluation Lenses

Every venture workspace also carries structured `evaluationLenses` for jobs-to-be-done, willingness to pay, distribution wedge, product-led growth, churn risk, expansion revenue, platform dependency, marketplace liquidity, network effects, data moats, regulatory arbitrage, procurement friction, founder-market fit, brand trust, AI automation defensibility, sales-led enterprise potential, workflow lock-in, vertical SaaS dynamics, marginal cost structure, integration complexity, switching costs, distribution moats, capital efficiency, support burden, and competitive retaliation. Each lens includes a score, confidence, signals, gaps, and next action; saved/imported ventures backfill missing lenses, search indexes the lens evidence, the operating workspace renders an accessible `Evaluation Lenses` region, founder memos export an `Evaluation Lenses` section, and core decision lenses (now including workflow lock-in, switching costs, capital efficiency, and support burden) calibrate prediction snapshots, demand drift, and founder memo posture. Competitive retaliation is rendered and exported but kept out of the core posture set so consumer or niche-vertical ventures without explicit incumbent language are not falsely blocked by a speculative retaliation lens.

## Venture Revenue Generation Posture

Every saved venture also derives a `VentureRevenueGenerationPosture` artifact (`buildVentureRevenueGenerationPosture`) that synthesizes evidence-backed revenue capture from money signals, paid pricing signals, paid activation cohorts, and channel economics. The posture exposes a status (`no-evidence | paid-validation | repeatable-revenue | scaling-revenue | blocked`), capture score, payback status, pricing calibration, primary revenue source, recorded revenue evidence (received/committed/cohort/channel revenue plus paid pricing signals, paid cohort users, paid-back channels, and channel payback coverage), gaps, and a next action, with Markdown export. Portfolio search indexes the posture (`revenue generation posture`, `generate revenue`, status, paid pricing/cohort/channel terms, payback) and `serializeVenturePortfolio` exports the array as `revenueGenerationPostures` so the `Generate revenue` slice is evidence-backed instead of asserted. The Venture Lab portfolio view renders the posture per venture and the portfolio summary surfaces revenue capture, scaling/repeatable/paid-validation/no-evidence/blocked counts, and the average capture score.

## Discovering New Opportunities

Every saved venture portfolio now derives `VentureOpportunityDiscoveryBacklogItem` records via `buildVentureOpportunityDiscoveryBacklog`. The backlog turns market proof gaps, source evidence, saved browser research tasks, competitor watches, converted-pain memory, and fake-market memory into prioritized discovery candidates. Each item carries source type (`market-proof-gap | evidence-source | browser-research | competitor-watch | portfolio-memory`), source artifact, priority, status (`research-ready | needs-source | watch | blocked`), confidence score, owner, buyer/pain/wedge, rationale, source provenance, next research command, proof required, improved-venture instruction, and Markdown. `serializeVenturePortfolio` exports it as `opportunityDiscoveryBacklog`, portfolio search indexes `opportunity discovery backlog`, `discover opportunities`, `next research command`, source/proof/provenance terms, the portfolio summary tracks ready/needs-source/watch/blocked and high-priority counts, and the Venture Lab renders an `Opportunity discovery backlog` panel so discovery must improve the next saved venture instead of becoming loose notes.

## Atlas of Overlooked High-Value Opportunities

Every saved venture portfolio also derives `VentureOverlookedOpportunityAtlasItem` records via `buildVentureOverlookedOpportunityAtlas`. The atlas ranks overlooked opportunities from the opportunity-discovery backlog, market proof gaps, competitor watches, fake-market memory, converted-pain memory, and saved evidence quality. Each item carries source type (`opportunity-backlog | market-proof-gap | competitor-watch | fake-market-memory | converted-pain-memory | evidence-quality`), status (`ranked-ready | needs-source | watch | blocked`), priority, rank score, confidence score, novelty (not-recycled) score, owner, target buyer, pain, hidden wedge, hidden-wedge rationale, not-recycled proof against the current saved venture, source provenance, a cheap internal-only test command, a human-review boundary, an explicit no-external-side-effect proof, next action, and Markdown. `serializeVenturePortfolio` exports the array as `overlookedOpportunityAtlas`, portfolio search indexes `overlooked opportunity atlas`, `overlooked high value opportunity`, `hidden wedge rationale`, `not recycled proof`, `cheap internal test command`, source/proof/provenance terms, the portfolio summary tracks ranked/needs-source/watch/blocked, critical/high-priority, average rank score, and average novelty score, and the Venture Lab renders an `Overlooked opportunity atlas` panel. Cheap-test commands are internal-only: they never send messages, spend money, deploy code, contact customers, or change billing — every promotion to a saved venture requires the human-review boundary.

## Atlas Validation Command Packs

Every saved venture portfolio also derives `VentureAtlasValidationCommandPack` records via `buildVentureAtlasValidationCommandPacks`. The packs turn the top overlooked-opportunity atlas items into approval-gated validation packs that prove whether anyone actually wants the wedge. Each pack carries an atlas item link (`atlasItemId`, `atlasItemTitle`, `atlasSourceArtifactId`, `atlasSourceArtifactLabel`), source type (`opportunity-backlog | market-proof-gap | competitor-watch | fake-market-memory | converted-pain-memory | evidence-quality`), status (`ready | needs-approval | needs-source | blocked`), priority, rank score, confidence score, novelty score, owner, target buyer, hidden wedge, hypothesis, the cheapest internal validation command, manual result fields and thresholds, explicit success/failure/pivot criteria, a demand-drift update instruction, source provenance, approval gates, a human-review boundary, an explicit no-external-side-effect proof, next action, and Markdown. `serializeVenturePortfolio` exports them as `atlasValidationCommandPacks`, portfolio search indexes `atlas validation command packs`, `prove whether anyone wants one`, `validation command pack`, `cheap internal validation command`, `demand drift update instruction`, `approval gated validation pack`, plus hypothesis/criteria/provenance/threshold terms, the portfolio summary tracks ready/needs-approval/needs-source/blocked and critical/high-priority counts, and the Venture Lab renders an `Atlas validation command packs` panel. Validation packs never send messages, spend money, deploy code, contact customers, or change billing automatically — every pack requires explicit operator approval, and manual result fields must be captured into saved evidence and the demand drift report before promoting an atlas item into a saved venture.

## Recording Atlas Validation Results

Venture Lab can now persist `VentureAtlasValidationResultRecord` entries with `recordVentureAtlasValidationResult`, turning an approval-gated atlas validation pack into source-backed manual demand proof. Each result stores the pack id, atlas item id/title, outcome (`passed | failed | pivot | inconclusive`), qualified-buyer count, pain-confirmation count, hidden-wedge resonance count, paid-pricing signal count, strongest quote, strongest objection, evidence note, learning, owner, next action, no-external-side-effect proof, and a demand-drift score. `buildVentureAtlasValidationResultLedger` exports those records as `atlasValidationResultLedger`, portfolio search indexes `atlas validation result ledger`, `manual validation result`, `validation result ledger`, `recorded atlas validation outcome`, and `manual demand proof`, summary counters track outcomes plus buyer and paid-signal totals, Venture Lab renders the `Atlas validation result ledger`, and `buildVentureDemandDriftReport` includes atlas validation as a reality component. Recording a result is local/manual only; it does not send messages, spend money, deploy code, contact customers, or change billing.

## Building Products From Venture Proof

Every saved venture portfolio also derives `VentureProductBuildCommand` records via `buildVentureProductBuildCommandQueue`. The queue converts generated app handoffs, source scaffolds, MVP build workspaces, verifier proofs, passed atlas validation results, QA reports, roadmap tasks, and deployment blockers into explicit product-build commands. Each command carries source type (`generated-app-handoff | source-scaffold | mvp-build-workspace | verifier-proof | validation-result | qa-report | roadmap-task | deployment-blocker`), status (`ready | needs-proof | blocked | verified`), priority, owner, app name, build command, artifact target, proof required, no-fake-source boundary, next action, evidence, and Markdown. Validation-backed commands carry qualified-buyer counts, pain confirmations, hidden-wedge resonance, paid-pricing signals, source validation pack title, demand-drift update, generated-app verifier command, and local product handoff target so `Build the first product` is tied to proof instead of pitch language. `serializeVenturePortfolio` exports it as `productBuildCommandQueue`, portfolio search indexes `product build command queue`, `build products`, `validation-backed product build`, `build first product`, `no fake source boundary`, command/proof/target terms, the portfolio summary tracks ready/needs-proof/blocked/verified and critical counts, and the Venture Lab renders a `Product build command queue` panel so build work is tied to source artifacts and verifier proof instead of vague product intent.

Product-build commands can also preserve local run proof with `recordVentureProductBuildCommandRun`. A `VentureProductBuildCommandRunRecord` stores the command id/title/source, run state (`executed | imported | promoted`), app name, build command, artifact target, owner, run proof, local artifact proof, verifier report proof, learning, evidence, and a no-send/no-spend/no-deploy/no-contact/no-billing proof string. `buildVentureProductBuildCommandRunLedger` exports these records as `productBuildCommandRunLedger`, search indexes `product build command run ledger`, `local product build command run`, `product build run proof`, and `validation-backed product build run`, portfolio analytics count executed/imported/promoted runs, and Venture Lab renders both a local run-proof form for validation-backed build commands plus a `Product build command run ledger` panel. Recording a run never executes shell commands or performs external side effects; it only captures operator-provided local proof after the command has been run elsewhere.

## Executable MVP Release Workspace

`buildVentureMvpReleaseWorkspace(venture)` turns product-build command run proof into a `VentureMvpReleaseWorkspace` release handoff object. Each workspace carries id, venture id, title, status (`release-ready | needs-run-proof | needs-qa-proof | blocked`), app name, source path, verifier report proof, QA proof, chosen run id/state (preferring promoted runs, then executed or imported), product build command id, generated app proof status, QA status, owner, setup/test/build/browser-smoke commands, a no-deploy release boundary, a no-external-side-effect proof, next actions, evidence, and Markdown. `buildVentureMvpReleaseWorkspaceList(ventures)` produces the portfolio-level list, exported as `mvpReleaseWorkspaceList` in `serializeVenturePortfolio`. Portfolio search indexes `executable mvp release workspace`, `build first product release workspace`, `promoted product build run`, `source path`, `verifier report proof`, `qa proof`, and `no-deploy release boundary`. Portfolio analytics track total, release-ready, needs-run-proof, needs-qa-proof, and blocked workspace counts. Venture Lab renders a `Executable MVP release workspaces` panel showing source path, verifier proof, QA proof, commands, status, and no-deploy boundary per venture, plus MetricTile summary tiles.

## Pilot Cohort Signal Gates

`buildVenturePilotCohortSignalGate(venture)` derives a `VenturePilotCohortSignalGate` — an operator-owned step that turns an executable MVP release workspace into a local-only inbound pilot-signal capture record. Each gate carries id, venture id/title, status (`ready | needs-release-workspace | needs-inbound-signal | blocked`), priority, owner, release workspace id/status, app name, source path, cohort label, inbound signal source, local capture command, an activation cohort draft with signup/activated/retained/paid/revenue/support targets, a demand capture proof draft, qualified demand metric, no-send boundary, no-deploy boundary, no-external-side-effect proof, next action, evidence, and Markdown. Status is conservative: `ready` only when a run proof exists and at least one activation cohort, pricing signal, money signal, or customer interview has been recorded; `needs-release-workspace` when no run proof exists; `needs-inbound-signal` when workspace exists but no cohort or pricing/money/interview signal is present; `blocked` when the underlying release workspace is blocked. `buildVenturePilotCohortSignalGates(ventures)` produces the portfolio list, exported as `pilotCohortSignalGates` in `serializeVenturePortfolio`. Portfolio search indexes `pilot cohort signal gate`, `capture inbound pilot signal`, `no-send pilot cohort`, `activation cohort draft`, `demand capture proof draft`, `no contact no deploy`, and all gate field text. The portfolio summary tracks total, ready, needs-release-workspace, needs-inbound-signal, blocked, critical, and high-priority gate counts. Venture Lab renders a `Pilot cohort signal gates` panel showing status, owner, release workspace status, cohort label, local capture command, activation draft, demand proof draft, no-send boundary, and next action. No deploy, send, external contact, spend, or billing change occurs from this gate.

Pilot signal gates now also feed the real activation-cohort workflow. When a venture has release-workspace run proof plus inbound pricing, money, or interview signal but no saved activation cohort yet, `buildVentureActivationCohortCandidates(venture)` emits a `pilot-signal-gate` candidate. Saving that candidate through the existing activation cohort form persists source-backed pilot onboarding proof, dedupes the gate candidate, and immediately makes the saved cohort available to `buildVentureDemandCaptureProofQueue` as cohort demand evidence. The candidate keeps the same local-only boundary: operators must verify and adjust observed signup/activation counts before saving, and the app still performs no external contact, send, deployment, spend, or billing change.

## No-Send Email Gate Worklist

`buildVentureNoSendEmailGateWorklist(ventures)` derives internal email-gate work items from pilot cohort signal gates. Each item carries status (`draft-ready | needs-pilot-gate | blocked`), priority, owner, source pilot gate, cohort label, recipient placeholders, draft subject/body, review checklist, replay command, human approval boundary, no-send boundary, no-deploy boundary, no-external-side-effect proof, evidence, next action, and Markdown. `serializeVenturePortfolio` exports the list as `noSendEmailGateWorklist`, portfolio search indexes `no-send email gate`, `email gate dispatch worklist`, `internal outreach draft`, `draft only do not send`, recipient placeholders, boundaries, replay commands, and draft copy, and portfolio analytics track total, draft-ready, needs-pilot-gate, blocked, and critical email-gate counts. Venture Lab renders a `No-send email gate worklist` panel after pilot signal gates. The worklist never sends email, stores real recipients, deploys, spends, tracks, contacts anyone, or changes billing; it only gives the operator a reviewable internal draft packet.

`recordVentureNoSendEmailGateReplyProof(ownerKey, ventureId, input)` converts a manually reviewed, redacted reply note from a draft-ready no-send email gate into existing proof records: customer interviews, pricing signals, risks, or activation cohorts. The recorder fails closed if the work item is missing, blocked, still needs a pilot gate, lacks owner/reply text, contains raw email/phone identifiers in any proof text, or exactly repeats a redacted reply note already saved for the same work item and proof type. Successful records carry a no-send evidence note that links the email gate work item, states the manual consent boundary, and repeats that the app did not send email, store a real recipient, deploy, spend, track, contact anyone, or change billing. The worklist derives `replyProofReceipts`, `replyProofReceiptCount`, `replyProofTypesRecorded`, and `replyProofDedupeHint` from those saved records, exports them in Markdown, and indexes `no-send reply proof receipts` plus `reply proof dedupe` so repeated claim inflation is visible before another reply is saved. Venture Lab renders a compact reply-proof capture form only for draft-ready email gates, shows converted proof receipts on the worklist card, and the maygoals Playwright verification now seeds a draft-ready no-send gate, saves a redacted reply through the form, and confirms the exported portfolio contains the no-send reply proof receipt.

## Launching Experiments Under Control

Every saved venture portfolio now derives `VentureLaunchControlQueueItem` records via `buildVentureLaunchControlQueue`. The queue converts experiment launch packs, gap actions, read-only browser research tasks, no-send outreach approvals, autonomy audits, and agent replay logs into launch-control items. Each item carries source type (`experiment-launch-pack | gap-action | browser-research | outreach-approval | autonomy-audit | agent-replay`), status (`ready | needs-approval | blocked | recorded`), priority, owner, launch command, human approval boundary, success metric, failure metric, no-external-action proof, replay command, evidence, next action, and Markdown. `serializeVenturePortfolio` exports it as `launchControlQueue`, portfolio search indexes `launch control queue`, `launch experiments`, `no external send spend deploy`, command/approval/metric/proof/replay terms, the portfolio summary tracks ready/needs-approval/blocked/recorded and critical counts, and the Venture Lab renders a `Launch control queue` panel. The queue is internal-only: it does not send outreach, spend money, deploy code, or change billing automatically.

## Capturing Demand as Proof

Every saved venture portfolio now derives `VentureDemandCaptureProofQueueItem` records via `buildVentureDemandCaptureProofQueue`. The queue converts demand drift reports, activation cohorts, channel economics, pricing signals, money signals, customer interviews, no-send outreach approvals, read-only browser research tasks, and no-send reply proof receipts into demand-capture proof items. Each item carries source type (`demand-drift-report | activation-cohort | channel-economics | pricing-signal | money-signal | customer-interview | outreach-approval | browser-research | no-send-reply-proof`), status (`captured | needs-follow-up | blocked | weak`), priority, owner, capture command, qualified demand metric, source proof, no-fake-demand boundary, follow-up action, evidence, and Markdown. `serializeVenturePortfolio` exports it as `demandCaptureProofQueue`, portfolio search indexes `demand capture proof queue`, `capture demand`, `no fake demand boundary`, command/metric/proof/follow-up terms, the portfolio summary tracks captured/needs-follow-up/blocked/weak and critical counts, and the Venture Lab renders a `Demand capture proof queue` panel so growth claims must be backed by source records instead of inferred market excitement.

No-send reply proof receipts now enter the same queue as `no-send-reply-proof` items. When a receipt-backed interview, pricing signal, risk, or activation cohort carries the no-send proof marker, the generic source item is skipped and a single receipt item is emitted instead. That item links to the source record, carries the receipt dedupe key, and states that no-send reply demand is counted once per dedupe key, so downstream continue/pivot/kill decisions can use redacted manual reply proof without double-counting the same reply.

## Recommending Continue, Pivot, or Kill

Every saved venture portfolio now derives `VenturePortfolioDecisionCommand` records via `buildVenturePortfolioDecisionCommandQueue`. The queue turns demand-capture proof, revenue posture, launch-control state, product-build proof, support load, scale readiness, and kill-pressure rules into reviewable decision commands. Each command carries recommended decision (`continue | pivot | pause | kill | scale | archive`), status (`ready | needs-proof | blocked | human-review`), priority, confidence score, confidence note, owner, decision command, contradiction proof, next command, human-review boundary, source summaries, demand source provenance summary, demand source decision note, demand source evidence, no-send reply demand summary, no-send reply decision note, no-send reply evidence, evidence, blockers, and Markdown. `serializeVenturePortfolio` exports it as `portfolioDecisionCommandQueue` and now also includes `portfolioSummary`, portfolio search indexes `portfolio decision command queue`, `recommend continue pivot kill`, `continue pivot kill recommendation`, `human review boundary`, `demand source provenance`, `non-no-send demand source`, `no-send email gate reply demand`, `no-send reply demand influence`, decision/proof/summary/confidence terms, the portfolio summary tracks ready/needs-proof/blocked/human-review plus decision counts and demand-source blocker counters, and the Venture Lab renders a `Portfolio decision command queue` panel. Commands are advisory only; they do not mutate lifecycle state, archive ventures, spend money, contact customers, deploy code, or change billing.

Decision commands now make receipt-backed no-send demand explicit instead of burying it in aggregate demand counts. Redacted `no-send-reply-proof` demand items produce a summary, influence note, confidence note, and evidence lines that explain whether the replies moved the recommendation toward continue, pivot, pause, kill, or scale, while still preserving the once-per-dedupe-key boundary.

Decision commands also expose non-no-send demand source provenance. Interview, cohort, channel, pricing, money, outreach, browser, and demand-drift proof are grouped separately from no-send reply receipts with source-type counts, captured/blocked/weak status counts, a decision note, and evidence lines. This lets an operator compare ordinary demand proof against redacted reply receipts without opening the raw demand-capture queue.

Decision commands additionally surface per-source-type **blocker** provenance. `demandSourceBlockerSummary` and `demandSourceBlockerEvidence` derive blocked non-no-send demand items plus weak non-no-send pressure when no captured ordinary demand exists, group them by source type, and explain which sources are pressuring the recommendation toward pivot/kill independently of no-send reply signal. The summary, evidence lines, and a dedicated `## Demand Source Blocker Provenance` markdown section feed `serializeVenturePortfolio`, the portfolio search (`demand source blocker provenance`, `blocked non-no-send demand source`), and the Venture Lab `Portfolio decision command queue` panel so operators can see which non-no-send sources contributed blocker pressure without opening each demand-capture item. Portfolio-level counters (`portfolioDecisionDemandSourceBlockerCount`, blocked/weak pressure counts, source-type count, `portfolioDecisionDemandSourceBlockerBreakdown`, and pivot/pause/kill blocker counts) appear in the summary metric tiles so blocker provenance is visible without opening individual command cards.

The same blocker provenance now rolls up into `demandSourceBlockerDrilldowns` from `buildVentureDemandSourceBlockerDrilldowns(ventures)`. Each drilldown groups a blocker source type, affected venture ids/titles, linked decision command ids, blocked/weak counts, decision counts, evidence lines, a Markdown artifact, and an operator `searchQuery` such as `demand source blocker drilldown customer-interview`. `serializeVenturePortfolio` exports the drilldowns, portfolio search indexes `demand source blocker drilldown`, `blocker source mix drilldown`, and `jump to blocker source` only for affected ventures, and Venture Lab renders a `Demand source blocker drilldowns` panel with filter buttons so operators can jump from the `Blocker source mix` metric directly to the command cards under pressure.

Operators can now save those blocker-source investigations as named views. Venture Lab stores `demandSourceBlockerSavedViews` locally per owner, each with a source type and replayable drilldown `searchQuery`; the panel can apply or delete saved views, and `serializeVenturePortfolio` exports them with provenance metadata. Portfolio import accepts the same saved-view collision mode (`keep both`, `replace`, or `skip`) for these blocker views alongside deployment escalation saved views, so a recurring investigation such as `channel-economics` blocker pressure can be carried across exported portfolio snapshots and replayed after import.

Saved blocker-source views also produce shareable operator packets. Each `demandSourceBlockerSavedViewPackets` export includes the saved view name, source type, saved query, current matching venture ids/titles, linked decision command ids, decision counts, latest evidence snippets, summary, and a Markdown handoff headed `Demand Source Blocker Saved View Packet`. Venture Lab previews these packets in the drilldown panel so an operator can hand off a blocker investigation without asking the recipient to inspect the entire portfolio export first.

The Venture Lab also promotes those packets into a portfolio-level `Demand source blocker packet inbox`. The inbox aggregates all saved blocker-source packets, shows stale/missing-evidence warnings, displays packet freshness timestamps, and offers a `Replay packet ...` action that restores the saved search query without requiring the operator to open the drilldown panel first. Operators can triage each packet as `acknowledged`, `needs-evidence`, or `delegated`; that per-operator state persists locally, survives reloads, imports through `demandSourceBlockerPacketTriage`, appears in inbox counts, and is exported both as packet metadata and a top-level triage payload. Each transition also appends `demandSourceBlockerPacketTriageAuditHistory` with previous status, next status, saved view name, source type, timestamp, and search query so delegated blocker investigations carry audit provenance across imports. Delegated and needs-evidence packets additionally form a `demandSourceBlockerPacketTriageOwnerQueue`, grouped by operator, source type, and triage state with the latest audit transition; the inbox can filter all, needs-evidence, or delegated packet cards so a lead can scan active handoffs without reading every packet. The queue rolls up into `demandSourceBlockerPacketTriageOwnerWorkloadSummary`, which aggregates each owner/source pair with delegated vs needs-evidence totals, stale and missing-evidence counts, latest transition timestamp, and a search anchor that jumps the inbox to that workload group. Imported workload summaries are treated as read-only handoff artifacts: import preview validates and counts them, import re-derives the current local owner workload summary, and the inbox surfaces a persisted drift report when imported owner/source groups are stale, missing, new, or count-mismatched. Leads can reconcile those drift reports without mutating the imported artifact: `demandSourceBlockerPacketTriageWorkloadDriftReconciliation` stores reviewed/pinned/cleared audit entries, `demandSourceBlockerPacketTriageWorkloadPinnedSummaries` stores the current owner/source summary pinned as authoritative, the inbox can filter unresolved drift, and export/import carries both reconciliation trails with provenance. Repeated imported drift snapshots now accumulate into `demandSourceBlockerPacketHandoffHealth`, a portfolio-level handoff health artifact and inbox panel that summarizes unresolved drift, reviewed/pinned reconciliation, pinned authoritative summaries, stale review age, churn score, repeated drift events, and the next trust check per owner/source group before a lead accepts another portfolio transfer. Handoff health groups with repeated drift, unresolved drift, or stale reviews now feed `demandSourceBlockerPacketHandoffRemediationQueue`, a lead-owned remediation list rendered inside the inbox under the `Demand source blocker packet handoff remediation queue` aria-label. Each remediation item carries a trigger (`repeated-drift`, `unresolved-drift`, `stale-review`), priority (`critical`, `high`, `medium`), suggested owner, search anchor, proof required, next action, evidence, and ready/planned status. A lead can mark a remediation planned; planned remediation persists locally as `demandSourceBlockerPacketHandoffRemediationPlans`, survives reload, and exports through `serializeVenturePortfolio` alongside the derived queue. Planned items can then be closed with proof through `demandSourceBlockerPacketHandoffRemediationClosures`, which stores closure summaries, proof artifacts, linked drift report ids, and closed-by provenance while keeping the original drift history visible. If a later imported drift snapshot arrives after closure or drift counts increase, the item reopens to ready, keeps the previous closure receipt visible, and shows a re-opened handoff badge so proof never masks newly stale drift. Import preview validates `demandSourceBlockerPacketHandoffRemediationQueue`, `demandSourceBlockerPacketHandoffRemediationPlans`, and `demandSourceBlockerPacketHandoffRemediationClosures` payloads, surfaces remediation queue/plan/closure counts, warns on malformed payloads, and ignores invalid rows so a repeatedly stale handoff produces a concrete next task and proof-closed receipt instead of only a warning. Reopened remediation items additionally roll up into `demandSourceBlockerPacketHandoffReopenEscalations`, a portfolio-level escalation analytics artifact and inbox panel (`Demand source blocker packet handoff reopen escalation`) that summarizes severity, reopened/failed closure counts, the prior failed proof, the latest reopened drift and failed closure timestamps, the next action, and a search anchor per owner/source group so leads see when proof closure stopped keeping drift stable; `serializeVenturePortfolio` exports the rollup with provenance, and import preview reports the reopen escalation count with a malformed-payload warning.

Reopen escalation SLA receipts (`demandSourceBlockerPacketHandoffReopenEscalationSlaReceipts`) turn that analytics rollup into accountable owner work: the inbox can assign an owner and due timestamp, mark overdue reopened handoffs with SLA badges, persist the assigned-by actor plus failed-closure context, export/import the receipts with provenance, and show preview counts plus malformed-payload warnings. Resolved SLA work now writes `demandSourceBlockerPacketHandoffReopenEscalationSlaResolutions` with proof summary, artifact, resolved-by actor, due timestamp, overdue/breach history, reopened count, and failed-closure context so a lead can close the SLA with evidence while the failed closure proof remains visible; export/import and preview carry the resolution receipt with provenance and malformed-payload warnings. Those resolved receipts also derive `demandSourceBlockerPacketHandoffReopenEscalationSlaBreachTrends`, which groups overdue reopened handoff SLA resolutions by owner/source, marks high/critical recurring process debt, lists breached receipt ids and assigned owners, renders an inbox panel (`Demand source blocker packet handoff reopen SLA breach trends`), exports the trend artifact with provenance, and previews/import-validates the payload with counts and malformed-payload warnings. Leads can now turn each breach trend into `demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessPlans`: an assigned owner/source process-improvement plan with due date, breached receipt ids, follow-up proof requirement, evidence, provenance export, import merge, preview counts, and malformed-payload warnings so recurring SLA breach debt becomes owned process work. Process plans can then be proof-closed with `demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessClosures`, preserving the original breach trend and breached receipt ids while storing proof summary, artifact, closed-by actor, provenance export, import merge, preview counts, and malformed-payload warnings. Future reopened SLA breaches after a process closure now derive `demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressions`, which marks the closed process plan stale-after-closure, preserves the prior proof and artifact, lists new breached receipt ids, exports/import-previews the regression artifact with provenance, and warns on malformed payloads so proof closure cannot hide a recurring breach. Operators can re-close stale regressions with `demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionClosures`: each receipt snapshots the current breach count, latest breach timestamp, new breached receipt ids, source closure id, fresh regression proof summary/artifact, closed-by actor, and provenance. Multiple regression closures accumulate as history rather than overwriting earlier proof, export/import with preview counts, and warn on malformed payloads. Regression re-closure history now derives `demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalations` whenever proof ages beyond the stability window or any later breached receipt appears after a regression re-closure; the inbox marks a higher-severity owner/source process audit, preserves trigger/latest re-closure ids, breach-count movement, aged days, new breached receipts, export provenance, import preview counts, and malformed-payload warnings so repeated proof cannot be mistaken for stable handoff repair. Leads can assign that escalation audit with `demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAssignments`, close it with proof in `demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditClosures`, export/import both receipts, preview counts and malformed payloads, and automatically reopen the audit status when later breached receipts exceed the audit closure snapshot.

Independent regression escalation audit reviews now persist as `demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditReviews`. A second reviewer can attest, dispute, or attach corrective proof to each audit closure; unresolved disputes keep the closure reopened, export/import carries the review trail, and import preview counts or rejects malformed review payloads before a lead accepts stability.

Appeal quorum packets now persist as `demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationAuditAppeals`. Conflicting audit reviews expose reviewer identities, independent reviewer counts, stale dispute age, and a quorum-required appeal packet; a later corrective proof plus two independent reviewers is required before a quorum-cleared appeal can move the audit back toward stability. Appeal packets survive local reloads, export/import, preview counts, and malformed-payload warnings so a reopened SLA breach cannot bury a disputed audit trail.

Appeal-clearance durability monitoring extends those packets with a `clearance-stale` status and optional metadata (`clearanceBaselineReceiptIds`, `reopenedAfterClearanceReceiptIds`, `priorClearanceAppealId`, `staleClearanceAgeDays`). When a quorum-cleared appeal is recorded it snapshots the breached resolution ids it covers as a clearance baseline. If a later reopened SLA breach lands outside that baseline, the prior clearance packet is preserved but marked stale, the audit reopens, and stability is blocked again. Re-clearance is not allowed until the lead records a fresh stale-clearance appeal packet (which keeps the prior clearance id and lists the reopened receipts), a fresh corrective review lands *after* that stale packet, and two independent reviewers then record a new quorum-cleared appeal that snapshots the new full baseline. The panel shows the prior clearance, the reopened receipt ids, the stale-clearance age, and the new re-clearance, and the full reopened appeal history (including baselines and superseded clearance ids) survives export/import, preview counts, and malformed-payload warnings — so a prior quorum clearance can never mask a later recurring breach.

Appeal re-clearance calibration now derives a per-owner/source fragility signal from exported appeal history. `buildBreachProcessRegressionEscalationAppealReClearanceCalibrations()` counts quorum clearances, re-clearances, stale-clearance recurrences, mean days-to-stale, repeat reviewers, latest appeal status, and whether the recurrence threshold marks the clearance fragile. Venture Lab renders a calibration panel next to the audit appeal history and keeps the `fragile clearance` signal visible even after the latest individual re-clearance succeeds, so a chronically re-breaching owner/source cannot look stable just because every single stale packet was eventually re-cleared.

Fragile-clearance governance adds a `fragile-governance` appeal packet before any fragile owner/source can be re-cleared into operational stability again. Once a clearance is flagged fragile, the re-clear button stays withheld after corrective proof until the lead records a separate remediation owner, a fragile escalation artifact, reviewer-rotation proof, and a rotated reviewer identity beyond the repeat reviewer set. The governance packet is stored in the same appeal export/import history, appears in the audit panel, and proves repeat reviewers alone cannot clear a fragile owner/source.

Fragile governance can also go stale. A later breached receipt outside the governance baseline exposes `fragile-governance-stale`, preserves the superseded governance packet id, records the baseline receipts, records the reopened-after-governance receipts, and blocks reuse of the old owner/reviewer lane. A governance packet also expires after seven days without a successful re-clearance; that path records `staleGovernanceReason: "aged-without-reclearance"` plus the stale-governance age before allowing replacement governance. The operator must record the stale-governance packet, add fresh corrective proof when needed, and then attach a new separate owner plus rotated reviewer proof before another re-clearance button appears.

Repeated stale governance now escalates to `fragile-governance-revoked`. Once two stale-governance packets exist for the same owner/source, Venture Lab requires a governance-council revocation packet before any fresh fragile-governance lane can be accepted. The revocation records the revoked governance packet id, the stale-governance packet ids that triggered revocation, a council artifact, and two independent council reviewers; future governance packets cannot reuse the revoked remediation owner or rotated reviewer even if their packet is otherwise complete.

Governance-council revocation packets can also age out. If a `fragile-governance-revoked` packet sits seven days without a fresh accepted governance lane, Venture Lab records `fragile-governance-revocation-stale` with the stale council packet id, stale age, and `staleGovernanceRevocationReason: "aged-without-fresh-governance"`. A fresh two-reviewer council packet is then required before replacement governance can proceed, so an old council revocation cannot unlock a later quarantined re-clearance.

Long governance-council revocation chains now export a compact immutable digest under `demandSourceBlockerPacketHandoffReopenEscalationSlaBreachProcessRegressionEscalationGovernanceDigests`. The digest summarizes governance, stale-governance, council-revocation, and stale-council packet ids plus artifact search text for fast audit review, but it is preview-only on import: `fullPacketGateRequired` and `digestCannotClearGovernance` make clear that the full appeal packets remain the only authoritative gate inputs for fresh governance and re-clearance.

Each compact governance digest also carries a deterministic `packetChainSignature`. Import preview recomputes the signature from the accompanying full appeal packets and warns when a digest references missing packets or has an altered signature; those mismatched digests stay preview-only and never enter the appeal-packet gate state.

Replay-aged compact digests are also kept out of gate state. When an imported digest's `exportedAt` predates the latest local governance appeal packet for the same owner/source/escalation chain, Venture Lab warns that the digest is older than local packet history, preserving the local packet chain as the only source that can affect governance and re-clearance gates.

If an import carries multiple compact governance digests for the same owner/source/escalation chain with competing signatures or packet windows, the preview reports a digest conflict and keeps the newest verifiable full appeal packets authoritative. Competing compact summaries can help an auditor search the old chain, but they cannot overwrite, hide, or suppress the packet-level appeal history used by the governance gates.

Digest conflicts now include preview drilldowns: the warning text lists the conflicting digest ids, the number of competing signatures, the competing packet windows, and the preferred full appeal packet id/timestamp. This gives operators enough context to investigate compact-summary drift without opening raw JSON while preserving the preview-only boundary.

When a conflicting compact governance digest payload is imported, the portfolio import audit history records the same preview-only drilldown as a `compactGovernanceDigestConflictReceipts` receipt. The receipt is exported with import audit history for later review, but the imported compact digest itself is still not merged into governance gate state.

## Spawning New Ventures from Successful Memories

Successful ventures now produce evidence-backed branch drafts (`VentureSpawnedVentureDraft`) via `buildVentureSpawnedVentureDrafts`. For each parent venture, the builder reads its converted-pain, retained-user, worked-channel, and converted-pricing memories and emits branch drafts that propose adjacent theses: an adjacent-buyer extension from converted pain, a retained-cohort deepening branch from retained users, a channel reuse branch from a worked channel, and a pricing-tier branch from converted pricing. Each draft carries parent venture id/title, source memory id, branch source type (`converted-pain | retained-user | worked-channel | converted-pricing`), proposed title, target buyer, pain, wedge, channel, pricing hypothesis, confidence score, status (`draft-ready | needs-evidence | blocked`), one-line summary, provenance, source evidence, risks to re-validate, kickoff actions, and Markdown export. Drafts are deliberately NOT auto-saved; they are kickoff theses for human review. `serializeVenturePortfolio` exports the array as `spawnedVentureDrafts`, portfolio search indexes the drafts (`spawned venture draft`, `spawn new ventures`, `adjacent buyer`, `channel reuse branch`, `pricing tier branch`, branch source, status, proposed title, provenance), the portfolio summary tracks and surfaces `spawnedVentureDraftCount`, ready/needs-evidence/blocked counts, and per-branch-source counts, and the Venture Lab renders a dedicated `Spawned venture drafts` panel with parent provenance, branch source labels, status, confidence, risks, and the next kickoff action — and an explicit reminder that human review is required before save.

## Merging Related Ideas Across Saved Ventures

Saved ventures are also clustered pairwise by `buildVentureRelatedIdeaMergeAudits`, which emits a `VentureRelatedIdeaMergeAudit` for every pair of saved ventures whose theses overlap on buyer / pain / wedge / channel / title / competitive context. Each audit carries a primary venture (selected by evidence depth, then most-recent update, then id), a related venture, similarity score, matched fields, recommendation (`reuse | merge | fork | keep-separate`), shared thesis summary, structural differences to preserve, evidence provenance arrays from both sides (top evidence sources, latest decision, recorded claim), risk callouts (audit-trail loss, scaling/killed-venture protection, recommendation-specific caveats), a human-review next action, and a Markdown export. Audits are **human review only**: ventures are never merged, archived, or deleted automatically. `serializeVenturePortfolio` exports them as `relatedIdeaMergeAudits`, `filterVenturePortfolio` indexes them (`related idea merge audit`, `merge related ideas`, `merge audit`, recommendation, matched fields, shared thesis summary, differences, evidence provenance, risks, next action, markdown), `summarizeVenturePortfolio` tracks `relatedIdeaMergeAuditCount` and per-recommendation counters (`reuse`, `merge`, `fork`, `keep-separate`), and the Venture Lab renders a dedicated `Merge related ideas` panel with recommendation/score/matched-field badges, provenance lines, differences to preserve, and the next human-review action.

## Scaling Strong Venture Branches

Every saved venture now derives a `VentureScaleStrongBranchPlan` via `buildVentureScaleStrongBranchPlan`. The plan combines revenue posture (`scaling-revenue`), financial model (`scale-ready`), paid-back channel economics, support burden, kill/scale pressure, and a human-approved spend audit plus explicit spend ceiling. It emits status (`scale-ready | approval-required | needs-proof | blocked`), support status, score, paid-back channel count, open/high/resolved support counts, approved spend audit count, spend ceiling, evidence, blockers, stop rules, next action, `humanReviewRequired: true`, and Markdown. The plan is internal only: it never spends money, contacts customers, deploys, or changes billing. `serializeVenturePortfolio` exports plans as `scaleStrongBranchPlans`, portfolio search indexes `scale strong branches`, `human-approved spend ceiling`, evidence, blockers, stop rules, and Markdown, the portfolio summary tracks ready/approval-needed/needs-proof/blocked plan counts and approved ceiling totals, and the Venture Lab renders a `Scale strong branch plan` panel inside each saved venture card.

## Killing Weak Venture Branches

The portfolio also derives `VentureWeakBranchKillMemory` records via `buildVentureWeakBranchKillMemories`. These records turn kill/pause recommendations, killed lifecycle state, recorded kill decisions, and blocked spawned drafts into explicit weak-branch memory with source type, source title, status (`kill-recommended | pause-recommended | archived | revival-watch`), recommendation, severity, confidence, primary reason, evidence, stop rules, no-go boundaries, failure lessons, revival conditions, next action, and Markdown. The memory is deliberately archival: it does not delete active records, but it makes no-spend/no-outreach/no-build boundaries searchable and exportable. `serializeVenturePortfolio` exports `weakBranchKillMemories`, portfolio search indexes `weak branch kill memory`, `kill weak branches`, `no spend no outreach`, source/status/reason/lesson/revival terms, the portfolio summary tracks kill/pause/archive/revival-watch counts, and the Venture Lab renders a `Kill weak branches` panel that keeps killed branch memory distinct from active venture cards.

## Reinvesting Venture Learning

The portfolio now derives a single `VentureLearningReinvestmentQueueItem` stream via `buildVentureLearningReinvestmentQueue`. The queue converts weak-branch kill memory, spawned venture drafts, related-idea merge audits, and scale-strong-branch plans into human-reviewed next experiments. Each item carries source type (`weak-branch-kill | spawned-venture-draft | related-idea-merge | scale-strong-branch`), source artifact, priority, status (`ready | needs-owner | blocked | watch`), owner, learning, next experiment, proof required, changed branch instruction, expected impact, evidence, and Markdown. `serializeVenturePortfolio` exports it as `learningReinvestmentQueue`, portfolio search indexes `learning reinvestment queue`, `reinvest learning`, proof/change/owner/source terms, the portfolio summary tracks ready/needs-owner/blocked/watch plus critical/high counts, and the Venture Lab renders a `Learning reinvestment queue` panel proving that old learning changes the next branch before reuse, merge, save, spend, or scale.

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

## Background Refresh Monitoring

The server exposes background refresh status at:

```bash
curl -fsS http://127.0.0.1:3001/api/background/refresh/status
```

The response includes scheduler state, live-readiness checks, current run, last run, recent runs, and totals for started/completed/failed/skipped/rejected refreshes. For the readiness object alone:

```bash
curl -fsS http://127.0.0.1:3001/api/background/refresh/readiness
```

Readiness validates live mode, InsForge URL/token presence, `BRAVE_SEARCH_API_KEY`, `OPENAI_API_KEY`, single-flight state, optional MongoDB vector sync, query count, and search delay without printing secret values. `POST /api/refresh` records a deterministic skipped run in demo mode and starts a forced live refresh outside demo mode only when readiness passes. Missing live dependencies return `503`; overlapping live runs return `409` with the active run snapshot. Failed live runs include retry metadata in the status snapshot, and runs that fail after creating a mission mark that mission `error` plus its agents `failed` so no partial sweep stays active. Discovery ingestion canonicalizes source URLs, skips duplicate sources inside a run, checks a recent-source lookback before inserts, and falls back to row-level inserts if a batch fails. With `MASTERBUILD_LOG_STRUCTURED=1`, refresh readiness, starts, skips, rejected overlaps, cleanup steps, search steps, dedupe counts, insert counts, vector sync, synthesis, completion, and failures are emitted as `background.refresh.*` JSON-line events.

To persist the current operational evidence outside process memory:

```bash
curl -fsS -X POST http://127.0.0.1:3001/api/background/refresh/export
```

The export writes an atomic JSON artifact under `MASTERBUILD_RUNTIME_DIR/operation-evidence` (or `runtime/operation-evidence` by default) containing readiness blockers, scheduler settings, current/last/recent refresh runs, totals, and an operator summary. The response includes the artifact path, runtime-relative path, byte count, and SHA-256 hash; `pnpm api:contracts` verifies that the file exists and matches the returned hash in an isolated runtime directory.

To list exported operation-evidence artifacts without knowing exact filenames:

```bash
curl -fsS http://127.0.0.1:3001/api/background/refresh/exports
```

The index response returns recent artifact filenames, runtime-relative paths, byte counts, hashes, generation times, parseability, last-run IDs, blocker names, and warning names. `limit=<n>` is supported up to 100 artifacts.

To inspect a saved operation-evidence artifact before trusting or importing it:

```bash
curl -fsS -X POST http://127.0.0.1:3001/api/background/refresh/import/inspect \
  -H 'content-type: application/json' \
  -d '{"runtimeRelativePath":"operation-evidence/background-refresh-example.json","sha256":"expected-sha256"}'
```

The inspection endpoint resolves only artifacts inside the operation-evidence directory, verifies the optional expected SHA-256, parses and validates the schema, and compares the artifact's saved last-run ID, status, blocker list, and run count against the current background refresh state.

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
insforge/masterbuild_schema_v2.sql
insforge/masterbuild_rls_policies.sql
insforge/migration_fix_agent_unique.sql
```

Apply it to the InsForge project before relying on live decision persistence or live agent mission persistence. The newer `recommendation_decisions` table intentionally stores AI-generated recommendation snapshots without requiring those generated recommendations to exist in the seeded `market_recommendations` table. The masterbuild schema includes the richer agent lifecycle fields used by the Market Research cockpit: status detail, failure reason, retry count, confidence, and heartbeat.

To verify the checked-in SQL assets, mock fixtures, and exported seed JSON stay aligned before touching a live backend:

```bash
pnpm db:assets:verify
```

This command validates required SQL files, the table/column contract used by `pnpm schema:verify:masterbuild`, fixture IDs, enums, date/numeric ranges, trend foreign-key coherence, exported InsForge seed files, and seed row counts. It runs without network access and cleans up its temporary seed-export directory.

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

Focused maygoals proof path:

```bash
pnpm verify:maygoals
```

The `Maygoals Verification` GitHub Actions workflow runs the same command on pull requests and pushes to `main`.

Production build and chunk-budget proof:

```bash
pnpm verify:production
```

Vite's manual chunks keep the heaviest Venture Lab panels and portfolio helpers split out of the route bundle, including import preview badges, regression escalation audit, command queue panels, demand-source blocker drilldowns, portfolio charts, and the governance/portfolio data helpers checked by `pnpm build:check-chunks`.

Static and build checks:

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm build
pnpm build:check-chunks
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
