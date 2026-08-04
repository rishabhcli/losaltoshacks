import { describe, expect, test } from "vitest";
import { createApiAuthenticator, getBearerToken } from "../../server/lib/api-auth.mjs";
import { createRateLimiter } from "../../server/lib/rate-limit.mjs";
import { validateImageUrl } from "../../server/lib/request-security.mjs";

describe("API authentication", () => {
  test("extracts bearer tokens case-insensitively", () => {
    expect(getBearerToken({ headers: { authorization: "bearer user-token" } })).toBe("user-token");
    expect(getBearerToken({ headers: {} })).toBe("");
  });

  test("rejects requests without a user session before contacting InsForge", async () => {
    let calls = 0;
    const authenticate = createApiAuthenticator({
      getBaseUrl: "https://example.test",
      fetchImpl: async () => {
        calls += 1;
        throw new Error("should not be called");
      },
    });

    await expect(authenticate({ headers: {} })).resolves.toEqual(expect.objectContaining({
      ok: false,
      statusCode: 401,
      body: expect.objectContaining({ error: "authentication_required" }),
    }));
    expect(calls).toBe(0);
  });

  test("accepts a validated user and caches the session briefly", async () => {
    let calls = 0;
    const authenticate = createApiAuthenticator({
      getBaseUrl: "https://example.test/",
      fetchImpl: async (_url, options) => {
        calls += 1;
        expect(options.headers.Authorization).toBe("Bearer user-token");
        return new Response(JSON.stringify({ user: { id: "user-1", email: "user@example.test" } }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
      cacheTtlMs: 60_000,
    });

    const request = { headers: { authorization: "Bearer user-token" } };
    await expect(authenticate(request)).resolves.toEqual(expect.objectContaining({
      ok: true,
      user: { id: "user-1", email: "user@example.test" },
    }));
    await expect(authenticate(request)).resolves.toEqual(expect.objectContaining({ ok: true }));
    expect(calls).toBe(1);
  });

  test("distinguishes expired sessions from an unavailable auth provider", async () => {
    const invalid = createApiAuthenticator({
      getBaseUrl: "https://example.test",
      fetchImpl: async () => new Response("{}", { status: 401 }),
    });
    await expect(invalid({ headers: { authorization: "Bearer expired" } })).resolves.toEqual(expect.objectContaining({
      statusCode: 401,
      body: expect.objectContaining({ error: "invalid_session" }),
    }));

    const unavailable = createApiAuthenticator({
      getBaseUrl: "https://example.test",
      fetchImpl: async () => new Response("{}", { status: 503 }),
    });
    await expect(unavailable({ headers: { authorization: "Bearer user-token" } })).resolves.toEqual(expect.objectContaining({
      statusCode: 503,
      body: expect.objectContaining({ error: "auth_provider_unavailable" }),
    }));
  });

  test("limits repeated requests and returns a retry window", () => {
    const limiter = createRateLimiter({ windowMs: 10_000 });
    expect(limiter.check("client", 2, 100).allowed).toBe(true);
    expect(limiter.check("client", 2, 101).allowed).toBe(true);
    expect(limiter.check("client", 2, 102)).toEqual(expect.objectContaining({
      allowed: false,
      retryAfterSeconds: 10,
    }));
  });

  test("rejects private or unallow-listed inference image URLs", () => {
    expect(validateImageUrl("http://127.0.0.1:8080/admin", { allowedHosts: ["127.0.0.1"] }).ok).toBe(false);
    expect(validateImageUrl("https://images.example.test/a.png", { allowedHosts: [] }).ok).toBe(false);
    expect(validateImageUrl("https://images.example.test/a.png", { allowedHosts: ["images.example.test"] })).toEqual({
      ok: true,
      url: "https://images.example.test/a.png",
    });
  });
});
