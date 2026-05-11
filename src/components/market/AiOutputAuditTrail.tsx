import { ClipboardCheck, Database, Hash, MessageSquareText, ShieldAlert, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { AiOutputAuditTrail as AiOutputAuditTrailModel } from "@/lib/ai-output-audit";

interface Props {
  audit: AiOutputAuditTrailModel;
}

export function AiOutputAuditTrail({ audit }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/75 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950/40" aria-label="AI Output Audit Trail">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Output Audit Trail</h2>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            How this {audit.artifactLabel.toLowerCase()} was assembled, which inputs it cites, and what still needs review.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
          <Sparkles className="h-3.5 w-3.5" />
          {audit.modeLabel}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AuditMetric icon={<MessageSquareText className="h-3.5 w-3.5" />} label="Prompt Summary" value={audit.promptSummary} />
        <AuditMetric icon={<Database className="h-3.5 w-3.5" />} label="Source Inputs" value={audit.sourceInputLabel} detail={audit.inputSummary} />
        <AuditMetric icon={<Hash className="h-3.5 w-3.5" />} label="Token Estimate" value={audit.tokenEstimateLabel} detail={audit.modelLabel} />
        <AuditMetric icon={<ShieldAlert className="h-3.5 w-3.5" />} label="Uncertainty" value={audit.uncertaintyLabel} detail={`Generated ${audit.generatedAtLabel}`} />
      </div>

      {audit.warnings.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {audit.warnings.map((warning) => (
            <span key={warning} className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              <ShieldAlert className="h-3.5 w-3.5" />
              {warning}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function AuditMetric({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      {detail && <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{detail}</p>}
    </div>
  );
}
