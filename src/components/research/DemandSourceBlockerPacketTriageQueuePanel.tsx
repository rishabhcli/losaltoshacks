import { ListFilter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  DemandSourceBlockerPacketTriageAuditEntry,
  DemandSourceBlockerPacketTriageAuditStatus,
  DemandSourceBlockerPacketTriageStatus,
  DemandSourceBlockerSavedViewPacket,
} from "@/lib/venture-portfolio";

export function DemandSourceBlockerPacketTriageQueuePanel({
  packets,
  auditEntriesByPacketKey,
  packetKey,
  triageLabel,
  onReplayPacket,
  onMarkPacketTriage,
}: {
  packets: DemandSourceBlockerSavedViewPacket[];
  auditEntriesByPacketKey: Map<string, DemandSourceBlockerPacketTriageAuditEntry[]>;
  packetKey: (packet: Pick<DemandSourceBlockerSavedViewPacket, "savedViewId" | "name" | "sourceType">) => string;
  triageLabel: (status: DemandSourceBlockerPacketTriageAuditStatus) => string;
  onReplayPacket: (packet: DemandSourceBlockerSavedViewPacket) => void;
  onMarkPacketTriage: (packet: DemandSourceBlockerSavedViewPacket, status: DemandSourceBlockerPacketTriageStatus) => void;
}) {
  return (
    <>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {packets.slice(0, 6).map((packet) => {
          const packetAuditEntries = auditEntriesByPacketKey.get(packetKey(packet)) ?? [];
          const latestAuditEntry = packetAuditEntries[0];
          return (
            <div key={packet.id} className="rounded-md border border-orange-200 bg-white/80 p-3 dark:border-orange-900/70 dark:bg-slate-950/60">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className="bg-white/80 text-orange-800 dark:bg-slate-950/70 dark:text-orange-200">
                  {packet.sourceType}
                </Badge>
                <Badge variant="secondary" className={packet.currentMatchCount > 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"}>
                  {packet.currentMatchCount} match{packet.currentMatchCount === 1 ? "" : "es"}
                </Badge>
                <Badge variant="secondary" className="bg-white/60 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
                  {packet.commandCount} command{packet.commandCount === 1 ? "" : "s"}
                </Badge>
                <Badge
                  variant="secondary"
                  className={packet.triageStatus === "delegated"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                    : packet.triageStatus === "needs-evidence"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                      : packet.triageStatus === "acknowledged"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"}
                >
                  {packet.triageStatus ? triageLabel(packet.triageStatus) : "Untriaged"}
                </Badge>
              </div>
              <p className="mt-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{packet.name}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{packet.summary}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-orange-900 dark:text-orange-100">Freshness: {packet.generatedAt}</p>
              {packet.currentMatchCount === 0 && (
                <p className="mt-1 text-[11px] leading-relaxed text-red-800 dark:text-red-200">Warning: no current ventures match this saved blocker-source view.</p>
              )}
              {packet.evidence.length === 0 && (
                <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-200">Warning: no latest evidence snippets are attached to this packet.</p>
              )}
              {packet.triageUpdatedAt && (
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Triage updated: {packet.triageUpdatedAt}</p>
              )}
              {latestAuditEntry && (
                <p className="mt-1 text-[11px] leading-relaxed text-violet-800 dark:text-violet-200">
                  Latest transition: {triageLabel(latestAuditEntry.previousStatus)} -&gt; {triageLabel(latestAuditEntry.nextStatus)} at {latestAuditEntry.recordedAt}
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 h-8 gap-1.5 border-orange-300 bg-white/80 text-xs text-orange-900 hover:bg-orange-100 dark:border-orange-900 dark:bg-slate-950/70 dark:text-orange-100 dark:hover:bg-orange-950/50"
                onClick={() => onReplayPacket(packet)}
              >
                <ListFilter className="h-3.5 w-3.5" />
                Replay packet {packet.name}
              </Button>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-[11px] text-emerald-800 hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-950/40"
                  onClick={() => onMarkPacketTriage(packet, "acknowledged")}
                >
                  Acknowledge packet {packet.name}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-[11px] text-amber-800 hover:bg-amber-50 dark:text-amber-200 dark:hover:bg-amber-950/40"
                  onClick={() => onMarkPacketTriage(packet, "needs-evidence")}
                >
                  Flag needs evidence {packet.name}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-[11px] text-blue-800 hover:bg-blue-50 dark:text-blue-200 dark:hover:bg-blue-950/40"
                  onClick={() => onMarkPacketTriage(packet, "delegated")}
                >
                  Delegate packet {packet.name}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {packets.length === 0 && (
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          No packet cards match the current triage filter.
        </p>
      )}
    </>
  );
}
