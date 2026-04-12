import { useState, useCallback, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  Lightbulb,
  Building2,
  Clock,
  LogOut,
  Volume2,
  FileText,
  Search,
} from "lucide-react";
import { usePreferences } from "@/hooks/usePreferences";
import { SearchBar } from "@/components/market/SearchBar";
import { SettingsMenu } from "@/components/market/SettingsMenu";
import { ThemeToggle } from "@/components/market/ThemeToggle";
import { BackgroundBubbles } from "@/components/market/BackgroundBubbles";
import { ErrorBoundary } from "@/components/market/ErrorBoundary";
import { SplashScreen } from "@/components/market/SplashScreen";
import { wasSplashShown } from "@/lib/splash";
import { getIndustryLabel } from "@/lib/industry";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/market-research", icon: Search, label: "Market Research" },
  { path: "/trends", icon: TrendingUp, label: "Trends" },
  { path: "/recommendations", icon: Lightbulb, label: "Recommendations" },
  { path: "/briefing", icon: Volume2, label: "Briefing" },
  { path: "/report", icon: FileText, label: "Report" },
  { path: "/history", icon: Clock, label: "History" },
  { path: "/business-type", icon: Building2, label: "Business Type" },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthReady, preferences, currentUser, logout } = usePreferences();
  const [showSplash, setShowSplash] = useState(() => !wasSplashShown());

  // Auth guard: redirect to /login if not logged in
  useEffect(() => {
    if (isAuthReady && !currentUser) {
      navigate("/login", { replace: true });
    }
  }, [currentUser, isAuthReady, navigate]);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    // After splash: first-timer goes to business-type, returning user stays on dashboard
    if (!preferences.hasCompletedSetup) {
      navigate("/business-type", { replace: true });
    }
  }, [preferences.hasCompletedSetup, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Don't render anything until auth is confirmed
  if (!isAuthReady || !currentUser) return null;

  const renderNavItem = (item: (typeof navItems)[number]) => {
    const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);

    return (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-sm font-medium ${
          isActive
            ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 font-semibold"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50"
        }`}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
      >
        <item.icon className="w-5 h-5" />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <BackgroundBubbles />
      <div
        className="flex h-screen w-screen overflow-hidden bg-transparent"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Sidebar */}
        <nav
          className="flex flex-col w-60 min-w-60 h-full border-r border-white/30 dark:border-white/10 glass backdrop-blur-xl"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-5 py-5 group cursor-pointer"
            aria-label="MarketPulse home"
          >
            <svg
              className="w-6 h-6 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">MarketPulse</span>
          </button>

          <div className="h-px bg-blue-100/50 dark:bg-slate-700/50 mx-4" />

          {/* Nav Items */}
          <div className="flex flex-col gap-1 mt-4 px-3">{navItems.map(renderNavItem)}</div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Industry badge */}
          <div className="px-4 pb-2">
            <div className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-lg text-center truncate">
              {getIndustryLabel(preferences.industry)}
            </div>
          </div>

          {/* Search */}
          <div className="px-3 pb-1">
            <SearchBar />
          </div>

          {/* Settings */}
          <div className="px-3 pb-1">
            <SettingsMenu />
          </div>

          {/* Theme toggle */}
          <div className="px-3 pb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 pl-3">Theme</span>
            <ThemeToggle />
          </div>

          {/* Logout */}
          <div className="px-3 pb-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-sm font-medium text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 w-full"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-transparent">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </>
  );
}
