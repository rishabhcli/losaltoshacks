import { getRequiredEnv, loadProjectEnv } from "./env.mjs";
import { parseProviderJson } from "./structured-output.mjs";

loadProjectEnv();

const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o";

function buildMessages({ systemPrompt, userPrompt, imageUrl }) {
  const messages = [
    {
      role: "system",
      content: systemPrompt || "You are a concise, reliable assistant.",
    }
  ];

  if (imageUrl) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: userPrompt },
        { type: "image_url", image_url: { url: imageUrl } }
      ]
    });
  } else {
    messages.push({
      role: "user",
      content: userPrompt,
    });
  }

  return messages;
}

export async function inferWithOpenAI({
  systemPrompt,
  userPrompt,
  imageUrl,
  model,
  temperature = 1,
}) {
  if (!userPrompt || userPrompt.trim() === "") {
    throw new Error("userPrompt is required.");
  }

  const apiKey = getRequiredEnv("OPENAI_API_KEY");
  const baseUrl = process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL;
  const resolvedModel = model || process.env.OPENAI_MODEL || DEFAULT_MODEL;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: resolvedModel,
      messages: buildMessages({ systemPrompt, userPrompt, imageUrl }),
      temperature,
      n: 1,
    }),
    signal: AbortSignal.timeout(60000), // increased timeout for vision
  });

  const text = await response.text();
  let payload;
  try {
    payload = parseProviderJson(text, { provider: "OpenAI", operation: "chat response" });
  } catch (error) {
    if (!response.ok) {
      throw new Error(`OpenAI request failed with status ${response.status}.`);
    }
    throw error;
  }

  if (!response.ok) {
    const message =
      payload?.error?.message ||
      `OpenAI request failed with status ${response.status}.`;
    throw new Error(message);
  }

  const content = payload?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return {
    model: resolvedModel,
    text: content,
    raw: payload,
  };
}
