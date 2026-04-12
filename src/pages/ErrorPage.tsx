import { useNavigate } from "react-router-dom";
import { RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundBubbles } from "@/components/market/BackgroundBubbles";

/** A cracked/glitchy chart SVG illustration — cute, not alarming */
function BrokenChartIllustration() {
  return (
    <div className="relative w-48 h-48 mx-auto mb-6">
      <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
        {/* Soft circle background */}
        <circle cx="100" cy="100" r="90" fill="#EFF6FF" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="#BFDBFE" strokeWidth="2" />

        {/* Chart axes */}
        <line x1="50" y1="150" x2="160" y2="150" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="150" x2="50" y2="50" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

        {/* The "broken" line chart — goes up fine, then cracks */}
        <path
          d="M 55 140 L 75 120 L 90 95 L 105 80"
          fill="none"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* The crack / break */}
        <path
          d="M 108 85 L 112 105 L 118 75 L 122 110 L 128 70"
          fill="none"
          stroke="#EF4444"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-wiggle"
        />

        {/* Scattered data points — "fallen off" the chart */}
        <circle cx="140" cy="130" r="4" fill="#93C5FD" className="animate-bounce-gentle" />
        <circle cx="148" cy="145" r="3" fill="#BFDBFE" className="animate-bounce-gentle-delayed" />
        <circle cx="135" cy="148" r="3.5" fill="#60A5FA" className="animate-bounce-gentle" />

        {/* Little sad face on the chart */}
        <circle cx="80" cy="65" r="18" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx="74" cy="62" r="2" fill="#92400E" />
        <circle cx="86" cy="62" r="2" fill="#92400E" />
        {/* Frowny mouth */}
        <path d="M 74 72 Q 80 68, 86 72" fill="none" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Inline keyframes for the wobble animation */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1.5deg); }
          75% { transform: rotate(-1.5deg); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes bounce-gentle-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-wiggle {
          transform-origin: 115px 90px;
          animation: wiggle 2s ease-in-out infinite;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2.5s ease-in-out infinite;
        }
        .animate-bounce-gentle-delayed {
          animation: bounce-gentle-delayed 2.5s ease-in-out infinite 0.4s;
        }
      `}</style>
    </div>
  );
}

interface ErrorPageProps {
  /** When provided, shows a "Try Again" button that calls this callback */
  onReset?: () => void;
}

export function ErrorPage({ onReset }: ErrorPageProps) {
  let navigate: ReturnType<typeof useNavigate> | null = null;

  // useNavigate may throw if we're outside a router context (route-level errorElement).
  // Wrap in try/catch so the page still renders.
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate();
  } catch {
    // outside router context — navigate will stay null
  }

  const handleGoHome = () => {
    if (navigate) {
      navigate("/");
    } else {
      window.location.href = import.meta.env.BASE_URL || "/";
    }
  };

  const handleTryAgain = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6" style={{ zIndex: 40 }}>
      {/* Reuse the app background so it blends in */}
      <BackgroundBubbles />

      <div
        className="relative z-10 w-full max-w-md rounded-2xl bg-white/85 backdrop-blur-xl border border-blue-100 p-10 text-center"
        style={{ boxShadow: "0 8px 30px rgba(37, 99, 235, 0.08)" }}
      >
        <BrokenChartIllustration />

        <h1 className="text-2xl font-semibold text-slate-800 mb-2">Oops! Something went wrong</h1>

        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          Our market signals got a bit tangled. Don&apos;t worry, it happens to the best of us!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={handleGoHome} variant="default" size="lg" className="gap-2 rounded-lg w-full sm:w-auto">
            <Home className="w-4 h-4" />
            Go back home
          </Button>
          <Button onClick={handleTryAgain} variant="outline" size="lg" className="gap-2 rounded-lg w-full sm:w-auto">
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
