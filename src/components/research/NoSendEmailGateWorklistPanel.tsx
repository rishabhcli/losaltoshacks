import { useState } from "react";
import { MailCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  VentureNoSendEmailGateReplyProofInput,
  VentureNoSendEmailGateReplyProofType,
  VentureNoSendEmailGateStatus,
  VentureNoSendEmailGateWorkItem,
} from "@/lib/venture-portfolio";

function noSendEmailGateStatusBadge(status: VentureNoSendEmailGateStatus) {
  if (status === "draft-ready") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "blocked") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
}

type NoSendReplyProofDraft = {
  proofType: VentureNoSendEmailGateReplyProofType;
  redactedReplyNote: string;
  consentEvidence: string;
  qualifiedBuyerCount: string;
  paidCommitmentCount: string;
  invoiceRequestCount: string;
  acceptedPrice: string;
  riskTitle: string;
  signupCount: string;
  activatedCount: string;
  retainedCount: string;
  paidCount: string;
  nextAction: string;
};

function defaultNoSendReplyProofDraft(): NoSendReplyProofDraft {
  return {
    proofType: "customer-interview",
    redactedReplyNote: "",
    consentEvidence: "",
    qualifiedBuyerCount: "1",
    paidCommitmentCount: "0",
    invoiceRequestCount: "0",
    acceptedPrice: "",
    riskTitle: "",
    signupCount: "0",
    activatedCount: "0",
    retainedCount: "0",
    paidCount: "0",
    nextAction: "",
  };
}

function numericDraftValue(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function NoSendEmailGateWorklistPanel({
  items,
  onRecordReplyProof,
}: {
  items: VentureNoSendEmailGateWorkItem[];
  onRecordReplyProof: (ventureId: string, input: VentureNoSendEmailGateReplyProofInput) => boolean;
}) {
  const [replyProofDrafts, setReplyProofDrafts] = useState<Record<string, NoSendReplyProofDraft>>({});
  if (items.length === 0) return null;
  const draftReadyCount = items.filter((item) => item.status === "draft-ready").length;
  const needsGateCount = items.filter((item) => item.status === "needs-pilot-gate").length;
  const blockedCount = items.filter((item) => item.status === "blocked").length;
  const updateReplyProofDraft = (itemId: string, patch: Partial<NoSendReplyProofDraft>) => {
    setReplyProofDrafts((current) => ({
      ...current,
      [itemId]: {
        ...defaultNoSendReplyProofDraft(),
        ...current[itemId],
        ...patch,
      },
    }));
  };
  const submitReplyProof = (item: VentureNoSendEmailGateWorkItem, draft: NoSendReplyProofDraft) => {
    const saved = onRecordReplyProof(item.ventureId, {
      workItemId: item.id,
      proofType: draft.proofType,
      owner: item.owner,
      redactedReplyNote: draft.redactedReplyNote,
      consentEvidence: draft.consentEvidence,
      qualifiedBuyerCount: numericDraftValue(draft.qualifiedBuyerCount),
      paidCommitmentCount: numericDraftValue(draft.paidCommitmentCount),
      invoiceRequestCount: numericDraftValue(draft.invoiceRequestCount),
      acceptedPrice: draft.acceptedPrice,
      riskTitle: draft.riskTitle,
      riskMitigation: draft.nextAction,
      signupCount: numericDraftValue(draft.signupCount),
      activatedCount: numericDraftValue(draft.activatedCount),
      retainedCount: numericDraftValue(draft.retainedCount),
      paidCount: numericDraftValue(draft.paidCount),
      nextAction: draft.nextAction,
    });
    if (saved) {
      setReplyProofDrafts((current) => ({
        ...current,
        [item.id]: defaultNoSendReplyProofDraft(),
      }));
    }
  };

  return (
    <div
      aria-label="No-send email gate worklist"
      className="rounded-lg border border-sky-200 bg-sky-50/75 p-4 dark:border-sky-900/70 dark:bg-sky-950/20"
    >
      <div className="flex flex-wrap items-center gap-2">
        <MailCheck className="h-4 w-4 text-sky-700 dark:text-sky-300" />
        <h2 className="text-sm font-semibold text-sky-950 dark:text-sky-100">No-send email gate worklist</h2>
        <Badge variant="secondary" className="bg-white/80 text-sky-800 dark:bg-slate-950/70 dark:text-sky-200">
          {items.length} draft gate{items.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="bg-white/60 text-sky-700 dark:bg-slate-950/60 dark:text-sky-300">
          Draft only - do not send
        </Badge>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Email gate work items transform ready pilot signal gates into internal draft packets with recipient placeholders, review checklists, and replay commands. They do not send email, store real recipients, deploy, spend, track, or change billing.
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
        Redacted replies can become interview, pricing, risk, or activation proof only after raw email and phone text is removed.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {draftReadyCount > 0 && (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {draftReadyCount} draft-ready
          </Badge>
        )}
        {needsGateCount > 0 && (
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            {needsGateCount} needs-pilot-gate
          </Badge>
        )}
        {blockedCount > 0 && (
          <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {blockedCount} blocked
          </Badge>
        )}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {items.slice(0, 6).map((item) => (
          <div key={item.id} className="rounded-md border border-sky-200 bg-white/80 p-3 dark:border-sky-900/70 dark:bg-slate-950/60">
            {(() => {
              const draft = replyProofDrafts[item.id] ?? defaultNoSendReplyProofDraft();
              return (
                <>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className={noSendEmailGateStatusBadge(item.status)}>
                      {item.status}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/80 text-sky-800 dark:bg-slate-950/70 dark:text-sky-200">
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{item.ventureTitle}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Owner: {item.owner}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-sky-800 dark:text-sky-200">Subject: {item.draftSubject}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Recipients: {item.recipientPlaceholders.join("; ")}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Replay: {item.replayCommand}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-red-800 dark:text-red-200">No-send boundary: {item.noSendBoundary}</p>
                  <div className="mt-2 rounded-md border border-sky-100 bg-sky-50/60 p-2 dark:border-sky-900/60 dark:bg-sky-950/25">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className="bg-white/80 text-sky-800 dark:bg-slate-950/70 dark:text-sky-200">
                        {item.replyProofReceiptCount} reply receipt{item.replyProofReceiptCount === 1 ? "" : "s"}
                      </Badge>
                      {item.replyProofTypesRecorded.map((proofType) => (
                        <Badge key={proofType} variant="secondary" className="bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-200">
                          {proofType}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{item.replyProofDedupeHint}</p>
                    {item.replyProofReceipts.length > 0 && (
                      <div className="mt-2 space-y-1.5" aria-label={`No-send reply proof receipts ${item.ventureTitle}`}>
                        {item.replyProofReceipts.slice(0, 4).map((receipt) => (
                          <div key={receipt.id} className="rounded border border-white/80 bg-white/80 p-2 dark:border-slate-800 dark:bg-slate-950/70">
                            <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">{receipt.sourceLabel}</p>
                            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{receipt.proofMetric}</p>
                            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{receipt.redactedReplyNote}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">Next action: {item.nextAction}</p>
                  {item.status === "draft-ready" && (
                    <div
                      aria-label={`No-send reply proof capture ${item.ventureTitle}`}
                      className="mt-3 rounded-md border border-sky-100 bg-sky-50/60 p-2 dark:border-sky-900/60 dark:bg-sky-950/25"
                    >
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[170px_1fr]">
                        <Select
                          value={draft.proofType}
                          onValueChange={(value) => updateReplyProofDraft(item.id, { proofType: value as VentureNoSendEmailGateReplyProofType })}
                        >
                          <SelectTrigger className="h-8 bg-white/90 text-xs dark:bg-slate-950/70" aria-label="Reply proof type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer-interview">Interview proof</SelectItem>
                            <SelectItem value="pricing-signal">Pricing proof</SelectItem>
                            <SelectItem value="risk">Risk proof</SelectItem>
                            <SelectItem value="activation-cohort">Activation proof</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={draft.consentEvidence}
                          onChange={(event) => updateReplyProofDraft(item.id, { consentEvidence: event.target.value })}
                          placeholder="Manual consent evidence, no recipient"
                          className="h-8 bg-white/90 text-xs dark:bg-slate-950/70"
                        />
                      </div>
                      <Textarea
                        value={draft.redactedReplyNote}
                        onChange={(event) => updateReplyProofDraft(item.id, { redactedReplyNote: event.target.value })}
                        placeholder="Redacted reply note, no email or phone..."
                        className="mt-2 min-h-[64px] resize-none bg-white/90 text-xs dark:bg-slate-950/70"
                      />
                      {draft.proofType === "pricing-signal" && (
                        <div className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
                          <Input value={draft.qualifiedBuyerCount} onChange={(event) => updateReplyProofDraft(item.id, { qualifiedBuyerCount: event.target.value })} placeholder="Qualified" className="h-8 bg-white/90 text-xs dark:bg-slate-950/70" />
                          <Input value={draft.paidCommitmentCount} onChange={(event) => updateReplyProofDraft(item.id, { paidCommitmentCount: event.target.value })} placeholder="Paid" className="h-8 bg-white/90 text-xs dark:bg-slate-950/70" />
                          <Input value={draft.invoiceRequestCount} onChange={(event) => updateReplyProofDraft(item.id, { invoiceRequestCount: event.target.value })} placeholder="Invoice" className="h-8 bg-white/90 text-xs dark:bg-slate-950/70" />
                          <Input value={draft.acceptedPrice} onChange={(event) => updateReplyProofDraft(item.id, { acceptedPrice: event.target.value })} placeholder="Accepted price" className="h-8 bg-white/90 text-xs dark:bg-slate-950/70" />
                        </div>
                      )}
                      {draft.proofType === "risk" && (
                        <Input
                          value={draft.riskTitle}
                          onChange={(event) => updateReplyProofDraft(item.id, { riskTitle: event.target.value })}
                          placeholder="Risk title"
                          className="mt-2 h-8 bg-white/90 text-xs dark:bg-slate-950/70"
                        />
                      )}
                      {draft.proofType === "activation-cohort" && (
                        <div className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
                          <Input value={draft.signupCount} onChange={(event) => updateReplyProofDraft(item.id, { signupCount: event.target.value })} placeholder="Signups" className="h-8 bg-white/90 text-xs dark:bg-slate-950/70" />
                          <Input value={draft.activatedCount} onChange={(event) => updateReplyProofDraft(item.id, { activatedCount: event.target.value })} placeholder="Activated" className="h-8 bg-white/90 text-xs dark:bg-slate-950/70" />
                          <Input value={draft.retainedCount} onChange={(event) => updateReplyProofDraft(item.id, { retainedCount: event.target.value })} placeholder="Retained" className="h-8 bg-white/90 text-xs dark:bg-slate-950/70" />
                          <Input value={draft.paidCount} onChange={(event) => updateReplyProofDraft(item.id, { paidCount: event.target.value })} placeholder="Paid" className="h-8 bg-white/90 text-xs dark:bg-slate-950/70" />
                        </div>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Input
                          value={draft.nextAction}
                          onChange={(event) => updateReplyProofDraft(item.id, { nextAction: event.target.value })}
                          placeholder="Next action or mitigation"
                          className="h-8 min-w-[220px] flex-1 bg-white/90 text-xs dark:bg-slate-950/70"
                        />
                        <Button size="sm" type="button" onClick={() => submitReplyProof(item, draft)}>
                          Save reply proof
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}
