import { useState, useEffect } from "react";
import { markSplashShown } from "@/lib/splash";

const SPLASH_DURATION = 2500;
const FADE_DURATION = 400;

// SVG path — dramatic: starts low, rockets up, crashes down, then slow x²/30 parabolic recovery
const LINE_PATH =
  "M 0 170 C 50 170, 100 30, 150 10 C 200 -10, 250 170, 300 170 C 350 170, 380 165, 400 157 C 430 145, 460 130, 500 118 C 530 100, 560 80, 600 42 C 620 25, 640 15, 650 10";

// Area path: same as LINE_PATH but closes down to the bottom-right
const AREA_PATH = `${LINE_PATH} L 650 180 L 0 180 Z`;

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"animate" | "fading" | "done">("animate");

  useEffect(() => {
    // Mark as shown for this session
    markSplashShown();

    const animTimer = setTimeout(() => {
      setPhase("fading");
    }, SPLASH_DURATION);

    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, SPLASH_DURATION + FADE_DURATION);

    return () => {
      clearTimeout(animTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: "#7C3AED",
        opacity: phase === "fading" ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease-out`,
      }}
      aria-hidden="true"
    >
      {/* Graph animation */}
      <svg
        viewBox="0 0 650 180"
        className="w-[80%] max-w-[600px]"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Gradient fill for area under curve */}
          <linearGradient id="splash-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
          </linearGradient>

          {/* Clip-path that reveals left-to-right */}
          <clipPath id="splash-reveal">
            <rect x="0" y="0" width="650" height="200" className="splash-reveal-rect" />
          </clipPath>
        </defs>

        {/* Area fill */}
        <path d={AREA_PATH} fill="url(#splash-area-grad)" clipPath="url(#splash-reveal)" />

        {/* Line */}
        <path
          d={LINE_PATH}
          fill="none"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="splash-line"
        />
      </svg>

      {/* MarketPulse text */}
      <p className="mt-8 text-white text-2xl font-semibold tracking-tight splash-text">MarketPulse</p>

      {/* Inline styles for the animation — keeps it self-contained */}
      <style>{`
        .splash-line {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: splash-draw 2s ease-out forwards;
        }
        .splash-reveal-rect {
          width: 0;
          animation: splash-clip 2s ease-out forwards;
        }
        .splash-text {
          opacity: 0;
          animation: splash-fade-in 0.6s ease-out 1s forwards;
        }

        @keyframes splash-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes splash-clip {
          to {
            width: 650px;
          }
        }
        @keyframes splash-fade-in {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
