const DEFAULT_TIMEOUT_MS = 2500;
const DEFAULT_CACHE_TTL_MS = 15_000;

function compactMessage(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

export function getBearerToken(request) {
  const header = String(request?.headers?.authorization ?? "").trim();
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
}

export function createApiAuthenticator({
  getBaseUrl,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  cacheTtlMs = DEFAULT_CACHE_TTL_MS,
} = {}) {
  const sessionCache = new Map();

  return async function authenticate(request) {
    const token = getBearerToken(request);
    if (!token) {
      return {
        ok: false,
        statusCode: 401,
        body: {
          ok: false,
          error: "authentication_required",
          message: "A valid InsForge user session is required for this API route.",
        },
      };
    }

    const cached = sessionCache.get(token);
    if (cached && cached.expiresAt > Date.now()) {
      return { ok: true, user: cached.user };
    }
    sessionCache.delete(token);

    const baseUrl = String(typeof getBaseUrl === "function" ? getBaseUrl() : getBaseUrl ?? "")
      .trim()
      .replace(/\/+$/, "");
    if (!baseUrl) {
      return {
        ok: false,
        statusCode: 503,
        body: {
          ok: false,
          error: "auth_provider_unavailable",
          message: "InsForge authentication is not configured for the API server.",
        },
      };
    }

    try {
      const response = await fetchImpl(`${baseUrl}/api/auth/sessions/current`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(timeoutMs),
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (response.status === 401 || response.status === 403) {
        return {
          ok: false,
          statusCode: 401,
          body: {
            ok: false,
            error: "invalid_session",
            message: "The InsForge session is missing, expired, or invalid.",
          },
        };
      }

      if (!response.ok) {
        return {
          ok: false,
          statusCode: 503,
          body: {
            ok: false,
            error: "auth_provider_unavailable",
            message: `InsForge session validation failed with HTTP ${response.status}.`,
          },
        };
      }

      const user = payload?.user ?? payload?.data?.user ?? null;
      if (!user?.id) {
        return {
          ok: false,
          statusCode: 401,
          body: {
            ok: false,
            error: "invalid_session",
            message: "InsForge did not return an authenticated user for this session.",
          },
        };
      }

      sessionCache.set(token, {
        user,
        expiresAt: Date.now() + cacheTtlMs,
      });
      return { ok: true, user };
    } catch (error) {
      return {
        ok: false,
        statusCode: 503,
        body: {
          ok: false,
          error: "auth_provider_unavailable",
          message: compactMessage(error?.message ?? error) || "InsForge session validation failed.",
        },
      };
    }
  };
}
