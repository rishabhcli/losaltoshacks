import { useEffect } from "react";
import { useTheme } from "@/lib/theme";

const lightBubbles = [
  { size: 420, x: "5%", y: "-5%", color: "rgba(37, 99, 235, 0.45)", duration: 28, delay: 0 },
  { size: 350, x: "60%", y: "-10%", color: "rgba(139, 92, 246, 0.40)", duration: 34, delay: 2 },
  { size: 280, x: "80%", y: "20%", color: "rgba(16, 185, 129, 0.35)", duration: 24, delay: 4 },
  { size: 500, x: "20%", y: "30%", color: "rgba(37, 99, 235, 0.40)", duration: 38, delay: 1 },
  { size: 240, x: "45%", y: "10%", color: "rgba(139, 92, 246, 0.35)", duration: 30, delay: 3 },
  { size: 320, x: "-5%", y: "40%", color: "rgba(16, 185, 129, 0.38)", duration: 26, delay: 5 },
] as const;

const darkBubbles = [
  { size: 420, x: "5%", y: "-5%", color: "rgba(29, 78, 216, 0.45)", duration: 28, delay: 0 },
  { size: 350, x: "60%", y: "-10%", color: "rgba(126, 34, 206, 0.40)", duration: 34, delay: 2 },
  { size: 280, x: "80%", y: "20%", color: "rgba(5, 150, 105, 0.35)", duration: 24, delay: 4 },
  { size: 500, x: "20%", y: "30%", color: "rgba(29, 78, 216, 0.40)", duration: 38, delay: 1 },
  { size: 240, x: "45%", y: "10%", color: "rgba(126, 34, 206, 0.35)", duration: 30, delay: 3 },
  { size: 320, x: "-5%", y: "40%", color: "rgba(5, 150, 105, 0.38)", duration: 26, delay: 5 },
] as const;

export function BackgroundBubbles() {
  const { theme } = useTheme();
  const bubbles = theme === "dark" ? darkBubbles : lightBubbles;

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      document.documentElement.style.setProperty("--scroll-y", String(scrollY));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // Also capture scroll on main content areas
    const mainEl = document.querySelector("main");
    if (mainEl) {
      const onMainScroll = () => {
        document.documentElement.style.setProperty("--scroll-y", String(mainEl.scrollTop));
      };
      mainEl.addEventListener("scroll", onMainScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        mainEl.removeEventListener("scroll", onMainScroll);
      };
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      {bubbles.map((bubble, i) => (
        <div
          key={i}
          className="absolute rounded-full bubble-float"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.x,
            top: bubble.y,
            backgroundColor: bubble.color,
            filter: "blur(60px)",
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
            transform: "translate(calc(var(--scroll-y, 0) * 0.15px), calc(var(--scroll-y, 0) * 0.2px))",
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
