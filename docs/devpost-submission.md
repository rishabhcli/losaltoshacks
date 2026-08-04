# Inspiration

Most teams know their market is changing, but they usually notice too late. The signals are scattered across YouTube, Reddit, X, newsletters, reports, and internal hunches. We built MarketPulse to make market intelligence feel less like guessing and more like having a calm analyst team that can show its work.

## What It Does

MarketPulse is an autonomous market-intelligence workspace for operators, founders, marketers, and product teams.

It helps a team:

- Launch a market research mission.
- Watch specialist agents move through queued, searching, validating, synthesizing, failed, stale, and done states.
- Inspect evidence behind discoveries, recommendations, reports, and briefings.
- Open a trend and see its memory: whether the signal is new or resurfacing, how confident the forecast is, what source mix supports it, and what to check next.
- Accept or reject opportunities and see those decisions persist into decision libraries with evidence counts, review cadence, and revisit guidance.
- Launch follow-up research directly from recommendation details when a decision needs to be rechecked.
- Generate a report and executive briefing from the same research trail, with a briefing trust ledger and stricter-evidence regeneration mode.
- Review an AI output audit trail on reports and briefings before trusting the artifact.
- See runtime health before trusting a mission result.

The demo mode is deterministic and clearly labeled, so the full judge path works without paid API credentials. The live backend path uses InsForge for auth and database persistence when credentials are configured.

## How We Built It

MarketPulse is a Vite + React + TypeScript app with a Node AI server and Python browser-agent runtime.

The app includes:

- A Market Research cockpit for mission control and agent observability.
- An evidence model that carries source URL, platform, title, summary, and engagement metadata into recommendations, reports, and briefings.
- A trend memory model that turns trend score, growth, detection age, and evidence mix into lifecycle and forecast context.
- A briefing trust layer that summarizes source coverage, platform coverage, evidence-backed recommendation coverage, and risk before a user treats a briefing as decision-ready.
- An AI output audit trail that shows generation mode, prompt summary, source inputs, token estimate, uncertainty, and warnings on generated reports and briefings.
- InsForge-backed mission, agent, recommendation-decision, and health-check paths.
- A deterministic demo AI server path for reliable local judging.
- Playwright coverage for login routing, dashboard navigation, Market Research command and observe modes, mobile visibility, mission launch, evidence inspection, recommendation acceptance, accepted ideas, reports, briefings, and API smoke routes.
- Verification scripts for the live InsForge schema and recommendation-decision persistence.

We also added a one-command demo runner:

```bash
pnpm dev:demo
```

## Challenges We Ran Into

The hardest part was making an ambitious agent product honest. It is easy to build a fake command center; it is harder to show when a source is missing, when an agent failed, when the backend is degraded, or when a result is only demo-seeded.

We also found real infrastructure drift during verification. The original MarketPulse InsForge backend was paused, so we created and verified against a replacement backend; that replacement is now paused as well, making those live checks historical rather than current availability proof. A live dashboard smoke caught a missing `discoveries.industry` column, which we fixed in schema and verifier code.

## Accomplishments That We're Proud Of

We are proud that MarketPulse now has a real inspectable loop:

- Start a mission.
- Watch agents progress and degrade honestly.
- Inspect source evidence.
- Open a generated trend and see trend memory, forecast confidence, source mix, and the missing-channel warning.
- Accept a recommendation.
- See the accepted idea in a decision library with its evidence trail and launch-review cadence.
- Open report and briefing artifacts built from the same research state.
- Inspect the artifact audit trail to see whether it was locally drafted or live-generated, which sources went in, and what still needs review.
- Tighten a briefing to cited/evidence-backed inputs with a single stricter-evidence control.

We also proved more than the UI. The full local test ladder passes, the one-command demo runner has been smoked, the live InsForge mission queue can write and read rows, and browser-authenticated recommendation decisions have been verified on the disposable active backend.

## What We Learned

Trust is the product. AI-generated market intelligence is only useful if a user can see why the system believes something, how fresh the evidence is, what failed, and whether the output is safe to act on.

We also learned that a great demo path should not pretend to be production. MarketPulse separates deterministic demo behavior from live credentials and exposes that state in the interface.

## What's Next For MarketPulse

Next we would focus on:

- Running the full live Python/browser worker with live AI inference once production OpenAI credentials are available.
- Restoring or repointing the official MarketPulse InsForge backend so local env and live proof target the same project.
- Adding richer evidence scoring for credibility, novelty, freshness, contradictions, and channel diversity.
- Connecting trend memory to scheduled change detection so resurfacing signals can trigger fresh missions automatically.
- Turning follow-up missions into scheduled decision-review rituals with change detection.
- Extending AI output audit trails to product handoffs and scheduled briefing runs.
- Expanding the briefing ritual into daily and weekly strategy modes with live audio once TTS credentials are configured.

The goal is to make strategic market awareness as easy to check as a morning inbox, but with enough evidence that a serious team can act on it.
