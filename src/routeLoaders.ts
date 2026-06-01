export const loadAuthCallbackRoute = () => import("./AuthCallback");
export const loadDashboardRoute = () => import("./pages/Dashboard");
export const loadTrendsExplorerRoute = () => import("./pages/TrendsExplorer");
export const loadTrendDetailRoute = () => import("./pages/TrendDetail");
export const loadRecommendationsRoute = () => import("./pages/Recommendations");
export const loadBriefingRoute = () => import("./pages/Briefing");
export const loadReportRoute = () => import("./pages/Report");
export const loadBusinessTypeRoute = () => import("./pages/BusinessType");
export const loadAcceptedIdeasRoute = () => import("./pages/AcceptedIdeas");
export const loadRejectedIdeasRoute = () => import("./pages/RejectedIdeas");
export const loadMarketResearchRoute = () => import("./pages/MarketResearch");
export const loadVentureLabRoute = () => import("./pages/VentureLab");
export const loadHistoryRoute = () => import("./pages/History");
export const loadLoginRoute = () => import("./pages/LoginPage");

export const ROUTE_PRELOAD_EVENT = "marketpulse:route-preload";

const routeLoaders: Record<string, () => Promise<unknown>> = {
  "/": loadDashboardRoute,
  "/auth/callback": loadAuthCallbackRoute,
  "/login": loadLoginRoute,
  "/market-research": loadMarketResearchRoute,
  "/trends": loadTrendsExplorerRoute,
  "/recommendations": loadRecommendationsRoute,
  "/ventures": loadVentureLabRoute,
  "/briefing": loadBriefingRoute,
  "/report": loadReportRoute,
  "/business-type": loadBusinessTypeRoute,
  "/history": loadHistoryRoute,
  "/accepted-ideas": loadAcceptedIdeasRoute,
  "/rejected-ideas": loadRejectedIdeasRoute,
};

type RoutePreloadStatus = {
  key: string;
  status: "pending" | "loaded" | "failed";
  updatedAt: string;
  errorMessage?: string;
};

const preloadCache = new Map<string, Promise<unknown>>();
const preloadStatuses = new Map<string, RoutePreloadStatus>();

function recordRoutePreloadStatus(status: RoutePreloadStatus) {
  preloadStatuses.set(status.key, status);
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ROUTE_PRELOAD_EVENT, { detail: status }));
}

function resolveRouteLoader(pathname: string) {
  if (pathname.startsWith("/trends/")) return { key: "/trends/:trendId", loader: loadTrendDetailRoute };
  const loader = routeLoaders[pathname];
  return loader ? { key: pathname, loader } : null;
}

export function preloadRouteModule(pathname: string) {
  const match = resolveRouteLoader(pathname);
  if (!match || preloadCache.has(match.key)) return;
  recordRoutePreloadStatus({
    key: match.key,
    status: "pending",
    updatedAt: new Date().toISOString(),
  });
  const pending = match.loader()
    .then((result) => {
      recordRoutePreloadStatus({
        key: match.key,
        status: "loaded",
        updatedAt: new Date().toISOString(),
      });
      return result;
    })
    .catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      recordRoutePreloadStatus({
        key: match.key,
        status: "failed",
        updatedAt: new Date().toISOString(),
        errorMessage,
      });
      console.warn(`[route-preload] Failed to preload ${match.key}: ${errorMessage}`);
      preloadCache.delete(match.key);
    });
  preloadCache.set(match.key, pending);
}

export function getRoutePreloadSnapshot() {
  return Array.from(preloadStatuses.values());
}
