import assert from "node:assert/strict";
import test from "node:test";
import {
  boundedInteger,
  boundedNumber,
  sanitizeAgentRow,
  sanitizeBusinessPlanRow,
  sanitizeDiscoveryRow,
} from "./response-validation.mjs";

test("bounded numeric helpers reject non-finite and out-of-range values", () => {
  assert.equal(boundedNumber("0.75", { min: 0, max: 1 }), 0.75);
  assert.equal(boundedNumber("Infinity", { fallback: null, min: 0, max: 1 }), null);
  assert.equal(boundedInteger(2.5, { fallback: 0, min: 0, max: 10 }), 0);
  assert.equal(boundedInteger(11, { fallback: 0, min: 0, max: 10 }), 0);
});

test("persisted telemetry is normalized to schema-safe ranges", () => {
  assert.deepEqual(sanitizeAgentRow({ agent_id: "9", energy: "Infinity", confidence: 2 }), {
    agent_id: 0,
    energy: 0,
    confidence: null,
    retry_count: 0,
  });
  assert.deepEqual(sanitizeDiscoveryRow({ agent_id: 2, likes: -1, views: "bad", comments: 4.5 }), {
    agent_id: 2,
    likes: 0,
    views: 0,
    comments: 0,
  });
  assert.deepEqual(sanitizeBusinessPlanRow({ version: "bad", confidence_score: 101, discovery_count: "NaN" }), {
    version: 1,
    confidence_score: 0,
    discovery_count: 0,
  });
});
