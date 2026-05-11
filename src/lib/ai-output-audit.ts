export type AiOutputMode = "local-draft" | "strict-local-draft" | "live-model";

export interface AiOutputAuditSource {
  url?: string | null;
  platform?: string | null;
}

export interface AiOutputAuditInput {
  artifact: "report" | "briefing" | "business-plan" | "recommendation";
  mode: AiOutputMode;
  model?: string | null;
  missionPrompt?: string | null;
  generatedAt?: Date | string | null;
  outputText?: string | null;
  sources?: AiOutputAuditSource[] | null;
  inputCounts?: {
    trends?: number;
    recommendations?: number;
    insights?: number;
    sections?: number;
  };
  warnings?: string[];
}

export interface AiOutputAuditTrail {
  artifactLabel: string;
  modeLabel: string;
  modelLabel: string;
  promptSummary: string;
  generatedAtLabel: string;
  sourceInputLabel: string;
  inputSummary: string;
  tokenEstimate: number;
  tokenEstimateLabel: string;
  uncertaintyLabel: string;
  warnings: string[];
}

const ARTIFACT_LABELS: Record<AiOutputAuditInput["artifact"], string> = {
  report: "Research report",
  briefing: "Executive briefing",
  "business-plan": "Business plan",
  recommendation: "Recommendation",
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizePlatform(platform?: string | null) {
  return String(platform ?? "unknown").trim().toLowerCase().replace(/\s+/g, "_") || "unknown";
}

function plural(value: number, singular: string, pluralLabel = `${singular}s`) {
  return `${value} ${value === 1 ? singular : pluralLabel}`;
}

function summarizePrompt(prompt?: string | null) {
  const trimmed = String(prompt ?? "").trim().replace(/\s+/g, " ");
  if (!trimmed) return "No mission prompt attached";
  return trimmed.length > 96 ? `${trimmed.slice(0, 93)}...` : trimmed;
}

function formatGeneratedAt(value?: Date | string | null) {
  const date = value instanceof Date ? value : value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "Generated time unknown";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function estimateTokenCount(text?: string | null) {
  const normalized = String(text ?? "").trim();
  if (!normalized) return 0;
  const words = normalized.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words * 1.35));
}

function getModeLabel(input: AiOutputAuditInput) {
  if (input.mode === "live-model") return input.model ? `Live model: ${input.model}` : "Live model";
  if (input.mode === "strict-local-draft") return "Strict evidence local draft";
  return "Local deterministic draft";
}

function getUncertaintyLabel(input: {
  mode: AiOutputMode;
  sourceCount: number;
  platformCount: number;
  tokenEstimate: number;
}) {
  let confidence = 46;
  confidence += Math.min(24, input.sourceCount * 5);
  confidence += Math.min(18, input.platformCount * 6);
  if (input.mode === "live-model") confidence += 8;
  if (input.mode === "strict-local-draft") confidence += 6;
  if (input.tokenEstimate === 0) confidence -= 24;
  confidence = clamp(confidence, 0, 100);

  if (confidence >= 78) return "Lower uncertainty";
  if (confidence >= 58) return "Moderate uncertainty";
  return "High uncertainty";
}

export function buildAiOutputAuditTrail(input: AiOutputAuditInput): AiOutputAuditTrail {
  const sources = input.sources ?? [];
  const sourceUrls = new Set(sources.map((source) => source.url).filter(Boolean));
  const sourceCount = sourceUrls.size || sources.length;
  const platforms = Array.from(new Set(sources.map((source) => normalizePlatform(source.platform)))).filter(
    (platform) => platform !== "unknown",
  );
  const platformCount = platforms.length;
  const tokenEstimate = estimateTokenCount(input.outputText);
  const counts = input.inputCounts ?? {};
  const inputParts = [
    counts.trends != null ? plural(counts.trends, "trend") : "",
    counts.recommendations != null ? plural(counts.recommendations, "recommendation") : "",
    counts.insights != null ? plural(counts.insights, "insight") : "",
    counts.sections != null ? plural(counts.sections, "section") : "",
  ].filter(Boolean);

  const warnings = [
    sourceCount === 0 ? "No source inputs attached" : "",
    sourceCount > 0 && platformCount < 2 ? "Limited source diversity" : "",
    !String(input.missionPrompt ?? "").trim() ? "No mission prompt attached" : "",
    input.mode !== "live-model" ? "Local draft, not live LLM regenerated" : "",
    tokenEstimate === 0 ? "No generated output text available" : "",
    ...(input.warnings ?? []),
  ].filter(Boolean);

  return {
    artifactLabel: ARTIFACT_LABELS[input.artifact],
    modeLabel: getModeLabel(input),
    modelLabel: input.mode === "live-model" ? (input.model ?? "Live model") : "Deterministic local generator",
    promptSummary: summarizePrompt(input.missionPrompt),
    generatedAtLabel: formatGeneratedAt(input.generatedAt),
    sourceInputLabel:
      sourceCount > 0
        ? `${plural(sourceCount, "source")} across ${plural(platformCount, "platform")}`
        : "No cited source inputs",
    inputSummary: inputParts.length > 0 ? inputParts.join(", ") : "No structured inputs counted",
    tokenEstimate,
    tokenEstimateLabel: tokenEstimate > 0 ? `~${tokenEstimate.toLocaleString()} output tokens` : "No output tokens",
    uncertaintyLabel: getUncertaintyLabel({ mode: input.mode, sourceCount, platformCount, tokenEstimate }),
    warnings,
  };
}
