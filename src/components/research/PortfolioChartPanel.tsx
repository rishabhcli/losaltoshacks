import { BarChart3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type {
  VentureAutonomyAuditStatus,
  VentureAutonomySideEffect,
  VentureChartDatum,
  VentureChartTone,
  VentureChartUnit,
  VenturePortfolioChartPack,
} from "@/lib/venture-portfolio";

const DEPLOYMENT_ESCALATION_AUDIT_STATUSES: VentureAutonomyAuditStatus[] = ["proposed", "approved", "executed", "blocked", "dismissed"];
const DEPLOYMENT_ESCALATION_AUDIT_SIDE_EFFECTS: VentureAutonomySideEffect[] = ["none", "local-only", "external-proposed", "external-approved", "external-blocked"];

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function chartToneClass(tone: VentureChartTone) {
  if (tone === "emerald") return "bg-emerald-500 dark:bg-emerald-400";
  if (tone === "blue") return "bg-blue-500 dark:bg-blue-400";
  if (tone === "amber") return "bg-amber-500 dark:bg-amber-400";
  if (tone === "red") return "bg-red-500 dark:bg-red-400";
  return "bg-slate-400 dark:bg-slate-500";
}

function formatChartDatumValue(value: number, unit: VentureChartUnit) {
  if (unit === "currency-cents") return formatMoney(value);
  if (unit === "score") return `${Math.round(value)}/100`;
  if (unit === "percent") return `${Math.round(value)}%`;
  return String(Math.round(value));
}

function ChartBar({
  datum,
  drilldownLabel,
  onDrilldown,
}: {
  datum: VentureChartDatum;
  drilldownLabel?: string;
  onDrilldown?: () => void;
}) {
  const ratio = datum.maxValue > 0 ? Math.min(100, (Math.abs(datum.value) / datum.maxValue) * 100) : 0;
  const width = datum.value === 0 ? "0%" : `${Math.max(5, ratio)}%`;

  return (
    <div className="space-y-1">
      <div className="flex items-start justify-between gap-3 text-[11px]">
        <div className="min-w-0">
          <div className="truncate font-semibold text-slate-800 dark:text-slate-100">{datum.label}</div>
          <div className="line-clamp-2 leading-relaxed text-slate-500 dark:text-slate-400">{datum.detail}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="font-semibold text-slate-700 dark:text-slate-200">{formatChartDatumValue(datum.value, datum.unit)}</div>
          {onDrilldown && drilldownLabel && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onDrilldown}
              className="h-6 border-indigo-200 bg-white/80 px-2 text-[10px] text-indigo-800 hover:bg-indigo-50 dark:border-indigo-900/70 dark:bg-slate-950/70 dark:text-indigo-200"
            >
              {drilldownLabel}
            </Button>
          )}
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className={`h-full rounded-full ${chartToneClass(datum.tone)}`} style={{ width }} />
      </div>
    </div>
  );
}

export function PortfolioChartPanel({
  chartPack,
  onDeploymentEscalationStatusDrilldown,
  onDeploymentEscalationSideEffectDrilldown,
  onDeploymentEscalationActorDrilldown,
}: {
  chartPack: VenturePortfolioChartPack;
  onDeploymentEscalationStatusDrilldown?: (status: VentureAutonomyAuditStatus) => void;
  onDeploymentEscalationSideEffectDrilldown?: (sideEffect: VentureAutonomySideEffect) => void;
  onDeploymentEscalationActorDrilldown?: (actor: string) => void;
}) {
  const drilldownFor = (chartId: string, datum: VentureChartDatum) => {
    if (
      chartId === "deployment-escalation-status-chart" &&
      DEPLOYMENT_ESCALATION_AUDIT_STATUSES.includes(datum.label as VentureAutonomyAuditStatus) &&
      onDeploymentEscalationStatusDrilldown
    ) {
      return {
        label: `Drilldown ${datum.label}`,
        onClick: () => onDeploymentEscalationStatusDrilldown(datum.label as VentureAutonomyAuditStatus),
      };
    }
    if (
      chartId === "deployment-escalation-side-effect-chart" &&
      DEPLOYMENT_ESCALATION_AUDIT_SIDE_EFFECTS.includes(datum.label as VentureAutonomySideEffect) &&
      onDeploymentEscalationSideEffectDrilldown
    ) {
      return {
        label: `Drilldown ${datum.label}`,
        onClick: () => onDeploymentEscalationSideEffectDrilldown(datum.label as VentureAutonomySideEffect),
      };
    }
    if (chartId === "deployment-escalation-actor-chart" && onDeploymentEscalationActorDrilldown) {
      return {
        label: `Drilldown ${datum.label}`,
        onClick: () => onDeploymentEscalationActorDrilldown(datum.label),
      };
    }
    return null;
  };

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50/55 p-4 dark:border-indigo-900/70 dark:bg-indigo-950/20">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <BarChart3 className="h-4 w-4 text-indigo-700 dark:text-indigo-300" />
        <h2 className="text-sm font-semibold text-indigo-950 dark:text-indigo-100">Portfolio charts</h2>
        <Badge variant="secondary" className="bg-white/80 text-indigo-800 dark:bg-slate-950/70 dark:text-indigo-200">
          {chartPack.chartCount} charts
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-indigo-800 dark:bg-slate-950/70 dark:text-indigo-200">
          {chartPack.ventureCount} ventures
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {chartPack.charts.map((chart) => (
          <div key={chart.id} aria-label={`${chart.title} card`} className="rounded-md border border-indigo-200 bg-white/80 p-3 dark:border-indigo-900/70 dark:bg-slate-950/70">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-800 dark:text-indigo-200">{chart.title}</div>
            <div className="space-y-3">
              {chart.data.slice(0, 6).map((datum) => {
                const drilldown = drilldownFor(chart.id, datum);
                return (
                  <ChartBar
                    key={datum.id}
                    datum={datum}
                    drilldownLabel={drilldown?.label}
                    onDrilldown={drilldown?.onClick}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <Textarea
        aria-label="Portfolio chart markdown"
        readOnly
        value={chartPack.markdown}
        className="mt-3 min-h-[112px] resize-y bg-white/80 font-mono text-[11px] dark:bg-slate-950/70"
      />
    </div>
  );
}
