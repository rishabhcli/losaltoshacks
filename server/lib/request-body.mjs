export const DEFAULT_JSON_BODY_LIMIT_BYTES = 1024 * 1024;

export class JsonBodyError extends Error {
  constructor({ code, statusCode, message }) {
    super(message);
    this.name = "JsonBodyError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function getJsonBodyLimitBytes(value = process.env.MARKETPULSE_MAX_BODY_BYTES) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_JSON_BODY_LIMIT_BYTES;
}

function getContentLength(request) {
  const value = request?.headers?.["content-length"] ?? request?.headers?.["Content-Length"];
  if (value == null || String(value).trim() === "") return null;

  const parsed = Number.parseInt(String(value), 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function tooLargeError(limitBytes) {
  return new JsonBodyError({
    code: "payload_too_large",
    statusCode: 413,
    message: `JSON request body exceeds the ${limitBytes}-byte limit.`,
  });
}

function invalidJsonError() {
  return new JsonBodyError({
    code: "invalid_json_body",
    statusCode: 400,
    message: "Request body must contain valid JSON.",
  });
}

export async function readJsonBody(request, { maxBytes = getJsonBodyLimitBytes() } = {}) {
  const limitBytes = getJsonBodyLimitBytes(maxBytes);
  const contentLength = getContentLength(request);
  if (contentLength != null && contentLength > limitBytes) {
    request.resume?.();
    throw tooLargeError(limitBytes);
  }

  const chunks = [];
  let receivedBytes = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    receivedBytes += buffer.length;
    if (receivedBytes > limitBytes) {
      request.resume?.();
      throw tooLargeError(limitBytes);
    }
    chunks.push(buffer);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};

  try {
    return JSON.parse(raw);
  } catch {
    throw invalidJsonError();
  }
}
