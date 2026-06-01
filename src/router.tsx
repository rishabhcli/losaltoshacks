import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/market/AppLayout";
import {
  loadAcceptedIdeasRoute,
  loadAuthCallbackRoute,
  loadBriefingRoute,
  loadBusinessTypeRoute,
  loadDashboardRoute,
  loadHistoryRoute,
  loadLoginRoute,
  loadMarketResearchRoute,
  loadRecommendationsRoute,
  loadRejectedIdeasRoute,
  loadReportRoute,
  loadTrendDetailRoute,
  loadTrendsExplorerRoute,
  loadVentureLabRoute,
} from "./routeLoaders";

const AuthCallback = lazy(() => loadAuthCallbackRoute());
const Dashboard = lazy(() => loadDashboardRoute().then((module) => ({ default: module.Dashboard })));
const TrendsExplorer = lazy(() => loadTrendsExplorerRoute().then((module) => ({ default: module.TrendsExplorer })));
const TrendDetail = lazy(() => loadTrendDetailRoute().then((module) => ({ default: module.TrendDetail })));
const Recommendations = lazy(() => loadRecommendationsRoute().then((module) => ({ default: module.Recommendations })));
const Briefing = lazy(() => loadBriefingRoute().then((module) => ({ default: module.Briefing })));
const Report = lazy(() => loadReportRoute().then((module) => ({ default: module.Report })));
const BusinessType = lazy(() => loadBusinessTypeRoute().then((module) => ({ default: module.BusinessType })));
const AcceptedIdeas = lazy(() => loadAcceptedIdeasRoute().then((module) => ({ default: module.AcceptedIdeas })));
const RejectedIdeas = lazy(() => loadRejectedIdeasRoute().then((module) => ({ default: module.RejectedIdeas })));
const MarketResearch = lazy(() => loadMarketResearchRoute().then((module) => ({ default: module.MarketResearch })));
const VentureLab = lazy(() => loadVentureLabRoute().then((module) => ({ default: module.VentureLab })));
const History = lazy(() => loadHistoryRoute().then((module) => ({ default: module.History })));
const LoginPage = lazy(() => loadLoginRoute().then((module) => ({ default: module.LoginPage })));

const routeFallback = (
  <div
    role="status"
    aria-label="Loading route"
    className="flex min-h-[240px] items-center justify-center text-sm text-slate-500 dark:text-slate-400"
  >
    Loading...
  </div>
);

function routeElement(element: ReactNode) {
  return <Suspense fallback={routeFallback}>{element}</Suspense>;
}

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
  [
    {
      path: "/login",
      element: routeElement(<LoginPage />),
    },
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: routeElement(<Dashboard />),
        },
        {
          path: "/market-research",
          element: routeElement(<MarketResearch />),
        },
        {
          path: "/trends",
          element: routeElement(<TrendsExplorer />),
        },
        {
          path: "/trends/:trendId",
          element: routeElement(<TrendDetail />),
        },
        {
          path: "/recommendations",
          element: routeElement(<Recommendations />),
        },
        {
          path: "/ventures",
          element: routeElement(<VentureLab />),
        },
        {
          path: "/briefing",
          element: routeElement(<Briefing />),
        },
        {
          path: "/report",
          element: routeElement(<Report />),
        },
        {
          path: "/business-type",
          element: routeElement(<BusinessType />),
        },
        {
          path: "/history",
          element: routeElement(<History />),
        },
        {
          path: "/accepted-ideas",
          element: routeElement(<AcceptedIdeas />),
        },
        {
          path: "/rejected-ideas",
          element: routeElement(<RejectedIdeas />),
        },
      ],
    },
    {
      // This is the route defined in your application's redirect URL
      path: "/auth/callback",
      element: routeElement(<AuthCallback />),
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
