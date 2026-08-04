import { apiFetch } from "./api";

const DEFAULT_API_BASE_URL = "http://localhost:3001";

export interface OpenAIInferenceInput {
  systemPrompt?: string;
  userPrompt: string;
  imageUrl?: string;
  model?: string;
  temperature?: number;
}

export interface OpenAIInferenceResult {
  model: string;
  text: string;
}

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

export async function inferWithOpenAI(input: OpenAIInferenceInput): Promise<OpenAIInferenceResult> {
  const response = await apiFetch(`${getApiBaseUrl()}/api/ai/infer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as
    | ({ ok: true } & OpenAIInferenceResult)
    | { ok: false; error?: string };

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "OpenAI inference failed.");
  }

  return {
    model: payload.model,
    text: payload.text,
  };
}
