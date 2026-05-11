import { useState, useCallback, useMemo } from "react";
import { AlertTriangle, BarChart3, CheckCircle2, Copy, ExternalLink, Gauge, Globe, Lightbulb, Search, ShieldAlert, ShieldCheck, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { scoreEvidenceQuality } from "@/lib/evidence-quality";
import { buildFollowUpResearchPrompt } from "@/lib/followup-research";
import { scoreFinalOptions, type OpportunityScoreBreakdown } from "@/lib/opportunity-scoring";
import type { FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";
import { useTheme } from "@/lib/theme";

interface Props {
  finalOptions: FinalOptionsPayload;
  isCreatingFollowUp?: boolean;
  onCreateFollowUpMission?: (prompt: string) => void | Promise<void>;
}

function scoreTone(score: number) {
  if (score >= 75) return "text-emerald-700 dark:text-emerald-300";
  if (score >= 60) return "text-blue-700 dark:text-blue-300";
  if (score >= 45) return "text-amber-700 dark:text-amber-300";
  return "text-red-700 dark:text-red-300";
}

function scoreBadgeClass(score: number) {
  if (score >= 75) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (score >= 60) return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (score >= 45) return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
}

function ScoreMetric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Gauge }) {
  return (
    <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800/80 dark:bg-slate-950/70">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className={`mt-1 text-lg font-semibold ${scoreTone(value)}`}>{value}</div>
    </div>
  );
}

function OptionRankRow({ score, index }: { score: OpportunityScoreBreakdown; index: number }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200/80 px-3 py-2 dark:border-slate-800/80">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500 dark:bg-slate-900 dark:text-slate-300">
        {index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{score.title}</div>
        <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
          {score.evidenceCount} evidence source{score.evidenceCount === 1 ? "" : "s"} | {score.coveredPlatforms.length} channel{score.coveredPlatforms.length === 1 ? "" : "s"}
        </div>
      </div>
      <div className={`text-sm font-semibold ${scoreTone(score.opportunityScore)}`}>{score.opportunityScore}</div>
    </div>
  );
}

export function FinalOptionsPanel({ finalOptions, isCreatingFollowUp = false, onCreateFollowUpMission }: Props) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { marketResearch, options, primaryOptionId, implementationPlan, lovableHandoff, coverage } = finalOptions;
  const scorecard = useMemo(() => scoreFinalOptions(finalOptions), [finalOptions]);
  const primaryScore = scorecard.primary;
  const followUpPrompt = useMemo(() => buildFollowUpResearchPrompt(finalOptions), [finalOptions]);
  const primaryOption = options.find((o) => o.id === primaryOptionId) ?? options[0];
  const allEvidence = useMemo(() => {
    const byUrl = new Map<string, FinalOptionsPayload["options"][number]["evidence"][number]>();
    for (const option of options) {
      for (const evidence of option.evidence) {
        if (!evidence.url) continue;
        byUrl.set(evidence.url, evidence);
      }
    }
    return Array.from(byUrl.values());
  }, [options]);
  const hasEvidence = allEvidence.length > 0;

  const handleCopyPrompt = useCallback(() => {
    if (!lovableHandoff.prompt) return;
    navigator.clipboard.writeText(lovableHandoff.prompt).then(() => {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    });
  }, [lovableHandoff.prompt]);

  const handleCreateFollowUp = useCallback(() => {
    void onCreateFollowUpMission?.(followUpPrompt);
  }, [followUpPrompt, onCreateFollowUpMission]);

  return (
    <div className="space-y-4">
      <Card className={isDark ? "border-slate-800/80 bg-slate-950/90" : "border-slate-200 bg-white"}>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                {hasEvidence ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Source Evidence</h3>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                {hasEvidence
                  ? `${allEvidence.length} source${allEvidence.length === 1 ? "" : "s"} support ${primaryOption?.title ?? "the recommended opportunity"}.`
                  : "This result has no attached source evidence yet. Treat it as a draft, not a decision-ready result."}
              </p>
            </div>
            <Badge
              variant="secondary"
              className={hasEvidence ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"}
            >
              {hasEvidence ? "Evidence-backed" : "Low evidence"}
            </Badge>
          </div>

          {hasEvidence && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              {allEvidence.slice(0, 6).map((evidence) => {
                const quality = scoreEvidenceQuality(evidence);
                return (
                  <a
                    key={`${evidence.platform}-${evidence.url}`}
                    href={evidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/70 p-3 transition-colors hover:border-blue-200 hover:bg-blue-50/60 dark:hover:border-blue-800/80 dark:hover:bg-blue-950/25"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {evidence.platform || "web"}
                      </Badge>
                      <Badge variant="secondary" className={scoreBadgeClass(quality.score)}>
                        Evidence quality {quality.score}
                      </Badge>
                      <ExternalLink className="ml-auto h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-2">
                      {evidence.title || evidence.keywords || evidence.url}
                    </div>
                    {evidence.summary && (
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-300 line-clamp-2">
                        {evidence.summary}
                      </p>
                    )}
                    <div className="mt-2 space-y-1">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{quality.reasons[1]}</p>
                      {quality.warnings[0] ? (
                        <p className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-300">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          {quality.warnings[0]}
                        </p>
                      ) : null}
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className={isDark ? "border-slate-800/80 bg-slate-950/90" : "border-slate-200 bg-white"}>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Opportunity Scorecard</h3>
                <Badge variant="secondary" className={scoreBadgeClass(primaryScore.opportunityScore)}>
                  {primaryScore.label}
                </Badge>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                Deterministic ranking from attached evidence, source diversity, missing channels, execution load, and risk pressure.
              </p>
            </div>
            <div className="w-full lg:w-[260px]">
              <div
                aria-label={`Opportunity score ${primaryScore.opportunityScore}`}
                className={`text-3xl font-semibold leading-none ${scoreTone(primaryScore.opportunityScore)}`}
              >
                {primaryScore.opportunityScore}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">opportunity score</div>
              <Progress value={primaryScore.opportunityScore} className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-5">
            <ScoreMetric label="Confidence" value={primaryScore.confidenceScore} icon={Gauge} />
            <ScoreMetric label="Timing" value={primaryScore.marketTimingScore} icon={BarChart3} />
            <ScoreMetric label="Diversity" value={primaryScore.evidenceDiversityScore} icon={ShieldCheck} />
            <ScoreMetric label="Difficulty" value={primaryScore.executionDifficultyScore} icon={Target} />
            <ScoreMetric label="Risk" value={primaryScore.riskScore} icon={ShieldAlert} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_1.1fr]">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Score Drivers</div>
              <div className="mt-2 space-y-1.5">
                {primaryScore.drivers.map((driver) => (
                  <div key={driver} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Warnings</div>
              <div className="mt-2 space-y-1.5">
                {primaryScore.warnings.length > 0 ? primaryScore.warnings.map((warning) => (
                  <div key={warning} className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{warning}</span>
                  </div>
                )) : (
                  <div className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>No scoring warnings from current evidence.</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Ranked Options</div>
              <div className="mt-2 space-y-2">
                {scorecard.rankedOptions.map((score, index) => (
                  <OptionRankRow key={score.optionId} score={score} index={index} />
                ))}
              </div>
            </div>
          </div>

          {onCreateFollowUpMission && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50/70 p-3 dark:border-blue-900/70 dark:bg-blue-950/20">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-blue-800 dark:text-blue-200">Follow-up research</div>
                  <p className="mt-1 text-xs leading-relaxed text-blue-700/80 dark:text-blue-200/80">
                    Launch a targeted mission to fill the missing source coverage and pressure-test this score.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreateFollowUp}
                  disabled={isCreatingFollowUp}
                  className="h-8 shrink-0 gap-1.5 bg-blue-600 text-xs hover:bg-blue-700"
                >
                  <Search className="h-3.5 w-3.5" />
                  {isCreatingFollowUp ? "Launching..." : "Research Evidence Gap"}
                </Button>
              </div>
              <p className="mt-2 line-clamp-2 text-[11px] text-blue-700/70 dark:text-blue-200/70">
                {followUpPrompt}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Research Summary */}
      {marketResearch.summary && (
        <Card className={isDark ? "border-blue-800/80 bg-slate-950/95" : "border-blue-200 bg-blue-50/30"}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Market Research Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{marketResearch.summary}</p>
            {marketResearch.signals.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {marketResearch.signals.map((signal, i) => (
                  <Badge key={i} variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {signal}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => {
          const isPrimary = option.id === primaryOptionId;
          return (
            <Card
              key={option.id}
              className={
                isPrimary
                  ? (isDark
                    ? "border-green-800 bg-slate-950/95 ring-1 ring-green-800/80"
                    : "border-green-300 bg-green-50/30 ring-1 ring-green-200")
                  : (isDark
                    ? "border-slate-800/80 bg-slate-950/90"
                    : "border-slate-200 bg-white")
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  {isPrimary && <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />}
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{option.title}</div>
                    {isPrimary && <Badge className="mt-1 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-0">Recommended</Badge>}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">{option.concept}</p>
                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div><span className="font-medium text-slate-600 dark:text-slate-200">Audience:</span> {option.audience}</div>
                  <div><span className="font-medium text-slate-600 dark:text-slate-200">Format:</span> {option.recommendedFormat}</div>
                </div>
                {option.evidence.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-300 uppercase tracking-wider">Evidence ({option.evidence.length})</span>
                  </div>
                )}
                {option.evidence.length === 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-amber-600 dark:text-amber-300 uppercase tracking-wider">Evidence missing</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Implementation Plan */}
      {implementationPlan.title && (
        <Card className={isDark ? "border-slate-800/80 bg-slate-950/90" : "border-slate-200 bg-white"}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Implementation Plan: {implementationPlan.title}
            </CardTitle>
            {implementationPlan.oneLiner && (
              <p className="text-xs text-slate-500 dark:text-slate-400">{implementationPlan.oneLiner}</p>
            )}
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {implementationPlan.screens.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-200 mb-1">Screens</div>
                <div className="grid grid-cols-2 gap-2">
                  {implementationPlan.screens.map((s, i) => (
                    <div key={i} className="rounded border border-slate-100 dark:border-slate-800/70 p-2 bg-transparent dark:bg-slate-950/65">
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-100">{s.name}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">{s.purpose}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {implementationPlan.successMetrics.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-200 mb-1">Success Metrics</div>
                <ul className="space-y-0.5">
                  {implementationPlan.successMetrics.map((m, i) => (
                    <li key={i} className="text-xs text-slate-500 dark:text-slate-300 flex items-start gap-1.5">
                      <span className="text-slate-400 dark:text-slate-500 mt-0.5">&bull;</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lovable Handoff */}
      {lovableHandoff.prompt && (
        <Card className={isDark ? "border-purple-800/80 bg-slate-950/95" : "border-purple-200 bg-purple-50/30"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800 dark:text-purple-300">Build with Lovable</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyPrompt}
                  className="h-7 text-xs text-purple-600 gap-1.5"
                >
                  <Copy className="w-3 h-3" />
                  {copiedPrompt ? "Copied!" : "Copy Prompt"}
                </Button>
                {coverage.readyForLovable && lovableHandoff.launchUrl && (
                  <Button asChild size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700 gap-1.5">
                    <a href={lovableHandoff.launchUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3" />
                      Launch
                    </a>
                  </Button>
                )}
              </div>
            </div>
            {!coverage.readyForLovable && coverage.missingPlatforms.length > 0 && (
              <div className="text-xs text-purple-500 dark:text-purple-300">
                Waiting for: {coverage.missingPlatforms.join(", ")}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
