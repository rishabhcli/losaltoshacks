import { DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  VENTURE_MONEY_SIGNAL_STATUS_OPTIONS,
  VENTURE_MONEY_SIGNAL_TYPE_OPTIONS,
  type VentureAutonomyApprovalLevel,
  type VentureMoneySignalRecord,
  type VentureMoneySignalStatus,
  type VentureMoneySignalType,
} from "@/lib/venture-portfolio";

function moneySignalStatusBadge(status: VentureMoneySignalStatus) {
  if (status === "received") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "committed") return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
  if (status === "spent" || status === "refunded") return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function moneySignalStatusLabel(status: VentureMoneySignalStatus) {
  return VENTURE_MONEY_SIGNAL_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function moneySignalTypeLabel(type: VentureMoneySignalType) {
  return VENTURE_MONEY_SIGNAL_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}

function moneySignalApprovalLevel(signal: VentureMoneySignalRecord): VentureAutonomyApprovalLevel {
  return signal.approvalLevel ?? (signal.type === "expense" ? "human-approved-spend" : "human-approved-billing-change");
}

function moneySignalApprovalState(signal: VentureMoneySignalRecord) {
  if (signal.approvalState) return signal.approvalState;
  if (signal.status === "blocked") return "blocked-before-external-action";
  if (signal.status === "received" || signal.status === "spent" || signal.status === "refunded") return "record-only";
  return "approval-required";
}

function moneySignalExternalActionState(signal: VentureMoneySignalRecord) {
  if (signal.externalActionState) return signal.externalActionState;
  if (signal.type === "expense" || signal.status === "spent") return "no-app-spend";
  if (signal.type === "refund" || signal.status === "refunded") return "no-app-refund";
  return "no-app-charge";
}

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function RevenueCostLedgerPanel({
  moneySignalCount,
  latestMoneySignal,
  spendGatedMoneySignalCount,
  billingGatedMoneySignalCount,
  moneyType,
  moneyStatus,
  moneyAmountDraft,
  moneyCurrencyDraft,
  moneySourceDraft,
  moneyOwnerDraft,
  moneyEvidenceDraft,
  moneyNotesDraft,
  canSaveMoneySignal,
  onMoneyTypeChange,
  onMoneyStatusChange,
  onMoneyAmountDraftChange,
  onMoneyCurrencyDraftChange,
  onMoneySourceDraftChange,
  onMoneyOwnerDraftChange,
  onMoneyEvidenceDraftChange,
  onMoneyNotesDraftChange,
  onSaveMoneySignal,
}: {
  moneySignalCount: number;
  latestMoneySignal?: VentureMoneySignalRecord;
  spendGatedMoneySignalCount: number;
  billingGatedMoneySignalCount: number;
  moneyType: VentureMoneySignalType;
  moneyStatus: VentureMoneySignalStatus;
  moneyAmountDraft: string;
  moneyCurrencyDraft: string;
  moneySourceDraft: string;
  moneyOwnerDraft: string;
  moneyEvidenceDraft: string;
  moneyNotesDraft: string;
  canSaveMoneySignal: boolean;
  onMoneyTypeChange: (value: VentureMoneySignalType) => void;
  onMoneyStatusChange: (value: VentureMoneySignalStatus) => void;
  onMoneyAmountDraftChange: (value: string) => void;
  onMoneyCurrencyDraftChange: (value: string) => void;
  onMoneySourceDraftChange: (value: string) => void;
  onMoneyOwnerDraftChange: (value: string) => void;
  onMoneyEvidenceDraftChange: (value: string) => void;
  onMoneyNotesDraftChange: (value: string) => void;
  onSaveMoneySignal: () => void;
}) {
  return (
    <div className="rounded-lg border border-lime-200 bg-lime-50/60 p-3 dark:border-lime-900/70 dark:bg-lime-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <DollarSign className="h-4 w-4 text-lime-700 dark:text-lime-300" />
        <h3 className="text-xs font-semibold text-lime-900 dark:text-lime-100">Revenue and cost ledger</h3>
        <Badge variant="secondary" className="bg-white/80 text-lime-800 dark:bg-slate-950/70 dark:text-lime-200">
          {moneySignalCount} signal{moneySignalCount === 1 ? "" : "s"}
        </Badge>
        {latestMoneySignal && (
          <Badge variant="secondary" className={moneySignalStatusBadge(latestMoneySignal.status)}>
            {moneySignalStatusLabel(latestMoneySignal.status)}
          </Badge>
        )}
        {spendGatedMoneySignalCount > 0 && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
            {spendGatedMoneySignalCount} spend-gated
          </Badge>
        )}
        {billingGatedMoneySignalCount > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            {billingGatedMoneySignalCount} billing-gated
          </Badge>
        )}
      </div>
      {latestMoneySignal ? (
        <div className="mt-2 rounded-md border border-lime-200 bg-white/75 p-2 dark:border-lime-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-lime-800 dark:text-lime-200">Latest money signal</span>
            <Badge variant="secondary" className={moneySignalStatusBadge(latestMoneySignal.status)}>
              {moneySignalStatusLabel(latestMoneySignal.status)}
            </Badge>
            <Badge variant="secondary" className="bg-white/80 text-lime-800 dark:bg-slate-950/70 dark:text-lime-200">
              {moneySignalTypeLabel(latestMoneySignal.type)}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">
            {formatMoney(latestMoneySignal.amountCents, latestMoneySignal.currency)} from {latestMoneySignal.source}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Owner: {latestMoneySignal.owner}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Evidence: {latestMoneySignal.evidence}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Notes: {latestMoneySignal.notes}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            External billing: {latestMoneySignal.externalBillingStatus}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            Approval: {moneySignalApprovalLevel(latestMoneySignal)}; state: {moneySignalApprovalState(latestMoneySignal)}; external action: {moneySignalExternalActionState(latestMoneySignal)}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            Next: {latestMoneySignal.approvalNextAction ?? "Require human approval before any external spend or billing side effect."}
          </p>
        </div>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-lime-800/70 dark:text-lime-200/70">
          No money signal has been recorded yet.
        </p>
      )}
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[1fr_120px_150px_150px]">
        <Input
          value={moneySourceDraft}
          onChange={(event) => onMoneySourceDraftChange(event.target.value)}
          placeholder="Money source"
          className="bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Input
          value={moneyAmountDraft}
          onChange={(event) => onMoneyAmountDraftChange(event.target.value)}
          placeholder="Amount"
          inputMode="decimal"
          className="bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Select value={moneyType} onValueChange={(value) => onMoneyTypeChange(value as VentureMoneySignalType)}>
          <SelectTrigger
            aria-label="Money signal type"
            size="sm"
            className="w-full border-lime-200 bg-white/80 text-xs dark:border-lime-900/70 dark:bg-slate-950/70"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VENTURE_MONEY_SIGNAL_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={moneyStatus} onValueChange={(value) => onMoneyStatusChange(value as VentureMoneySignalStatus)}>
          <SelectTrigger
            aria-label="Money signal status"
            size="sm"
            className="w-full border-lime-200 bg-white/80 text-xs dark:border-lime-900/70 dark:bg-slate-950/70"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VENTURE_MONEY_SIGNAL_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Input
          value={moneyCurrencyDraft}
          onChange={(event) => onMoneyCurrencyDraftChange(event.target.value)}
          placeholder="Currency"
          className="bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Input
          value={moneyOwnerDraft}
          onChange={(event) => onMoneyOwnerDraftChange(event.target.value)}
          placeholder="Money owner"
          className="bg-white/80 text-xs dark:bg-slate-950/70"
        />
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Textarea
          value={moneyEvidenceDraft}
          onChange={(event) => onMoneyEvidenceDraftChange(event.target.value)}
          placeholder="Record money evidence..."
          className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
        <Textarea
          value={moneyNotesDraft}
          onChange={(event) => onMoneyNotesDraftChange(event.target.value)}
          placeholder="Record finance notes..."
          className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70"
        />
      </div>
      <Button
        type="button"
        size="sm"
        onClick={onSaveMoneySignal}
        disabled={!canSaveMoneySignal}
        className="mt-2 h-8 self-start bg-lime-700 text-xs text-white hover:bg-lime-800"
      >
        Save money signal
      </Button>
    </div>
  );
}
