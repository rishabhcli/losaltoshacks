import { useState } from "react";
import { usePreferences } from "@/hooks/usePreferences";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, RotateCcw } from "lucide-react";
import { INDUSTRY_OPTIONS } from "@/lib/industry";

export function SettingsMenu() {
  const { preferences, setIndustry, setBusinessName, resetPreferences } = usePreferences();
  const [open, setOpen] = useState(false);
  const [localIndustry, setLocalIndustry] = useState(preferences.industry);
  const [localName, setLocalName] = useState(preferences.businessName);

  const handleOpen = () => {
    setLocalIndustry(preferences.industry);
    setLocalName(preferences.businessName);
    setOpen(true);
  };

  const handleSave = () => {
    setIndustry(localIndustry);
    setBusinessName(localName.trim());
    setOpen(false);
  };

  const handleReset = () => {
    resetPreferences();
    setLocalIndustry("All");
    setLocalName("");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 w-full"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px] bg-white border-slate-200 rounded-xl shadow-lg p-0 gap-0">
          <div className="px-6 pt-6 pb-4">
            <DialogTitle className="text-lg font-semibold text-slate-900 tracking-tight">Preferences</DialogTitle>
            <DialogDescription className="text-sm text-slate-500 mt-1">
              Customize your MarketPulse experience
            </DialogDescription>
          </div>

          <div className="h-px bg-slate-100 mx-6" />

          {/* Industry selection */}
          <div className="px-6 pt-4 pb-2">
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Industry focus</Label>
            <div className="grid grid-cols-2 gap-2">
              {INDUSTRY_OPTIONS.map(ind => (
                <button
                  key={ind.value}
                  onClick={() => setLocalIndustry(ind.value)}
                  className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer text-sm ${
                    localIndustry === ind.value
                      ? "border-blue-600 bg-blue-50 text-blue-600 font-semibold shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {ind.label}
                </button>
              ))}
            </div>
          </div>

          {/* Business name */}
          <div className="px-6 pt-3 pb-2">
            <Label htmlFor="settings-business-name" className="text-sm font-medium text-slate-700 mb-2 block">
              Business name (optional)
            </Label>
            <Input
              id="settings-business-name"
              placeholder="e.g. Acme Corp"
              value={localName}
              onChange={e => setLocalName(e.target.value)}
              className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-lg"
            />
          </div>

          <div className="h-px bg-slate-100 mx-6 mt-3" />

          {/* Actions */}
          <div className="px-6 pt-4 pb-6 flex items-center justify-between gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to defaults
            </button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="text-slate-600 border-slate-200 hover:bg-slate-50 text-sm font-medium rounded-lg"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleSave}
                className="bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 rounded-lg hover:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
