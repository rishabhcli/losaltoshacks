import type { FinalOption, FinalOptionEvidence, FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";
import { scoreFinalOptions } from "./opportunity-scoring";

export type VentureStage = "researching" | "validating" | "building";
export type ApprovalStatus = "complete" | "available" | "requires-human" | "blocked";
export type VentureWhyNowConfidence = "supported" | "inferred" | "speculative";
export type VentureMvpScopeConfidence = "defined" | "inferred" | "speculative";
export type VentureBuildEstimateConfidence = "calculated" | "inferred" | "speculative";
export type VentureBuildEffortLevel = "low" | "medium" | "high";
export type VentureEvidenceConfidenceLabel = "strong" | "moderate" | "thin" | "weak";
export type VentureReasoningDebateConfidence = "source-backed" | "inferred" | "speculative";
export type VentureEvaluationLensConfidence = "source-backed" | "inferred" | "speculative";

export interface VentureWorkspaceExperiment {
  id: string;
  type: string;
  hypothesis: string;
  audience: string;
  channel: string;
  cost: string;
  successThreshold: string;
  failureThreshold: string;
  ethicsReview: string;
  metrics: string[];
  result: string;
  interpretation: string;
  nextAction: string;
  recordedAt?: string;
}

export interface VentureWorkspaceApproval {
  level: string;
  status: ApprovalStatus;
  evidence: string;
}

export interface VentureOpportunityDemandSnapshot {
  source: "final-options" | "manual-thesis";
  optionId: string;
  title: string;
  buyer: string;
  demandScore: number;
  painUrgencyScore: number;
  demandEvidenceScore: number;
  evidenceCount: number;
  coveredPlatforms: string[];
  missingPlatforms: string[];
  demandSignals: string[];
  warnings: string[];
}

export interface VentureWhyNowRationale {
  headline: string;
  drivers: string[];
  risks: string[];
  expiringWindow: string;
  confidence: VentureWhyNowConfidence;
  sources: FinalOptionEvidence[];
}

export interface VentureMvpScope {
  mustHaveFeatures: string[];
  deferredFeatures: string[];
  dependencies: string[];
  timeToMvp: string;
  confidence: VentureMvpScopeConfidence;
  source: "build-brief" | "manual-thesis" | "fallback";
}

export interface VentureBuildEstimate {
  effortScore: number;
  effortLevel: VentureBuildEffortLevel;
  timeRange: string;
  builderProfile: string;
  complexityDrivers: string[];
  riskAdjustments: string[];
  confidence: VentureBuildEstimateConfidence;
  source: "build-brief" | "manual-thesis" | "fallback";
}

export interface VentureEvidenceConfidence {
  score: number;
  label: VentureEvidenceConfidenceLabel;
  sourceCount: number;
  platformCount: number;
  sourcePlatforms: string[];
  supportingSignals: string[];
  gaps: string[];
}

export interface VentureReasoningDebate {
  bullCase: string;
  bearCase: string;
  lazyConsensus: string;
  nonObviousInsight: string;
  fatalAssumption: string;
  fastestValidationPath: string;
  clearestKillReason: string;
  downsideIfWrong: string;
  confidence: VentureReasoningDebateConfidence;
  sourceSignals: string[];
}

export interface VentureEvaluationLens {
  label: string;
  score: number;
  confidence: VentureEvaluationLensConfidence;
  signals: string[];
  gaps: string[];
  nextAction: string;
}

export interface VentureEvaluationLenses {
  jobsToBeDone: VentureEvaluationLens;
  willingnessToPay: VentureEvaluationLens;
  distributionWedge: VentureEvaluationLens;
  productLedGrowth: VentureEvaluationLens;
  churnRisk: VentureEvaluationLens;
  expansionRevenue: VentureEvaluationLens;
  platformDependency: VentureEvaluationLens;
  marketplaceLiquidity: VentureEvaluationLens;
  networkEffects: VentureEvaluationLens;
  dataMoats: VentureEvaluationLens;
  regulatoryArbitrage: VentureEvaluationLens;
  procurementFriction: VentureEvaluationLens;
  founderMarketFit: VentureEvaluationLens;
  brandTrust: VentureEvaluationLens;
  aiAutomationDefensibility: VentureEvaluationLens;
  salesLedEnterprise: VentureEvaluationLens;
  workflowLockIn: VentureEvaluationLens;
  verticalSaasDynamics: VentureEvaluationLens;
  marginalCostStructure: VentureEvaluationLens;
  integrationComplexity: VentureEvaluationLens;
  switchingCosts: VentureEvaluationLens;
  distributionMoats: VentureEvaluationLens;
  capitalEfficiency: VentureEvaluationLens;
  supportBurden: VentureEvaluationLens;
  competitiveRetaliation: VentureEvaluationLens;
}

export interface VentureOperatingWorkspace {
  id: string;
  title: string;
  stage: VentureStage;
  stageLabel: string;
  decision: "continue" | "validate" | "kill-review";
  targetBuyer: string;
  painStatement: string;
  productWedge: string;
  revenueModel: string;
  pricingHypothesis: string;
  acquisitionChannels: string[];
  retentionMechanism: string;
  whyNow: VentureWhyNowRationale;
  mvpScope: VentureMvpScope;
  buildEstimate: VentureBuildEstimate;
  evidenceConfidence: VentureEvidenceConfidence;
  reasoningDebate: VentureReasoningDebate;
  evaluationLenses: VentureEvaluationLenses;
  keyIntegrations: string[];
  dataRequirements: string[];
  evidenceSources: FinalOptionEvidence[];
  claims: string[];
  contradictions: string[];
  untestedAssumptions: string[];
  changeMindTriggers: string[];
  companySimulation: {
    customerSegments: string[];
    salesCycle: string;
    pricing: string;
    grossMargin: string;
    cac: string;
    paybackPeriod: string;
    activation: string;
    retention: string;
    expansion: string;
    supportLoad: string;
    infrastructureCost: string;
    complianceCost: string;
    engineeringComplexity: string;
    competitiveResponse: string;
    hiringNeeds: string;
    capitalIntensity: string;
    failureModes: string[];
  };
  experiments: VentureWorkspaceExperiment[];
  killCriteria: {
    missingEvidence: string[];
    disconfirmationPath: string;
    pivotTriggers: string[];
    stopTriggers: string[];
    killReasons: string[];
  };
  mvpHandoff: {
    sourceCodeStatus: string;
    setupInstructions: string;
    testCoverage: string;
    deploymentPath: string;
    analyticsPlan: string;
    securityNotes: string;
    accessibilityPass: string;
    mobileBehavior: string;
    dataModel: string[];
    operatorDashboard: string;
    evidenceBacklink: string;
  };
  approvals: VentureWorkspaceApproval[];
  opportunityDemandSnapshot?: VentureOpportunityDemandSnapshot;
  nextActions: string[];
}

export interface ManualVentureThesisInput {
  title: string;
  targetBuyer: string;
  painStatement: string;
  productWedge: string;
  revenueModel?: string;
  pricingHypothesis?: string;
  acquisitionChannel?: string;
  evidenceNote?: string;
  whyNowNote?: string;
  mvpScopeNote?: string;
  buildEstimateNote?: string;
  evidenceConfidenceNote?: string;
}

function primaryOption(finalOptions: FinalOptionsPayload): FinalOption {
  return (
    finalOptions.options.find((option) => option.id === finalOptions.primaryOptionId) ??
    finalOptions.options[0]
  );
}

function compactList(values: Array<string | undefined | null>) {
  return values.map((value) => value?.trim() ?? "").filter(Boolean);
}

function sentenceFallback(value: string | undefined, fallback: string) {
  return value?.trim() ? value.trim() : fallback;
}

function firstMetricContaining(metrics: string[], pattern: RegExp) {
  return metrics.find((metric) => pattern.test(metric))?.trim();
}

function clampScore(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function uniqueCompact(values: Array<string | undefined | null>, limit = 4) {
  const seen = new Set<string>();
  const results: string[] = [];
  for (const value of values) {
    const normalized = value?.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(normalized);
    if (results.length >= limit) break;
  }
  return results;
}

function timingDriverFragments(text: string) {
  return text
    .split(/[.;\n]+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 4);
}

function expiringWindowFrom(drivers: string[]) {
  return drivers.find((driver) => (
    /\b(20\d{2}|Q[1-4]|month|quarter|year|wave|cycle|semester|season|deadline|renewal|trend)\b/i.test(driver)
  )) ?? "No dated catalyst on record";
}

function scopeTimeEstimate(params: {
  featureCount: number;
  dependencyCount: number;
  complexityText?: string;
}) {
  if (/high|complex|regulated|multi[- ]?tenant|payment|billing|clinical|security/i.test(params.complexityText ?? "")) {
    return "2-4 weeks for a local concierge MVP before production hardening.";
  }
  if (params.featureCount >= 5 || params.dependencyCount >= 3) {
    return "1-2 weeks for a focused local MVP with manual setup.";
  }
  return "2-5 days for a no-frills concierge or fake-door MVP.";
}

function confidenceFromScope(params: {
  source: VentureMvpScope["source"];
  note: string;
  featureCount: number;
}) {
  if (params.source === "build-brief" && params.featureCount >= 3) return "defined";
  if (params.note || params.featureCount > 0) return "inferred";
  return "speculative";
}

function effortLevelFor(score: number): VentureBuildEffortLevel {
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

function buildTimeRangeFor(level: VentureBuildEffortLevel) {
  if (level === "high") return "2-4 weeks before a trustworthy local MVP is ready for deployment review.";
  if (level === "medium") return "1-2 weeks for a focused local MVP with verification.";
  return "2-5 days for a concierge or fake-door MVP.";
}

function builderProfileFor(level: VentureBuildEffortLevel) {
  if (level === "high") return "Full-stack builder plus operator QA before any external launch.";
  if (level === "medium") return "Product-minded full-stack builder with founder-led QA.";
  return "Founder/operator with lightweight builder support.";
}

function buildEstimateConfidenceFor(source: VentureBuildEstimate["source"], mvpScopeConfidence: VentureMvpScopeConfidence): VentureBuildEstimateConfidence {
  if (source === "build-brief" && mvpScopeConfidence === "defined") return "calculated";
  if (source !== "fallback" || mvpScopeConfidence !== "speculative") return "inferred";
  return "speculative";
}

function buildVentureBuildEstimate(params: {
  source: VentureBuildEstimate["source"];
  mvpScope: VentureMvpScope;
  integrationCount: number;
  dataRequirementCount: number;
  missingEvidenceCount: number;
  executionDifficultyScore: number;
  riskScore: number;
  complexityText?: string;
  note?: string;
}): VentureBuildEstimate {
  const featureCount = params.mvpScope.mustHaveFeatures.length;
  const dependencyCount = params.mvpScope.dependencies.length;
  const effortScore = clampScore(
    10 +
    featureCount * 3 +
    dependencyCount * 3 +
    params.integrationCount * 4 +
    params.dataRequirementCount +
    params.missingEvidenceCount * 2 +
    params.executionDifficultyScore * 0.25 +
    params.riskScore * 0.08,
  );
  const effortLevel = effortLevelFor(effortScore);
  const complexityDrivers = uniqueCompact([
    `${featureCount} must-have MVP feature${featureCount === 1 ? "" : "s"}`,
    `${dependencyCount} ${dependencyCount === 1 ? "dependency" : "dependencies"}`,
    params.integrationCount > 0 ? `${params.integrationCount} integration${params.integrationCount === 1 ? "" : "s"}` : "",
    params.dataRequirementCount > 0 ? `${params.dataRequirementCount} data requirement${params.dataRequirementCount === 1 ? "" : "s"}` : "",
    params.note,
    params.complexityText,
  ], 6);
  const riskAdjustments = uniqueCompact([
    params.missingEvidenceCount > 0 ? `${params.missingEvidenceCount} unresolved evidence gate${params.missingEvidenceCount === 1 ? "" : "s"} before deployment confidence.` : "",
    params.riskScore >= 55 ? "Risk pressure adds review time." : "",
    params.mvpScope.deferredFeatures[0],
  ], 4);

  return {
    effortScore,
    effortLevel,
    timeRange: buildTimeRangeFor(effortLevel),
    builderProfile: builderProfileFor(effortLevel),
    complexityDrivers: complexityDrivers.length > 0 ? complexityDrivers : ["No complexity drivers recorded yet."],
    riskAdjustments: riskAdjustments.length > 0 ? riskAdjustments : ["No build risk adjustment recorded yet."],
    confidence: buildEstimateConfidenceFor(params.source, params.mvpScope.confidence),
    source: params.source,
  };
}

function buildMvpScope(params: {
  source: VentureMvpScope["source"];
  note?: string;
  coreFlows?: string[];
  screenModules?: string[];
  dataRequirements?: string[];
  integrations?: string[];
  missingEvidence?: string[];
  complexityText?: string;
}): VentureMvpScope {
  const note = params.note?.trim() ?? "";
  const noteFragments = timingDriverFragments(note);
  const mustHaveFeatures = uniqueCompact([
    ...noteFragments,
    ...(params.coreFlows ?? []),
    ...(params.screenModules ?? []),
    ...(params.dataRequirements ?? []).slice(0, 3),
  ], 6);
  const deferredFeatures = uniqueCompact([
    ...(params.missingEvidence ?? []).map((gap) => `Defer scale or deployment until ${gap} is resolved.`),
    ...(params.integrations ?? []).slice(2).map((integration) => `Defer deep ${integration} automation until demand is proven.`),
  ], 4);
  const dependencies = uniqueCompact([
    ...(params.integrations ?? []).map((integration) => `${integration} integration`),
    ...(params.missingEvidence ?? []).map((gap) => `${gap} evidence`),
  ], 5);
  const features = mustHaveFeatures.length > 0 ? mustHaveFeatures : ["No concrete MVP feature scope has been extracted yet."];

  return {
    mustHaveFeatures: features,
    deferredFeatures: deferredFeatures.length > 0 ? deferredFeatures : ["Defer production deployment until evidence and verification are attached."],
    dependencies: dependencies.length > 0 ? dependencies : ["Manual founder workflow"],
    timeToMvp: scopeTimeEstimate({
      featureCount: features.length,
      dependencyCount: dependencies.length,
      complexityText: params.complexityText,
    }),
    confidence: confidenceFromScope({
      source: params.source,
      note,
      featureCount: mustHaveFeatures.length,
    }),
    source: params.source,
  };
}

function evidenceConfidenceLabel(score: number): VentureEvidenceConfidenceLabel {
  if (score >= 75) return "strong";
  if (score >= 58) return "moderate";
  if (score >= 35) return "thin";
  return "weak";
}

function platformsFromEvidence(evidence: FinalOptionEvidence[]) {
  return Array.from(new Set(
    evidence
      .map((source) => source.platform.trim().toLowerCase())
      .filter(Boolean),
  )).sort();
}

function sourceCountFromEvidence(evidence: FinalOptionEvidence[]) {
  return evidence.filter((source) => source.url.trim() || source.summary.trim() || source.title.trim()).length;
}

function buildEvidenceConfidence(params: {
  evidence: FinalOptionEvidence[];
  confidenceScore: number;
  demandEvidenceScore: number;
  coveredPlatforms: string[];
  missingPlatforms: string[];
  demandSignals: string[];
  warnings: string[];
  note?: string;
}): VentureEvidenceConfidence {
  const sourcePlatforms = params.coveredPlatforms.length > 0 ? params.coveredPlatforms : platformsFromEvidence(params.evidence);
  const sourceCount = sourceCountFromEvidence(params.evidence);
  const score = clampScore(
    params.confidenceScore * 0.62 +
    params.demandEvidenceScore * 0.28 +
    Math.min(10, sourceCount * 2) -
    params.missingPlatforms.length * 3,
  );
  const supportingSignals = uniqueCompact([
    `${sourceCount} source${sourceCount === 1 ? "" : "s"} across ${sourcePlatforms.length} platform${sourcePlatforms.length === 1 ? "" : "s"}`,
    params.note,
    ...params.demandSignals,
    ...params.evidence.map((source) => source.title || source.summary),
  ], 5);
  const gaps = uniqueCompact([
    ...params.missingPlatforms.map((platform) => `Missing evidence from ${platform}.`),
    ...params.warnings.filter((warning) => /evidence|confidence|missing|contradiction|risk/i.test(warning)),
  ], 5);

  return {
    score,
    label: evidenceConfidenceLabel(score),
    sourceCount,
    platformCount: sourcePlatforms.length,
    sourcePlatforms,
    supportingSignals: supportingSignals.length > 0 ? supportingSignals : ["No source-backed evidence signal recorded yet."],
    gaps: gaps.length > 0 ? gaps : ["No evidence confidence gap recorded yet."],
  };
}

function reasoningConfidenceFor(evidenceConfidence: VentureEvidenceConfidence): VentureReasoningDebateConfidence {
  if (evidenceConfidence.score >= 58 && evidenceConfidence.sourceCount >= 2) return "source-backed";
  if (evidenceConfidence.sourceCount > 0 || evidenceConfidence.score >= 35) return "inferred";
  return "speculative";
}

function buildReasoningDebate(params: {
  title: string;
  buyer: string;
  pain: string;
  wedge: string;
  pricing: string;
  channels: string[];
  claims: string[];
  contradictions: string[];
  killReasons: string[];
  experiments: VentureWorkspaceExperiment[];
  whyNow: VentureWhyNowRationale;
  mvpScope: VentureMvpScope;
  buildEstimate: VentureBuildEstimate;
  evidenceConfidence: VentureEvidenceConfidence;
}): VentureReasoningDebate {
  const primaryChannel = params.channels[0] ?? "manual founder outreach";
  const nextExperiment = params.experiments.find((experiment) => (
    !experiment.result.trim() || experiment.result === "Not run yet."
  )) ?? params.experiments[0];
  const firstGap = params.evidenceConfidence.gaps[0] ?? params.contradictions[0] ?? "Evidence is still too thin to trust a scale decision.";
  const firstKillReason = params.killReasons[0] ?? "Buyer does not show urgent pain.";
  const sourceSignals = uniqueCompact([
    ...params.evidenceConfidence.supportingSignals,
    params.whyNow.headline,
    ...params.claims,
  ], 5);

  return {
    bullCase: `${params.buyer} feel ${params.pain}, and ${params.wedge} can become a repeat workflow if ${primaryChannel} reaches the right early users.`,
    bearCase: `${firstGap} The ${params.buildEstimate.effortLevel} build estimate means the team should not build past the MVP before stronger proof exists.`,
    lazyConsensus: `This sounds like a useful ${params.title} concept, but usefulness is not enough without pricing, retention, and channel proof.`,
    nonObviousInsight: `${params.whyNow.headline} The best first product may be the narrowest repeated workflow in the MVP scope, not the broadest app idea.`,
    fatalAssumption: `${params.buyer} will accept ${params.pricing} and repeat the workflow after the first promised outcome.`,
    fastestValidationPath: nextExperiment?.nextAction ?? params.mvpScope.deferredFeatures[0] ?? "Run the smallest fake-door or concierge test before building.",
    clearestKillReason: firstKillReason,
    downsideIfWrong: `A premature build would spend ${params.buildEstimate.timeRange.toLowerCase()} on a thesis with ${params.evidenceConfidence.label} evidence confidence.`,
    confidence: reasoningConfidenceFor(params.evidenceConfidence),
    sourceSignals,
  };
}

function isFallbackText(value: string, patterns: RegExp[]) {
  const text = value.toLowerCase();
  return patterns.some((pattern) => pattern.test(text));
}

function hasPricingProof(value: string) {
  return /\$|\bpaid\b|\bprice\b|\bmonth\b|\byear\b|\brevenue\b|\bsubscription\b|\blicense\b/i.test(value) &&
    !/not validated|unknown|not proven/i.test(value);
}

function evaluationConfidenceFor(params: {
  score: number;
  evidenceConfidence: VentureEvidenceConfidence;
  forceSpeculative?: boolean;
}): VentureEvaluationLensConfidence {
  if (params.forceSpeculative) return "speculative";
  if (params.score >= 65 && params.evidenceConfidence.score >= 58 && params.evidenceConfidence.sourceCount >= 2) return "source-backed";
  if (params.score >= 35 || params.evidenceConfidence.sourceCount > 0) return "inferred";
  return "speculative";
}

function buildEvaluationLens(params: {
  label: string;
  score: number;
  evidenceConfidence: VentureEvidenceConfidence;
  signals: Array<string | undefined | null>;
  gaps: Array<string | undefined | null>;
  nextAction: string;
  forceSpeculative?: boolean;
}): VentureEvaluationLens {
  const score = clampScore(params.score);
  const signals = uniqueCompact(params.signals, 5);
  const gaps = uniqueCompact(params.gaps, 5);

  return {
    label: params.label,
    score,
    confidence: evaluationConfidenceFor({
      score,
      evidenceConfidence: params.evidenceConfidence,
      forceSpeculative: params.forceSpeculative,
    }),
    signals: signals.length > 0 ? signals : ["No positive signal recorded yet."],
    gaps: gaps.length > 0 ? gaps : ["No explicit gap recorded yet."],
    nextAction: params.nextAction,
  };
}

function buildVentureEvaluationLenses(params: {
  buyer: string;
  pain: string;
  wedge: string;
  pricing: string;
  revenueModel: string;
  channels: string[];
  retentionMechanism: string;
  keyIntegrations: string[];
  dataRequirements: string[];
  claims: string[];
  contradictions: string[];
  missingEvidence: string[];
  successMetrics: string[];
  coreUserFlows: string[];
  mvpScope: VentureMvpScope;
  buildEstimate: VentureBuildEstimate;
  evidenceConfidence: VentureEvidenceConfidence;
  expansion: string;
  supportLoad: string;
  cac: string;
  customerSegments: string[];
  source: VentureMvpScope["source"];
}): VentureEvaluationLenses {
  const buyerDefined = !isFallbackText(params.buyer, [/not defined/, /target buyer/]);
  const painDefined = !isFallbackText(params.pain, [/not defined/, /pain statement/]);
  const wedgeDefined = !isFallbackText(params.wedge, [/not defined/, /product wedge/]);
  const pricingProven = hasPricingProof(`${params.pricing} ${params.revenueModel} ${params.successMetrics.join(" ")}`);
  const channelSignals = params.channels.filter((channel) => !/manual founder outreach/i.test(channel));
  const selfServeSignals = uniqueCompact([
    ...params.coreUserFlows,
    ...params.mvpScope.mustHaveFeatures,
  ].filter((value) => (
    !/[A-Z][A-Za-z0-9_]*\.[A-Za-z0-9_]+/.test(value) &&
    /signup|sign up|invite|share|self[- ]?serve|free|waitlist|dashboard|onboard|activation/i.test(value)
  )), 4);
  const retentionSignals = uniqueCompact([
    params.retentionMechanism,
    ...params.successMetrics.filter((metric) => /retention|repeat|week|cohort|return/i.test(metric)),
  ], 4);
  const expansionSignals = uniqueCompact([
    params.expansion,
    params.customerSegments.length > 1 ? `${params.customerSegments.length} customer segments recorded.` : "",
    /team|seat|enterprise|usage|tier|plan|subscription|license/i.test(params.revenueModel) ? params.revenueModel : "",
  ], 4);
  const platformDependencies = params.keyIntegrations.filter((integration) => !/manual workflow|manual csv|none/i.test(integration));
  const heavyPlatformDependencies = platformDependencies.filter((integration) => /stripe|openai|shopify|google|meta|aws|slack|salesforce|calendar|oauth|payment|billing/i.test(integration));
  const missingEvidencePenalty = params.missingEvidence.length * 6;

  return {
    jobsToBeDone: buildEvaluationLens({
      label: "Jobs-to-be-done",
      score: (buyerDefined ? 24 : 4) + (painDefined ? 30 : 4) + (wedgeDefined ? 24 : 4) + params.evidenceConfidence.score * 0.18,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        buyerDefined ? `Buyer: ${params.buyer}` : "",
        painDefined ? `Pain: ${params.pain}` : "",
        wedgeDefined ? `Desired progress: ${params.wedge}` : "",
        params.claims[0],
      ],
      gaps: [
        buyerDefined ? "" : "Target buyer is not defined.",
        painDefined ? "" : "Pain statement is not defined.",
        wedgeDefined ? "" : "Product wedge is not defined.",
        ...params.evidenceConfidence.gaps.slice(0, 2),
      ],
      nextAction: "Interview target buyers until the job, trigger, current workaround, and desired outcome are stated in their words.",
    }),
    willingnessToPay: buildEvaluationLens({
      label: "Willingness to pay",
      score: (pricingProven ? 38 : 8) + params.evidenceConfidence.score * 0.25 + params.successMetrics.filter((metric) => /paid|revenue|price|cac|\$/i.test(metric)).length * 12,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        pricingProven ? `Pricing hypothesis: ${params.pricing}` : "",
        pricingProven ? `Revenue model: ${params.revenueModel}` : "",
        ...params.successMetrics.filter((metric) => /paid|revenue|price|cac|\$/i.test(metric)),
      ],
      gaps: [
        pricingProven ? "" : "Pricing is not validated yet.",
        ...params.contradictions.filter((gap) => /price|paid|revenue|cac|billing/i.test(gap)),
        ...params.missingEvidence.filter((gap) => /pricing|paid|revenue|customer/i.test(gap)).map((gap) => `Missing ${gap}.`),
      ],
      nextAction: "Ask qualified buyers to choose a price or commit payment intent before building paid workflows.",
      forceSpeculative: !pricingProven,
    }),
    distributionWedge: buildEvaluationLens({
      label: "Distribution wedge",
      score: 18 + channelSignals.length * 16 + params.evidenceConfidence.platformCount * 8 + Math.max(0, 12 - missingEvidencePenalty * 0.3),
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        ...params.channels.map((channel) => `Channel: ${channel}`),
        params.cac,
        `${params.evidenceConfidence.platformCount} evidence platform${params.evidenceConfidence.platformCount === 1 ? "" : "s"}`,
      ],
      gaps: [
        channelSignals.length > 0 ? "" : "Distribution still depends on manual founder outreach.",
        ...params.missingEvidence.map((gap) => `Missing channel proof: ${gap}.`),
      ],
      nextAction: "Run one channel-specific fake-door test and record CAC, signup quality, and buyer objections.",
    }),
    productLedGrowth: buildEvaluationLens({
      label: "Product-led growth",
      score: 14 + selfServeSignals.length * 18 + (params.keyIntegrations.length <= 2 ? 12 : 0) + (params.buildEstimate.effortLevel === "low" ? 10 : 0),
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        ...selfServeSignals,
        params.keyIntegrations.length <= 2 ? "Integration-light first scope." : "",
      ],
      gaps: [
        selfServeSignals.length > 0 ? "" : "No self-serve signup, invite, share, or activation loop is explicit yet.",
        params.buildEstimate.effortLevel === "high" ? "High build effort may slow product-led iteration." : "",
      ],
      nextAction: "Prototype the activation loop as a self-serve fake-door path and measure completion without founder help.",
      forceSpeculative: selfServeSignals.length === 0 && params.source !== "build-brief",
    }),
    churnRisk: buildEvaluationLens({
      label: "Churn risk",
      score: 28 + retentionSignals.length * 14 - params.missingEvidence.length * 5 - (/manual|support|question|concierge/i.test(params.supportLoad) ? 8 : 0),
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        ...retentionSignals,
        params.supportLoad,
      ],
      gaps: [
        retentionSignals.length > 0 ? "" : "No retention or repeat-use metric is attached.",
        /manual|support|question|concierge/i.test(params.supportLoad) ? "Support burden may hide churn risk until measured." : "",
        ...params.missingEvidence.filter((gap) => /customer|retention|interview|source/i.test(gap)).map((gap) => `Missing churn proof: ${gap}.`),
      ],
      nextAction: "Run the concierge retention test and record repeat use, support load, and churn reasons before scaling.",
    }),
    expansionRevenue: buildEvaluationLens({
      label: "Expansion revenue",
      score: 18 + expansionSignals.length * 16 + (params.customerSegments.length > 1 ? 12 : 0) + (/team|seat|enterprise|usage|tier|license/i.test(params.revenueModel) ? 12 : 0),
      evidenceConfidence: params.evidenceConfidence,
      signals: expansionSignals,
      gaps: [
        /only after|not proven|unknown/i.test(params.expansion) ? "Expansion is intentionally gated until repeat usage is proven." : "",
        params.customerSegments.length > 1 ? "" : "Only one customer segment is explicit.",
        /team|seat|enterprise|usage|tier|license/i.test(params.revenueModel) ? "" : "Revenue model does not yet expose an expansion mechanic.",
      ],
      nextAction: "Ask retained users what adjacent seat, workflow, or usage expansion they would pay for after the first outcome works.",
      forceSpeculative: /only after|not proven|unknown/i.test(params.expansion) && params.customerSegments.length <= 1,
    }),
    platformDependency: buildEvaluationLens({
      label: "Platform dependency",
      score: 82 - platformDependencies.length * 9 - heavyPlatformDependencies.length * 9 - params.dataRequirements.length * 0.8,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        platformDependencies.length > 0 ? `Dependencies: ${platformDependencies.join(", ")}` : "Manual or integration-light first scope.",
        heavyPlatformDependencies.length > 0 ? `High-leverage platform dependencies: ${heavyPlatformDependencies.join(", ")}` : "",
        `${params.dataRequirements.length} data requirement${params.dataRequirements.length === 1 ? "" : "s"} recorded.`,
      ],
      gaps: [
        heavyPlatformDependencies.length > 0 ? "Heavy platform dependencies need outage, API, and terms-of-service review." : "",
        platformDependencies.length >= 3 ? "Multiple integrations could slow the first MVP and create external breakage risk." : "",
      ],
      nextAction: "Document the manual fallback and minimum API surface for each external dependency before production hardening.",
    }),
    ...buildExtendedEvaluationLenses(params, {
      buyerDefined,
      painDefined,
      wedgeDefined,
      pricingProven,
      platformDependencies,
      heavyPlatformDependencies,
      selfServeSignals,
    }),
    ...buildAdditionalEvaluationLenses(params, {
      buyerDefined,
      painDefined,
      wedgeDefined,
      pricingProven,
      platformDependencies,
      heavyPlatformDependencies,
      selfServeSignals,
      channelSignals,
      retentionSignals,
    }),
    ...buildPostureRetaliationEvaluationLenses(params, {
      buyerDefined,
      painDefined,
      wedgeDefined,
      pricingProven,
      platformDependencies,
      heavyPlatformDependencies,
      selfServeSignals,
      channelSignals,
      retentionSignals,
    }),
  };
}

function buildExtendedEvaluationLenses(
  params: Parameters<typeof buildVentureEvaluationLenses>[0],
  ctx: {
    buyerDefined: boolean;
    painDefined: boolean;
    wedgeDefined: boolean;
    pricingProven: boolean;
    platformDependencies: string[];
    heavyPlatformDependencies: string[];
    selfServeSignals: string[];
  },
): Pick<VentureEvaluationLenses, "marketplaceLiquidity" | "networkEffects" | "dataMoats" | "regulatoryArbitrage" | "procurementFriction" | "founderMarketFit" | "brandTrust" | "aiAutomationDefensibility"> {
  const corpus = [
    params.buyer,
    params.pain,
    params.wedge,
    params.revenueModel,
    params.pricing,
    params.expansion,
    params.supportLoad,
    ...params.claims,
    ...params.contradictions,
    ...params.channels,
    ...params.keyIntegrations,
    ...params.dataRequirements,
    ...params.successMetrics,
    ...params.coreUserFlows,
    ...params.customerSegments,
  ].join(" ");
  const marketplaceHits = /marketplace|two[- ]sided|supply|demand|listing|seller|buyer pool|gmv|take[- ]?rate|transaction fee|booking|match(ing)?\b/i.test(corpus);
  const liquidityHits = /liquidity|fill rate|match rate|inventory|catalog|supply side|demand side/i.test(corpus);
  const networkHits = /viral|invite|share|community|social|referral|network|collaborat|multiplayer|workspace member|seat sharing/i.test(corpus);
  const aiHits = /\bai\b|llm|gpt|openai|anthropic|claude|model|inference|prompt|copilot|agent/i.test(corpus);
  const dataMoatHits = /proprietary data|training data|dataset|knowledge graph|feedback loop|labeled data|first[- ]party data|annotation|telemetry/i.test(corpus);
  const regulatedHits = /compliance|regulat|hipaa|ferpa|gdpr|soc2|sox|pci|license|policy|audit|legal|privacy|health|clinical|student|financial advisor|kyc|aml/i.test(corpus);
  const enterpriseHits = /enterprise|b2b|procurement|rfp|rfi|legal review|security review|soc2|sso|sla|contract|cio|ciso|it admin|vendor onboard/i.test(corpus);
  const smbHits = /self[- ]?serve|individual|prosumer|smb|small business|creator|student|consumer|free tier|freemium|credit card/i.test(corpus);
  const founderFitHits = /founder|operator|domain expert|former|ex-|previously|veteran|years of|first[- ]hand|lived experience|built before/i.test(corpus);
  const brandTrustHits = /testimonial|case study|press|featured|trusted by|customer logo|nps|reviews?\b|social proof|referenc(e|able) customer/i.test(corpus);
  const commodityAiHits = /chatgpt wrapper|prompt wrapper|gpt wrapper|generic ai/i.test(corpus);
  const segmentsCount = params.customerSegments.length;
  const evidenceScore = params.evidenceConfidence.score;
  const sourceCount = params.evidenceConfidence.sourceCount;
  const platformCount = params.evidenceConfidence.platformCount;
  const missingPenalty = params.missingEvidence.length * 4;

  return {
    marketplaceLiquidity: buildEvaluationLens({
      label: "Marketplace liquidity",
      score: (marketplaceHits ? 36 : 10) + (liquidityHits ? 18 : 0) + (segmentsCount > 1 ? 14 : 0) + evidenceScore * 0.18 - missingPenalty,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        marketplaceHits ? "Marketplace or two-sided language detected in thesis." : "",
        liquidityHits ? "Supply/demand or liquidity vocabulary present." : "",
        segmentsCount > 1 ? `${segmentsCount} customer segments may seed both sides.` : "",
        /take[- ]?rate|transaction|gmv|listing|booking/i.test(params.revenueModel) ? `Revenue model: ${params.revenueModel}` : "",
      ],
      gaps: [
        marketplaceHits ? "" : "No marketplace or two-sided dynamic is explicit yet.",
        liquidityHits ? "" : "Supply and demand sides have not been quantified.",
        segmentsCount > 1 ? "" : "Only one customer segment is explicit; the other side of the market is not defined.",
      ],
      nextAction: "Map the first 10 supply-side and 10 demand-side participants and measure match rate before scaling marketplace mechanics.",
      forceSpeculative: !marketplaceHits && !liquidityHits,
    }),
    networkEffects: buildEvaluationLens({
      label: "Network effects",
      score: (networkHits ? 30 : 8) + ctx.selfServeSignals.length * 8 + (segmentsCount > 1 ? 10 : 0) + (marketplaceHits ? 14 : 0) + evidenceScore * 0.12,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        networkHits ? "Viral, invite, share, referral, or community language detected." : "",
        ctx.selfServeSignals.length > 0 ? "Self-serve activation surfaces could carry virality." : "",
        marketplaceHits ? "Two-sided dynamics could compound usage." : "",
      ],
      gaps: [
        networkHits ? "" : "No invite, share, referral, or community loop is explicit.",
        ctx.selfServeSignals.length > 0 ? "" : "Without a self-serve loop, network effects depend on founder-led growth.",
      ],
      nextAction: "Instrument the first invite, share, or referral mechanic and measure k-factor before assuming compounding growth.",
      forceSpeculative: !networkHits,
    }),
    dataMoats: buildEvaluationLens({
      label: "Data moats",
      score: (dataMoatHits ? 32 : 10) + params.dataRequirements.length * 4 + (aiHits ? 12 : 0) + (sourceCount >= 2 ? 10 : 0) + evidenceScore * 0.12 - missingPenalty,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        dataMoatHits ? "Proprietary data, training data, or feedback loop language detected." : "",
        params.dataRequirements.length > 0 ? `${params.dataRequirements.length} structured data requirement${params.dataRequirements.length === 1 ? "" : "s"} recorded.` : "",
        aiHits ? "AI/ML stack referenced; data flywheel is plausible if data is owned." : "",
      ],
      gaps: [
        dataMoatHits ? "" : "No proprietary data, training set, or feedback loop is explicit yet.",
        params.dataRequirements.length === 0 ? "No structured data requirements are captured to seed a moat." : "",
        aiHits && !dataMoatHits ? "AI is used without an explicit data ownership story." : "",
      ],
      nextAction: "Decide which dataset only this venture can accumulate, then design the workflow that produces it as a side effect.",
      forceSpeculative: !dataMoatHits && params.dataRequirements.length < 2,
    }),
    regulatoryArbitrage: buildEvaluationLens({
      label: "Regulatory arbitrage",
      score: (regulatedHits ? 34 : 14) + (sourceCount >= 2 ? 10 : 0) + evidenceScore * 0.12 - (params.contradictions.filter((value) => /compliance|legal|privacy|policy/i.test(value)).length * 10) - missingPenalty,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        regulatedHits ? "Regulated domain language present (compliance, HIPAA, FERPA, privacy, audit, license, etc.)." : "",
        /unregulated|outside scope|exempt/i.test(corpus) ? "Thesis claims operate outside the regulated path." : "",
      ],
      gaps: [
        regulatedHits ? "Regulatory clarity, opinion letter, or counsel review is not yet attached." : "No regulated wedge or arbitrage is articulated.",
        ...params.contradictions.filter((value) => /compliance|legal|privacy|policy/i.test(value)),
      ],
      nextAction: "Document the specific rule, exemption, or licensing posture this venture relies on, and validate it with qualified counsel before scaling.",
      forceSpeculative: !regulatedHits,
    }),
    procurementFriction: buildEvaluationLens({
      label: "Procurement friction",
      score: 78 - (enterpriseHits ? 38 : 0) - (regulatedHits ? 12 : 0) - params.keyIntegrations.length * 3 + (smbHits ? 12 : 0) + (ctx.selfServeSignals.length > 0 ? 8 : 0) - missingPenalty,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        smbHits ? "Self-serve, individual, prosumer, or SMB language detected; procurement should be light." : "",
        ctx.selfServeSignals.length > 0 ? "Self-serve surfaces can bypass enterprise procurement." : "",
        enterpriseHits ? `Enterprise procurement signals: ${params.buyer}` : "",
      ],
      gaps: [
        enterpriseHits ? "Enterprise procurement, security review, SSO, SLA, and legal review can stall the first deal." : "",
        regulatedHits ? "Regulated domain adds vendor onboarding overhead." : "",
        params.keyIntegrations.length >= 3 ? "Multiple integrations expand the vendor-onboarding surface." : "",
      ],
      nextAction: "Run a fake purchase order: ask one target buyer to walk through how they would actually buy and approve this venture inside their org.",
    }),
    founderMarketFit: buildEvaluationLens({
      label: "Founder-market fit",
      score: (founderFitHits ? 32 : 12) + (ctx.buyerDefined ? 14 : 0) + (ctx.painDefined ? 14 : 0) + (sourceCount >= 1 ? 8 : 0) + evidenceScore * 0.12 - missingPenalty,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        founderFitHits ? "Founder lived-experience or domain-expert language detected in claims." : "",
        ctx.buyerDefined ? `Buyer is concretely named: ${params.buyer}` : "",
        ctx.painDefined ? `Pain is articulated in operator vocabulary: ${params.pain}` : "",
      ],
      gaps: [
        founderFitHits ? "" : "No founder lived experience or domain credential is recorded against this thesis.",
        ctx.buyerDefined ? "" : "Without a concrete buyer, founder-market fit cannot be evaluated.",
      ],
      nextAction: "Write down the founder's specific lived experience, prior shipping record, and unfair distribution into this buyer set before fundraising.",
      forceSpeculative: !founderFitHits,
    }),
    brandTrust: buildEvaluationLens({
      label: "Brand trust",
      score: 18 + sourceCount * 6 + platformCount * 5 + (brandTrustHits ? 18 : 0) + evidenceScore * 0.18 - missingPenalty,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        sourceCount > 0 ? `${sourceCount} evidence source${sourceCount === 1 ? "" : "s"} across ${platformCount} platform${platformCount === 1 ? "" : "s"}.` : "",
        brandTrustHits ? "Testimonial, case study, press, or social-proof language detected." : "",
        evidenceScore >= 60 ? `Evidence confidence ${params.evidenceConfidence.label} at ${evidenceScore}/100.` : "",
      ],
      gaps: [
        sourceCount === 0 ? "No evidence sources are attached; trust depends only on founder claims." : "",
        brandTrustHits ? "" : "No testimonial, case study, press, or referenceable customer is recorded.",
        ...params.missingEvidence.slice(0, 1).map((gap) => `Missing trust proof: ${gap}.`),
      ],
      nextAction: "Capture the first three named customer quotes, screenshots, or referenceable design partners before paid acquisition begins.",
      forceSpeculative: sourceCount === 0 && !brandTrustHits,
    }),
    aiAutomationDefensibility: buildEvaluationLens({
      label: "AI automation defensibility",
      score: (aiHits ? 22 : 12) + (dataMoatHits ? 22 : 0) + params.dataRequirements.length * 3 + (params.coreUserFlows.length > 2 ? 8 : 0) - (commodityAiHits ? 22 : 0) - (aiHits && !dataMoatHits ? 12 : 0) + evidenceScore * 0.1,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        aiHits ? "AI or model-driven workflow described in the thesis." : "",
        dataMoatHits ? "Proprietary data or feedback loop strengthens automation defensibility." : "",
        params.coreUserFlows.length > 2 ? `${params.coreUserFlows.length} core user flows could compound automation value.` : "",
      ],
      gaps: [
        aiHits && !dataMoatHits ? "AI workflow lacks a proprietary data or workflow lock-in story." : "",
        commodityAiHits ? "Thesis reads as a generic AI wrapper; substitutes can copy quickly." : "",
        !aiHits ? "No AI or automation lever is explicit; defensibility must come from workflow lock-in." : "",
      ],
      nextAction: "Define the workflow that improves the model or the model that improves the workflow, and prove at least one feedback loop before scaling.",
      forceSpeculative: aiHits && !dataMoatHits,
    }),
  };
}

function buildAdditionalEvaluationLenses(
  params: Parameters<typeof buildVentureEvaluationLenses>[0],
  ctx: {
    buyerDefined: boolean;
    painDefined: boolean;
    wedgeDefined: boolean;
    pricingProven: boolean;
    platformDependencies: string[];
    heavyPlatformDependencies: string[];
    selfServeSignals: string[];
    channelSignals: string[];
    retentionSignals: string[];
  },
): Pick<VentureEvaluationLenses, "salesLedEnterprise" | "workflowLockIn" | "verticalSaasDynamics" | "marginalCostStructure" | "integrationComplexity" | "switchingCosts" | "distributionMoats" | "capitalEfficiency"> {
  const corpus = [
    params.buyer,
    params.pain,
    params.wedge,
    params.revenueModel,
    params.pricing,
    params.expansion,
    params.supportLoad,
    ...params.claims,
    ...params.contradictions,
    ...params.channels,
    ...params.keyIntegrations,
    ...params.dataRequirements,
    ...params.successMetrics,
    ...params.coreUserFlows,
    ...params.customerSegments,
    params.retentionMechanism,
  ].join(" ");
  const enterpriseHits = /enterprise|b2b|procurement|rfp|rfi|legal review|security review|soc2|sso|sla|contract|cio|ciso|it admin|vendor onboard|seat|annual contract|annual plan/i.test(corpus);
  const salesLedHits = /sales[- ]?led|account executive|outbound sales|sdr|bdr|pilot|design partner|enterprise pilot|annual contract|six[- ]figure|five[- ]figure|land[- ]and[- ]expand/i.test(corpus);
  const smbHits = /self[- ]?serve|individual|prosumer|smb|small business|creator|student|consumer|free tier|freemium|credit card/i.test(corpus);
  const workflowHits = /workflow|daily|weekly|monthly|habit|routine|recurring|loop|playbook|standup|ritual|operating system/i.test(corpus);
  const lockInHits = /lock[- ]?in|embedded|deeply integrated|source of truth|system of record|stored data|historic data|library|template library/i.test(corpus);
  const teamHits = /team|shared|collaborat|workspace|seat|multi[- ]?user|admin/i.test(corpus);
  const verticalHits = /vertical|industry[- ]?specific|construction|healthcare|clinic|legal|law firm|real estate|logistics|education|fitness|finance|manufacturing|retail|restaurant|salon|dental|veterinary|pharma|insurance|nonprofit|agriculture|hospitality|trucking/i.test(corpus);
  const aiHits = /\bai\b|llm|gpt|openai|anthropic|claude|model|inference|prompt|copilot|agent/i.test(corpus);
  const hardwareHits = /hardware|device|sensor|inventory|shipping|fulfillment|fleet|warehouse|kitchen|on[- ]site/i.test(corpus);
  const servicesHits = /concierge|done[- ]for[- ]you|managed service|white glove|consulting|agency|implementation/i.test(corpus);
  const softwareMarginHits = /software[- ]margin|recurring revenue|subscription|saas|api|pay[- ]?per[- ]?use|usage[- ]based/i.test(corpus);
  const integrationCount = params.keyIntegrations.filter((integration) => !/manual workflow|manual csv|none/i.test(integration)).length;
  const heavyIntegrationCount = ctx.heavyPlatformDependencies.length;
  const dataExportHits = /data export|api access|own your data|portability|migration|byo[- ]?data/i.test(corpus);
  const contractHits = /annual|multi[- ]?year|contract|commitment|prepaid|invoice/i.test(corpus);
  const recurringHits = /recurring|subscription|saas|month|annual|usage[- ]based|seat/i.test(corpus);
  const distributionPartnerHits = /partnership|distribution partner|exclusive|reseller|referral program|affiliate|community ownership|owned audience|email list|newsletter|installed base/i.test(corpus);
  const viralHits = /viral|invite|share|referral|word[- ]of[- ]mouth|community/i.test(corpus);
  const capitalEffortPenalty = params.buildEstimate.effortLevel === "high" ? 16 : params.buildEstimate.effortLevel === "medium" ? 6 : 0;
  const lowCapitalHits = /low capital|bootstrap|capital efficient|low burn|self[- ]?fund|profitable from day one/i.test(corpus);
  const highCapitalHits = /high capital|capital[- ]?intensive|biotech|hardware|fleet|warehouse|inventory|paid ads at scale|series [a-d]/i.test(corpus);
  const evidenceScore = params.evidenceConfidence.score;
  const sourceCount = params.evidenceConfidence.sourceCount;
  const missingPenalty = params.missingEvidence.length * 4;
  const segmentsCount = params.customerSegments.length;

  return {
    salesLedEnterprise: buildEvaluationLens({
      label: "Sales-led enterprise potential",
      score: (enterpriseHits ? 30 : 8) + (salesLedHits ? 18 : 0) + (contractHits ? 12 : 0) + (segmentsCount > 1 ? 8 : 0) + evidenceScore * 0.12 - (smbHits && !enterpriseHits ? 16 : 0) - missingPenalty,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        enterpriseHits ? `Enterprise/B2B language detected for buyer ${params.buyer}.` : "",
        salesLedHits ? "Sales-led, design partner, or pilot motion present." : "",
        contractHits ? "Annual/contract pricing language detected." : "",
        /paid|invoice|pilot|design partner/i.test(corpus) ? `Pricing/pilot signal: ${params.pricing}` : "",
      ],
      gaps: [
        enterpriseHits ? "" : "No enterprise/B2B procurement language is explicit.",
        salesLedHits ? "" : "No sales-led, pilot, or design-partner motion is articulated.",
        contractHits ? "" : "No annual or contract pricing language recorded.",
      ],
      nextAction: "Identify one enterprise buyer profile, draft a design-partner offer, and confirm contract pricing before any sales-led investment.",
      forceSpeculative: !enterpriseHits && !salesLedHits,
    }),
    workflowLockIn: buildEvaluationLens({
      label: "Workflow lock-in",
      score: (workflowHits ? 24 : 8) + (lockInHits ? 22 : 0) + ctx.retentionSignals.length * 8 + (teamHits ? 10 : 0) + (params.dataRequirements.length >= 2 ? 8 : 0) + evidenceScore * 0.12 - missingPenalty,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        workflowHits ? "Workflow, routine, or recurring loop language detected." : "",
        lockInHits ? "Lock-in, embedded, or system-of-record language detected." : "",
        ctx.retentionSignals.length > 0 ? `${ctx.retentionSignals.length} retention signal${ctx.retentionSignals.length === 1 ? "" : "s"} recorded.` : "",
        teamHits ? "Team/collaboration vocabulary present; multi-user workflows raise switching cost." : "",
      ],
      gaps: [
        workflowHits ? "" : "No recurring workflow or routine language is explicit.",
        lockInHits ? "" : "No lock-in, embedded, or system-of-record story is articulated.",
        ctx.retentionSignals.length === 0 ? "No retention metric is attached to the workflow." : "",
      ],
      nextAction: "Map the daily/weekly workflow this venture replaces, then prove the activity that would be expensive to abandon after one month of use.",
      forceSpeculative: !workflowHits && !lockInHits,
    }),
    verticalSaasDynamics: buildEvaluationLens({
      label: "Vertical SaaS dynamics",
      score: (verticalHits ? 32 : 10) + (enterpriseHits ? 10 : 0) + (workflowHits ? 8 : 0) + (params.keyIntegrations.length >= 2 ? 8 : 0) + (segmentsCount > 0 ? 6 : 0) + evidenceScore * 0.1 - missingPenalty,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        verticalHits ? "Industry-specific vertical language detected in thesis." : "",
        verticalHits && workflowHits ? "Vertical workflow combination: industry plus recurring loop." : "",
        params.keyIntegrations.length >= 2 ? `${params.keyIntegrations.length} vertical-relevant integration${params.keyIntegrations.length === 1 ? "" : "s"} recorded.` : "",
      ],
      gaps: [
        verticalHits ? "" : "No specific industry or vertical is identified.",
        verticalHits && !workflowHits ? "Industry is named but the recurring workflow is not explicit." : "",
      ],
      nextAction: "Pick a single vertical, document its specific buyer roles and workflows, and confirm the venture would be a top-three vertical tool before broadening.",
      forceSpeculative: !verticalHits,
    }),
    marginalCostStructure: buildEvaluationLens({
      label: "Marginal cost structure",
      score: (softwareMarginHits ? 28 : 14) + (recurringHits ? 12 : 0) + (ctx.pricingProven ? 14 : 0) - (servicesHits ? 14 : 0) - (hardwareHits ? 14 : 0) - (aiHits && !softwareMarginHits ? 8 : 0) - (params.dataRequirements.length > 6 ? 6 : 0) + evidenceScore * 0.1,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        softwareMarginHits ? "Software-margin / recurring revenue language detected." : "",
        ctx.pricingProven ? `Pricing hypothesis: ${params.pricing}` : "",
        recurringHits ? "Recurring revenue language detected." : "",
        servicesHits ? "Services or concierge components are explicit and will compress margin." : "",
        hardwareHits ? "Hardware or fulfillment components are explicit and will add COGS." : "",
        aiHits ? "AI/model inference is part of the workflow; expect per-call cost." : "",
      ],
      gaps: [
        softwareMarginHits ? "" : "No explicit software-margin or recurring-revenue language recorded.",
        servicesHits ? "Services component should be measured and capped." : "",
        hardwareHits ? "Hardware/fulfillment cost must be measured before scaling." : "",
        aiHits && !softwareMarginHits ? "AI usage cost vs paid plan value is not yet quantified." : "",
      ],
      nextAction: "Estimate the per-user marginal cost (inference, services, hardware) and compare it against the pricing hypothesis before pricing/scale decisions.",
    }),
    integrationComplexity: buildEvaluationLens({
      label: "Integration complexity",
      score: 82 - integrationCount * 9 - heavyIntegrationCount * 9 - params.dataRequirements.length * 0.6 - (params.buildEstimate.effortLevel === "high" ? 10 : params.buildEstimate.effortLevel === "medium" ? 4 : 0),
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        integrationCount === 0 ? "Integration-light first scope." : `${integrationCount} integration${integrationCount === 1 ? "" : "s"} planned.`,
        heavyIntegrationCount > 0 ? `Heavy integration surface: ${ctx.heavyPlatformDependencies.join(", ")}` : "",
        params.buildEstimate.effortLevel === "low" ? "Build estimate is low; integration burden looks contained." : "",
      ],
      gaps: [
        integrationCount >= 3 ? "Multiple integrations expand the failure surface and slow the first MVP." : "",
        heavyIntegrationCount > 0 ? "Heavy integrations need outage, API, and terms-of-service review." : "",
        params.buildEstimate.effortLevel === "high" ? "High build effort raises integration risk before pilot." : "",
      ],
      nextAction: "List each integration with required scopes, rate limits, and outage fallbacks before any production integration is wired.",
    }),
    switchingCosts: buildEvaluationLens({
      label: "Switching costs",
      score: (lockInHits ? 24 : 8) + (workflowHits ? 14 : 0) + (params.dataRequirements.length >= 2 ? 10 : 0) + (teamHits ? 10 : 0) + (contractHits ? 8 : 0) + (dataExportHits ? 6 : 0) + evidenceScore * 0.1 - (smbHits && !lockInHits && !workflowHits ? 8 : 0) - missingPenalty,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        lockInHits ? "Lock-in or system-of-record language detected." : "",
        workflowHits ? "Recurring workflow becomes harder to abandon over time." : "",
        params.dataRequirements.length >= 2 ? `${params.dataRequirements.length} data requirements stored; departure would cost data migration.` : "",
        teamHits ? "Team usage would force a coordinated exit." : "",
        contractHits ? "Contract/annual pricing creates timing-based switching cost." : "",
      ],
      gaps: [
        lockInHits ? "" : "No explicit lock-in or stored-state story is recorded.",
        workflowHits ? "" : "No recurring workflow that builds switching cost is articulated.",
        params.dataRequirements.length < 2 ? "Few data requirements means departure is cheap." : "",
      ],
      nextAction: "Decide which user data and configuration would make leaving expensive, then design the workflow that produces it within 30 days of activation.",
      forceSpeculative: !lockInHits && !workflowHits,
    }),
    distributionMoats: buildEvaluationLens({
      label: "Distribution moats",
      score: (distributionPartnerHits ? 26 : 6) + (viralHits ? 14 : 0) + ctx.channelSignals.length * 10 + params.evidenceConfidence.platformCount * 5 + (sourceCount >= 2 ? 6 : 0) + evidenceScore * 0.1 - missingPenalty,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        distributionPartnerHits ? "Distribution partner / owned audience language detected." : "",
        viralHits ? "Viral, referral, or community language present." : "",
        ctx.channelSignals.length > 0 ? `${ctx.channelSignals.length} non-manual channel signal${ctx.channelSignals.length === 1 ? "" : "s"} recorded.` : "",
        params.evidenceConfidence.platformCount > 1 ? `${params.evidenceConfidence.platformCount} evidence platforms could become defensible distribution surfaces.` : "",
      ],
      gaps: [
        distributionPartnerHits ? "" : "No exclusive partnership, owned audience, or installed-base distribution moat is recorded.",
        ctx.channelSignals.length > 0 ? "" : "Distribution still depends on manual founder outreach.",
        viralHits ? "" : "No viral, referral, or community compounding loop is explicit.",
      ],
      nextAction: "Identify one channel where this venture could become uncopiable (owned audience, exclusive partnership, viral loop) and prove repeat acquisition there first.",
      forceSpeculative: !distributionPartnerHits && !viralHits && ctx.channelSignals.length === 0,
    }),
    capitalEfficiency: buildEvaluationLens({
      label: "Capital efficiency",
      score: 64 - capitalEffortPenalty - integrationCount * 4 - (servicesHits ? 10 : 0) - (hardwareHits ? 14 : 0) - (highCapitalHits ? 14 : 0) + (lowCapitalHits ? 12 : 0) + (softwareMarginHits ? 10 : 0) + (ctx.pricingProven ? 10 : 0) - missingPenalty * 0.5,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        lowCapitalHits ? "Bootstrap / capital-efficient language detected." : "",
        softwareMarginHits ? "Recurring software margin supports capital efficiency." : "",
        params.buildEstimate.effortLevel === "low" ? "Low build effort keeps initial capital need small." : "",
        ctx.pricingProven ? `Pricing hypothesis: ${params.pricing}` : "",
      ],
      gaps: [
        params.buildEstimate.effortLevel === "high" ? "High build effort raises capital need before evidence is proven." : "",
        servicesHits ? "Services components require sustained labor capital." : "",
        hardwareHits ? "Hardware/fulfillment components require working capital." : "",
        highCapitalHits ? "Capital-intensive language is explicit; plan financing before scaling." : "",
        !ctx.pricingProven ? "No proven pricing means CAC payback cannot yet be modeled." : "",
      ],
      nextAction: "Estimate cash to first paid customer and cash to repeatable channel; prove both with a concierge MVP before committing scale capital.",
    }),
  };
}

function buildPostureRetaliationEvaluationLenses(
  params: Parameters<typeof buildVentureEvaluationLenses>[0],
  ctx: {
    buyerDefined: boolean;
    painDefined: boolean;
    wedgeDefined: boolean;
    pricingProven: boolean;
    platformDependencies: string[];
    heavyPlatformDependencies: string[];
    selfServeSignals: string[];
    channelSignals: string[];
    retentionSignals: string[];
  },
): Pick<VentureEvaluationLenses, "supportBurden" | "competitiveRetaliation"> {
  const corpus = [
    params.buyer,
    params.pain,
    params.wedge,
    params.revenueModel,
    params.pricing,
    params.expansion,
    params.supportLoad,
    params.retentionMechanism,
    ...params.claims,
    ...params.contradictions,
    ...params.channels,
    ...params.keyIntegrations,
    ...params.dataRequirements,
    ...params.successMetrics,
    ...params.coreUserFlows,
    ...params.customerSegments,
    ...params.missingEvidence,
  ].join(" ");
  const supportText = params.supportLoad ?? "";
  const supportHeavyHits = /concierge|manual|white[- ]?glove|done[- ]for[- ]you|onboarding call|hand[- ]?hold|implementation|setup call|live chat|24\/7|onboard each|integration support/i.test(`${supportText} ${corpus}`);
  const supportLightHits = /self[- ]?serve|self[- ]?service|no support|low support|automated onboarding|in[- ]app help|knowledge base|docs only|community support/i.test(`${supportText} ${corpus}`);
  const supportLogHits = /log every|track support|measure support|record support|capture support/i.test(`${supportText} ${corpus}`);
  const supportTextRecorded = supportText.trim().length > 0 && !/not (defined|measured|recorded|known)/i.test(supportText);
  const supportIssueHits = /support questions?|support load|support burden|support ticket|complain|customer service/i.test(corpus);
  const complianceSupportHits = /hipaa|ferpa|gdpr|soc2|pci|compliance|privacy|clinical|health|student|financial advisor|kyc|aml/i.test(corpus);
  const heavyIntegrationCount = ctx.heavyPlatformDependencies.length;
  const dataRequirementBurden = params.dataRequirements.length;
  const missingEvidencePenalty = params.missingEvidence.length * 4;
  const buildEffortPenalty = params.buildEstimate.effortLevel === "high" ? 14 : params.buildEstimate.effortLevel === "medium" ? 6 : 0;
  const evidenceScore = params.evidenceConfidence.score;

  const retaliationIncumbentHits = /incumbent|established player|category leader|microsoft|google|salesforce|hubspot|notion|atlassian|stripe|shopify|amazon|meta|adobe|oracle|workday|sap|servicenow|figma|linear|asana|monday|airtable|zendesk|intercom|slack|datadog|snowflake|crowded category|saturated/i.test(corpus);
  const retaliationCompetitionHits = /competition|competitor|substitute|alternative|rival|status quo|existing players?|head[- ]to[- ]head|crowded market/i.test(corpus);
  const retaliationCloneHits = /clone|copy|copycat|wrapper|undifferentiated|easy to replicate|me[- ]too|fast follower|platform feature|platform clone|sherlocked|first[- ]party feature|native feature/i.test(corpus);
  const retaliationPlatformHits = /platform|api|app store|marketplace|on top of|built on|depends on|extension/i.test(corpus);
  const retaliationPaidAdsHits = /paid ads|ad spend|adwords|google ads|meta ads|facebook ads|outbid|auction|cac war|bidding war|ad inflation/i.test(corpus);
  const retaliationCommodityHits = /commoditi|undifferentiated|price war|race to the bottom|generic|wrapper|me[- ]too/i.test(corpus);
  const retaliationFeatureCopyHits = /copy our|copy this|copy the feature|will copy|could copy|feature copy|feature parity|incumbent could ship/i.test(corpus);
  const moatHits = /lock[- ]?in|proprietary data|switching cost|owned audience|exclusive|partnership|community ownership|installed base|workflow lock|system of record|brand trust|regulatory|compliance moat|network effects|viral loop/i.test(corpus);
  const enterpriseHits = /enterprise|b2b|procurement|rfp|rfi|legal review|security review|soc2|sso|sla|contract|cio|ciso|it admin|vendor onboard|seat|annual contract|annual plan/i.test(corpus);
  const verticalHits = /vertical|industry[- ]?specific|construction|healthcare|clinic|legal|law firm|real estate|logistics|education|fitness|finance|manufacturing|retail|restaurant|salon|dental|veterinary|pharma|insurance|nonprofit|agriculture|hospitality|trucking/i.test(corpus);
  const niche = !retaliationIncumbentHits && !retaliationCompetitionHits && !enterpriseHits && verticalHits;
  const heavyPlatformPenalty = ctx.heavyPlatformDependencies.length * 6;

  return {
    supportBurden: buildEvaluationLens({
      label: "Support burden",
      score: 70
        - (supportTextRecorded ? 0 : 10)
        - (supportHeavyHits ? 26 : 0)
        - (supportIssueHits ? 8 : 0)
        - (complianceSupportHits ? 10 : 0)
        - heavyIntegrationCount * 6
        - Math.min(12, dataRequirementBurden * 1.2)
        - buildEffortPenalty
        + (supportLightHits ? 14 : 0)
        + (supportLogHits ? 6 : 0)
        + (ctx.selfServeSignals.length > 0 ? 6 : 0)
        + evidenceScore * 0.06
        - missingEvidencePenalty * 0.4,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        supportTextRecorded ? `Support load posture: ${supportText}` : "",
        supportLightHits ? "Self-serve or low-support workflow language detected." : "",
        supportLogHits ? "Support measurement plan (log/track/measure) is explicit." : "",
        ctx.selfServeSignals.length > 0 ? "Self-serve activation surfaces could absorb support volume." : "",
      ],
      gaps: [
        supportTextRecorded ? "" : "Support load is not yet recorded; the concierge cost is invisible.",
        supportHeavyHits ? "Concierge / manual / hand-hold language signals high per-user support cost." : "",
        complianceSupportHits ? "Compliance domain raises support cost for audits, privacy questions, and policy edge cases." : "",
        heavyIntegrationCount > 0 ? "Heavy platform integrations create third-party outage and credential support tickets." : "",
        dataRequirementBurden >= 4 ? `${dataRequirementBurden} data requirements suggest data-cleanup support load.` : "",
        params.buildEstimate.effortLevel === "high" ? "High build effort suggests onboarding will need hand-holding before automation lands." : "",
        supportIssueHits && !supportLogHits ? "Support pain is referenced but no measurement plan is attached." : "",
      ],
      nextAction: "Log every support question, time spent, and root cause during the first concierge pilot, then cap manual support at a written hours-per-user budget before scaling.",
    }),
    competitiveRetaliation: buildEvaluationLens({
      label: "Competitive retaliation",
      score: 70
        - (retaliationIncumbentHits ? 24 : 0)
        - (retaliationCloneHits ? 22 : 0)
        - (retaliationFeatureCopyHits ? 16 : 0)
        - (retaliationCommodityHits ? 18 : 0)
        - (retaliationPaidAdsHits ? 12 : 0)
        - (retaliationPlatformHits && retaliationCompetitionHits ? 10 : 0)
        - heavyPlatformPenalty
        - missingEvidencePenalty * 0.4
        + (moatHits ? 18 : 0)
        + (ctx.retentionSignals.length > 0 ? 8 : 0)
        + (niche ? 8 : 0)
        + (verticalHits ? 4 : 0)
        + (ctx.pricingProven ? 4 : 0)
        + evidenceScore * 0.06,
      evidenceConfidence: params.evidenceConfidence,
      signals: [
        retaliationIncumbentHits ? "Incumbent / category-leader language detected; retaliation risk is real." : "",
        retaliationCompetitionHits ? "Competition / substitute / status-quo language present." : "",
        retaliationCloneHits ? "Clone / wrapper / copycat language detected; differentiation must be explicit." : "",
        retaliationPaidAdsHits ? "Paid-ads / bidding-war language detected; CAC could be retaliated against." : "",
        retaliationPlatformHits && retaliationCompetitionHits ? "Platform-built positioning could be cloned as a native feature." : "",
        retaliationCommodityHits ? "Commoditization / wrapper risk explicit in thesis." : "",
        moatHits ? "Lock-in, network effects, owned-audience, regulatory, or brand-trust language reduces retaliation risk." : "",
        ctx.retentionSignals.length > 0 ? "Retention signals suggest switching cost can blunt copycat copy-paste responses." : "",
        niche ? "Vertical/niche framing without explicit incumbents reduces immediate retaliation surface." : "",
      ],
      gaps: [
        retaliationIncumbentHits && !moatHits ? "Incumbents named but no moat (lock-in, network, owned audience, regulation) is recorded." : "",
        retaliationCloneHits && !moatHits ? "Clone / wrapper risk is explicit but no defensible workflow or data moat is articulated." : "",
        retaliationFeatureCopyHits ? "Thesis admits incumbents could ship this as a feature; defensibility must be proven before scale." : "",
        retaliationPlatformHits && heavyPlatformPenalty > 0 ? "Heavy platform dependency raises platform-clone / TOS retaliation risk." : "",
        retaliationPaidAdsHits ? "Paid-ads positioning invites bidding wars from better-funded incumbents." : "",
        retaliationCommodityHits ? "Commoditization risk needs differentiation evidence before paid acquisition." : "",
      ],
      nextAction: "Name the strongest two incumbents or substitutes, document the specific moat (lock-in, network, owned audience, regulation, brand trust, vertical knowledge), and rehearse the response plan if the closest substitute ships this as a feature next quarter.",
      forceSpeculative: !retaliationIncumbentHits && !retaliationCompetitionHits && !retaliationCloneHits && !retaliationCommodityHits && !retaliationPaidAdsHits,
    }),
  };
}

function confidenceFromTimingEvidence(params: {
  whyNowText: string;
  evidenceCount: number;
  timingScore: number;
  signalCount: number;
}): VentureWhyNowConfidence {
  if (params.whyNowText && params.evidenceCount >= 2 && params.timingScore >= 45) return "supported";
  if (params.whyNowText || params.signalCount > 0 || params.evidenceCount > 0) return "inferred";
  return "speculative";
}

function buildWhyNowRationale(params: {
  title: string;
  whyNowText?: string;
  marketSummary?: string;
  signals?: string[];
  demandSignals?: string[];
  missingPlatforms?: string[];
  warnings?: string[];
  evidence: FinalOptionEvidence[];
  timingScore: number;
}) {
  const whyNowText = params.whyNowText?.trim() ?? "";
  const drivers = uniqueCompact([
    ...timingDriverFragments(whyNowText),
    ...(params.signals ?? []),
    ...(params.demandSignals ?? []),
    ...params.evidence.map((source) => source.title || source.summary || source.keywords),
  ], 4);
  const risks = uniqueCompact([
    ...(params.missingPlatforms ?? []).map((platform) => `Missing timing proof from ${platform}.`),
    ...(params.warnings ?? []).filter((warning) => /timing|window|saturat|late|missing|confidence/i.test(warning)),
  ], 4);
  const headline = sentenceFallback(
    whyNowText || drivers[0] || params.marketSummary,
    `No dated catalyst recorded yet for ${params.title}.`,
  );

  return {
    headline,
    drivers: drivers.length > 0 ? drivers : ["No structured catalyst extracted from the build brief."],
    risks: risks.length > 0 ? risks : ["Timing rationale still needs independent pressure testing."],
    expiringWindow: expiringWindowFrom(drivers),
    confidence: confidenceFromTimingEvidence({
      whyNowText,
      evidenceCount: params.evidence.length,
      timingScore: clampScore(params.timingScore),
      signalCount: drivers.length,
    }),
    sources: params.evidence.slice(0, 4),
  };
}

export function deriveFallbackVentureWhyNow(workspace: Pick<VentureOperatingWorkspace, "title" | "targetBuyer" | "claims" | "killCriteria" | "evidenceSources" | "opportunityDemandSnapshot">): VentureWhyNowRationale {
  const timingClaim = workspace.claims.find((claim) => /now|timing|trend|wave|window|deadline|market/i.test(claim)) ?? "";
  return buildWhyNowRationale({
    title: workspace.title,
    whyNowText: timingClaim,
    signals: workspace.opportunityDemandSnapshot?.demandSignals ?? [],
    demandSignals: workspace.opportunityDemandSnapshot?.demandSignals ?? [],
    missingPlatforms: workspace.killCriteria.missingEvidence,
    warnings: workspace.opportunityDemandSnapshot?.warnings ?? [],
    evidence: workspace.evidenceSources,
    timingScore: workspace.opportunityDemandSnapshot?.demandScore ?? 35,
  });
}

export function deriveFallbackVentureMvpScope(workspace: Pick<VentureOperatingWorkspace, "productWedge" | "dataRequirements" | "keyIntegrations" | "killCriteria" | "mvpHandoff" | "companySimulation">): VentureMvpScope {
  return buildMvpScope({
    source: "fallback",
    note: workspace.productWedge,
    coreFlows: [workspace.mvpHandoff.setupInstructions, workspace.mvpHandoff.analyticsPlan],
    dataRequirements: workspace.dataRequirements,
    integrations: workspace.keyIntegrations,
    missingEvidence: workspace.killCriteria.missingEvidence,
    complexityText: workspace.companySimulation.engineeringComplexity,
  });
}

export function deriveFallbackVentureBuildEstimate(workspace: Pick<VentureOperatingWorkspace, "mvpScope" | "keyIntegrations" | "dataRequirements" | "killCriteria" | "companySimulation" | "contradictions">): VentureBuildEstimate {
  const difficultyScore = workspace.companySimulation.engineeringComplexity === "High"
    ? 78
    : workspace.companySimulation.engineeringComplexity === "Low"
      ? 34
      : 55;
  return buildVentureBuildEstimate({
    source: "fallback",
    mvpScope: workspace.mvpScope,
    integrationCount: workspace.keyIntegrations.length,
    dataRequirementCount: workspace.dataRequirements.length,
    missingEvidenceCount: workspace.killCriteria.missingEvidence.length,
    executionDifficultyScore: difficultyScore,
    riskScore: clampScore(workspace.contradictions.length * 18 + workspace.killCriteria.missingEvidence.length * 10),
    complexityText: workspace.companySimulation.engineeringComplexity,
  });
}

export function deriveFallbackVentureEvidenceConfidence(workspace: Pick<VentureOperatingWorkspace, "evidenceSources" | "killCriteria" | "contradictions" | "opportunityDemandSnapshot">): VentureEvidenceConfidence {
  const snapshot = workspace.opportunityDemandSnapshot;
  return buildEvidenceConfidence({
    evidence: workspace.evidenceSources,
    confidenceScore: snapshot?.demandScore ?? 35,
    demandEvidenceScore: snapshot?.demandEvidenceScore ?? 30,
    coveredPlatforms: snapshot?.coveredPlatforms ?? platformsFromEvidence(workspace.evidenceSources),
    missingPlatforms: snapshot?.missingPlatforms ?? workspace.killCriteria.missingEvidence,
    demandSignals: snapshot?.demandSignals ?? [],
    warnings: [
      ...(snapshot?.warnings ?? []),
      ...workspace.contradictions,
    ],
  });
}

export function deriveFallbackVentureReasoningDebate(workspace: Pick<VentureOperatingWorkspace, "title" | "targetBuyer" | "painStatement" | "productWedge" | "pricingHypothesis" | "acquisitionChannels" | "claims" | "contradictions" | "killCriteria" | "experiments" | "whyNow" | "mvpScope" | "buildEstimate" | "evidenceConfidence">): VentureReasoningDebate {
  return buildReasoningDebate({
    title: workspace.title,
    buyer: workspace.targetBuyer,
    pain: workspace.painStatement,
    wedge: workspace.productWedge,
    pricing: workspace.pricingHypothesis,
    channels: workspace.acquisitionChannels,
    claims: workspace.claims,
    contradictions: workspace.contradictions,
    killReasons: workspace.killCriteria.killReasons,
    experiments: workspace.experiments,
    whyNow: workspace.whyNow,
    mvpScope: workspace.mvpScope,
    buildEstimate: workspace.buildEstimate,
    evidenceConfidence: workspace.evidenceConfidence,
  });
}

export function deriveFallbackVentureEvaluationLenses(workspace: Pick<VentureOperatingWorkspace, "targetBuyer" | "painStatement" | "productWedge" | "pricingHypothesis" | "revenueModel" | "acquisitionChannels" | "retentionMechanism" | "keyIntegrations" | "dataRequirements" | "claims" | "contradictions" | "killCriteria" | "experiments" | "mvpScope" | "buildEstimate" | "evidenceConfidence" | "companySimulation">): VentureEvaluationLenses {
  return buildVentureEvaluationLenses({
    buyer: workspace.targetBuyer,
    pain: workspace.painStatement,
    wedge: workspace.productWedge,
    pricing: workspace.pricingHypothesis,
    revenueModel: workspace.revenueModel,
    channels: workspace.acquisitionChannels,
    retentionMechanism: workspace.retentionMechanism,
    keyIntegrations: workspace.keyIntegrations,
    dataRequirements: workspace.dataRequirements,
    claims: workspace.claims,
    contradictions: workspace.contradictions,
    missingEvidence: workspace.killCriteria.missingEvidence,
    successMetrics: workspace.experiments.flatMap((experiment) => experiment.metrics),
    coreUserFlows: workspace.mvpScope.mustHaveFeatures,
    mvpScope: workspace.mvpScope,
    buildEstimate: workspace.buildEstimate,
    evidenceConfidence: workspace.evidenceConfidence,
    expansion: workspace.companySimulation.expansion,
    supportLoad: workspace.companySimulation.supportLoad,
    cac: workspace.companySimulation.cac,
    customerSegments: workspace.companySimulation.customerSegments,
    source: "fallback",
  });
}

function channelFromEvidence(evidence: FinalOptionEvidence[]) {
  const platforms = Array.from(new Set(evidence.map((item) => item.platform).filter(Boolean)));
  return platforms.length > 0 ? platforms.join(", ") : "manual founder outreach";
}

function inferStage(score: number, readyForLovable: boolean): VentureStage {
  if (score >= 70 && readyForLovable) return "building";
  if (score >= 55) return "validating";
  return "researching";
}

function stageLabel(stage: VentureStage) {
  if (stage === "building") return "Build-ready with evidence";
  if (stage === "validating") return "Validation workspace";
  return "Research workspace";
}

function decisionFor(score: number, missingEvidenceCount: number): VentureOperatingWorkspace["decision"] {
  if (score >= 72 && missingEvidenceCount <= 1) return "continue";
  if (score >= 45) return "validate";
  return "kill-review";
}

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "manual-thesis";
}

function buildExperiments(params: {
  title: string;
  buyer: string;
  channels: string;
  pricing: string;
  retentionMetric: string;
  successMetrics: string[];
  missingPlatforms: string[];
}): VentureWorkspaceExperiment[] {
  const { title, buyer, channels, pricing, retentionMetric, successMetrics, missingPlatforms } = params;
  const missing = missingPlatforms.length > 0 ? missingPlatforms.join(", ") : "one independent channel";
  const primarySuccess = successMetrics[0] ?? "20 qualified signups from the target buyer";

  return [
    {
      id: "fake-door-waitlist",
      type: "Fake-door waitlist test",
      hypothesis: `${buyer} will exchange an email for ${title} before the full product exists.`,
      audience: buyer,
      channel: channels,
      cost: "One landing page plus one focused traffic or community post.",
      successThreshold: `Pass if the page captures ${primarySuccess}.`,
      failureThreshold: "Fail if qualified signup intent stays below 2% after one clear traffic source.",
      ethicsReview: "The page must state that early access is being prioritized and must not imply a finished product.",
      metrics: ["impressions", "click-through rate", "signup rate", "objections"],
      result: "Not run yet.",
      interpretation: "Pending real demand data.",
      nextAction: "Publish the waitlist copy and record visitor/signup counts.",
    },
    {
      id: "pricing-smoke",
      type: "Pricing test",
      hypothesis: `${buyer} will accept the stated pricing hypothesis: ${pricing}.`,
      audience: buyer,
      channel: "checkout-intent CTA or interview script",
      cost: "Manual checkout-intent tracking; no live billing charge until approved.",
      successThreshold: "Pass if 3 qualified buyers choose a paid tier or request an invoice.",
      failureThreshold: "Fail if buyers like the concept but refuse any paid commitment.",
      ethicsReview: "Do not collect payment without explicit human-approved billing setup.",
      metrics: ["willingness to pay", "conversion", "objections"],
      result: "Not run yet.",
      interpretation: "Pending price sensitivity data.",
      nextAction: "Add a pricing-choice question to the first interview or fake-door flow.",
    },
    {
      id: "missing-channel-pressure-test",
      type: "Contradiction pressure test",
      hypothesis: `The current thesis survives fresh evidence from ${missing}.`,
      audience: buyer,
      channel: missing,
      cost: "Research time plus source capture.",
      successThreshold: "Pass if new sources support the same pain, buyer, and acquisition wedge.",
      failureThreshold: "Fail if the missing channel shows low urgency, strong backlash, or better substitutes.",
      ethicsReview: "Use public or consented sources and store source URLs with provenance.",
      metrics: ["source count", "qualitative sentiment", "contradictions", "feature requests"],
      result: "Not run yet.",
      interpretation: "Pending missing-channel evidence.",
      nextAction: "Launch a follow-up research mission targeted at the missing channel.",
    },
    {
      id: "retention-concierge",
      type: "Concierge MVP retention test",
      hypothesis: `${buyer} will repeat the core workflow when ${title} is manually simulated.`,
      audience: buyer,
      channel: "manual pilot cohort",
      cost: "Founder-operated pilot with seeded workflows and manual support.",
      successThreshold: `Pass if the pilot reaches ${retentionMetric}.`,
      failureThreshold: "Fail if users do not return after the first delivered outcome.",
      ethicsReview: "Tell participants when the workflow is manually assisted.",
      metrics: ["activation", "retention", "support questions", "qualitative sentiment"],
      result: "Not run yet.",
      interpretation: "Pending pilot retention data.",
      nextAction: "Run the core workflow manually for 5 to 10 target users.",
    },
  ];
}

export function buildManualVentureWorkspace(input: ManualVentureThesisInput): VentureOperatingWorkspace {
  const title = sentenceFallback(input.title, "Manual venture thesis");
  const buyer = sentenceFallback(input.targetBuyer, "Target buyer not defined yet");
  const pain = sentenceFallback(input.painStatement, "Pain statement not defined yet");
  const wedge = sentenceFallback(input.productWedge, "Product wedge not defined yet");
  const pricing = sentenceFallback(input.pricingHypothesis || input.revenueModel, "pricing not validated yet");
  const revenueModel = sentenceFallback(input.revenueModel, pricing);
  const acquisitionChannel = sentenceFallback(input.acquisitionChannel, "manual founder outreach");
  const evidenceNote = sentenceFallback(input.evidenceNote, "Manual thesis created before source-backed research.");
  const manualDemandScore = evidenceNote === "Manual thesis created before source-backed research." ? 28 : 42;
  const manualEvidenceSource: FinalOptionEvidence = {
    id: "manual-thesis-note",
    platform: "operator-note",
    title: `${title} thesis note`,
    summary: evidenceNote,
    url: "",
    keywords: `${buyer}, ${pain}, ${wedge}`,
  };
  const experiments = buildExperiments({
    title,
    buyer,
    channels: acquisitionChannel,
    pricing,
    retentionMetric: "two repeat uses inside 14 days",
    successMetrics: ["20 qualified signups", "3 paid commitments", "40% week-two retention"],
    missingPlatforms: ["source-backed market evidence"],
  });
  const whyNow = buildWhyNowRationale({
    title,
    whyNowText: input.whyNowNote,
    marketSummary: evidenceNote,
    signals: input.whyNowNote ? [input.whyNowNote] : [],
    demandSignals: [
      `Buyer: ${buyer}`,
      `Pain urgency: ${pain ? 45 : 20}/100`,
      `Demand evidence: ${evidenceNote === "Manual thesis created before source-backed research." ? 0 : 1} operator note`,
    ],
    missingPlatforms: ["source-backed market evidence"],
    warnings: ["Manual thesis demand score requires independent source evidence."],
    evidence: [manualEvidenceSource],
    timingScore: manualDemandScore,
  });
  const dataRequirements = ["CustomerInterview.pain", "Experiment.signupRate", "PricingSignal.acceptedPrice"];
  const mvpScope = buildMvpScope({
    source: "manual-thesis",
    note: input.mvpScopeNote || wedge,
    coreFlows: [wedge, "Capture customer interview evidence", "Record the first fake-door experiment result"],
    dataRequirements,
    integrations: ["manual workflow"],
    missingEvidence: ["source-backed market evidence", "customer interview evidence", "pricing evidence"],
    complexityText: "Unknown until MVP scope is decomposed.",
  });
  const evidenceConfidence = buildEvidenceConfidence({
    evidence: [manualEvidenceSource],
    confidenceScore: manualDemandScore,
    demandEvidenceScore: evidenceNote === "Manual thesis created before source-backed research." ? 15 : 35,
    coveredPlatforms: ["operator-note"],
    missingPlatforms: ["source-backed market evidence"],
    demandSignals: [
      `Buyer: ${buyer}`,
      `Pain urgency: ${pain ? 45 : 20}/100`,
      `Demand evidence: ${evidenceNote === "Manual thesis created before source-backed research." ? 0 : 1} operator note`,
    ],
    warnings: ["Manual thesis demand score requires independent source evidence."],
    note: input.evidenceConfidenceNote,
  });
  const buildEstimate = buildVentureBuildEstimate({
    source: "manual-thesis",
    mvpScope,
    integrationCount: 1,
    dataRequirementCount: dataRequirements.length,
    missingEvidenceCount: 3,
    executionDifficultyScore: 55,
    riskScore: 52,
    complexityText: "Unknown until MVP scope is decomposed.",
    note: input.buildEstimateNote,
  });
  const reasoningDebate = buildReasoningDebate({
    title,
    buyer,
    pain,
    wedge,
    pricing,
    channels: [acquisitionChannel],
    claims: [
      evidenceNote,
      `Target buyer: ${buyer}.`,
      `Pain: ${pain}.`,
      `Product wedge: ${wedge}.`,
    ],
    contradictions: ["Manual thesis still needs independent source evidence."],
    killReasons: [
      "Independent evidence does not support the pain.",
      "Buyer does not show urgent demand.",
      "The wedge is not differentiated from existing alternatives.",
      "Pricing cannot support acquisition and support load.",
    ],
    experiments,
    whyNow,
    mvpScope,
    buildEstimate,
    evidenceConfidence,
  });
  const evaluationLenses = buildVentureEvaluationLenses({
    buyer,
    pain,
    wedge,
    pricing,
    revenueModel,
    channels: [acquisitionChannel],
    retentionMechanism: "two repeat uses inside 14 days",
    keyIntegrations: ["manual workflow"],
    dataRequirements,
    claims: [
      evidenceNote,
      `Target buyer: ${buyer}.`,
      `Pain: ${pain}.`,
      `Product wedge: ${wedge}.`,
    ],
    contradictions: ["Manual thesis still needs independent source evidence."],
    missingEvidence: ["source-backed market evidence", "customer interview evidence", "pricing evidence"],
    successMetrics: ["20 qualified signups", "3 paid commitments", "40% week-two retention"],
    coreUserFlows: [wedge, "Capture customer interview evidence", "Record the first fake-door experiment result"],
    mvpScope,
    buildEstimate,
    evidenceConfidence,
    expansion: "Expand only after repeat usage and differentiation are proven.",
    supportLoad: "Log every manual support request during the first concierge pass.",
    cac: "Unknown until the first acquisition channel test.",
    customerSegments: [buyer],
    source: "manual-thesis",
  });

  return {
    id: `venture-manual-${slugify(title)}`,
    title,
    stage: "researching",
    stageLabel: "Manual thesis workspace",
    decision: "validate",
    targetBuyer: buyer,
    painStatement: pain,
    productWedge: wedge,
    revenueModel,
    pricingHypothesis: pricing,
    acquisitionChannels: [acquisitionChannel],
    retentionMechanism: "two repeat uses inside 14 days",
    whyNow,
    mvpScope,
    buildEstimate,
    evidenceConfidence,
    reasoningDebate,
    evaluationLenses,
    keyIntegrations: ["manual workflow"],
    dataRequirements,
    evidenceSources: [manualEvidenceSource],
    claims: [
      evidenceNote,
      `Target buyer: ${buyer}.`,
      `Pain: ${pain}.`,
      `Product wedge: ${wedge}.`,
    ],
    contradictions: ["Manual thesis still needs independent source evidence."],
    untestedAssumptions: [
      `The buyer urgently feels: ${pain}.`,
      `The wedge is differentiated enough: ${wedge}.`,
      `The buyer will accept: ${pricing}.`,
      `Acquisition can start through ${acquisitionChannel}.`,
    ],
    changeMindTriggers: [
      "Independent sources do not show the pain.",
      "Interviews reveal a stronger status quo or substitute.",
      "Fake-door signup rate misses the failure threshold.",
      "Qualified buyers reject the pricing hypothesis.",
    ],
    companySimulation: {
      customerSegments: [buyer],
      salesCycle: "Founder-led discovery until the first qualified demand signal is recorded.",
      pricing,
      grossMargin: "Unknown until delivery cost and support load are measured.",
      cac: "Unknown until the first acquisition channel test.",
      paybackPeriod: "Not proven; estimate after pricing and CAC tests.",
      activation: "Complete the first promised outcome.",
      retention: "two repeat uses inside 14 days",
      expansion: "Expand only after repeat usage and differentiation are proven.",
      supportLoad: "Log every manual support request during the first concierge pass.",
      infrastructureCost: "Low until a real MVP or integration is attached.",
      complianceCost: "Review once source evidence and target buyer context are attached.",
      engineeringComplexity: "Unknown until MVP scope is decomposed.",
      competitiveResponse: "Existing alternatives may already solve enough of the pain.",
      hiringNeeds: "Founder/operator plus product builder after validation.",
      capitalIntensity: "Low before paid acquisition or production infrastructure.",
      failureModes: [
        "The pain is real but not urgent.",
        "The buyer prefers the current status quo.",
        "The product wedge is not differentiated from existing alternatives.",
        "Support load makes the manual workflow too expensive.",
      ],
    },
    experiments,
    killCriteria: {
      missingEvidence: ["source-backed market evidence", "customer interview evidence", "pricing evidence"],
      disconfirmationPath: "Interview target buyers and run a fake-door signup test before building.",
      pivotTriggers: [
        "A different buyer describes the pain with more urgency.",
        "Users prefer a service or template over software.",
        "The strongest demand comes from a different acquisition channel.",
      ],
      stopTriggers: [
        experiments[0].failureThreshold,
        experiments[1].failureThreshold,
        experiments[3].failureThreshold,
      ],
      killReasons: [
        "Independent evidence does not support the pain.",
        "Buyer does not show urgent demand.",
        "The wedge is not differentiated from existing alternatives.",
        "Pricing cannot support acquisition and support load.",
      ],
    },
    mvpHandoff: {
      sourceCodeStatus: "Source code: pending builder output",
      setupInstructions: "Attach source-backed evidence before generating or deploying an MVP.",
      testCoverage: "Require typecheck, unit tests, build, and browser smoke before marking the MVP executable.",
      deploymentPath: "Deployment proposal blocked until independent evidence and a build artifact exist.",
      analyticsPlan: "Track visitor, signup, interview, pricing, activation, retention, support, and competitor-switching signals.",
      securityNotes: "Do not collect sensitive data until the workflow and compliance risk are reviewed.",
      accessibilityPass: "Mobile-first workflow must pass keyboard, contrast, and small-screen checks.",
      mobileBehavior: "Validate responsive behavior before launch.",
      dataModel: ["CustomerInterview: persona, painQuote, objections", "ExperimentResult: channel, signups, conversion", "CompetitorWatch: alternative, threat, response"],
      operatorDashboard: "Show evidence gaps, interviews, experiments, pricing, competitors, and kill/continue decisions.",
      evidenceBacklink: "Manual thesis note attached; independent source evidence pending.",
    },
    approvals: [
      { level: "Read-only research", status: "available", evidence: "Manual thesis needs source-backed research." },
      { level: "Draft artifact generation", status: "available", evidence: "Thesis fields can produce a build brief after evidence improves." },
      { level: "Local code generation", status: "available", evidence: "Code generation should wait for MVP scope." },
      { level: "Local test execution", status: "available", evidence: "Run repo-native checks after code exists." },
      { level: "Deployment proposal", status: "blocked", evidence: "No verified MVP artifact exists yet." },
      { level: "Human-approved deployment", status: "requires-human", evidence: "Deployment changes are intentionally not automatic." },
      { level: "Human-approved outreach", status: "requires-human", evidence: "Outbound contact requires explicit human review." },
      { level: "Human-approved spend", status: "requires-human", evidence: "Paid acquisition requires spend approval." },
      { level: "Human-approved billing changes", status: "requires-human", evidence: "Billing setup must be reviewed before charging users." },
    ],
    opportunityDemandSnapshot: {
      source: "manual-thesis",
      optionId: `manual-${slugify(title)}`,
      title,
      buyer,
      demandScore: manualDemandScore,
      painUrgencyScore: pain ? 45 : 20,
      demandEvidenceScore: evidenceNote === "Manual thesis created before source-backed research." ? 15 : 35,
      evidenceCount: evidenceNote === "Manual thesis created before source-backed research." ? 0 : 1,
      coveredPlatforms: ["operator-note"],
      missingPlatforms: ["source-backed market evidence"],
      demandSignals: [
        `Buyer: ${buyer}`,
        `Pain urgency: ${pain ? 45 : 20}/100`,
        `Demand evidence: ${evidenceNote === "Manual thesis created before source-backed research." ? 0 : 1} operator note`,
      ],
      warnings: ["Manual thesis demand score requires independent source evidence."],
    },
    nextActions: [
      "Attach source-backed evidence.",
      "Interview five target buyers.",
      "Run the fake-door waitlist test.",
      "Record competitor alternatives before building.",
    ],
  };
}

export function buildVentureOperatingWorkspace(finalOptions: FinalOptionsPayload): VentureOperatingWorkspace {
  const option = primaryOption(finalOptions);
  const scorecard = scoreFinalOptions(finalOptions);
  const score = scorecard.primary;
  const implementation = finalOptions.implementationPlan;
  const evidence = option.evidence.length > 0 ? option.evidence : implementation.sourceEvidence;
  const title = sentenceFallback(implementation.title, option.title);
  const buyer = sentenceFallback(implementation.targetUsers, option.audience);
  const revenueModel = sentenceFallback(implementation.monetization, option.recommendedFormat);
  const retentionMetric = firstMetricContaining(implementation.successMetrics, /retention|repeat|week/i) ?? "two repeat uses inside 14 days";
  const pricingMetric = firstMetricContaining(implementation.successMetrics, /cac|revenue|paid|price|month|\$/i);
  const pricing = sentenceFallback(implementation.monetization || pricingMetric, "pricing not validated yet");
  const channels = compactList([
    ...implementation.launchPlan,
    channelFromEvidence(evidence),
  ]).slice(0, 5);
  const stage = inferStage(score.opportunityScore, finalOptions.coverage.readyForLovable);
  const dataRequirements = implementation.dataModel.flatMap((model) => model.fields.length > 0 ? model.fields.map((field) => `${model.entity}.${field}`) : [model.entity]);
  const screenModules = implementation.screens.flatMap((screen) => [
    `${screen.name}: ${screen.purpose}`,
    ...screen.modules.map((module) => `${screen.name} module: ${module}`),
  ]);
  const missingEvidence = finalOptions.coverage.missingPlatforms.length > 0
    ? finalOptions.coverage.missingPlatforms.map((platform) => `${platform} coverage`)
    : ["fresh independent validation"];
  const contradictions = compactList([
    ...score.warnings.filter((warning) => /missing|contradiction|risk|confidence/i.test(warning)),
    finalOptions.coverage.readyForLovable ? "" : "Builder launch is gated until source coverage is complete.",
  ]);

  const untestedAssumptions = compactList([
    `Willingness to pay for ${pricing}.`,
    `Retention can reach ${retentionMetric}.`,
    channels.length > 0 ? `Acquisition can work through ${channels[0]}.` : "A repeatable acquisition channel exists.",
    "Support load stays manageable during a concierge pilot.",
  ]);

  const experiments = buildExperiments({
    title,
    buyer,
    channels: channels[0] ?? channelFromEvidence(evidence),
    pricing,
    retentionMetric,
    successMetrics: implementation.successMetrics,
    missingPlatforms: score.missingPlatforms,
  });
  const whyNow = buildWhyNowRationale({
    title,
    whyNowText: implementation.whyNow,
    marketSummary: finalOptions.marketResearch.summary,
    signals: finalOptions.marketResearch.signals,
    demandSignals: score.demandSignals,
    missingPlatforms: score.missingPlatforms,
    warnings: score.warnings,
    evidence,
    timingScore: score.marketTimingScore,
  });
  const mvpScope = buildMvpScope({
    source: "build-brief",
    note: implementation.oneLiner || implementation.valueProp,
    coreFlows: implementation.coreUserFlows,
    screenModules,
    dataRequirements,
    integrations: implementation.integrations,
    missingEvidence,
    complexityText: score.executionDifficultyScore >= 70 ? "High" : score.executionDifficultyScore >= 45 ? "Moderate" : "Low",
  });
  const buildEstimate = buildVentureBuildEstimate({
    source: "build-brief",
    mvpScope,
    integrationCount: implementation.integrations.length,
    dataRequirementCount: dataRequirements.length,
    missingEvidenceCount: missingEvidence.length,
    executionDifficultyScore: score.executionDifficultyScore,
    riskScore: score.riskScore,
    complexityText: score.executionDifficultyScore >= 70 ? "High" : score.executionDifficultyScore >= 45 ? "Moderate" : "Low",
  });
  const evidenceConfidence = buildEvidenceConfidence({
    evidence,
    confidenceScore: score.confidenceScore,
    demandEvidenceScore: score.demandEvidenceScore,
    coveredPlatforms: score.coveredPlatforms,
    missingPlatforms: score.missingPlatforms,
    demandSignals: score.demandSignals,
    warnings: score.warnings,
  });
  const reasoningDebate = buildReasoningDebate({
    title,
    buyer,
    pain: sentenceFallback(implementation.problem, option.whyPromising),
    wedge: sentenceFallback(implementation.valueProp, option.marketAngle),
    pricing,
    channels: channels.length > 0 ? channels : ["manual founder outreach"],
    claims: compactList([
      finalOptions.marketResearch.summary,
      option.whyPromising,
      implementation.whyNow,
      implementation.valueProp,
      `Opportunity score ${score.opportunityScore} from ${score.evidenceCount} evidence source${score.evidenceCount === 1 ? "" : "s"}.`,
    ]),
    contradictions,
    killReasons: [
      "Buyer does not show urgent pain.",
      "Channel is too expensive for the pricing hypothesis.",
      "Evidence remains weak after missing-channel research.",
      "The MVP is not differentiated from existing substitutes.",
    ],
    experiments,
    whyNow,
    mvpScope,
    buildEstimate,
    evidenceConfidence,
  });
  const keyIntegrations = implementation.integrations.length > 0 ? implementation.integrations : ["manual CSV import"];
  const evaluationLenses = buildVentureEvaluationLenses({
    buyer,
    pain: sentenceFallback(implementation.problem, option.whyPromising),
    wedge: sentenceFallback(implementation.valueProp, option.marketAngle),
    pricing,
    revenueModel,
    channels: channels.length > 0 ? channels : ["manual founder outreach"],
    retentionMechanism: retentionMetric,
    keyIntegrations,
    dataRequirements,
    claims: compactList([
      finalOptions.marketResearch.summary,
      option.whyPromising,
      implementation.whyNow,
      implementation.valueProp,
      `Opportunity score ${score.opportunityScore} from ${score.evidenceCount} evidence source${score.evidenceCount === 1 ? "" : "s"}.`,
    ]),
    contradictions,
    missingEvidence,
    successMetrics: implementation.successMetrics,
    coreUserFlows: implementation.coreUserFlows,
    mvpScope,
    buildEstimate,
    evidenceConfidence,
    expansion: "Expand only after repeat usage and a stable acquisition channel are proven.",
    supportLoad: "Concierge pilot should log every support question before automation.",
    cac: firstMetricContaining(implementation.successMetrics, /cac/i) ?? "Unknown until first acquisition test.",
    customerSegments: compactList([buyer, option.audience]),
    source: "build-brief",
  });

  return {
    id: `venture-${option.id}`,
    title,
    stage,
    stageLabel: stageLabel(stage),
    decision: decisionFor(score.opportunityScore, missingEvidence.length),
    targetBuyer: buyer,
    painStatement: sentenceFallback(implementation.problem, option.whyPromising),
    productWedge: sentenceFallback(implementation.valueProp, option.marketAngle),
    revenueModel,
    pricingHypothesis: pricing,
    acquisitionChannels: channels.length > 0 ? channels : ["manual founder outreach"],
    retentionMechanism: retentionMetric,
    whyNow,
    mvpScope,
    buildEstimate,
    evidenceConfidence,
    reasoningDebate,
    evaluationLenses,
    keyIntegrations,
    dataRequirements,
    evidenceSources: evidence,
    claims: compactList([
      finalOptions.marketResearch.summary,
      option.whyPromising,
      implementation.whyNow,
      implementation.valueProp,
      `Opportunity score ${score.opportunityScore} from ${score.evidenceCount} evidence source${score.evidenceCount === 1 ? "" : "s"}.`,
    ]),
    contradictions,
    untestedAssumptions,
    changeMindTriggers: [
      "Fresh missing-channel evidence contradicts the buyer pain.",
      "Fake-door signup rate misses the failure threshold.",
      "Qualified buyers reject the pricing hypothesis.",
      "Concierge users do not repeat the core workflow.",
    ],
    companySimulation: {
      customerSegments: compactList([buyer, option.audience]),
      salesCycle: "Founder-led validation before any scaled sales motion.",
      pricing,
      grossMargin: "Likely software-margin if support and AI usage stay below the paid plan value.",
      cac: firstMetricContaining(implementation.successMetrics, /cac/i) ?? "Unknown until first acquisition test.",
      paybackPeriod: "Not proven; estimate after pricing and CAC tests.",
      activation: implementation.coreUserFlows[0] ?? "Complete the first core workflow.",
      retention: retentionMetric,
      expansion: "Expand only after repeat usage and a stable acquisition channel are proven.",
      supportLoad: "Concierge pilot should log every support question before automation.",
      infrastructureCost: implementation.integrations.length > 0 ? `Driven by ${implementation.integrations.join(", ")} integrations.` : "Low until live usage and integrations are added.",
      complianceCost: /health|wellness|clinical|therapy|student/i.test(`${title} ${implementation.problem}`) ? "Review wellness and student-privacy claims before outreach." : "No special compliance signal yet; verify during pilots.",
      engineeringComplexity: score.executionDifficultyScore >= 70 ? "High" : score.executionDifficultyScore >= 45 ? "Moderate" : "Low",
      competitiveResponse: "Existing substitutes can copy positioning if the workflow is only a content wrapper.",
      hiringNeeds: "Founder/operator plus product engineer until repeatable demand is proven.",
      capitalIntensity: "Low before paid acquisition or regulated integrations.",
      failureModes: [
        "The pain is inspirational but not urgent.",
        "Users want content but not a recurring workflow.",
        "Missing-channel evidence reveals stronger substitutes.",
        "The product requires more trust than the MVP can earn.",
      ],
    },
    experiments,
    killCriteria: {
      missingEvidence,
      disconfirmationPath: experiments[2].nextAction,
      pivotTriggers: [
        "Users prefer templates over software.",
        "The buyer changes from individual user to creator/operator.",
        "The highest intent comes from a channel outside the current evidence set.",
      ],
      stopTriggers: [
        experiments[0].failureThreshold,
        experiments[1].failureThreshold,
        experiments[3].failureThreshold,
      ],
      killReasons: [
        "Buyer does not show urgent pain.",
        "Channel is too expensive for the pricing hypothesis.",
        "Evidence remains weak after missing-channel research.",
        "The MVP is not differentiated from existing substitutes.",
      ],
    },
    mvpHandoff: {
      sourceCodeStatus: finalOptions.lovableHandoff.launchUrl ? "builder launch URL ready" : "Source code: pending builder output",
      setupInstructions: finalOptions.lovableHandoff.prompt ? "Copy or launch the build brief, then attach the generated repo path back to this venture." : "Create a build brief before code generation.",
      testCoverage: "Require typecheck, unit tests, build, and browser smoke before marking the MVP executable.",
      deploymentPath: finalOptions.coverage.readyForLovable ? "Lovable handoff can be launched now." : `Deployment proposal blocked by ${missingEvidence.join(", ")}.`,
      analyticsPlan: `Track ${experiments.flatMap((experiment) => experiment.metrics).slice(0, 6).join(", ")}.`,
      securityNotes: "Do not collect sensitive health or billing data before review.",
      accessibilityPass: "Mobile-first workflow must pass keyboard, contrast, and small-screen checks.",
      mobileBehavior: implementation.screens.some((screen) => /mobile|weekly|plan/i.test(screen.name)) ? "Primary workflow is mobile-first." : "Verify responsive behavior before launch.",
      dataModel: implementation.dataModel.map((model) => `${model.entity}: ${model.fields.join(", ") || model.purpose}`),
      operatorDashboard: "Show experiments, evidence, conversion, objections, and kill/continue decision in one cockpit.",
      evidenceBacklink: evidence.length > 0 ? `${evidence.length} evidence sources linked to ${title}.` : "No evidence sources attached yet.",
    },
    approvals: [
      { level: "Read-only research", status: evidence.length > 0 ? "complete" : "available", evidence: `${evidence.length} sources attached.` },
      { level: "Draft artifact generation", status: implementation.title ? "complete" : "available", evidence: implementation.title ? "Implementation plan exists." : "No generated plan yet." },
      { level: "Local code generation", status: "available", evidence: "Builder prompt can create a local or Lovable workspace." },
      { level: "Local test execution", status: "available", evidence: "Run repo-native verification before handoff." },
      { level: "Deployment proposal", status: finalOptions.coverage.readyForLovable ? "available" : "blocked", evidence: finalOptions.coverage.readyForLovable ? "Coverage is complete." : `Missing ${missingEvidence.join(", ")}.` },
      { level: "Human-approved deployment", status: "requires-human", evidence: "Deployment changes are intentionally not automatic." },
      { level: "Human-approved outreach", status: "requires-human", evidence: "Outbound contact requires explicit human review." },
      { level: "Human-approved spend", status: "requires-human", evidence: "Paid ads or tools require spend approval." },
      { level: "Human-approved billing changes", status: "requires-human", evidence: "Billing setup must be reviewed before charging users." },
    ],
    opportunityDemandSnapshot: {
      source: "final-options",
      optionId: score.optionId,
      title: score.title,
      buyer: score.buyer,
      demandScore: score.demandScore,
      painUrgencyScore: score.painUrgencyScore,
      demandEvidenceScore: score.demandEvidenceScore,
      evidenceCount: score.evidenceCount,
      coveredPlatforms: score.coveredPlatforms,
      missingPlatforms: score.missingPlatforms,
      demandSignals: score.demandSignals,
      warnings: score.warnings.filter((warning) => /demand|evidence|missing|confidence/i.test(warning)),
    },
    nextActions: [
      "Run the fake-door waitlist test.",
      "Pressure-test the missing evidence channel.",
      "Attach generated MVP source code after builder output exists.",
      "Record experiment results before any scale decision.",
    ],
  };
}
