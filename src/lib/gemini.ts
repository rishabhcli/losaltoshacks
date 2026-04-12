const DEFAULT_API_BASE_URL = "http://localhost:3001";

export interface GeminiImageInput {
  prompt: string;
  aspectRatio?: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
}

export interface GeminiImageResult {
  base64: string;
  mimeType: string;
}

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

export async function generateImageWithGemini(input: GeminiImageInput): Promise<GeminiImageResult> {
  const response = await fetch(`${getApiBaseUrl()}/api/ai/image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as
    | ({ ok: true } & GeminiImageResult)
    | { ok: false; error?: string };

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Gemini image generation failed.");
  }

  return {
    base64: payload.base64,
    mimeType: payload.mimeType,
  };
}
