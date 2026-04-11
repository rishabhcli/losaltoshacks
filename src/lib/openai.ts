import OpenAI from "openai";

const MINIMAX_MODEL = "MiniMax-M2.7";

const openai = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY || "",
  baseURL: "https://api.minimax.io/v1",
});

export default openai;

/**
 * MiniMax M2.7 may prepend &lt;think&gt;...&lt;/think&gt; chain-of-thought tags.
 * Strip them so downstream JSON.parse succeeds.
 */
/**
 * Clean MiniMax M2.7 responses:
 * 1. Strip <think>...</think> chain-of-thought blocks
 * 2. Strip markdown code fences (```json ... ```)
 * 3. If all content was in think tags, extract JSON from within them
 */
function cleanModelResponse(text: string): string {
  // Strip think tags first
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  // If nothing left, try extracting JSON from inside think tags
  if (!cleaned && text.length > 0) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleaned = jsonMatch[0];
  }

  // Strip markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

  return cleaned;
}

/**
 * Embeddings stub — MiniMax does not expose a public embeddings API,
 * so we return empty arrays. The clustering layer will fall back to
 * keyword-based grouping automatically.
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  return texts.map(() => []);
}

export async function generateInsight(
  trendName: string,
  trendDescription: string,
  growthRate: number,
  acceleration: number,
  articleSummaries: string[]
): Promise<{
  audience: { demographic: string; psychographic: string; behaviors: string[] };
  explanation: string;
  businessActions: { action: string; category: string; priority: string }[];
  risks: string[];
  confidence: string;
}> {
  const response = await openai.chat.completions.create({
    model: MINIMAX_MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a senior market intelligence analyst. Given a consumer trend with supporting articles, generate a structured analysis. Respond in JSON matching this exact schema:
{
  "audience": {
    "demographic": "age range, location, income level",
    "psychographic": "values, lifestyle, aspirations",
    "behaviors": ["specific purchasing/media behaviors"]
  },
  "explanation": "2-3 sentences on why this trend is emerging now",
  "businessActions": [
    { "action": "specific concrete recommendation", "category": "product|marketing|branding|pricing", "priority": "high|medium|low" }
  ],
  "risks": ["what could undermine this trend"],
  "confidence": "high|medium|low"
}`,
      },
      {
        role: "user",
        content: `Trend: ${trendName}\nDescription: ${trendDescription}\nGrowth: ${growthRate.toFixed(1)}%, Acceleration: ${acceleration.toFixed(2)}\n\nArticles:\n${articleSummaries.slice(0, 8).join("\n\n")}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return JSON.parse(cleanModelResponse(response.choices[0].message.content || "{}"));
}

export async function generateTrendLabel(
  articleTitles: string[]
): Promise<{ name: string; keywords: string[]; description: string }> {
  const response = await openai.chat.completions.create({
    model: MINIMAX_MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a trend analyst. Given related article titles, provide a JSON response:
{ "name": "concise trend name (5-8 words)", "keywords": ["3-5 normalized keywords"], "description": "one sentence trend description" }`,
      },
      {
        role: "user",
        content: `Articles:\n${articleTitles.join("\n")}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 2000,
  });

  return JSON.parse(cleanModelResponse(response.choices[0].message.content || "{}"));
}

export async function generateReport(
  trends: { name: string; description: string; audience: string; actions: string[] }[],
  targetContext: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: MINIMAX_MODEL,
    messages: [
      {
        role: "system",
        content: `You are a strategic market intelligence advisor. Generate a comprehensive business brief that synthesizes multiple market trends into actionable strategy recommendations. Use clear headings, bullet points, and structured sections. The brief should be professional yet accessible.`,
      },
      {
        role: "user",
        content: `Target context: ${targetContext}\n\nTrends to synthesize:\n${trends
          .map(
            (t) =>
              `- ${t.name}: ${t.description}\n  Audience: ${t.audience}\n  Actions: ${t.actions.join("; ")}`
          )
          .join("\n\n")}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 8000,
  });

  return cleanModelResponse(response.choices[0].message.content || "");
}

export async function generateBriefingScript(
  trends: { name: string; growthRate: number; audience: string; topAction: string }[]
): Promise<string> {
  if (trends.length === 0) {
    return "No trends available for briefing at this time.";
  }

  const trendCount = trends.length;
  const duration = trendCount <= 2 ? "30-45" : trendCount <= 4 ? "60-90" : "90-120";

  const response = await openai.chat.completions.create({
    model: MINIMAX_MODEL,
    messages: [
      {
        role: "system",
        content: `You are a market intelligence anchor delivering a ${duration}-second executive audio briefing. Write ONLY the spoken text — no stage directions, annotations, headers, or formatting marks.

Structure:
1. Brief opening (1-2 sentences establishing context and date)
2. For each trend: name, growth signal, who it affects, and the single most important action to take
3. Closing strategic takeaway (1 sentence connecting the dots)

Tone: professional, concise, confident. Speak as if addressing a C-suite audience. Use natural spoken language — contractions are fine, but avoid filler words.`,
      },
      {
        role: "user",
        content: trends
          .map(
            (t, i) =>
              `Trend ${i + 1}: ${t.name} (${t.growthRate > 0 ? "+" : ""}${t.growthRate.toFixed(0)}% growth)\n  Audience: ${t.audience}\n  Action: ${t.topAction}`
          )
          .join("\n\n"),
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return cleanModelResponse(response.choices[0].message.content || "");
}
