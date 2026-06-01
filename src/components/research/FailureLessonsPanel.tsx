import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type VentureFailureLesson } from "@/lib/venture-portfolio";

function failureLessonSeverityBadge(severity: VentureFailureLesson["severity"]) {
  if (severity === "critical") return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  if (severity === "high") return "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300";
  if (severity === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300";
}

function failureLessonSourceLabel(sourceType: VentureFailureLesson["sourceType"]) {
  if (sourceType === "killed-decision") return "Killed";
  if (sourceType === "failed-experiment") return "Failed test";
  if (sourceType === "rejected-pricing") return "Rejected price";
  return "Open risk";
}

export function FailureLessonsPanel({ lessons }: { lessons: VentureFailureLesson[] }) {
  if (lessons.length === 0) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50/70 p-3 dark:border-red-900/70 dark:bg-red-950/20">
      <div className="flex flex-wrap items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-red-700 dark:text-red-300" />
        <h3 className="text-xs font-semibold text-red-900 dark:text-red-100">Failure lessons</h3>
        <Badge variant="secondary" className="bg-white/80 text-red-800 dark:bg-slate-950/70 dark:text-red-200">
          {lessons.length} warning{lessons.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        {lessons.slice(0, 6).map((lesson) => (
          <div key={lesson.id} className="rounded-md border border-red-200 bg-white/80 p-2 dark:border-red-900/70 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={failureLessonSeverityBadge(lesson.severity)}>
                {lesson.severity}
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {failureLessonSourceLabel(lesson.sourceType)}
              </Badge>
              {lesson.matched && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  matched
                </Badge>
              )}
              <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">{lesson.title}</span>
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{lesson.lesson}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Evidence: {lesson.evidence}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Never repeat: {lesson.neverRepeat}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Reuse trigger: {lesson.reuseTrigger}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Next: {lesson.nextAction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
