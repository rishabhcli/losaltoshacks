import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { type TimeFrame, TIME_FRAME_OPTIONS } from "@/lib/trendChartData";

interface ChartControlsProps {
  timeFrame: TimeFrame;
  onTimeFrameChange: (tf: TimeFrame) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isZoomed: boolean;
}

export function ChartControls({
  timeFrame,
  onTimeFrameChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isZoomed,
}: ChartControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      {/* Time frame pills */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
        {TIME_FRAME_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onTimeFrameChange(opt.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              timeFrame === opt.value
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onZoomIn}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        {isZoomed && (
          <button
            onClick={onResetZoom}
            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
            aria-label="Reset zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
