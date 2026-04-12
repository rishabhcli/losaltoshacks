import "./styles/globals.css";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { PreferencesProvider } from "./components/PreferencesProvider";
import { router } from "./router";

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <PreferencesProvider>
      <RouterProvider router={router} />
      <Toaster />
    </PreferencesProvider>
  </QueryClientProvider>,
);
