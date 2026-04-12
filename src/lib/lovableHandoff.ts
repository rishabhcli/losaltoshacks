import type { BusinessPlan, DiscoveredContent } from "@/hooks/useAgentData";
import type { FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";

const MAX_PROMPT_CHARS = 14_000;

/**
 * Lovable autosubmit URL (same pattern as agents/masterbuild_runtime.py).
 */
export function buildLovableLaunchUrl(prompt: string): string {
  const trimmed = prompt.trim().slice(0, MAX_PROMPT_CHARS);
  if (!trimmed) return "https://lovable.dev/";
  return `https://lovable.dev/?autosubmit=true#prompt=${encodeURIComponent(trimmed)}`;
}

function discoveryLines(discoveries: DiscoveredContent[], limit = 40): string[] {
  const lines: string[] = [];
  for (const d of discoveries.slice(0, limit)) {
    const parts = [
      `agent ${d.found_by_agent_id}`,
      d.keywords ? `keywords: ${d.keywords}` : "",
      d.video_url ? `url: ${d.video_url}` : "",
    ].filter(Boolean);
    if (parts.length) lines.push(`- ${parts.join(" | ")}`);
  }
  return lines;
}

/**
 * Extremely detailed build brief from the live market report + optional final options.
 */
export function buildDetailedLovablePromptFromReport(params: {
  missionPrompt: string;
  plan: BusinessPlan;
  discoveries: DiscoveredContent[];
  finalOptions: FinalOptionsPayload | null;
}): string {
  const { missionPrompt, plan, discoveries, finalOptions } = params;
  const p = plan;

  const sections: string[] = [
    "# Lovable build brief — production MVP",
    "",
    "You are building a real, shippable web application in Lovable. Follow every section below. Do not skip flows, empty states, or monetization hooks called out here.",
    "",
    "## Mission & research context",
    `- **Research mission:** ${missionPrompt.trim() || "(not specified)"}`,
    `- **Plan version:** v${p.version} | **Confidence:** ${p.confidence_score}% | **Discoveries analyzed:** ${p.discovery_count}`,
    "",
    "## Executive synthesis (structured plan)",
    "### Market opportunity",
    p.market_opportunity?.trim() || "_No data — infer carefully from mission and signals._",
    "",
    "### Competitive landscape",
    p.competitive_landscape?.trim() || "_Infer from research context._",
    "",
    "### Revenue models",
    p.revenue_models?.trim() || "_Propose 1–2 credible models aligned with the mission._",
    "",
    "### User acquisition",
    p.user_acquisition?.trim() || "_Propose concrete channels._",
    "",
    "### Risk analysis",
    p.risk_analysis?.trim() || "_List top risks and mitigations._",
    "",
  ];

  if (p.raw_plan?.trim()) {
    sections.push(
      "## Full live report (verbatim — primary source)",
      "Use this as the deepest source of truth for product decisions, copy tone, and feature scope:",
      "",
      "```markdown",
      p.raw_plan.trim(),
      "```",
      "",
    );
  }

  const discLines = discoveryLines(discoveries);
  if (discLines.length) {
    sections.push(
      "## Ground-truth signals from live scraping",
      "These are real URLs/keywords gathered during research — respect them in UX copy, IA, and integrations:",
      "",
      ...discLines,
      "",
    );
  }

  const impl = finalOptions?.implementationPlan;
  if (impl) {
    sections.push(
      "## Implementation blueprint (from research engine)",
      `- **Product title:** ${impl.title}`,
      `- **One-liner:** ${impl.oneLiner}`,
      "",
      "### Problem & users",
      `- **Problem:** ${impl.problem}`,
      `- **Target users:** ${impl.targetUsers}`,
      `- **Value proposition:** ${impl.valueProp}`,
      `- **Why now:** ${impl.whyNow}`,
      "",
      "### Core user flows",
      ...(impl.coreUserFlows?.length ? impl.coreUserFlows.map((f) => `- ${f}`) : ["- (define 3–5 end-to-end flows from the report)"]),
      "",
      "### Screens (build each with modules)",
      ...(impl.screens?.length
        ? impl.screens.map(
            (s) =>
              `- **${s.name}:** ${s.purpose}${s.modules?.length ? ` — modules: ${s.modules.join(", ")}` : ""}`,
          )
        : ["- Map screens from the live report"]),
      "",
      "### Data model",
      ...(impl.dataModel?.length
        ? impl.dataModel.map(
            (m) =>
              `- **${m.entity}:** ${m.purpose}${m.fields?.length ? ` — fields: ${m.fields.join(", ")}` : ""}`,
          )
        : ["- Propose entities implied by the report"]),
      "",
      "### Workflows",
      ...(impl.workflows?.length
        ? impl.workflows.map((w) => `- **${w.name}:** trigger \`${w.trigger}\` → outcome: ${w.outcome}`)
        : []),
      "",
      "### Integrations & monetization",
      `- **Integrations:** ${impl.integrations?.join(", ") || "As justified by report"}`,
      `- **Monetization:** ${impl.monetization || "From revenue section above"}`,
      "",
      "### Launch & metrics",
      ...(impl.launchPlan?.length ? impl.launchPlan.map((x) => `- Launch: ${x}`) : []),
      ...(impl.successMetrics?.length ? impl.successMetrics.map((x) => `- Metric: ${x}`) : []),
      "",
    );
  }

  sections.push(
    "## Non-negotiable build quality",
    "- **Stack:** Modern React app suitable for Lovable (responsive, accessible, fast).",
    "- **MVP depth:** Core workflow must work end-to-end with realistic seeded demo data.",
    "- **UI:** Credible SaaS polish — spacing, typography, empty states, loading states, error states.",
    "- **Navigation:** Clear IA; primary CTA always obvious on key screens.",
    "- **Auth (if needed):** Simple email magic link or mock auth with clear demo credentials in UI.",
    "- **SEO basics:** Sensible titles/meta where applicable.",
    "",
    "## Deliverable",
    "Ship the smallest version that still feels like a real product a founder could show investors, grounded in the research above.",
  );

  return sections.join("\n").trim().slice(0, MAX_PROMPT_CHARS);
}
