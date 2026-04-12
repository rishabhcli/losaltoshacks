import { createBrowserRouter } from "react-router-dom";
import AuthCallback from "./AuthCallback";
import { AppLayout } from "./components/market/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { TrendsExplorer } from "./pages/TrendsExplorer";
import { TrendDetail } from "./pages/TrendDetail";
import { Recommendations } from "./pages/Recommendations";
import { Briefing } from "./pages/Briefing";
import { Report } from "./pages/Report";
import { BusinessType } from "./pages/BusinessType";
import { AcceptedIdeas } from "./pages/AcceptedIdeas";
import { RejectedIdeas } from "./pages/RejectedIdeas";
import { LoginPage } from "./pages/LoginPage";

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(
  [
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/trends",
          element: <TrendsExplorer />,
        },
        {
          path: "/trends/:trendId",
          element: <TrendDetail />,
        },
        {
          path: "/recommendations",
          element: <Recommendations />,
        },
        {
          path: "/briefing",
          element: <Briefing />,
        },
        {
          path: "/report",
          element: <Report />,
        },
        {
          path: "/business-type",
          element: <BusinessType />,
        },
        {
          path: "/accepted-ideas",
          element: <AcceptedIdeas />,
        },
        {
          path: "/rejected-ideas",
          element: <RejectedIdeas />,
        },
      ],
    },
    {
      // This is the route defined in your application's redirect URL
      path: "/auth/callback",
      element: <AuthCallback />,
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
