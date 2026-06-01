import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  GitBranch,
  KeyRound,
  Rocket,
  ShieldCheck,
  Skull,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePreferences } from "@/hooks/usePreferences";
import type { FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";
import { saveVentureWorkspace } from "@/lib/venture-portfolio";
import { buildVentureOperatingWorkspace, type ApprovalStatus } from "@/lib/venture-workspace";

interface Props {
  finalOptions: FinalOptionsPayload;
  onCreateFollowUpMission?: (prompt: string) => void | Promise<void>;
  isCreatingFollowUp?: boolean;
}

function approvalBadge(status: ApprovalStatus) {
  if (status === "complete") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "available") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "blocked") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300";
}

function decisionBadge(decision: string) {
  if (decision === "continue") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (decision === "validate") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function whyNowBadge(confidence: string) {
  if (confidence === "supported" || confidence === "source-backed") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (confidence === "inferred") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

function scopeBadge(confidence: string) {
  if (confidence === "defined") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (confidence === "inferred") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

function effortBadge(level: string) {
  if (level === "low") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (level === "medium") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

function evidenceBadge(label: string) {
  if (label === "strong") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (label === "moderate") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (label === "thin") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function SmallList({ items, tone = "slate" }: { items: string[]; tone?: "slate" | "amber" | "emerald" }) {
  const iconClass = tone === "amber" ? "text-amber-600" : tone === "emerald" ? "text-emerald-600" : "text-slate-400";
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${iconClass}`} />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export function VentureOperatingWorkspace({ finalOptions, onCreateFollowUpMission, isCreatingFollowUp = false }: Props) {
  const { currentUser } = usePreferences();
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const workspace = buildVentureOperatingWorkspace(finalOptions);
  const pressurePrompt = [
    `Venture pressure test: ${workspace.title}.`,
    `Validate missing evidence: ${workspace.killCriteria.missingEvidence.join(", ")}.`,
    `Run the disconfirmation path: ${workspace.killCriteria.disconfirmationPath}`,
    "Return source URLs, buyer objections, willingness-to-pay signals, and a continue/pivot/kill recommendation.",
  ].join(" ");
  const ownerKey = currentUser?.email ?? "anonymous";
  const evaluationLensEntries = [
    workspace.evaluationLenses.jobsToBeDone,
    workspace.evaluationLenses.willingnessToPay,
    workspace.evaluationLenses.distributionWedge,
    workspace.evaluationLenses.productLedGrowth,
    workspace.evaluationLenses.churnRisk,
    workspace.evaluationLenses.expansionRevenue,
    workspace.evaluationLenses.platformDependency,
    workspace.evaluationLenses.marketplaceLiquidity,
    workspace.evaluationLenses.networkEffects,
    workspace.evaluationLenses.dataMoats,
    workspace.evaluationLenses.regulatoryArbitrage,
    workspace.evaluationLenses.procurementFriction,
    workspace.evaluationLenses.founderMarketFit,
    workspace.evaluationLenses.brandTrust,
    workspace.evaluationLenses.aiAutomationDefensibility,
    workspace.evaluationLenses.salesLedEnterprise,
    workspace.evaluationLenses.workflowLockIn,
    workspace.evaluationLenses.verticalSaasDynamics,
    workspace.evaluationLenses.marginalCostStructure,
    workspace.evaluationLenses.integrationComplexity,
    workspace.evaluationLenses.switchingCosts,
    workspace.evaluationLenses.distributionMoats,
    workspace.evaluationLenses.capitalEfficiency,
    workspace.evaluationLenses.supportBurden,
    workspace.evaluationLenses.competitiveRetaliation,
  ];

  const handleSaveVenture = () => {
    const saved = saveVentureWorkspace(ownerKey, workspace);
    setSavedAt(saved.updatedAt);
    toast.success("Venture workspace saved");
  };

  return (
    <Card className="border-slate-200 bg-white dark:border-slate-800/80 dark:bg-slate-950/90">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <Rocket className="h-4 w-4 text-blue-600" />
              Venture Operating Workspace
            </CardTitle>
            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-500 dark:text-slate-300">
              Converts the recommended opportunity into a venture workspace with evidence, simulation, experiments, kill criteria, approvals, and MVP handoff truth.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {workspace.stageLabel}
            </Badge>
            <Badge variant="secondary" className={decisionBadge(workspace.decision)}>
              {workspace.decision === "continue" ? "Continue" : workspace.decision === "validate" ? "Validate next" : "Kill review"}
            </Badge>
            <Button type="button" size="sm" variant="outline" onClick={handleSaveVenture} className="h-7 gap-1.5 text-xs">
              <ClipboardCheck className="h-3.5 w-3.5" />
              {savedAt ? "Saved venture" : "Save venture"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Buyer</div>
            <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{workspace.targetBuyer}</div>
          </div>
          <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Evidence</div>
            <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{workspace.evidenceSources.length} linked sources</div>
          </div>
          <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Pricing hypothesis</div>
            <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{workspace.pricingHypothesis}</div>
          </div>
          <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Retention test</div>
            <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{workspace.retentionMechanism}</div>
          </div>
        </div>

        <section className="rounded-lg border border-blue-200/80 bg-blue-50/50 p-3 dark:border-blue-900/60 dark:bg-blue-950/20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-semibold text-blue-900 dark:text-blue-100">Why Now</h3>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-blue-800/90 dark:text-blue-100/90">{workspace.whyNow.headline}</p>
            </div>
            <Badge variant="secondary" className={`shrink-0 text-[10px] ${whyNowBadge(workspace.whyNow.confidence)}`}>
              {workspace.whyNow.confidence}
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-blue-500/80 dark:text-blue-200/70">Timing drivers</div>
              <SmallList items={workspace.whyNow.drivers.slice(0, 4)} tone="emerald" />
            </div>
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-blue-500/80 dark:text-blue-200/70">Timing risks</div>
              <SmallList items={workspace.whyNow.risks.slice(0, 4)} tone="amber" />
            </div>
          </div>
          <div className="mt-3 text-[11px] leading-relaxed text-blue-700/80 dark:text-blue-200/80">
            Window: {workspace.whyNow.expiringWindow}
          </div>
        </section>

        <section aria-label="MVP Scope" className="rounded-lg border border-emerald-200/80 bg-emerald-50/50 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">MVP Scope</h3>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-emerald-800/90 dark:text-emerald-100/90">{workspace.mvpScope.timeToMvp}</p>
            </div>
            <Badge variant="secondary" className={`shrink-0 text-[10px] ${scopeBadge(workspace.mvpScope.confidence)}`}>
              {workspace.mvpScope.confidence}
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-200/70">Must-have</div>
              <SmallList items={workspace.mvpScope.mustHaveFeatures.slice(0, 4)} tone="emerald" />
            </div>
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-200/70">Deferred</div>
              <SmallList items={workspace.mvpScope.deferredFeatures.slice(0, 4)} tone="amber" />
            </div>
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-200/70">Dependencies</div>
              <SmallList items={workspace.mvpScope.dependencies.slice(0, 4)} />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <section aria-label="Build Estimate" className="rounded-lg border border-slate-200/80 p-3 dark:border-slate-800/80">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-100">Build Estimate</h3>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{workspace.buildEstimate.timeRange}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{workspace.buildEstimate.builderProfile}</p>
              </div>
              <Badge variant="secondary" className={`shrink-0 text-[10px] ${effortBadge(workspace.buildEstimate.effortLevel)}`}>
                {workspace.buildEstimate.effortLevel} / {workspace.buildEstimate.effortScore}
              </Badge>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Drivers</div>
                <SmallList items={workspace.buildEstimate.complexityDrivers.slice(0, 4)} />
              </div>
              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Risk adjustments</div>
                <SmallList items={workspace.buildEstimate.riskAdjustments.slice(0, 4)} tone="amber" />
              </div>
            </div>
          </section>

          <section aria-label="Evidence Confidence" className="rounded-lg border border-slate-200/80 p-3 dark:border-slate-800/80">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-100">Evidence Confidence</h3>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {workspace.evidenceConfidence.sourceCount} source{workspace.evidenceConfidence.sourceCount === 1 ? "" : "s"} across {workspace.evidenceConfidence.platformCount} platform{workspace.evidenceConfidence.platformCount === 1 ? "" : "s"}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Platforms: {workspace.evidenceConfidence.sourcePlatforms.join(", ") || "none"}
                </p>
              </div>
              <Badge variant="secondary" className={`shrink-0 text-[10px] ${evidenceBadge(workspace.evidenceConfidence.label)}`}>
                {workspace.evidenceConfidence.label} / {workspace.evidenceConfidence.score}
              </Badge>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Signals</div>
                <SmallList items={workspace.evidenceConfidence.supportingSignals.slice(0, 4)} tone="emerald" />
              </div>
              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Gaps</div>
                <SmallList items={workspace.evidenceConfidence.gaps.slice(0, 4)} tone="amber" />
              </div>
            </div>
          </section>
        </div>

        <section aria-label="Reasoning Debate" className="rounded-lg border border-slate-200/80 p-3 dark:border-slate-800/80">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-fuchsia-600" />
                <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-100">Reasoning Debate</h3>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{workspace.reasoningDebate.nonObviousInsight}</p>
            </div>
            <Badge variant="secondary" className={whyNowBadge(workspace.reasoningDebate.confidence)}>
              {workspace.reasoningDebate.confidence}
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="rounded-md border border-slate-200/70 p-2 dark:border-slate-800">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Bull case</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{workspace.reasoningDebate.bullCase}</p>
            </div>
            <div className="rounded-md border border-slate-200/70 p-2 dark:border-slate-800">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Bear case</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{workspace.reasoningDebate.bearCase}</p>
            </div>
            <div className="rounded-md border border-slate-200/70 p-2 dark:border-slate-800">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Fatal assumption</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{workspace.reasoningDebate.fatalAssumption}</p>
            </div>
            <div className="rounded-md border border-slate-200/70 p-2 dark:border-slate-800">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Fastest validation</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{workspace.reasoningDebate.fastestValidationPath}</p>
            </div>
          </div>
        </section>

        <section aria-label="Evaluation Lenses" className="rounded-lg border border-slate-200/80 p-3 dark:border-slate-800/80">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-cyan-600" />
                <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-100">Evaluation Lenses</h3>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Weakest lens: {evaluationLensEntries.slice().sort((a, b) => a.score - b.score)[0]?.label ?? "none"}.
              </p>
            </div>
            <Badge variant="secondary" className="shrink-0 bg-slate-100 text-[10px] text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {evaluationLensEntries.length} lenses
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
            {evaluationLensEntries.map((lens) => (
              <div key={lens.label} className="rounded-md border border-slate-200/70 p-2 dark:border-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{lens.label}</div>
                  <Badge variant="secondary" className={`shrink-0 text-[10px] ${whyNowBadge(lens.confidence)}`}>
                    {lens.score}
                  </Badge>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{lens.signals[0]}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-amber-700 dark:text-amber-200">{lens.gaps[0]}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
          <section className="rounded-lg border border-slate-200/80 p-3 dark:border-slate-800/80">
            <div className="mb-2 flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-emerald-600" />
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-100">Evidence Graph</h3>
            </div>
            <SmallList items={workspace.claims.slice(0, 4)} tone="emerald" />
            <div className="mt-3 rounded-md bg-amber-50 p-2 dark:bg-amber-950/20">
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-3.5 w-3.5" />
                Contradictions and gaps
              </div>
              <SmallList items={workspace.contradictions.length > 0 ? workspace.contradictions : ["No contradiction warnings from current evidence."]} tone="amber" />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200/80 p-3 dark:border-slate-800/80">
            <div className="mb-2 flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-blue-600" />
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-100">Company Simulation</h3>
            </div>
            <div className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div><span className="font-semibold text-slate-800 dark:text-slate-100">Sales cycle:</span> {workspace.companySimulation.salesCycle}</div>
              <div><span className="font-semibold text-slate-800 dark:text-slate-100">CAC:</span> {workspace.companySimulation.cac}</div>
              <div><span className="font-semibold text-slate-800 dark:text-slate-100">Complexity:</span> {workspace.companySimulation.engineeringComplexity}</div>
              <div><span className="font-semibold text-slate-800 dark:text-slate-100">Compliance:</span> {workspace.companySimulation.complianceCost}</div>
            </div>
            <div className="mt-3">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Failure modes</div>
              <SmallList items={workspace.companySimulation.failureModes.slice(0, 3)} />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200/80 p-3 dark:border-slate-800/80">
            <div className="mb-2 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-purple-600" />
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-100">Experiment Plan</h3>
            </div>
            <div className="flex flex-col gap-2">
              {workspace.experiments.slice(0, 3).map((experiment) => (
                <div key={experiment.id} className="rounded-md border border-slate-200/70 p-2 dark:border-slate-800">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">{experiment.type}</div>
                  <div className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-300">{experiment.hypothesis}</div>
                  <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">Metrics: {experiment.metrics.join(", ")}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
          <section className="rounded-lg border border-red-200/80 bg-red-50/40 p-3 dark:border-red-900/60 dark:bg-red-950/20">
            <div className="mb-2 flex items-center gap-2">
              <Skull className="h-4 w-4 text-red-600" />
              <h3 className="text-xs font-semibold text-red-800 dark:text-red-200">Kill-or-continue rubric</h3>
            </div>
            <SmallList items={workspace.killCriteria.killReasons.slice(0, 4)} tone="amber" />
            <div className="mt-2 text-[11px] leading-relaxed text-red-700/80 dark:text-red-200/80">
              Fastest disconfirmation: {workspace.killCriteria.disconfirmationPath}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200/80 p-3 dark:border-slate-800/80">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-100">MVP handoff readiness</h3>
            </div>
            <div className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div><span className="font-semibold text-slate-800 dark:text-slate-100">{workspace.mvpHandoff.sourceCodeStatus}</span></div>
              <div>{workspace.mvpHandoff.deploymentPath}</div>
              <div>{workspace.mvpHandoff.testCoverage}</div>
              <div>{workspace.mvpHandoff.evidenceBacklink}</div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200/80 p-3 dark:border-slate-800/80">
            <div className="mb-2 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-blue-600" />
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-100">Trustworthy autonomy queue</h3>
            </div>
            <div className="flex flex-col gap-1.5">
              {workspace.approvals.map((approval) => (
                <div key={approval.level} className="flex items-start justify-between gap-2 rounded-md border border-slate-200/70 px-2 py-1.5 dark:border-slate-800">
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-100">{approval.level}</div>
                    <div className="text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">{approval.evidence}</div>
                  </div>
                  <Badge variant="secondary" className={`shrink-0 text-[10px] ${approvalBadge(approval.status)}`}>
                    {approval.status}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        </div>

        {onCreateFollowUpMission && (
          <div className="flex flex-col gap-2 rounded-lg border border-blue-200 bg-blue-50/70 p-3 dark:border-blue-900/70 dark:bg-blue-950/20 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-semibold text-blue-800 dark:text-blue-200">Pressure-test the venture</div>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-blue-700/80 dark:text-blue-200/80">{pressurePrompt}</p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => void onCreateFollowUpMission(pressurePrompt)}
              disabled={isCreatingFollowUp}
              className="h-8 shrink-0 gap-1.5 bg-blue-600 text-xs hover:bg-blue-700"
            >
              <FlaskConical className="h-3.5 w-3.5" />
              {isCreatingFollowUp ? "Launching..." : "Launch pressure test"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
