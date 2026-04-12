import { useState, useCallback } from "react";
import { CheckCircle2, Copy, ExternalLink, Globe, Lightbulb, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FinalOptionsPayload } from "@/hooks/useMasterBuildDashboard";

interface Props {
  finalOptions: FinalOptionsPayload;
}

export function FinalOptionsPanel({ finalOptions }: Props) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const { marketResearch, options, primaryOptionId, implementationPlan, lovableHandoff, coverage } = finalOptions;
  const primaryOption = options.find((o) => o.id === primaryOptionId) ?? options[0];

  const handleCopyPrompt = useCallback(() => {
    if (!lovableHandoff.prompt) return;
    navigator.clipboard.writeText(lovableHandoff.prompt).then(() => {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    });
  }, [lovableHandoff.prompt]);

  return (
    <div className="space-y-4">
      {/* Market Research Summary */}
      {marketResearch.summary && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Market Research Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-slate-700 leading-relaxed">{marketResearch.summary}</p>
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
              className={`${isPrimary ? "border-green-300 dark:border-green-800 bg-green-50/30 dark:bg-green-900/30 ring-1 ring-green-200 dark:ring-green-800" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  {isPrimary && <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />}
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{option.title}</div>
                    {isPrimary && <Badge className="mt-1 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-0">Recommended</Badge>}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{option.concept}</p>
                <div className="space-y-1 text-xs text-slate-500">
                  <div><span className="font-medium text-slate-600">Audience:</span> {option.audience}</div>
                  <div><span className="font-medium text-slate-600">Format:</span> {option.recommendedFormat}</div>
                </div>
                {option.evidence.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Evidence ({option.evidence.length})</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Implementation Plan */}
      {implementationPlan.title && (
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Implementation Plan: {implementationPlan.title}
            </CardTitle>
            {implementationPlan.oneLiner && (
              <p className="text-xs text-slate-500">{implementationPlan.oneLiner}</p>
            )}
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {implementationPlan.screens.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-slate-600 mb-1">Screens</div>
                <div className="grid grid-cols-2 gap-2">
                  {implementationPlan.screens.map((s, i) => (
                    <div key={i} className="rounded border border-slate-100 dark:border-slate-700 p-2">
                      <div className="text-xs font-medium text-slate-700">{s.name}</div>
                      <div className="text-[11px] text-slate-400">{s.purpose}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {implementationPlan.successMetrics.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-slate-600 mb-1">Success Metrics</div>
                <ul className="space-y-0.5">
                  {implementationPlan.successMetrics.map((m, i) => (
                    <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                      <span className="text-slate-400 mt-0.5">&bull;</span>
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
        <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-900/30">
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
              <div className="text-xs text-purple-500">
                Waiting for: {coverage.missingPlatforms.join(", ")}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
