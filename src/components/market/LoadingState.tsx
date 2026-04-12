import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="font-sans font-medium text-xs tracking-wide uppercase text-slate-400">{label}</p>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-4 animate-pulse">
          <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-2/3 mb-3" />
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/2 mb-2" />
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}
