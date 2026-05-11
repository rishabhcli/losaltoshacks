# Ultra Mega Codex Goal Prompt for losaltoshacks

## Copy This Into Codex Goal Mode

```text
/goal Transform /Users/m3-max/Documents/GitHub/losaltoshacks from a hackathon-grade MarketPulse prototype into an autonomous market-intelligence operating system that continuously discovers live market shifts, verifies source evidence, ranks opportunities, coordinates specialist research agents, produces investor-quality strategy artifacts, generates executable product handoffs, and proves every major behavior through end-to-end tests. Treat the north star as intentionally years ahead of a normal software engineer, but keep each iteration grounded in real shipped code, real tests, real runtime checks, and real user-visible improvement.
```

After creating the goal, paste the rest of this prompt as the operating contract.

---

# MarketPulse Autonomous Build Contract

You are working in:

```text
/Users/m3-max/Documents/GitHub/losaltoshacks
```

The repo is a Vite + React + TypeScript application for MarketPulse, a market intelligence product with:

- A dashboard for trends, KPIs, recommendations, briefings, and reports.
- A Market Research cockpit with browser-style specialist agents: Echo, Pulse, Thread, Ledger, and Atlas.
- A Node AI server at `server/ai-server.mjs`.
- Python browser-use agents under `agents/`.
- InsForge-backed auth, database, realtime, functions, and storage surfaces.
- MongoDB vector-search helpers.
- Playwright tests under `e2e/`.
- Design direction in `docs/design.md`: calm, bright, clear, trustworthy, operator-focused.

Your job is not to make a small polish pass. Your job is to make MarketPulse feel like the first version of a serious autonomous market-intelligence company.

The north star is deliberately absurd:

MarketPulse should become an always-on strategic analyst that watches the internet, extracts credible early signals, understands which signals matter to a specific business, explains why, tracks uncertainty over time, coordinates agents, generates business plans, produces executive briefings, hands off validated opportunities to product builders, and learns from user feedback. A normal engineer would need years to fully accomplish this. You must compress as much of that future as possible into the current repo through repeated, tested, high-leverage iterations.

Do not stop at a proposal. Do not stop after only reading files. Do not stop after one cosmetic change. Build, test, inspect, fix, and iterate.

---

## Hard Rules

1. Work from runtime truth.
   Inspect the real source tree, real scripts, real env assumptions, real routes, real tests, and real dev-server behavior before major changes.

2. Preserve the existing product soul.
   MarketPulse should feel like a calm, credible advisor for operators, not a noisy crypto dashboard or a generic AI toy.

3. Do not fake the core loop.
   If a feature claims live research, evidence, confidence, collaboration, mission state, or agent work, either implement the real behavior or label the fallback honestly in the UI and tests.

4. Never silently hide failures.
   Loading, empty, offline, missing-secret, API-error, partial-data, and stale-data states must be visible and useful.

5. Every iteration must ship something concrete.
   Concrete means code, tests, docs, migrations, scripts, seeded data, runtime checks, or measurable UI behavior.

6. Every iteration must be verified.
   At minimum run relevant static checks and focused tests. For user-facing changes, run the app and inspect the browser with Playwright or the Browser plugin.

7. Keep edits scoped, but be bold.
   Do not churn unrelated files. Do not do random refactors. But if the real product needs a new module, endpoint, route, schema, or test harness, build it.

8. Respect project instructions.
   If touching InsForge integration code, fetch the latest InsForge docs through the MCP docs tools before coding. Use SDKs for app logic and MCP tools for infrastructure. Keep dependency changes intentional. The project doc says Tailwind CSS 3.4 should be used, so audit the existing Tailwind setup before making style/build changes and reconcile drift carefully.

9. Avoid literal infinite loops.
   This is a relentless iteration loop, not a runaway process. Continue looping until all acceptance gates pass or until a true external blocker exists. Before any stop, write the exact next step and blocker state into the repo.

10. Do not claim victory without proof.
    Final output must list the commands run, URLs checked, tests passed, and any remaining risks.

---

## Initial Recon

Start every run by building a real map of the repo. Use fast commands and read the actual files.

Required recon:

```bash
pwd
git status --short
rg --files -g '!node_modules' -g '!dist' -g '!coverage' | sort | sed -n '1,240p'
sed -n '1,240p' package.json
sed -n '1,220p' README.md
sed -n '1,260p' docs/design.md
sed -n '1,260p' src/router.tsx
sed -n '1,260p' src/pages/MarketResearch.tsx
sed -n '1,260p' src/hooks/useMasterBuildDashboard.ts
sed -n '1,260p' server/ai-server.mjs
sed -n '1,260p' e2e/app.spec.ts
```

Then answer these questions in your own working notes before coding:

- What is the real product promise today?
- Which parts are implemented versus mocked, shimmed, or aspirational?
- Which path creates the biggest user-visible leap with the least architectural damage?
- Which tests already protect the path?
- Which missing test would catch the most embarrassing regression?
- What is the smallest end-to-end loop that proves the next major improvement?

---

## Product North Star

Build toward this product:

MarketPulse is an autonomous market-intelligence OS for founders, marketers, operators, product leads, and small strategy teams.

It should answer:

- What is changing in my market right now?
- Which signals are early but credible?
- Which signals are noise?
- What specific opportunity should I act on?
- What evidence supports that recommendation?
- What should I build, test, write, buy, or launch next?
- Which assumptions are weak?
- What changed since yesterday?
- What has the team already accepted, rejected, or archived?
- Can I trust this insight enough to act?

The application should not merely generate insights. It should run an evidence-backed research workflow that a serious business person can inspect.

---

## Epic Outcomes to Build Toward

Use these as the large target areas. Do not try to finish them all in one giant uncontrolled patch. Pick the highest-leverage slice, ship it, verify it, then loop.

### 1. Evidence Graph and Source Truth

Create a first-class evidence model:

- Source URL, platform, author/channel, title, excerpt, timestamp, fetched-at, freshness, engagement, content type, raw metadata.
- Credibility score and reason.
- Relevance score and reason.
- Novelty score and reason.
- Connected trend, opportunity, recommendation, and briefing references.
- Duplicate and near-duplicate handling.
- "Why this matters" explanation attached to evidence, not just to generated text.

User-visible result:

- Every trend, recommendation, option, business plan, and briefing can show the evidence behind it.
- Users can inspect source provenance without leaving the app.
- Empty evidence is treated as a warning, not as success.

### 2. Agent Mission Control That Feels Alive

Make the Market Research page feel like a real command center while staying calm and usable:

- Agent lifecycle: idle, queued, searching, extracting, validating, synthesizing, blocked, done, failed.
- Per-agent objective, current source, latest action, retry count, last heartbeat, confidence.
- Live feed with useful event taxonomy, not raw spam.
- Mission timeline with phases and ETA bands.
- Stop, reset, retry failed agent, and replay mission from checkpoint.
- Agent browser previews that degrade gracefully when no preview exists.
- Clear final state: done, partial, stopped, failed, or needs user input.

User-visible result:

- A non-technical user understands what the agents are doing and whether the result can be trusted.

### 3. Opportunity Ranking Engine

Build a scoring layer that turns evidence into decisions:

- Opportunity score.
- Confidence score.
- Market timing score.
- Revenue potential.
- Execution difficulty.
- Differentiation.
- Audience urgency.
- Channel fit.
- Evidence diversity.
- Risk and contradiction score.

The ranking should be inspectable:

- Show what moved the score up or down.
- Show missing evidence.
- Show stale evidence.
- Show contradictory signals.

### 4. Strategic Workflow System

Turn recommendations into work:

- Accept, reject, archive, revisit-later flows.
- Decision notes and rationale.
- Team-ready report state.
- History of prior decisions.
- Change tracking: what changed since this was accepted or rejected?
- Follow-up research missions spawned from a recommendation.
- Accepted ideas and rejected ideas pages should become serious decision libraries.

### 5. Executive Briefings With Audio and Citations

Upgrade briefings from "generated summary" into an executive ritual:

- Daily/weekly briefing modes.
- Briefing sections: what changed, top risks, top opportunities, recommended actions, evidence appendix.
- Voice playback with useful states and failure handling.
- Download/share only if already supported and privacy-safe.
- Citation-aware content.
- "Regenerate using stricter evidence" control.

### 6. Trend Memory and Forecasting

Build trend evolution:

- Trend history over time.
- Momentum changes.
- Forecast confidence.
- New versus resurfacing trends.
- User-specific relevance from preferences.
- Semantic clustering of related trends.
- Vector search across discoveries, memory, and reports.

### 7. Trust, Safety, and Auditability

Market intelligence dies without trust. Build trust into the product:

- Generated content must identify uncertainty.
- Risk labels for insufficient evidence, stale evidence, single-source claims, and low confidence.
- Audit trail for AI outputs: model, prompt summary, timestamp, source inputs, token estimate when available.
- Data freshness badges.
- Error boundaries and user-safe recovery paths.

### 8. Production-Grade Local Runtime

The local development loop must be boringly reliable:

- One command or documented pair of commands to run frontend and AI server.
- Health checks for server, InsForge env, MongoDB env, AI providers, and browser-use agent prerequisites.
- Seed/reset scripts that create a usable demo state.
- Clear docs for missing credentials.
- CI-friendly test split: unit, type, lint, e2e, server API smoke.

### 9. Design System Hardening

Match `docs/design.md` unless the app has intentionally evolved:

- Calm light interface as the default.
- Accessible contrast.
- Responsive layouts.
- No text overflow in buttons, cards, sidebars, or panels.
- Consistent icons from lucide-react.
- Predictable spacing and stable fixed-format UI.
- No nested cards unless the structure truly demands it.
- Controls should look like controls: icon buttons, toggles, tabs, menus, sliders, inputs, filters.

### 10. Launch-Ready Story

Update the product story so a judge, user, or investor can understand:

- What MarketPulse does.
- What is real today.
- What integrations are required.
- What the demo path is.
- How to run it locally.
- How to verify the mission loop.
- What the next frontier is.

---

## The Relentless Iteration Loop

Run this loop until all acceptance gates pass.

### Loop Step 1: Select the Highest-Leverage Slice

Pick one slice that materially improves the real product. Prefer slices that connect frontend, backend, data model, and tests.

Good slices:

- Evidence-backed recommendation details.
- Mission state machine hardening.
- Server dashboard contract cleanup.
- Agent event taxonomy and UI.
- Accept/reject workflow with persistence.
- Realistic seed/demo state plus e2e coverage.
- Briefing generation with citation coverage.
- Health-check dashboard.
- A complete "launch mission -> observe agents -> inspect result -> accept idea -> generate report" path.

Bad slices:

- Random visual tweaks without product behavior.
- New marketing pages.
- Hidden code with no UI path.
- Fake AI claims.
- Giant dependency swaps without proof.
- Refactors that do not improve a user-visible or test-visible outcome.

### Loop Step 2: Write a Short Local Plan

Before editing, write a concise plan in your response or working notes:

- Files likely touched.
- Behavior being changed.
- Tests to add or update.
- Verification command sequence.
- Risks.

Then execute. Do not wait for user permission.

### Loop Step 3: Implement the Slice

Use existing patterns:

- React components under `src/components`.
- Pages under `src/pages`.
- Shared hooks under `src/hooks`.
- Server logic under `server/`.
- Agent runtime under `agents/`.
- InsForge SQL under `insforge/`.
- E2E under `e2e/`.

Add abstractions only when they remove real duplication or clarify a real domain boundary.

### Loop Step 4: Add Real Tests

Choose tests proportional to risk:

- Type tests or normalization tests for pure data transforms.
- Vitest for hooks, reducers, scoring, validation, and utility modules.
- Playwright for real user flows.
- API smoke tests for server routes.
- Seed/reset tests where possible.

Every new product behavior should have at least one direct regression test.

### Loop Step 5: Run the Verification Ladder

Use the real package manager after checking lockfiles and scripts. The repo currently documents pnpm, but also has npm artifacts, so inspect before assuming.

Baseline ladder:

```bash
pnpm install
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

If frontend or e2e changed:

```bash
pnpm exec vite --host 127.0.0.1 --port 3000
```

In another process:

```bash
AI_SERVER_PORT=3001 node server/ai-server.mjs
```

Then:

```bash
curl -fsS http://127.0.0.1:3001/health
pnpm exec playwright test
```

If Playwright depends on server setup, adjust `playwright.config.ts` or add documented webServer orchestration rather than relying on magic.

For browser UI verification:

- Open `http://127.0.0.1:3000`.
- Verify login/auth mock behavior or real configured auth behavior.
- Verify `/market-research`.
- Launch a mission if credentials and backend are configured.
- Verify dashboard, trends, recommendations, briefing, history, accepted/rejected ideas.
- Capture screenshots when layout or visual behavior changed.
- Check desktop and mobile widths when responsive layout changed.

### Loop Step 6: Fix Failures Immediately

If a command fails:

1. Read the error.
2. Identify whether it is your regression, an existing unrelated failure, or missing local setup.
3. Fix your regression.
4. If setup is missing, add a health check, clearer env docs, or a mockable fallback.
5. Rerun the failing command.

Do not move on while your own change is broken.

### Loop Step 7: Commit-Ready Summary

At the end of each loop, produce:

- What changed.
- Why it matters.
- Files touched.
- Tests run.
- Runtime URLs checked.
- Remaining risks.
- Next highest-leverage slice.

Then immediately start the next loop if acceptance gates remain unmet and tool/context budget allows.

### Loop Step 8: Continuation File Before Any Stop

If you must stop because of context, external services, missing secrets, or a hard blocker, create or update:

```text
docs/mega-build-continuation.md
```

Include:

- Current branch and git status summary.
- Completed slices.
- Exact commands run and results.
- Current blocker.
- Next command to run.
- Next files to inspect or edit.
- Acceptance gates still failing.

This allows the next Codex run to resume without starting over.

---

## Acceptance Gates

Do not declare the goal complete until these gates are true or explicitly blocked by missing external credentials with a documented fallback.

### Gate A: App Builds Cleanly

Required:

- TypeScript passes.
- Lint passes or documented project lint baseline is fixed.
- Unit tests pass.
- Production build passes.

### Gate B: Local Runtime Works

Required:

- Frontend runs locally.
- AI server runs locally.
- `GET /health` returns OK.
- `GET /api/dashboard` returns a usable object.
- Missing env variables produce clear guidance rather than crashes where feasible.

### Gate C: Core User Flow Works

Required:

The following flow is implemented and e2e tested:

1. User reaches app.
2. Auth or mocked auth lands user in dashboard.
3. User opens Market Research.
4. User launches or simulates a mission.
5. UI shows mission state, agent status, discoveries or honest empty states.
6. User inspects evidence or result details.
7. User accepts, rejects, archives, or follows up on an opportunity.
8. User can see the decision in history or accepted/rejected pages.
9. User can generate or view a report/briefing from the result.

### Gate D: Evidence Is First-Class

Required:

- Generated recommendations and plans can cite evidence.
- Evidence has source URL and platform.
- Low-evidence states are visible.
- Data freshness is visible.
- At least one test proves evidence appears in the UI.

### Gate E: Agent System Is Inspectable

Required:

- Agent statuses are normalized.
- Mission lifecycle is visible.
- Live feed is useful.
- Server dashboard payload is documented or typed.
- UI handles no agents, partial agents, failed agents, stale agents, and complete agents.

### Gate F: Design Feels Professional

Required:

- No obvious text overlap.
- No broken responsive surfaces.
- Controls are recognizable and accessible.
- Layout matches the calm MarketPulse design direction.
- Browser screenshots have been inspected after major UI changes.

### Gate G: Documentation Is Honest

Required:

- README or docs explain real setup.
- Required env vars are documented.
- Demo path is documented.
- Unsupported or mocked behavior is identified.
- Devpost story remains truthful.

---

## Suggested Build Sequence

Use judgment, but this sequence is likely high leverage.

### Phase 1: Stabilize the Runtime Contract

- Audit `server/ai-server.mjs`, `src/hooks/useMasterBuildDashboard.ts`, and `e2e/helpers.ts`.
- Add shared TypeScript types for dashboard payloads if missing.
- Normalize mission, agent, discovery, evidence, and business plan data.
- Make `/api/dashboard` predictable in success, empty, and error states.
- Add server smoke tests or Playwright request tests that do not depend on paid services.

### Phase 2: Make Evidence Visible Everywhere

- Introduce evidence cards/components.
- Add evidence counts and warnings to recommendations, final options, business plans, and briefings.
- Add a source drawer or inline expandable evidence section.
- Update seed/mock payloads and tests.

### Phase 3: Upgrade Market Research Mission UX

- Add lifecycle timeline.
- Add agent heartbeat/staleness handling.
- Add failed/partial mission states.
- Make reset/stop/retry states testable.
- Verify with Playwright.

### Phase 4: Build Opportunity Decision Workflow

- Wire accept/reject/archive/follow-up actions.
- Persist decisions through InsForge if available, or a clearly labeled local/demo adapter if not.
- Upgrade accepted/rejected pages from passive lists into decision libraries.
- Add tests for moving an opportunity through states.

### Phase 5: Build Briefing and Report Trust Layer

- Make reports and briefings citation-aware.
- Add confidence and contradiction sections.
- Add audio status and graceful failure handling.
- Add "regenerate with stricter evidence" if AI route exists.

### Phase 6: Vector Memory and Semantic Search

- Audit MongoDB vector helpers.
- Add health check and graceful unavailable state.
- Store evidence embeddings where possible.
- Search across discoveries, memory, and reports.
- Surface related evidence in detail pages.

### Phase 7: Production Demo Harness

- One documented demo command or script.
- Seed realistic missions, agents, evidence, recommendations, and reports.
- A Playwright "judge demo" spec that proves the best path.
- Screenshots or trace artifacts for proof.

### Phase 8: Polish the Whole Product Feel

- Remove fake or aspirational labels.
- Tighten empty states.
- Fix responsive issues.
- Add accessible labels and keyboard paths.
- Ensure every page has a reason to exist.

---

## Testing Requirements in Detail

Build tests that prove user value, not just selectors.

Required Playwright specs to add or maintain:

- Login unauthenticated route.
- Authenticated dashboard route.
- Market Research command view.
- Market Research observe view.
- Mission input interaction.
- Agent status rendering for empty, active, failed, and completed states.
- Evidence rendering from dashboard payload.
- Accept/reject/archive flow.
- Briefing/report view from a completed mission.
- Server health and dashboard API.
- Mobile smoke for dashboard and market research if layout changes.

Required static checks:

- TypeScript.
- Lint.
- Unit tests.
- Build.

Recommended local proof commands:

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm build
AI_SERVER_PORT=3001 node server/ai-server.mjs
curl -fsS http://127.0.0.1:3001/health
curl -fsS http://127.0.0.1:3001/api/dashboard
pnpm exec vite --host 127.0.0.1 --port 3000
pnpm exec playwright test
```

If any command cannot run because of missing env/secrets/services, document:

- Exact command.
- Exact error.
- Whether it is required for the feature.
- What fallback test was run.
- What env var or service would unblock it.

---

## Quality Bar for Code

Follow this standard:

- Prefer typed domain models over `any`.
- Prefer small pure normalizers for uncertain API data.
- Prefer stable route contracts.
- Prefer explicit loading/error/empty states.
- Prefer reusable UI only when the second use exists or is clearly imminent.
- Avoid broad rewrites.
- Avoid duplicating source-of-truth constants.
- Avoid `setTimeout` as logic except for UI pacing or test-safe simulation.
- Do not bury business rules inside JSX.
- Do not let AI output shape leak everywhere; normalize it at boundaries.

---

## Quality Bar for UI

MarketPulse should feel:

- Calm.
- Bright.
- Trustworthy.
- Fast.
- Specific.
- Inspectable.
- Useful to a business operator.

It should not feel:

- Generic.
- Decorative.
- Over-animated.
- Dark by default unless a mature dark theme exists.
- Like an AI chatbot wrapped in cards.
- Like a fake command center with no evidence.

When building UI:

- Use lucide-react icons.
- Use existing Radix/shadcn-style primitives.
- Keep repeated item cards modest.
- Make controls stable in width and height.
- Add tooltips for icon-only controls.
- Keep headings sized for the local surface.
- Avoid text overflow at mobile widths.
- Use badges for state, not paragraph explanations.
- Use drawers/dialogs for deep evidence inspection.

---

## Data and Infrastructure Expectations

### InsForge

If editing InsForge app logic:

- Fetch current docs first with InsForge MCP documentation tools.
- Use `@insforge/sdk` from application code.
- Keep client config in one place.
- Handle `{ data, error }` responses explicitly.
- Inserts should use array format where the SDK expects it.
- Use MCP tools for schema, buckets, functions, deployments, and metadata.

### MongoDB Vector Search

If editing vector search:

- Make missing MongoDB config a clear degraded state.
- Add health checks.
- Keep embedding storage idempotent.
- Do not block the whole dashboard because semantic search is unavailable.

### AI Providers

If editing OpenAI, Gemini, ElevenLabs, MiniMax, or other AI code:

- Detect missing keys early.
- Return actionable errors.
- Keep prompts in named functions or files.
- Store prompt summaries and output metadata where useful.
- Do not hardcode secrets.

### Python Agents

If editing agents:

- Make control commands observable.
- Make cancellation reliable.
- Write checkpoints where long-running tasks can resume.
- Emit structured logs.
- Keep browser-use failures visible in the UI.

---

## "Unattainable" Feature Ideas to Pull From

Use these as idea fuel. Implement the highest-leverage real subset each loop.

- Competitive radar that tracks named competitors and detects messaging shifts.
- Trend contradiction detector that explains why two sources disagree.
- Weak-signal detector for tiny but fast-growing communities.
- Evidence diversity meter across YouTube, X, Reddit, Substack, newsletters, web search, and internal notes.
- Operator persona tuning: founder, marketer, product lead, sales lead, investor.
- Action generator: campaign ideas, landing-page tests, survey questions, partnership targets, content calendar, prototype spec.
- Market memory: "this looked promising last month, but momentum faded."
- Watchlists with alert thresholds.
- Briefing ritual: morning digest, weekly strategy memo, board-update mode.
- Opportunity lab: compare 3 possible plays with assumptions, evidence, risk, and next experiment.
- Decision ledger: accepted/rejected ideas with rationale and follow-up dates.
- Trust dashboard: stale sources, low-confidence claims, missing channels, agent failures.
- Demo mode that can run without paid credentials but labels itself honestly.
- Real mode that uses configured services and proves live calls.

---

## Final Completion Standard

Only declare the goal complete if:

- All acceptance gates pass.
- The app runs locally.
- The AI server health endpoint works.
- The core Market Research flow has e2e proof.
- Evidence-backed insights are visible.
- Decision workflow is real or honestly demo-backed.
- Documentation matches reality.
- You can hand the repo to another engineer and they can run the demo.

If the full north star remains impossible, that is expected. The goal is intentionally beyond normal scope. Your real success condition is that every autonomous loop pushes the app closer to that north star with verified, compounding improvements.

Your closing report must include:

- Summary of shipped changes.
- Commands run and results.
- Local URLs checked.
- Screenshots/traces if created.
- Remaining blockers.
- The next three highest-leverage loops.

Then, if context and tools remain available and gates are still failing, continue the next loop.
