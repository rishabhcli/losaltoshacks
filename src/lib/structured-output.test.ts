import { describe, expect, it } from "vitest";
import {
  assertBusinessPlanObject,
  assertObjectArray,
  assertRecommendationArray,
  assertRequiredObjectKeys,
  parseModelJson,
  parseProviderJson,
  StructuredOutputError,
} from "../../server/lib/structured-output.mjs";

describe("structured model output", () => {
  it("parses direct, fenced, and prose-wrapped JSON", () => {
    expect(parseModelJson('{"ok":true}', { expectedType: "object" })).toEqual({ ok: true });
    expect(parseModelJson("```json\n[{\"title\":\"A\"}]\n```", { expectedType: "array" })).toEqual([{ title: "A" }]);
    expect(parseModelJson("Here is the result:\n[1, 2, 3]\nDone.", { expectedType: "array" })).toEqual([1, 2, 3]);
  });

  it("rejects empty, malformed, and wrong-shaped model output", () => {
    expect(() => parseModelJson("", { operation: "recommendations" })).toThrow(StructuredOutputError);
    expect(() => parseModelJson("not json", { operation: "recommendations" })).toThrow(/invalid JSON/);
    expect(() => parseModelJson("[]", { expectedType: "object", operation: "business plan" })).toThrow(/wrong JSON shape/);
  });

  it("fails explicitly on malformed provider responses", () => {
    expect(parseProviderJson('{"choices":[]}', { provider: "OpenAI", operation: "chat response" })).toEqual({ choices: [] });
    expect(() => parseProviderJson("not json", { provider: "Gemini", operation: "image response" })).toThrow(/Gemini returned invalid JSON/);
  });

  it("rejects incomplete structured collections", () => {
    expect(assertObjectArray([{ title: "A" }], { operation: "recommendations" })).toEqual([{ title: "A" }]);
    expect(() => assertObjectArray([null], { operation: "recommendations" })).toThrow(/non-object item/);
    expect(() => assertRequiredObjectKeys({ market_opportunity: "x" }, ["risk_analysis"], { operation: "business plan" }))
      .toThrow(/required fields/);
  });

  it("validates recommendation fields and numeric confidence", () => {
    const recommendation = {
      sourceTrendTitle: "Protein soda",
      title: "Launch protein soda sampler",
      description: "A concrete sampler for shoppers testing functional beverages.",
      industry: "food-beverage",
      productCategory: "Product",
      targetDemographic: "Gen Z wellness shoppers",
      confidenceScore: 0.82,
      estimatedRevenuePotential: "$180K first quarter",
      priority: "high",
      actionPlan: "Source flavors; run a paid sampler; measure repeat purchase.",
    };

    expect(assertRecommendationArray([recommendation])).toEqual([recommendation]);
    expect(() => assertRecommendationArray([{ ...recommendation, confidenceScore: 1.2 }])).toThrow(/confidenceScore/);
    expect(() => assertRecommendationArray([{ ...recommendation, industry: "unknown" }])).toThrow(/industry/);
  });

  it("validates business-plan field types and confidence range", () => {
    const plan = {
      market_opportunity: "Specific demand is visible.",
      competitive_landscape: "Existing tools leave a workflow gap.",
      revenue_models: "Charge per seat with a paid tier.",
      user_acquisition: "Start with creator partnerships.",
      risk_analysis: "Validate willingness to pay before scaling.",
      confidence_score: 78,
    };

    expect(assertBusinessPlanObject(plan)).toEqual(plan);
    expect(() => assertBusinessPlanObject({ ...plan, confidence_score: "78" })).toThrow(/confidence_score/);
    expect(() => assertBusinessPlanObject({ ...plan, risk_analysis: "" })).toThrow(/risk_analysis/);
  });
});
