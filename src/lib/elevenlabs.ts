const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function generateAudio(text: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/ai/tts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    let errorMsg = "Unknown error";
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch {
      errorMsg = await response.text();
    }
    throw new Error(`TTS generation failed: ${errorMsg}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
