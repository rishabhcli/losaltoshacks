import { useState } from "react";
import { Clock, CheckCircle2, XCircle, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useOsdkObjects, marketRecommendation } from "@/lib/osdk-shims";
import { AcceptedIdeas } from "./AcceptedIdeas";
import { RejectedIdeas } from "./RejectedIdeas";
import { useMasterBuildDashboard } from "@/hooks/useMasterBuildDashboard";

export function History() {
  const [tab, setTab] = useState("research");

  const { data: acceptedRecs } = useOsdkObjects(marketRecommendation, {
    where: { status: { $eq: "accepted" } },
    pageSize: 100,
  });
  const { data: rejectedRecs } = useOsdkObjects(marketRecommendation, {
    where: { status: { $eq: "dismissed" } },
    pageSize: 100,
  });
  const { latestMission, discoveries } = useMasterBuildDashboard();

  const acceptedCount = acceptedRecs?.length ?? 0;
  const rejectedCount = rejectedRecs?.length ?? 0;
  const hasResearch = !!latestMission;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">History</h1>
        </div>
        <p className="text-slate-500 text-sm mt-1">
          Past research missions, accepted ideas, and rejected ideas
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col overflow-hidden px-6">
        <TabsList className="bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 shrink-0 w-fit mb-4">
          <TabsTrigger
            value="research"
            className="text-sm gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600"
          >
            <Search className="w-3.5 h-3.5" />
            Market Research
            {hasResearch && (
              <Badge variant="secondary" className="text-[9px] px-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                {discoveries.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="accepted"
            className="text-sm gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-emerald-600"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accepted
            {acceptedCount > 0 && (
              <Badge variant="secondary" className="text-[9px] px-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300">
                {acceptedCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="text-sm gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-red-500"
          >
            <XCircle className="w-3.5 h-3.5" />
            Rejected
            {rejectedCount > 0 && (
              <Badge variant="secondary" className="text-[9px] px-1.5 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-300">
                {rejectedCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="flex-1 overflow-hidden mt-0">
          <ResearchHistory />
        </TabsContent>

        <TabsContent value="accepted" className="flex-1 overflow-hidden mt-0">
          <AcceptedIdeas />
        </TabsContent>

        <TabsContent value="rejected" className="flex-1 overflow-hidden mt-0">
          <RejectedIdeas />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/** Summary of the latest market research mission */
function ResearchHistory() {
  const { latestMission, discoveries, businessPlans } = useMasterBuildDashboard();
  const latest = businessPlans[0] ?? null;

  if (!latestMission) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16 gap-3">
        <Search className="w-8 h-8 opacity-40" />
        <span className="text-sm">No research missions yet</span>
        <span className="text-xs text-slate-300">Launch a mission from the Dashboard or Market Research tab</span>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 pb-6">
        {/* Mission summary card */}
        <div className="border border-slate-200 dark:border-slate-700/60 rounded-xl p-5 glass">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Latest Mission</h3>
            <Badge variant={latestMission.status === "active" || latestMission.status === "queued" ? "default" : "secondary"} className="text-xs capitalize">
              {latestMission.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-600 mb-3">{latestMission.prompt}</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>{discoveries.length} discoveries</span>
            {latest && <span>Confidence: {latest.confidence_score}%</span>}
            {latest && <span>v{latest.version}</span>}
          </div>
        </div>

        {/* Business plan summary */}
        {latest?.raw_plan && (
          <div className="border border-slate-200 dark:border-slate-700/60 rounded-xl p-5 glass">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Business Plan</h3>
            <pre className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed font-sans">
              {latest.raw_plan}
            </pre>
          </div>
        )}

        {/* Discovery list */}
        {discoveries.length > 0 && (
          <div className="border border-slate-200 dark:border-slate-700/60 rounded-xl p-5 glass">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Discoveries ({discoveries.length})</h3>
            <div className="space-y-2">
              {discoveries.slice(0, 20).map((d) => (
                <div key={d._id} className="flex items-start gap-3 text-xs border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0">
                  <span className="text-slate-400 shrink-0 w-12 text-right">{d.found_by_agent_id}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-700 font-medium truncate">{d.keywords}</div>
                    {d.video_url && (
                      <a href={d.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 truncate block">
                        {d.video_url}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
