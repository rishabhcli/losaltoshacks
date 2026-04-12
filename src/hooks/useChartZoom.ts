import { useState, useMemo, useCallback } from "react";
import type { TrendDataPoint } from "@/lib/trendChartData";

export function useChartZoom(data: TrendDataPoint[]) {
  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState<number | null>(null);

  const effectiveEnd = endIdx ?? data.length - 1;
  const isZoomed = startIdx > 0 || effectiveEnd < data.length - 1;

  const visibleData = useMemo(() => {
    return data.slice(startIdx, effectiveEnd + 1);
  }, [data, startIdx, effectiveEnd]);

  const zoomIn = useCallback(() => {
    const range = effectiveEnd - startIdx;
    if (range <= 3) return; // minimum 4 points
    const shrink = Math.max(1, Math.floor(range * 0.2));
    setStartIdx(prev => Math.min(prev + shrink, effectiveEnd - 3));
    setEndIdx(Math.max(startIdx + 3, effectiveEnd - shrink));
  }, [startIdx, effectiveEnd]);

  const zoomOut = useCallback(() => {
    const range = effectiveEnd - startIdx;
    const grow = Math.max(1, Math.floor(range * 0.25));
    setStartIdx(prev => Math.max(0, prev - grow));
    setEndIdx(Math.min(data.length - 1, effectiveEnd + grow));
  }, [startIdx, effectiveEnd, data.length]);

  const resetZoom = useCallback(() => {
    setStartIdx(0);
    setEndIdx(null);
  }, []);

  // Reset zoom when data length changes (time frame switch)
  useMemo(() => {
    setStartIdx(0);
    setEndIdx(null);
  }, [data.length]);

  return { visibleData, isZoomed, zoomIn, zoomOut, resetZoom };
}

/**
 * For merged chart data (multiple series in one object array),
 * zoom by slicing the array indices.
 */
export function useMergedChartZoom<T>(data: T[]) {
  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState<number | null>(null);

  const effectiveEnd = endIdx ?? data.length - 1;
  const isZoomed = startIdx > 0 || effectiveEnd < data.length - 1;

  const visibleData = useMemo(() => {
    return data.slice(startIdx, effectiveEnd + 1);
  }, [data, startIdx, effectiveEnd]);

  const zoomIn = useCallback(() => {
    const range = effectiveEnd - startIdx;
    if (range <= 3) return;
    const shrink = Math.max(1, Math.floor(range * 0.2));
    setStartIdx(prev => Math.min(prev + shrink, effectiveEnd - 3));
    setEndIdx(Math.max(startIdx + 3, effectiveEnd - shrink));
  }, [startIdx, effectiveEnd]);

  const zoomOut = useCallback(() => {
    const range = effectiveEnd - startIdx;
    const grow = Math.max(1, Math.floor(range * 0.25));
    setStartIdx(prev => Math.max(0, prev - grow));
    setEndIdx(Math.min(data.length - 1, effectiveEnd + grow));
  }, [startIdx, effectiveEnd, data.length]);

  const resetZoom = useCallback(() => {
    setStartIdx(0);
    setEndIdx(null);
  }, []);

  useMemo(() => {
    setStartIdx(0);
    setEndIdx(null);
  }, [data.length]);

  return { visibleData, isZoomed, zoomIn, zoomOut, resetZoom };
}
