interface InferOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}

interface InferResult {
  text: string;
  model: string;
}

export async function inferWithOpenAI(_options: InferOptions): Promise<InferResult> {
  throw new Error("OpenAI API key not configured. Add VITE_OPENAI_API_KEY to your .env file to enable AI briefings.");
}
