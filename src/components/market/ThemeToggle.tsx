import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center w-14 h-8 rounded-full p-1 transition-colors duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      style={{
        backgroundColor: isDark ? "#334155" : "#e2e8f0",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sliding knob */}
      <div
        className="flex items-center justify-center w-6 h-6 rounded-full shadow-md transition-all duration-300 ease-in-out"
        style={{
          transform: isDark ? "translateX(24px)" : "translateX(0px)",
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
        }}
      >
        {/* Sun icon */}
        <svg
          className="absolute w-3.5 h-3.5 transition-all duration-300"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? "rotate(-90deg) scale(0.5)" : "rotate(0deg) scale(1)",
            color: "#f59e0b",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>

        {/* Moon icon */}
        <svg
          className="absolute w-3.5 h-3.5 transition-all duration-300"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)",
            color: "#93c5fd",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>
  );
}
