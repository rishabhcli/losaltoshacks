import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "@/hooks/usePreferences";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, Check, Sparkles, ArrowRight } from "lucide-react";
import { INDUSTRY_OPTIONS, getIndustryLabel } from "@/lib/industry";
import { toast } from "sonner";

export function BusinessType() {
  const navigate = useNavigate();
  const { preferences, setIndustry, setBusinessName, completeSetup } = usePreferences();
  const [selectedIndustry, setSelectedIndustry] = useState(preferences.industry);
  const [name, setName] = useState(preferences.businessName);

  const isFirstTime = !preferences.hasCompletedSetup;
  const hasChanges = selectedIndustry !== preferences.industry || name.trim() !== preferences.businessName;

  const handleSave = () => {
    setIndustry(selectedIndustry);
    setBusinessName(name.trim());
    toast.success("Business preferences updated");
  };

  const handleContinueToDashboard = () => {
    setIndustry(selectedIndustry);
    setBusinessName(name.trim());
    completeSetup();
    navigate("/");
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 lg:p-8 space-y-6 max-w-[1120px]">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h1 className="text-4xl font-semibold text-slate-900">
              {isFirstTime ? "Welcome to MarketPulse" : "Business Type"}
            </h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            {isFirstTime
              ? "Let's personalize your experience. Choose your industry focus to get tailored insights."
              : "Set your industry preference to get tailored recommendations"}
          </p>
        </div>

        {/* Current selection — only for returning users */}
        {!isFirstTime && (
          <div className="border border-slate-200 bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-1">Current industry</p>
            <p className="text-lg font-semibold text-blue-600">{getIndustryLabel(preferences.industry)}</p>
            {preferences.businessName && <p className="text-sm text-slate-500 mt-0.5">{preferences.businessName}</p>}
          </div>
        )}

        {/* Industry selection */}
        <div className="border border-slate-200 bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <Label className="text-sm font-medium text-slate-700 mb-4 block">Choose your industry focus</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INDUSTRY_OPTIONS.map(ind => {
              const isSelected = selectedIndustry === ind.value;
              return (
                <button
                  key={ind.value}
                  onClick={() => setSelectedIndustry(ind.value)}
                  className={`relative text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                      : "border-slate-200 dark:border-slate-600 glass hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm font-semibold ${isSelected ? "text-blue-600" : "text-slate-800"}`}>
                        {ind.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{ind.description}</p>
                    </div>
                    {isSelected && (
                      <div className="shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Business name */}
        <div className="border border-slate-200 bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <Label htmlFor="bt-business-name" className="text-sm font-medium text-slate-700 mb-2 block">
            Business name (optional)
          </Label>
          <Input
            id="bt-business-name"
            placeholder="e.g. Acme Corp"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-lg max-w-md"
          />
        </div>

        {/* Actions */}
        <div>
          {isFirstTime ? (
            <Button
              onClick={handleContinueToDashboard}
              className="bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 rounded-lg hover:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all h-11 px-6"
            >
              Continue to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className="bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 rounded-lg hover:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all h-11 px-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Save preferences
            </Button>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
