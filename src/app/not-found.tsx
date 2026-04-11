import Link from "next/link";
import { Search, Home, BarChart3 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 mx-auto mb-6">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-gray-400 mb-8">
          This page doesn&apos;t exist. Maybe the trend hasn&apos;t emerged yet.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
