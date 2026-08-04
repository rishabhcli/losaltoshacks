const MAX_SAFE_COUNT = Number.MAX_SAFE_INTEGER;
const MAX_RETRY_COUNT = 1_000_000;
const MAX_TOKEN_COUNT = 1_000_000_000;
const MAX_DURATION_MS = 86_400_000;

function asFiniteNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function boundedNumber(value, {
  fallback = null,
  min = -Infinity,
  max = Infinity,
} = {}) {
  const parsed = asFiniteNumber(value);
  return parsed !== null && parsed >= min && parsed <= max ? parsed : fallback;
}

export function boundedInteger(value, {
  fallback = 0,
  min = 0,
  max = MAX_SAFE_COUNT,
} = {}) {
  const parsed = asFiniteNumber(value);
  return parsed !== null && Number.isSafeInteger(parsed) && parsed >= min && parsed <= max
    ? parsed
    : fallback;
}

function optionalAgentId(value) {
  return value == null
    ? null
    : boundedInteger(value, { fallback: null, min: 1, max: 5 });
}

export function sanitizeAgentRow(row) {
  return {
    ...row,
    agent_id: boundedInteger(row?.agent_id, { fallback: 0, min: 1, max: 5 }),
    energy: boundedInteger(row?.energy, { fallback: 0, min: 0, max: 100 }),
    retry_count: boundedInteger(row?.retry_count, { fallback: 0, min: 0, max: MAX_RETRY_COUNT }),
    confidence: row?.confidence == null
      ? null
      : boundedNumber(row.confidence, { fallback: null, min: 0, max: 1 }),
  };
}

export function sanitizeDiscoveryRow(row) {
  return {
    ...row,
    agent_id: boundedInteger(row?.agent_id, { fallback: 0, min: 1, max: 5 }),
    likes: boundedInteger(row?.likes, { fallback: 0, min: 0, max: MAX_SAFE_COUNT }),
    views: boundedInteger(row?.views, { fallback: 0, min: 0, max: MAX_SAFE_COUNT }),
    comments: boundedInteger(row?.comments, { fallback: 0, min: 0, max: MAX_SAFE_COUNT }),
  };
}

export function sanitizeLogRow(row) {
  return {
    ...row,
    agent_id: optionalAgentId(row?.agent_id),
  };
}

export function sanitizeSignalRow(row) {
  return {
    ...row,
    from_agent: boundedInteger(row?.from_agent, { fallback: 0, min: 1, max: 5 }),
    to_agent: boundedInteger(row?.to_agent, { fallback: 0, min: 1, max: 5 }),
  };
}

export function sanitizeThoughtRow(row) {
  return {
    ...row,
    agent_id: optionalAgentId(row?.agent_id),
    tokens_used: boundedInteger(row?.tokens_used, { fallback: 0, min: 0, max: MAX_TOKEN_COUNT }),
    duration_ms: boundedInteger(row?.duration_ms, { fallback: 0, min: 0, max: MAX_DURATION_MS }),
  };
}

export function sanitizeMemoryRow(row) {
  return {
    ...row,
    version: boundedInteger(row?.version, { fallback: 1, min: 1, max: MAX_RETRY_COUNT }),
  };
}

export function sanitizeBusinessPlanRow(row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return null;
  return {
    ...row,
    version: boundedInteger(row.version, { fallback: 1, min: 1, max: MAX_RETRY_COUNT }),
    confidence_score: boundedInteger(row.confidence_score, { fallback: 0, min: 0, max: 100 }),
    discovery_count: boundedInteger(row.discovery_count, { fallback: 0, min: 0, max: MAX_SAFE_COUNT }),
  };
}

export function sanitizeRows(rows, sanitizer) {
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((row) => row && typeof row === "object" && !Array.isArray(row))
    .map(sanitizer);
}

export function sanitizeBusinessPlanRows(rows) {
  return sanitizeRows(rows, sanitizeBusinessPlanRow).filter(Boolean);
}
