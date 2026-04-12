/**
 * MiniMax Text-to-Speech (T2A v2) helper
 * Docs: https://www.minimax.io/platform/document/T2A%20V2
 */

const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL || "https://api.minimaxi.com/v1";

/**
 * Generate speech audio from text using MiniMax T2A v2.
 * Returns a ReadableStream of audio bytes (mp3).
 *
 * @param {string} text - The text to synthesize (max 10,000 chars)
 * @param {object} options
 * @param {string} [options.voiceId]   - MiniMax voice ID, default "male-qn-qingse"
 * @param {number} [options.speed]     - 0.5–2.0, default 1.0
 * @param {number} [options.volume]    - 0–10, default 1.0
 * @param {number} [options.pitch]     - -12 – 12, default 0
 */
export async function generateSpeechWithMiniMax(text, options = {}) {
  const apiKey = process.env.MINIMAX_API_KEY;

  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY is not set in the environment.");
  }

  const voiceId = options.voiceId || "male-qn-qingse";
  const speed = options.speed ?? 1.0;
  const volume = options.volume ?? 1.0;
  const pitch = options.pitch ?? 0;

  const body = {
    model: "speech-2.8-hd",
    text,
    voice_setting: {
      voice_id: voiceId,
      speed,
      volume,
      pitch,
    },
    audio_setting: {
      format: "mp3",
      sample_rate: 32000,
    },
  };

  const response = await fetch(`${MINIMAX_BASE_URL}/t2a_v2`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MiniMax TTS API error (${response.status}): ${errorText}`);
  }

  // Return the web readable stream directly (audio/mpeg bytes)
  return response.body;
}
