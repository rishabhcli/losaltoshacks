import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  emerging: "bg-blue-50 text-blue-600 border-blue-200",
  growing: "bg-emerald-50 text-emerald-600 border-emerald-200",
  peaking: "bg-amber-50 text-amber-600 border-amber-200",
  declining: "bg-slate-100 text-slate-500 border-slate-200",
  // Recommendation statuses
  new: "bg-blue-50 text-blue-600 border-blue-200",
  reviewed: "bg-indigo-50 text-indigo-600 border-indigo-200",
  accepted: "bg-emerald-50 text-emerald-600 border-emerald-200",
  dismissed: "bg-slate-100 text-slate-500 border-slate-200",
  // Priority
  high: "bg-blue-50 text-blue-600 border-blue-200",
  medium: "bg-amber-50 text-amber-600 border-amber-200",
  low: "bg-slate-100 text-slate-500 border-slate-200",
};

export function StatusBadge({ value, className = "" }: { value: string | undefined; className?: string }) {
  const normalized = (value ?? "").toLowerCase();
  const style = statusStyles[normalized] ?? "bg-slate-50 text-slate-500 border-slate-200";

  return (
    <Badge
      variant="outline"
      className={`font-sans font-medium text-[10px] uppercase tracking-widest rounded-md ${style} ${className}`}
    >
      {value ?? "Unknown"}
    </Badge>
  );
}
