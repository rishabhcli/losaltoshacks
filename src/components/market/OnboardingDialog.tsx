import { useState } from "react";
import { usePreferences } from "@/hooks/usePreferences";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Sparkles } from "lucide-react";
import { INDUSTRY_OPTIONS } from "@/lib/industry";

export function OnboardingDialog() {
  const { preferences, setIndustry, setBusinessName, completeSetup } = usePreferences();
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [name, setName] = useState("");

  if (preferences.hasCompletedSetup) return null;

  const handleGetStarted = () => {
    setIndustry(selectedIndustry);
    setBusinessName(name.trim());
    completeSetup();
  };

  return (
    <Dialog open={true}>
      <DialogContent
        className="sm:max-w-[600px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-0 gap-0 [&>button]:hidden"
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        {/* Header */}
        <div className="px-6 pt-8 pb-5 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 mb-4">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <DialogTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome to MarketPulse
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
            AI-powered market intelligence tailored to your business. Let us personalize your experience.
          </DialogDescription>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-700 mx-6" />

        {/* Industry selection */}
        <div className="px-6 pt-5 pb-2">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">What industry are you in?</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[320px] overflow-y-auto">
            {INDUSTRY_OPTIONS.map(ind => (
              <button
                key={ind.value}
                onClick={() => setSelectedIndustry(ind.value)}
                className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedIndustry === ind.value
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${selectedIndustry === ind.value ? "text-blue-600" : "text-slate-800 dark:text-slate-200"}`}
                >
                  {ind.label}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{ind.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Business name (optional) */}
        <div className="px-6 pt-3 pb-2">
          <Label htmlFor="business-name" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
            Your business name (optional)
          </Label>
          <Input
            id="business-name"
            placeholder="e.g. Acme Corp"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-500 rounded-lg"
          />
        </div>

        {/* CTA */}
        <div className="px-6 pt-4 pb-6">
          <Button
            onClick={handleGetStarted}
            className="w-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 rounded-lg hover:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all h-11"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
