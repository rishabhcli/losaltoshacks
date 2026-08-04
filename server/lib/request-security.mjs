export function parseList(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function resolveCorsOrigin({ origin, demoMode = false, allowedOrigins = [] } = {}) {
  const normalizedOrigin = String(origin ?? "").trim();
  if (!normalizedOrigin) return "";
  if (demoMode) return "*";
  return allowedOrigins.includes(normalizedOrigin) ? normalizedOrigin : "";
}

function isPrivateHostname(hostname) {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host === "::1" ||
    host.startsWith("fc") ||
    host.startsWith("fd") ||
    host.startsWith("fe80:")
  ) {
    return true;
  }

  const octets = host.split(".").map((part) => Number.parseInt(part, 10));
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [first, second] = octets;
  return first === 0 || first === 10 || first === 127 || (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168);
}

export function validateImageUrl(value, { allowedHosts = [] } = {}) {
  if (value == null || String(value).trim() === "") return { ok: true, url: undefined };
  if (typeof value !== "string" || value.length > 2048) {
    return { ok: false, message: "imageUrl must be a short HTTPS URL." };
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return { ok: false, message: "imageUrl must be a valid HTTPS URL." };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || isPrivateHostname(hostname)) {
    return { ok: false, message: "imageUrl must use HTTPS and a public hostname without credentials." };
  }
  if (!allowedHosts.includes(hostname)) {
    return {
      ok: false,
      message: "imageUrl host is not allow-listed. Configure MARKETPULSE_ALLOWED_IMAGE_HOSTS before enabling remote images.",
    };
  }

  return { ok: true, url: parsed.toString() };
}
