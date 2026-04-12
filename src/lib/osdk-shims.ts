/**
 * osdk-shims.ts
 *
 * Drop-in replacements for @osdk/react/experimental hooks.
 * Returns mock data so the app works without any Palantir / Foundry connection.
 */

import { useMemo, useState } from "react";
import {
  MOCK_TRENDS,
  MOCK_INSIGHTS,
  MOCK_RECOMMENDATIONS,
  MOCK_SOURCES,
  MOCK_DEMOGRAPHICS,
  type MockTrend,
  type MockInsight,
  type MockRecommendation,
  type MockSource,
  type MockDemographic,
} from "./mockData";

// ─── Type tokens (replacing @osdk/src exports) ────────────────────────────────
export const marketTrend = "marketTrend";
export const marketInsight = "marketInsight";
export const marketRecommendation = "marketRecommendation";

// $Actions shims
export const $Actions = {
  updateRecommendationStatus: "updateRecommendationStatus",
  bookmarkTrend: "bookmarkTrend",
} as const;

type ObjectType = typeof marketTrend | typeof marketInsight | typeof marketRecommendation;

// Mutable recommendation state (in-memory, survives re-renders via module scope)
let _recs: MockRecommendation[] = MOCK_RECOMMENDATIONS.map(r => ({ ...r }));

function getObjects(objectType: ObjectType, opts?: Record<string, unknown>): unknown[] {
  if (objectType === "marketTrend") {
    let result = [...MOCK_TRENDS];
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
    let result = [...MOCK_INSIGHTS];
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
    let result = [..._recs];
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
  const data = useMemo(() => getObjects(objectType, opts) as (MockTrend | MockInsight | MockRecommendation)[], 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [objectType, JSON.stringify(opts)]
  );
  return { data, isLoading: false };
}

// ─── useOsdkObject (single) ───────────────────────────────────────────────────
export function useOsdkObject(objectType: ObjectType, id: string) {
  const object = useMemo(() => {
    if (objectType === "marketTrend") return MOCK_TRENDS.find(t => t.trendId === id || t.$primaryKey === id);
    if (objectType === "marketRecommendation") return _recs.find(r => r.recommendationId === id);
    return undefined;
  }, [objectType, id]);
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

    if (linkType.includes("Sources")) {
      return MOCK_SOURCES.filter(s => s.trendId === trendId) as MockSource[];
    }
    if (linkType.includes("Demographics")) {
      return MOCK_DEMOGRAPHICS.filter(d => d.trendId === trendId) as MockDemographic[];
    }
    if (linkType.includes("Recommendations")) {
      return _recs.filter(r => r.trendId === trendId) as MockRecommendation[];
    }
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
      const idx = _recs.findIndex(r => r.$primaryKey === rec.$primaryKey);
      if (idx !== -1) _recs[idx] = { ..._recs[idx], status };
    }

    if (actionType === "bookmarkTrend") {
      // no-op for mock — trend status toggle is visual only
    }

    setIsPending(false);
  };

  return { applyAction, isPending };
}
