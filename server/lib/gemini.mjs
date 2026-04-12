import { getRequiredEnv, loadProjectEnv } from "./env.mjs";

loadProjectEnv();

export async function generateImageWithGemini({ prompt, aspectRatio = "1:1" }) {
  if (!prompt || prompt.trim() === "") {
    throw new Error("prompt is required.");
  }

  const apiKey = getRequiredEnv("GEMINI_API_KEY");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      instances: [
        {
          prompt: prompt,
        },
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: aspectRatio,
        personGeneration: "allow_adult"
      },
    }),
    signal: AbortSignal.timeout(60000), // 60s timeout for image generation
  });

  const text = await response.text();
  
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const message = payload?.error?.message || `Gemini request failed with status ${response.status}.`;
    throw new Error(message);
  }

  const base64Image = payload?.predictions?.[0]?.bytesBase64Encoded;
  if (!base64Image) {
    throw new Error("Gemini returned an empty image response.");
  }

  const mimeType = payload?.predictions?.[0]?.mimeType || "image/jpeg";

  return {
    base64: base64Image,
    mimeType: mimeType
  };
}
