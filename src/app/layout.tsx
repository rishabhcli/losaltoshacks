import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://trendscope.tech";

export const metadata: Metadata = {
  title: {
    default: "TrendScope — AI Market Intelligence",
    template: "%s | TrendScope",
  },
  description:
    "Real-time consumer trend detection powered by Google News RSS, MiniMax AI clustering, and ElevenLabs audio briefings. Turn market signals into business decisions.",
  keywords: [
    "market intelligence", "trend detection", "consumer trends", "AI analytics",
    "Google News", "fashion trends", "Gen Z", "retail innovation",
  ],
  authors: [{ name: "TrendScope Team" }],
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: "website",
    title: "TrendScope — AI Market Intelligence",
    description:
      "Ingest Google News, cluster articles into emerging trends, and generate AI-powered audience insights and actionable recommendations.",
    siteName: "TrendScope",
    url: APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "TrendScope — AI Market Intelligence",
    description:
      "Turn market signals into business decisions with AI-powered trend detection.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100 font-sans">
        {children}
      </body>
    </html>
  );
}
