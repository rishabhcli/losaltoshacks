import { BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type VentureChannelEconomicsCandidate,
  type VentureChannelEconomicsRecord,
} from "@/lib/venture-portfolio";

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function ChannelEconomicsCacPanel({
  channelEconomicsCount,
  channelEconomicsCandidateCount,
  latestChannelEconomics,
  firstChannelEconomicsCandidate,
  channelDraft,
  channelOwnerDraft,
  channelSpendDraft,
  channelImpressionsDraft,
  channelClicksDraft,
  channelSignupDraft,
  channelActivatedDraft,
  channelPaidDraft,
  channelRevenueDraft,
  channelEvidenceDraft,
  channelNextActionDraft,
  canSaveChannelEconomics,
  onChannelDraftChange,
  onChannelOwnerDraftChange,
  onChannelSpendDraftChange,
  onChannelImpressionsDraftChange,
  onChannelClicksDraftChange,
  onChannelSignupDraftChange,
  onChannelActivatedDraftChange,
  onChannelPaidDraftChange,
  onChannelRevenueDraftChange,
  onChannelEvidenceDraftChange,
  onChannelNextActionDraftChange,
  onSaveChannelEconomics,
}: {
  channelEconomicsCount: number;
  channelEconomicsCandidateCount: number;
  latestChannelEconomics?: VentureChannelEconomicsRecord;
  firstChannelEconomicsCandidate?: VentureChannelEconomicsCandidate;
  channelDraft: string;
  channelOwnerDraft: string;
  channelSpendDraft: string;
  channelImpressionsDraft: string;
  channelClicksDraft: string;
  channelSignupDraft: string;
  channelActivatedDraft: string;
  channelPaidDraft: string;
  channelRevenueDraft: string;
  channelEvidenceDraft: string;
  channelNextActionDraft: string;
  canSaveChannelEconomics: boolean;
  onChannelDraftChange: (value: string) => void;
  onChannelOwnerDraftChange: (value: string) => void;
  onChannelSpendDraftChange: (value: string) => void;
  onChannelImpressionsDraftChange: (value: string) => void;
  onChannelClicksDraftChange: (value: string) => void;
  onChannelSignupDraftChange: (value: string) => void;
  onChannelActivatedDraftChange: (value: string) => void;
  onChannelPaidDraftChange: (value: string) => void;
  onChannelRevenueDraftChange: (value: string) => void;
  onChannelEvidenceDraftChange: (value: string) => void;
  onChannelNextActionDraftChange: (value: string) => void;
  onSaveChannelEconomics: () => void;
}) {
  return (
    <div className="rounded-lg border border-fuchsia-200 bg-fuchsia-50/60 p-3 dark:border-fuchsia-900/70 dark:bg-fuchsia-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <BarChart3 className="h-4 w-4 text-fuchsia-700 dark:text-fuchsia-300" />
        <h3 className="text-xs font-semibold text-fuchsia-900 dark:text-fuchsia-100">Channel economics and CAC</h3>
        <Badge variant="secondary" className="bg-white/80 text-fuchsia-800 dark:bg-slate-950/70 dark:text-fuchsia-200">
          {channelEconomicsCount} channel record{channelEconomicsCount === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/80 text-fuchsia-800 dark:bg-slate-950/70 dark:text-fuchsia-200">
          {channelEconomicsCandidateCount} inbox signal{channelEconomicsCandidateCount === 1 ? "" : "s"}
        </Badge>
      </div>
      {latestChannelEconomics ? (
        <div className="mt-2 rounded-md border border-fuchsia-200 bg-white/75 p-2 dark:border-fuchsia-900/70 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-fuchsia-800 dark:text-fuchsia-200">Latest channel economics</span>
            <Badge variant="secondary" className="bg-white/80 text-fuchsia-800 dark:bg-slate-950/70 dark:text-fuchsia-200">
              {latestChannelEconomics.paybackStatus}
            </Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              CAC {formatMoney(latestChannelEconomics.cacCents)}
            </Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{latestChannelEconomics.channel}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            Spend {formatMoney(latestChannelEconomics.spendCents)}; {latestChannelEconomics.signupCount} signups; {latestChannelEconomics.activatedCount} activated; {latestChannelEconomics.paidCount} paid; revenue {formatMoney(latestChannelEconomics.revenueCents)}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Cost per signup: {formatMoney(latestChannelEconomics.costPerSignupCents)}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Owner: {latestChannelEconomics.owner}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Evidence: {latestChannelEconomics.evidence}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Next: {latestChannelEconomics.nextAction}</p>
        </div>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-fuchsia-800/70 dark:text-fuchsia-200/70">
          No channel economics record has been saved yet.
        </p>
      )}
      {firstChannelEconomicsCandidate && (
        <div className="mt-2 rounded-md border border-fuchsia-200 bg-white/75 p-2 dark:border-fuchsia-900/70 dark:bg-slate-950/60">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-fuchsia-800 dark:text-fuchsia-200">Channel economics candidate</div>
          <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{firstChannelEconomicsCandidate.channel}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            Suggested: {formatMoney(firstChannelEconomicsCandidate.spendCents)} spend; {firstChannelEconomicsCandidate.signupCount} signups; {firstChannelEconomicsCandidate.paidCount} paid
          </p>
        </div>
      )}
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
        <Input value={channelDraft} onChange={(event) => onChannelDraftChange(event.target.value)} placeholder="Channel" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={channelOwnerDraft} onChange={(event) => onChannelOwnerDraftChange(event.target.value)} placeholder="Channel owner" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={channelSpendDraft} onChange={(event) => onChannelSpendDraftChange(event.target.value)} placeholder="Channel spend" className="bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-6">
        <Input value={channelImpressionsDraft} onChange={(event) => onChannelImpressionsDraftChange(event.target.value)} placeholder="Impressions" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={channelClicksDraft} onChange={(event) => onChannelClicksDraftChange(event.target.value)} placeholder="Clicks" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={channelSignupDraft} onChange={(event) => onChannelSignupDraftChange(event.target.value)} placeholder="Channel signups" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={channelActivatedDraft} onChange={(event) => onChannelActivatedDraftChange(event.target.value)} placeholder="Channel activated" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={channelPaidDraft} onChange={(event) => onChannelPaidDraftChange(event.target.value)} placeholder="Channel paid users" className="bg-white/80 text-xs dark:bg-slate-950/70" />
        <Input value={channelRevenueDraft} onChange={(event) => onChannelRevenueDraftChange(event.target.value)} placeholder="Channel revenue" className="bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Textarea value={channelEvidenceDraft} onChange={(event) => onChannelEvidenceDraftChange(event.target.value)} placeholder="Channel evidence" className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
        <Textarea value={channelNextActionDraft} onChange={(event) => onChannelNextActionDraftChange(event.target.value)} placeholder="Channel next action" className="min-h-[64px] resize-none bg-white/80 text-xs dark:bg-slate-950/70" />
      </div>
      <Button type="button" size="sm" onClick={onSaveChannelEconomics} disabled={!canSaveChannelEconomics} className="mt-2 h-8 self-start bg-fuchsia-700 text-xs text-white hover:bg-fuchsia-800">
        Save channel economics
      </Button>
    </div>
  );
}
