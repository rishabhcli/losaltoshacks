"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, Home, FileText, Zap } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileText },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Trend<span className="text-indigo-400">Scope</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>

          {/* Sponsor badges */}
          <div className="hidden md:flex items-center gap-3 text-xs text-gray-500">
            <span className="rounded border border-gray-700 px-2 py-0.5">Google News</span>
            <span className="rounded border border-gray-700 px-2 py-0.5">MongoDB</span>
            <span className="rounded border border-gray-700 px-2 py-0.5">MiniMax</span>
            <span className="rounded border border-gray-700 px-2 py-0.5">ElevenLabs</span>
            <span className="rounded border border-gray-700 px-2 py-0.5">Vercel</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
