/**
 * osdk-shims.ts
 *
 * Drop-in replacements for @osdk/react/experimental hooks.
 * Fetches live data from the AI server (derived from scraped discoveries + business plans).
 * Falls back to mock data when no live mission data is available.
 */

import { useEffect, useMemo, useState, useSyncExternalStore, useCallback } from "react";
import {
  type MockTrend,
  type MockInsight,
  type MockRecommendation,
} from "./mockData";

// ─── Type tokens (replacing @osdk/src exports) ────────────────────────────────
export const marketTrend = "marketTrend";
export const marketInsight = "marketInsight";
export const marketRecommendation = "marketRecommendation";

// ─── Live data from AI server ─────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const LIVE_CACHE_TTL = 60_000; // 1 minute
const RECS_CACHE_TTL = 5 * 60_000; // 5 minutes (matches server-side cache)

interface LiveData {
  trends: MockTrend[];
  insights: MockInsight[];
}

let _liveData: LiveData | null = null;
let _liveFetchedAt = 0;
let _liveFetchPromise: Promise<void> | null = null;

let _liveRecs: MockRecommendation[] | null = null;
let _liveRecsFetchedAt = 0;
let _liveRecsFetchPromise: Promise<void> | null = null;

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
      const trends = (data.trends ?? []) as MockTrend[];
      const insights = (data.insights ?? []) as MockInsight[];
      if (trends.length > 0 || insights.length > 0) {
        _liveData = { trends, insights };
        _liveFetchedAt = Date.now();
        _notify();
      }
    })
    .catch(() => { /* silently fall back to mock data */ })
    .finally(() => { _liveFetchPromise = null; });

  return _liveFetchPromise;
}

function fetchLiveRecommendations(): Promise<void> {
  const now = Date.now();
  if (_liveRecs && now - _liveRecsFetchedAt < RECS_CACHE_TTL) return Promise.resolve();
  if (_liveRecsFetchPromise) return _liveRecsFetchPromise;

  _liveRecsFetchPromise = fetch(`${API_BASE}/api/recommendations`, { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<{ recommendations?: unknown[] }>;
    })
    .then((data) => {
      const recs = (data.recommendations ?? []) as MockRecommendation[];
      if (recs.length > 0) {
        _liveRecs = recs;
        _liveRecsFetchedAt = Date.now();
        _notify();
      }
    })
    .catch(() => { /* silently fall back to mock data */ })
    .finally(() => { _liveRecsFetchPromise = null; });

  return _liveRecsFetchPromise;
}

function applyOpts(
  items: (MockTrend | MockInsight | MockRecommendation)[],
  opts?: Record<string, unknown>,
): (MockTrend | MockInsight | MockRecommendation)[] {
  let result = [...items];
  const orderBy = (opts as { orderBy?: Record<string, string> } | undefined)?.orderBy;
  if (orderBy) {
    const [key, dir] = Object.entries(orderBy)[0];
    result.sort((a, b) => {
      const av = (a as Record<string, unknown>)[key];
      const bv = (b as Record<string, unknown>)[key];
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

function getRecs(): MockRecommendation[] {
  const base = _liveRecs ?? [];
  return base.map(r => {
    const override = _statusOverrides.get(r.$primaryKey);
    return override ? { ...r, status: override } : { ...r };
  });
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
        const av = (a as Record<string, unknown>)[key] as number ?? 0;
        const bv = (b as Record<string, unknown>)[key] as number ?? 0;
        return dir === "desc" ? bv - av : av - bv;
      });
    }
    return result;
  }

  if (objectType === "marketInsight") {
    let result = [...(_liveData?.insights ?? [])];
    const orderBy = (opts as { orderBy?: Record<string, string> } | undefined)?.orderBy;
    if (orderBy) {
      const [key, dir] = Object.entries(orderBy)[0];
      result.sort((a, b) => {
        const av = (a as Record<string, unknown>)[key] as string ?? "";
        const bv = (b as Record<string, unknown>)[key] as string ?? "";
        return dir === "desc" ? bv.localeCompare(av) : av.localeCompare(bv);
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
    const orderBy = (opts as { orderBy?: Record<string, string> } | undefined)?.orderBy;
    if (orderBy) {
      const [key, dir] = Object.entries(orderBy)[0];
      result.sort((a, b) => {
        const av = (a as Record<string, unknown>)[key] as number ?? 0;
        const bv = (b as Record<string, unknown>)[key] as number ?? 0;
        return dir === "desc" ? bv - av : av - bv;
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
    void fetchLiveRecommendations();
  }, []);

  const data = useMemo(() => {
    if (objectType === "marketTrend" && _liveData && _liveData.trends.length > 0) {
      return applyOpts(_liveData.trends, opts);
    }
    if (objectType === "marketInsight" && _liveData && _liveData.insights.length > 0) {
      return applyOpts(_liveData.insights, opts);
    }
    return getObjects(objectType, opts) as (MockTrend | MockInsight | MockRecommendation)[];
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
  obj: MockTrend | MockInsight | MockRecommendation | undefined,
  linkType: string,
  _opts?: Record<string, unknown>
) {
  const links = useMemo(() => {
    if (!obj) return [];
    const trendId = (obj as MockTrend).trendId;
    if (!trendId) return [];

    if (linkType.includes("Recommendations")) {
      return getRecs().filter(r => r.trendId === trendId) as MockRecommendation[];
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
      const rec = params.recommendation as MockRecommendation;
      const status = params.status as string;
      _statusOverrides.set(rec.$primaryKey, status);
      _notify();
    }

    if (actionType === "bookmarkTrend") {
      // no-op for mock — trend status toggle is visual only
    }

    setIsPending(false);
  };

  return { applyAction, isPending };
}
