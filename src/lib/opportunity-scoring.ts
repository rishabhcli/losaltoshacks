import type { FinalOption, FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";

export interface OpportunityScoreBreakdown {
  optionId: string;
  title: string;
  label: "Strong" | "Promising" | "Speculative" | "Weak";
  opportunityScore: number;
  confidenceScore: number;
  marketTimingScore: number;
  evidenceDiversityScore: number;
  executionDifficultyScore: number;
  riskScore: number;
  contradictionScore: number;
  evidenceCount: number;
  coveredPlatforms: string[];
  missingPlatforms: string[];
  drivers: string[];
  warnings: string[];
}

export interface OpportunityScorecard {
  primary: OpportunityScoreBreakdown;
  rankedOptions: OpportunityScoreBreakdown[];
}

const DEFAULT_REQUIRED_PLATFORMS = ["youtube", "x", "reddit", "substack"];

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function roundScore(value: number) {
  return Math.round(clamp(value));
}

function uniquePlatforms(option: FinalOption) {
  return Array.from(new Set(
    option.evidence
      .map((evidence) => evidence.platform.trim().toLowerCase())
      .filter(Boolean),
  )).sort();
}

function getRequiredPlatforms(finalOptions: FinalOptionsPayload) {
  const required = finalOptions.coverage.requiredPlatforms?.map((platform) => platform.toLowerCase()) ?? [];
  return required.length > 0 ? required : DEFAULT_REQUIRED_PLATFORMS;
}

function getMissingPlatforms(option: FinalOption, finalOptions: FinalOptionsPayload) {
  const covered = new Set(uniquePlatforms(option));
  const required = getRequiredPlatforms(finalOptions);
  return required.filter((platform) => !covered.has(platform));
}

function getExecutionDifficulty(option: FinalOption, finalOptions: FinalOptionsPayload) {
  const isPrimary = option.id === finalOptions.primaryOptionId;
  if (isPrimary) {
    const plan = finalOptions.implementationPlan;
    const screenLoad = Math.min(24, (plan.screens?.length ?? 0) * 4);
    const integrationLoad = Math.min(20, (plan.integrations?.length ?? 0) * 5);
    const dataLoad = Math.min(16, (plan.dataModel?.length ?? 0) * 4);
    const workflowLoad = Math.min(12, (plan.workflows?.length ?? 0) * 3);
    return roundScore(30 + screenLoad + integrationLoad + dataLoad + workflowLoad);
  }

  const format = `${option.recommendedFormat} ${option.concept}`.toLowerCase();
  if (/template|download|kit|playbook|newsletter/.test(format)) return 38;
  if (/mobile|app|software|planner|platform/.test(format)) return 54;
  return 46;
}

function hasRiskyClaims(option: FinalOption, finalOptions: FinalOptionsPayload) {
  const text = [
    option.title,
    option.concept,
    option.whyPromising,
    option.marketAngle,
    finalOptions.implementationPlan.problem,
    finalOptions.implementationPlan.valueProp,
  ].join(" ").toLowerCase();

  return /clinical|therapy|medical|diagnos|treatment|mental-health|mental health/.test(text);
}

function hasContradictionLanguage(option: FinalOption) {
  const text = [
    option.concept,
    option.whyPromising,
    option.marketAngle,
    option.evidence.map((evidence) => evidence.summary).join(" "),
  ].join(" ").toLowerCase();

  return /contradict|mixed signal|pushback|backlash|declin|skeptic|concern/.test(text);
}

function difficultyLabel(score: number) {
  if (score >= 70) return "High";
  if (score >= 45) return "Moderate";
  return "Low";
}

function scoreLabel(score: number): OpportunityScoreBreakdown["label"] {
  if (score >= 75) return "Strong";
  if (score >= 60) return "Promising";
  if (score >= 45) return "Speculative";
  return "Weak";
}

function scoreOption(option: FinalOption, finalOptions: FinalOptionsPayload): OpportunityScoreBreakdown {
  const requiredPlatforms = getRequiredPlatforms(finalOptions);
  const coveredPlatforms = uniquePlatforms(option);
  const missingPlatforms = getMissingPlatforms(option, finalOptions);
  const evidenceCount = option.evidence.filter((evidence) => evidence.url.trim()).length;
  const evidenceVolumeScore = roundScore(Math.min(100, evidenceCount * 28));
  const evidenceDiversityScore = evidenceCount === 0
    ? 0
    : roundScore((coveredPlatforms.length / requiredPlatforms.length) * 100);
  const confidenceScore = roundScore(
    evidenceDiversityScore * 0.55 +
    evidenceVolumeScore * 0.25 +
    (finalOptions.coverage.readyForLovable ? 15 : 0) +
    (option.id === finalOptions.primaryOptionId ? 8 : 0) -
    missingPlatforms.length * 4,
  );
  const marketTimingScore = roundScore(
    45 +
    Math.min(32, finalOptions.marketResearch.signals.length * 8) +
    (finalOptions.implementationPlan.whyNow ? 10 : 0) +
    evidenceVolumeScore * 0.1,
  );
  const executionDifficultyScore = getExecutionDifficulty(option, finalOptions);
  const riskScore = roundScore(
    20 +
    missingPlatforms.length * 12 +
    (finalOptions.coverage.readyForLovable ? 0 : 8) +
    executionDifficultyScore * 0.15 +
    (hasRiskyClaims(option, finalOptions) ? 12 : 0) -
    evidenceVolumeScore * 0.08,
  );
  const contradictionScore = roundScore(
    (missingPlatforms.length > 0 ? Math.min(40, missingPlatforms.length * 14) : 0) +
    (hasContradictionLanguage(option) ? 20 : 0),
  );
  const opportunityScore = roundScore(
    confidenceScore * 0.26 +
    marketTimingScore * 0.22 +
    evidenceDiversityScore * 0.22 +
    (100 - executionDifficultyScore) * 0.16 +
    (100 - riskScore) * 0.1 -
    contradictionScore * 0.04,
  );

  const drivers = [
    `Evidence diversity: ${coveredPlatforms.length}/${requiredPlatforms.length} platforms`,
    `Market timing: ${finalOptions.marketResearch.signals.length} signal${finalOptions.marketResearch.signals.length === 1 ? "" : "s"}`,
    `Execution difficulty: ${difficultyLabel(executionDifficultyScore)}`,
  ];
  const warnings = [
    missingPlatforms.length > 0 ? `Missing platform coverage: ${missingPlatforms.join(", ")}` : "",
    riskScore >= 50 ? "Risk pressure is elevated; review assumptions before handoff." : "",
    contradictionScore >= 25 ? "Contradiction risk is elevated by incomplete or mixed evidence." : "",
    confidenceScore < 55 ? "Confidence is weak; collect more source evidence." : "",
  ].filter(Boolean);

  return {
    optionId: option.id,
    title: option.title,
    label: scoreLabel(opportunityScore),
    opportunityScore,
    confidenceScore,
    marketTimingScore,
    evidenceDiversityScore,
    executionDifficultyScore,
    riskScore,
    contradictionScore,
    evidenceCount,
    coveredPlatforms,
    missingPlatforms,
    drivers,
    warnings,
  };
}

export function scoreFinalOptions(finalOptions: FinalOptionsPayload): OpportunityScorecard {
  const rankedOptions = finalOptions.options
    .map((option) => scoreOption(option, finalOptions))
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
  const primary =
    rankedOptions.find((option) => option.optionId === finalOptions.primaryOptionId) ??
    rankedOptions[0];

  return {
    primary,
    rankedOptions,
  };
}
