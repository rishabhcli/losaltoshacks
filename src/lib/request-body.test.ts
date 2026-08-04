import { Readable } from "node:stream";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_JSON_BODY_LIMIT_BYTES,
  getJsonBodyLimitBytes,
  readJsonBody,
} from "../../server/lib/request-body.mjs";

function createRequest(chunks: Array<string | Buffer>, headers: Record<string, string> = {}) {
  const request = Readable.from(chunks) as Readable & { headers: Record<string, string> };
  request.headers = headers;
  return request;
}

describe("readJsonBody", () => {
  it("rejects an oversized content-length before buffering the body", async () => {
    const request = createRequest([Buffer.from('{"prompt":"ok"}')], { "content-length": "20" });

    await expect(readJsonBody(request, { maxBytes: 10 })).rejects.toMatchObject({
      code: "payload_too_large",
      statusCode: 413,
    });
  });

  it("rejects chunked bodies when their accumulated bytes exceed the limit", async () => {
    const request = createRequest([Buffer.from('{"prompt":"'), Buffer.alloc(12, "x"), Buffer.from('"}')]);

    await expect(readJsonBody(request, { maxBytes: 16 })).rejects.toMatchObject({
      code: "payload_too_large",
      statusCode: 413,
    });
  });

  it("parses bounded JSON and treats an empty body as an empty object", async () => {
    await expect(readJsonBody(createRequest(['{"prompt":"hello"}']), { maxBytes: 100 }))
      .resolves.toEqual({ prompt: "hello" });
    await expect(readJsonBody(createRequest([]), { maxBytes: 100 })).resolves.toEqual({});
  });

  it("returns a client error for malformed JSON", async () => {
    await expect(readJsonBody(createRequest(["not-json"]), { maxBytes: 100 })).rejects.toMatchObject({
      code: "invalid_json_body",
      statusCode: 400,
    });
  });

  it("uses a bounded default when the environment value is invalid", async () => {
    expect(getJsonBodyLimitBytes("not-a-number")).toBe(DEFAULT_JSON_BODY_LIMIT_BYTES);
    expect(getJsonBodyLimitBytes("0")).toBe(DEFAULT_JSON_BODY_LIMIT_BYTES);
    await expect(readJsonBody(createRequest(["{}"]))).resolves.toEqual({});
    expect(DEFAULT_JSON_BODY_LIMIT_BYTES).toBe(1024 * 1024);
  });
});
