"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, BarChart3, Users, Lightbulb, ArrowRight, Radio, Database, Globe, Brain } from "lucide-react";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: Globe,
    title: "Detect",
    description: "Ingest Yahoo News RSS feeds across fashion, retail, beauty, and lifestyle keywords in real time.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Brain,
    title: "Understand",
    description: "AI-powered semantic clustering and trend scoring with growth rate, acceleration, and recency analysis.",
    color: "text-[var(--color-primary)]",
    bg: "bg-[var(--color-primary)]/10",
  },
  {
    icon: Lightbulb,
    title: "Act",
    description: "Get concrete product, marketing, and branding recommendations with audience profiles and risk assessments.",
    color: "text-[var(--color-success)]",
    bg: "bg-[var(--color-success)]/10",
  },
];

const sponsors = [
  { name: "Yahoo", desc: "Live RSS signal feed" },
  { name: "MongoDB Atlas", desc: "Vector search & storage" },
  { name: "OpenAI", desc: "GenAI insights" },
  { name: "ElevenLabs", desc: "Audio briefings" },
  { name: "Vercel", desc: "Edge deployment" },
  { name: "Palantir AIP", desc: "Decision artifacts" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500">
                <Zap className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Turn market signals into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                business decisions
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10">
              TrendScope ingests live Yahoo News coverage, clusters articles into emerging consumer trends,
              and generates AI-powered audience insights and actionable recommendations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                Launch Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/reports"
                className="flex items-center gap-2 rounded-xl border border-gray-700 px-8 py-3.5 text-sm font-semibold text-gray-100 hover:bg-gray-800 transition-colors"
              >
                <Radio className="h-4 w-4" />
                Generate Report
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-xl border border-gray-700 bg-gray-900 p-6"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.bg} mb-4`}>
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: "1", title: "Ingest", desc: "Fetch Yahoo RSS feeds for configured keywords", icon: Globe },
            { step: "2", title: "Embed & Cluster", desc: "Generate embeddings, cluster via vector similarity", icon: Database },
            { step: "3", title: "Score & Analyze", desc: "Compute growth, acceleration, and composite scores", icon: BarChart3 },
            { step: "4", title: "Recommend", desc: "AI generates audience profiles and business actions", icon: Users },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-center p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-sm mx-auto mb-3">
                {item.step}
              </div>
              <h4 className="font-semibold mb-1">{item.title}</h4>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sponsors */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-center text-gray-400 mb-8">
          Powered By
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {sponsors.map((s) => (
            <div
              key={s.name}
              className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center"
            >
              <p className="text-sm font-semibold">{s.name}</p>
              <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
