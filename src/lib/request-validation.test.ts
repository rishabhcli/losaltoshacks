import { describe, expect, it } from "vitest";
import {
  parseBoundedInteger,
  RequestValidationError,
  validateAgentRetryBody,
  validateInferBody,
  validateSemanticSearchBody,
  validateTtsBody,
  validateTrendAnalysisBody,
} from "../../server/lib/request-validation.mjs";

describe("request validation", () => {
  it("normalizes valid inference and trend inputs", () => {
    expect(validateInferBody({ userPrompt: "  find the wedge  ", temperature: 0.4 })).toEqual({
      systemPrompt: undefined,
      userPrompt: "find the wedge",
      imageUrl: undefined,
      model: undefined,
      temperature: 0.4,
    });
    expect(validateTrendAnalysisBody({ title: "Routine planners", trendScore: 82, mentionCount: 10 })).toMatchObject({
      title: "Routine planners",
      trendScore: 82,
      mentionCount: 10,
    });
  });

  it("rejects wrong shapes before provider calls", () => {
    expect(() => validateInferBody({ userPrompt: 42 })).toThrow(RequestValidationError);
    expect(() => validateTrendAnalysisBody({ title: "x", growthRate: "fast" })).toThrow(/growthRate/);
    expect(() => validateAgentRetryBody({ agentId: "3" })).toThrow(/agentId/);
  });

  it("enforces provider and search numeric ranges", () => {
    expect(validateTtsBody({ text: "hello", speed: 1.2 }, { miniMax: true }).speed).toBe(1.2);
    expect(() => validateTtsBody({ text: "hello", speed: 3 }, { miniMax: true })).toThrow(/speed/);
    expect(() => validateSemanticSearchBody({ query: "trend", limit: 51 })).toThrow(/limit/);
    expect(validateSemanticSearchBody({ query: "trend", limit: 12, agent_id: 3 }).agent_id).toBe(3);
  });

  it("clamps query integer parsing to an explicit range", () => {
    expect(parseBoundedInteger(undefined, { defaultValue: 20, min: 1, max: 50, field: "limit" })).toBe(20);
    expect(parseBoundedInteger("50", { defaultValue: 20, min: 1, max: 50, field: "limit" })).toBe(50);
    expect(() => parseBoundedInteger("not-a-number", { defaultValue: 20, min: 1, max: 50, field: "limit" })).toThrow(/limit/);
    expect(() => parseBoundedInteger("51", { defaultValue: 20, min: 1, max: 50, field: "limit" })).toThrow(/limit/);
  });
});
