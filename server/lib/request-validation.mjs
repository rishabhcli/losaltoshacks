export class RequestValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "RequestValidationError";
    this.code = "invalid_request";
    this.statusCode = 400;
  }
}

function invalid(field, expectation) {
  throw new RequestValidationError(`${field} ${expectation}.`);
}

function objectBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new RequestValidationError("Request body must be a JSON object.");
  }
  return body;
}

function optionalString(body, field, maxLength) {
  const value = body[field];
  if (value == null) return undefined;
  if (typeof value !== "string") invalid(field, "must be a string");
  const normalized = value.trim();
  if (normalized.length > maxLength) invalid(field, `must be at most ${maxLength} characters`);
  return normalized;
}

function requiredString(body, field, maxLength) {
  const value = body[field];
  if (value == null) return "";
  if (typeof value !== "string") invalid(field, "must be a string");
  const normalized = value.trim();
  if (normalized.length > maxLength) invalid(field, `must be at most ${maxLength} characters`);
  return normalized;
}

function optionalNumber(body, field, { min = -Infinity, max = Infinity, integer = false, allowEmpty = false } = {}) {
  const value = body[field];
  if (value == null || (allowEmpty && value === "")) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value)) invalid(field, "must be a finite number");
  if (integer && !Number.isInteger(value)) invalid(field, "must be an integer");
  if (value < min || value > max) invalid(field, `must be between ${min} and ${max}`);
  return value;
}

function optionalAgentId(body, field = "agentId") {
  const value = body[field];
  if (value == null) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value)) invalid(field, "must be a finite number");
  return value;
}

export function validateMissionCreateBody(body) {
  const value = objectBody(body);
  return { prompt: requiredString(value, "prompt", 20_000) };
}

export function validateMissionReferenceBody(body) {
  const value = objectBody(body);
  return { missionId: optionalString(value, "missionId", 128) };
}

export function validateAgentRetryBody(body) {
  const value = objectBody(body);
  return {
    agentId: optionalAgentId(value),
    missionId: optionalString(value, "missionId", 128),
  };
}

export function validateTtsBody(body, { miniMax = false } = {}) {
  const value = objectBody(body);
  return {
    text: requiredString(value, "text", 10_000),
    voiceId: optionalString(value, "voiceId", 128),
    speed: miniMax ? optionalNumber(value, "speed", { min: 0.5, max: 2 }) : undefined,
    volume: miniMax ? optionalNumber(value, "volume", { min: 0, max: 10 }) : undefined,
    pitch: miniMax ? optionalNumber(value, "pitch", { min: -12, max: 12 }) : undefined,
  };
}

export function validateInferBody(body) {
  const value = objectBody(body);
  return {
    systemPrompt: optionalString(value, "systemPrompt", 10_000),
    userPrompt: requiredString(value, "userPrompt", 30_000),
    imageUrl: optionalString(value, "imageUrl", 2_048),
    model: optionalString(value, "model", 128),
    temperature: optionalNumber(value, "temperature", { min: 0, max: 2 }),
  };
}

export function validateSemanticSearchBody(body) {
  const value = objectBody(body);
  const rawAgentId = value.agent_id;
  return {
    query: requiredString(value, "query", 2_000),
    limit: optionalNumber(value, "limit", { min: 1, max: 50, integer: true, allowEmpty: true }) ?? 12,
    mission_id: optionalString(value, "mission_id", 128),
    industry: optionalString(value, "industry", 256),
    platform: optionalString(value, "platform", 256),
    agent_id: rawAgentId == null || rawAgentId === ""
      ? undefined
      : optionalNumber(value, "agent_id", { min: 1, max: 5, integer: true }),
  };
}

export function validateTrendAnalysisBody(body) {
  const value = objectBody(body);
  return {
    title: requiredString(value, "title", 500),
    industry: optionalString(value, "industry", 256),
    description: optionalString(value, "description", 5_000),
    keywords: optionalString(value, "keywords", 2_000),
    trendScore: optionalNumber(value, "trendScore", { min: 0, max: 100 }),
    growthRate: optionalNumber(value, "growthRate", { min: -100_000, max: 100_000 }),
    mentionCount: optionalNumber(value, "mentionCount", { min: 0, max: Number.MAX_SAFE_INTEGER, integer: true }),
  };
}

export function validateThemeBody(body) {
  const value = objectBody(body);
  const theme = optionalString(value, "theme", 16);
  if (theme !== "dark" && theme !== "light") invalid("theme", "must be either dark or light");
  return { theme };
}

export function validateBackgroundRefreshInspectionBody(body) {
  const value = objectBody(body);
  const filename = optionalString(value, "filename", 255);
  const runtimeRelativePath = optionalString(value, "runtimeRelativePath", 1_024);
  const providedPath = optionalString(value, "path", 1_024);
  const sha256 = optionalString(value, "sha256", 128);

  if (!filename && !runtimeRelativePath && !providedPath) {
    throw new RequestValidationError("One of filename, runtimeRelativePath, or path is required.");
  }
  if (sha256 && !/^[a-f0-9]{64}$/i.test(sha256)) {
    invalid("sha256", "must be a 64-character hexadecimal digest");
  }

  return { filename, runtimeRelativePath, path: providedPath, sha256 };
}

export function parseBoundedInteger(value, { defaultValue, min, max, field = "value" } = {}) {
  if (value == null || String(value).trim() === "") return defaultValue;
  const normalized = String(value).trim();
  if (!/^-?\d+$/.test(normalized)) invalid(field, "must be an integer");
  const parsed = Number(normalized);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    invalid(field, `must be between ${min} and ${max}`);
  }
  return parsed;
}
