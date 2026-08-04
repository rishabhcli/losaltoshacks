export class StructuredOutputError extends Error {
  constructor({ code, operation, message }) {
    super(message);
    this.name = "StructuredOutputError";
    this.code = code;
    this.operation = operation;
  }
}

function findJsonCandidate(text) {
  for (let start = 0; start < text.length; start += 1) {
    if (text[start] !== "{" && text[start] !== "[") continue;

    const stack = [];
    let inString = false;
    let escaped = false;
    for (let index = start; index < text.length; index += 1) {
      const character = text[index];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (character === "\\") {
          escaped = true;
        } else if (character === '"') {
          inString = false;
        }
        continue;
      }

      if (character === '"') {
        inString = true;
        continue;
      }
      if (character === "{" || character === "[") {
        stack.push(character);
        continue;
      }

      if (character !== "}" && character !== "]") continue;
      const opening = stack[stack.length - 1];
      if ((character === "}" && opening !== "{") || (character === "]" && opening !== "[")) break;
      stack.pop();
      if (stack.length === 0) return text.slice(start, index + 1);
    }
  }

  return null;
}

function stripModelDecorators(text) {
  const withoutThinkTags = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  const fenced = withoutThinkTags.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return (fenced ? fenced[1] : withoutThinkTags).trim();
}

function hasExpectedType(value, expectedType) {
  if (expectedType === "array") return Array.isArray(value);
  if (expectedType === "object") return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  return true;
}

export function parseProviderJson(text, { provider = "provider", operation = "response" } = {}) {
  const raw = String(text ?? "").trim();
  if (!raw) {
    throw new StructuredOutputError({
      code: "provider_response_empty",
      operation,
      message: `${provider} returned an empty ${operation}.`,
    });
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new StructuredOutputError({
      code: "provider_invalid_json",
      operation,
      message: `${provider} returned invalid JSON for ${operation}.`,
    });
  }
}

export function parseModelJson(text, {
  expectedType = "any",
  operation = "model output",
} = {}) {
  const cleaned = stripModelDecorators(String(text ?? ""));
  if (!cleaned) {
    throw new StructuredOutputError({
      code: "structured_output_empty",
      operation,
      message: `Model returned an empty ${operation}.`,
    });
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const candidate = findJsonCandidate(cleaned);
    if (!candidate) {
      throw new StructuredOutputError({
        code: "structured_output_invalid_json",
        operation,
        message: `Model returned invalid JSON for ${operation}.`,
      });
    }
    try {
      parsed = JSON.parse(candidate);
    } catch {
      throw new StructuredOutputError({
        code: "structured_output_invalid_json",
        operation,
        message: `Model returned invalid JSON for ${operation}.`,
      });
    }
  }

  if (!hasExpectedType(parsed, expectedType)) {
    throw new StructuredOutputError({
      code: "structured_output_invalid_shape",
      operation,
      message: `Model returned the wrong JSON shape for ${operation}.`,
    });
  }

  return parsed;
}

export function assertObjectArray(value, { operation = "model output" } = {}) {
  if (!Array.isArray(value) || value.some((item) => !item || typeof item !== "object" || Array.isArray(item))) {
    throw new StructuredOutputError({
      code: "structured_output_invalid_shape",
      operation,
      message: `Model returned a non-object item for ${operation}.`,
    });
  }
  return value;
}

export function assertRequiredObjectKeys(value, keys, { operation = "model output" } = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value) || keys.some((key) => !(key in value))) {
    throw new StructuredOutputError({
      code: "structured_output_missing_fields",
      operation,
      message: `Model omitted required fields for ${operation}.`,
    });
  }
  return value;
}

function invalidField(operation, message) {
  throw new StructuredOutputError({
    code: "structured_output_invalid_fields",
    operation,
    message: `Model returned invalid fields for ${operation}: ${message}`,
  });
}

function requireNonEmptyString(value, field, { operation, maxLength = 4000 } = {}) {
  if (typeof value !== "string" || !value.trim()) {
    invalidField(operation, `${field} must be a non-empty string.`);
  }
  if (value.length > maxLength) {
    invalidField(operation, `${field} exceeds ${maxLength} characters.`);
  }
}

function requireFiniteNumber(value, field, { operation, min = -Infinity, max = Infinity } = {}) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) {
    invalidField(operation, `${field} must be a finite number between ${min} and ${max}.`);
  }
}

const RECOMMENDATION_INDUSTRIES = new Set([
  "beauty-skincare", "fashion-retail", "food-beverage", "travel-hospitality",
  "wellness-fitness", "tech-saas", "healthcare", "finance-fintech",
  "real-estate", "education", "entertainment-media", "All",
]);
const RECOMMENDATION_CATEGORIES = new Set([
  "Product", "Service", "Platform", "Partnership", "Content", "Community",
]);
const RECOMMENDATION_PRIORITIES = new Set(["high", "medium", "low"]);

export function assertRecommendationArray(value, { operation = "recommendations" } = {}) {
  assertObjectArray(value, { operation });
  if (value.length < 1 || value.length > 8) {
    invalidField(operation, "recommendations must contain between 1 and 8 items.");
  }

  const requiredStringFields = [
    ["sourceTrendTitle", 240],
    ["title", 160],
    ["description", 2000],
    ["targetDemographic", 240],
    ["estimatedRevenuePotential", 240],
    ["actionPlan", 1600],
  ];

  value.forEach((recommendation, index) => {
    const fieldOperation = `${operation} item ${index + 1}`;
    for (const [field, maxLength] of requiredStringFields) {
      requireNonEmptyString(recommendation[field], field, { operation: fieldOperation, maxLength });
    }
    if (typeof recommendation.industry !== "string" || !RECOMMENDATION_INDUSTRIES.has(recommendation.industry)) {
      invalidField(fieldOperation, "industry must be a supported industry slug.");
    }
    if (typeof recommendation.productCategory !== "string" || !RECOMMENDATION_CATEGORIES.has(recommendation.productCategory)) {
      invalidField(fieldOperation, "productCategory is not supported.");
    }
    if (typeof recommendation.priority !== "string" || !RECOMMENDATION_PRIORITIES.has(recommendation.priority)) {
      invalidField(fieldOperation, "priority must be high, medium, or low.");
    }
    requireFiniteNumber(recommendation.confidenceScore, "confidenceScore", {
      operation: fieldOperation,
      min: 0.5,
      max: 0.97,
    });
  });

  return value;
}

export function assertBusinessPlanObject(value, { operation = "business plan" } = {}) {
  assertRequiredObjectKeys(value, [
    "market_opportunity",
    "competitive_landscape",
    "revenue_models",
    "user_acquisition",
    "risk_analysis",
    "confidence_score",
  ], { operation });

  for (const field of [
    "market_opportunity",
    "competitive_landscape",
    "revenue_models",
    "user_acquisition",
    "risk_analysis",
  ]) {
    requireNonEmptyString(value[field], field, { operation, maxLength: 4000 });
  }
  requireFiniteNumber(value.confidence_score, "confidence_score", {
    operation,
    min: 0,
    max: 100,
  });
  return value;
}
