/**
 * osdk-shims.ts
 *
 * Drop-in replacements for @osdk/react/experimental hooks.
 * Fetches live data from the AI server (derived from scraped discoveries + business plans).
 */

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

// Type definitions for live data from AI server
interface Trend {
  $primaryKey: string;
  trendId: string;
  title: string;
  description: string;
  industry: string;
  category: string;
  status: string;
  trendScore: number;
  mentionCount: number;
  growthRate: number;
  sentimentScore: number;
  topKeywords: string;
  detectedAt: string;
  sources?: unknown[];
  [key: string]: unknown;
}

interface Insight {
  $primaryKey: string;
  insightId: string;
  title: string;
  summary: string;
  insightType: string;
  industry: string;
  generatedAt: string;
  relatedTrendIds: string;
  metricValue?: number;
  metricUnit?: string;
  changePercent?: number;
  period?: string;
  [key: string]: unknown;
}

interface Recommendation {
  $primaryKey: string;
  recommendationId: string;
  trendId: string;
  title: string;
  description: string;
  industry: string;
  productCategory: string;
  targetDemographic: string;
  confidenceScore: number;
  estimatedRevenuePotential: string;
  priority: string;
  status: string;
  actionPlan: string;
  createdAt: string;
  [key: string]: unknown;
}

// ─── Type tokens (replacing @osdk/src exports) ────────────────────────────────
export const marketTrend = "marketTrend";
export const marketInsight = "marketInsight";
export const marketRecommendation = "marketRecommendation";

// ─── Live data from AI server ─────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const LIVE_CACHE_TTL = 60_000; // 1 minute
const RECS_CACHE_TTL = 5 * 60_000; // 5 minutes (matches server-side cache)

interface LiveData {
  trends: Trend[];
  insights: Insight[];
}

let _liveData: LiveData | null = null;
let _liveFetchedAt = 0;
let _liveFetchPromise: Promise<void> | null = null;

let _liveRecs: Recommendation[] | null = null;
let _liveRecsFetchedAt = 0;
/** In-flight fetches keyed by industry cache key (avoids cross-industry promise races) */
const _liveRecsFetchByKey = new Map<string, Promise<void>>();
/** Cache key for recommendations: industry slug or "__all__" */
let _liveRecsKey = "__all__";

function fetchLiveData(): Promise<void> {
  const now = Date.now();
  if (_liveData && now - _liveFetchedAt < LIVE_CACHE_TTL) return Promise.resolve();
  if (_liveFetchPromise) return _liveFetchPromise;

  _liveFetchPromise = fetch(`${API_BASE}/api/trends`, { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<{ trends?: unknown[]; insights?: unknown[] }>;
    })
    .then((data) => {
      const trends = (data.trends ?? []) as Trend[];
      const insights = (data.insights ?? []) as Insight[];
      if (trends.length > 0 || insights.length > 0) {
        _liveData = { trends, insights };
        _liveFetchedAt = Date.now();
        _notify();
      }
    })
    .catch(() => { /* no fallback - real data only */ })
    .finally(() => { _liveFetchPromise = null; });

  return _liveFetchPromise;
}

function fetchLiveRecommendations(opts?: { industry?: string }): Promise<void> {
  const key =
    opts?.industry && opts.industry !== "All"
      ? opts.industry
      : "__all__";

  const now = Date.now();
  if (
    _liveRecs &&
    _liveRecsKey === key &&
    now - _liveRecsFetchedAt < RECS_CACHE_TTL
  ) {
    return Promise.resolve();
  }

  let inflight = _liveRecsFetchByKey.get(key);
  if (!inflight) {
    const qs = key === "__all__" ? "" : `?industry=${encodeURIComponent(key)}`;
    const requestedKey = key;

    inflight = fetch(`${API_BASE}/api/recommendations${qs}`, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ recommendations?: unknown[] }>;
      })
      .then((data) => {
        const recs = (data.recommendations ?? []) as Recommendation[];
        if (recs.length > 0) {
          _liveRecs = recs;
          _liveRecsKey = requestedKey;
          _liveRecsFetchedAt = Date.now();
          _notify();
        }
      })
      .catch(() => { /* no fallback - real data only */ })
      .finally(() => {
        _liveRecsFetchByKey.delete(key);
      });

    _liveRecsFetchByKey.set(key, inflight);
  }

  return inflight;
}

function applyOpts(
  items: (Trend | Insight | Recommendation)[],
  opts?: Record<string, unknown>,
): (Trend | Insight | Recommendation)[] {
  let result = [...items];
  const orderBy = (opts as { orderBy?: Record<string, string> } | undefined)?.orderBy;
  if (orderBy) {
    const [key, dir] = Object.entries(orderBy)[0];
    result.sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[key];
      const bv = (b as unknown as Record<string, unknown>)[key];
      if (typeof av === "number" && typeof bv === "number") return dir === "desc" ? bv - av : av - bv;
      return dir === "desc"
        ? String(bv ?? "").localeCompare(String(av ?? ""))
        : String(av ?? "").localeCompare(String(bv ?? ""));
    });
  }
  const pageSize = (opts as { pageSize?: number } | undefined)?.pageSize;
  if (pageSize) result = result.slice(0, pageSize);
  return result;
}

// $Actions shims
export const $Actions = {
  updateRecommendationStatus: "updateRecommendationStatus",
  bookmarkTrend: "bookmarkTrend",
} as const;

type ObjectType = typeof marketTrend | typeof marketInsight | typeof marketRecommendation;

// User status overrides (accept/dismiss) applied on top of source data
const _statusOverrides = new Map<string, string>();

// Reactive version counter — subscribers re-render when data changes
let _version = 0;
const _listeners = new Set<() => void>();
function _notify() {
  _version++;
  _listeners.forEach(fn => fn());
}
function _subscribe(fn: () => void) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}
function _getVersion() {
  return _version;
}

function getRecs(): Recommendation[] {
  const base = _liveRecs ?? [];
  return base.map(r => {
    const override = _statusOverrides.get(r.$primaryKey);
    return override ? { ...r, status: override } : { ...r };
  }) as Recommendation[];
}

function getObjects(objectType: ObjectType, opts?: Record<string, unknown>): unknown[] {
  if (objectType === "marketTrend") {
    let result = [...(_liveData?.trends ?? [])];
    const where = (opts as { where?: { status?: { $eq?: string } } } | undefined)?.where;
    if (where?.status?.$eq) {
      result = result.filter(t => t.status === where.status!.$eq);
    }
    const orderBy = (opts as { orderBy?: Record<string, string> } | undefined)?.orderBy;
    if (orderBy) {
      const [key, dir] = Object.entries(orderBy)[0];
      result.sort((a, b) => {
        const av = (a as Trend)[key];
        const bv = (b as Trend)[key];
        if (typeof av === "number" && typeof bv === "number") return dir === "desc" ? bv - av : av - bv;
        return dir === "desc"
          ? String(bv ?? "").localeCompare(String(av ?? ""))
          : String(av ?? "").localeCompare(String(bv ?? ""));
      });
    }
    return result;
  }

  if (objectType === "marketInsight") {
    const result = [...(_liveData?.insights ?? [])];
    const orderBy = (opts as { orderBy?: Record<string, string> } | undefined)?.orderBy;
    if (orderBy) {
      const [key, dir] = Object.entries(orderBy)[0];
      result.sort((a, b) => {
        const av = (a as Insight)[key];
        const bv = (b as Insight)[key];
        if (typeof av === "number" && typeof bv === "number") return dir === "desc" ? bv - av : av - bv;
        return dir === "desc"
          ? String(bv ?? "").localeCompare(String(av ?? ""))
          : String(av ?? "").localeCompare(String(bv ?? ""));
      });
    }
    return result;
  }

  if (objectType === "marketRecommendation") {
    let result = getRecs();
    const where = (opts as { where?: { status?: { $eq?: string } } } | undefined)?.where;
    if (where?.status?.$eq) {
      result = result.filter(r => r.status === where.status!.$eq);
    }
    const industryOpt = (opts as { industry?: string } | undefined)?.industry;
    const orderBy = (opts as { orderBy?: Record<string, string> } | undefined)?.orderBy;
    // Preserve server-side ordering when industry-scoped (ranked by sector match)
    if (orderBy && (!industryOpt || industryOpt === "All")) {
      const [key, dir] = Object.entries(orderBy)[0];
      result.sort((a, b) => {
        const av = (a as Recommendation)[key];
        const bv = (b as Recommendation)[key];
        if (typeof av === "number" && typeof bv === "number") return dir === "desc" ? bv - av : av - bv;
        return dir === "desc"
          ? String(bv ?? "").localeCompare(String(av ?? ""))
          : String(av ?? "").localeCompare(String(bv ?? ""));
      });
    }
    return result;
  }

  return [];
}

// ─── useOsdkObjects ───────────────────────────────────────────────────────────
export function useOsdkObjects(objectType: ObjectType, opts?: Record<string, unknown>) {
  const version = useSyncExternalStore(_subscribe, _getVersion);

  // Kick off live data fetch on mount; _notify() will re-render when data arrives
  useEffect(() => {
    void fetchLiveData();
    const industry =
      objectType === marketRecommendation
        ? (opts as { industry?: string } | undefined)?.industry
        : undefined;
    void fetchLiveRecommendations({ industry });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- opts serialized below
  }, [objectType, JSON.stringify(opts)]);

  const data = useMemo(() => {
    if (objectType === "marketTrend" && _liveData && _liveData.trends.length > 0) {
      return applyOpts(_liveData.trends, opts);
    }
    if (objectType === "marketInsight" && _liveData && _liveData.insights.length > 0) {
      return applyOpts(_liveData.insights, opts);
    }
    return getObjects(objectType, opts) as (Trend | Insight | Recommendation)[];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectType, JSON.stringify(opts), version]);

  return { data, isLoading: false };
}

// ─── useOsdkObject (single) ───────────────────────────────────────────────────
export function useOsdkObject(objectType: ObjectType, id: string) {
  const version = useSyncExternalStore(_subscribe, _getVersion);

  useEffect(() => {
    void fetchLiveData();
    void fetchLiveRecommendations();
  }, []);

  const object = useMemo(() => {
    if (objectType === "marketTrend") {
      return _liveData?.trends.find(t => t.trendId === id || t.$primaryKey === id);
    }
    if (objectType === "marketRecommendation") return getRecs().find(r => r.recommendationId === id);
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectType, id, version]);
  return { object, isLoading: false };
}

// ─── useLinks ─────────────────────────────────────────────────────────────────
export function useLinks(
  obj: Trend | Insight | Recommendation | undefined,
  linkType: string,
  opts?: Record<string, unknown>,
) {
  void opts;
  const links = useMemo(() => {
    if (!obj) return [];
    const trendId = (obj as Trend).trendId;
    if (!trendId) return [];

    if (linkType.includes("Recommendations")) {
      return getRecs().filter(r => r.trendId === trendId) as Recommendation[];
    }
    // Sources and Demographics have no live data pipeline — return empty
    return [];
  }, [obj, linkType]);

  return { links, isLoading: false };
}

// ─── useOsdkAction ────────────────────────────────────────────────────────────
export function useOsdkAction(actionType: string) {
  const [isPending, setIsPending] = useState(false);

  const applyAction = async (params: Record<string, unknown>) => {
    setIsPending(true);
    await new Promise(r => setTimeout(r, 400)); // simulate latency

    if (actionType === "updateRecommendationStatus") {
      const rec = params.recommendation as Recommendation;
      const status = params.status as string;
      _statusOverrides.set(rec.$primaryKey, status);
      _notify();
    }

    if (actionType === "bookmarkTrend") {
      // no-op for now — trend status toggle is visual only
    }

    setIsPending(false);
  };

  return { applyAction, isPending };
}
