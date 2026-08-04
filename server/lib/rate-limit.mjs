export function createRateLimiter({
  windowMs = 60_000,
  maxEntries = 10_000,
} = {}) {
  const buckets = new Map();

  function prune(now) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
    while (buckets.size > maxEntries) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey === undefined) break;
      buckets.delete(oldestKey);
    }
  }

  function check(key, limit, now = Date.now()) {
    prune(now);
    const normalizedLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 1;
    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;
    const allowed = bucket.count <= normalizedLimit;
    return {
      allowed,
      count: bucket.count,
      limit: normalizedLimit,
      remaining: Math.max(0, normalizedLimit - bucket.count),
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return { check };
}
