import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, Lightbulb, LayoutDashboard, Volume2, FileText, Building2 } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { MOCK_TRENDS, MOCK_RECOMMENDATIONS } from "@/lib/mockData";
import { getIndustryLabel } from "@/lib/industry";

const pages = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/trends", label: "Trends", icon: TrendingUp },
  { path: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { path: "/briefing", label: "Briefing", icon: Volume2 },
  { path: "/report", label: "Report", icon: FileText },
  { path: "/business-type", label: "Business Type", icon: Building2 },
];

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 w-full"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
        <span className="flex-1 text-left">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search trends, recommendations, and pages"
      >
        <CommandInput placeholder="Search trends, recommendations, pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Pages">
            {pages.map(page => (
              <CommandItem key={page.path} onSelect={() => go(page.path)} className="cursor-pointer">
                <page.icon className="w-4 h-4 text-slate-400" />
                <span>{page.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Trends">
            {MOCK_TRENDS.map(trend => (
              <CommandItem
                key={trend.trendId}
                value={`${trend.title} ${trend.topKeywords} ${trend.industry}`}
                onSelect={() => go(`/trends/${trend.trendId}`)}
                className="cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <div className="flex flex-col">
                  <span>{trend.title}</span>
                  <span className="text-xs text-slate-400">{getIndustryLabel(trend.industry)}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Recommendations">
            {MOCK_RECOMMENDATIONS.map(rec => (
              <CommandItem
                key={rec.recommendationId}
                value={`${rec.title} ${rec.productCategory} ${rec.targetDemographic}`}
                onSelect={() => go("/recommendations")}
                className="cursor-pointer"
              >
                <Lightbulb className="w-4 h-4 text-slate-400" />
                <div className="flex flex-col">
                  <span>{rec.title}</span>
                  <span className="text-xs text-slate-400">{rec.productCategory}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
