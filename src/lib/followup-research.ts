import type { FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";
import { scoreFinalOptions } from "./opportunity-scoring";

export function buildFollowUpResearchPrompt(finalOptions: FinalOptionsPayload): string {
  const scorecard = scoreFinalOptions(finalOptions);
  const primary = scorecard.primary;
  const title = primary.title || finalOptions.implementationPlan.title || "the recommended opportunity";
  const missing = primary.missingPlatforms.length > 0
    ? primary.missingPlatforms.join(", ")
    : "fresh independent channels";
  const warnings = primary.warnings.length > 0
    ? primary.warnings.join("; ")
    : "no current scoring warnings";
  const signals = finalOptions.marketResearch.signals.slice(0, 4).join(", ") || "the current market signals";

  return [
    `Follow-up research: pressure-test ${title}.`,
    `Validate missing or weak evidence, especially ${missing}.`,
    `Current score warnings: ${warnings}.`,
    `Check whether these signals still hold: ${signals}.`,
    "Return fresh source URLs, engagement context, contradictions, and whether the opportunity score should move up, down, or stay the same.",
  ].join(" ");
}
