import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// ── Voice options ─────────────────────────────────────────────────────
// ElevenLabs pre-made voice IDs
const VOICES = {
  rachel: "21m00Tcm4TlvDq8ikWAM",     // professional female
  adam: "pNInz6obpgDQGcFmaJgB",        // professional male
  sam: "yoZ06aMxZJJ28mfd3POQ",         // neutral male
} as const;

const DEFAULT_VOICE = VOICES.rachel;
const DEFAULT_MODEL = "eleven_multilingual_v2";

// ── Client singleton ──────────────────────────────────────────────────

let client: ElevenLabsClient | null = null;

function getClient(): ElevenLabsClient | null {
  if (!process.env.ELEVENLABS_API_KEY) {
    return null;
  }
  if (!client) {
    client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
  }
  return client;
}

export function isElevenLabsConfigured(): boolean {
  return !!process.env.ELEVENLABS_API_KEY;
}

// ── Audio generation ──────────────────────────────────────────────────

export interface AudioResult {
  audio: Buffer;
  voiceId: string;
  model: string;
  characterCount: number;
}

/**
 * Convert a text script to an audio buffer using ElevenLabs TTS.
 *
 * Returns null if:
 * - ElevenLabs is not configured (no API key)
 * - The script is empty
 * - The API call fails after retry
 */
export async function generateAudioBriefing(
  script: string,
  voiceId: string = DEFAULT_VOICE
): Promise<AudioResult | null> {
  if (!script.trim()) return null;

  const el = getClient();
  if (!el) return null;

  // Truncate to ElevenLabs limit (~5000 chars for non-enterprise)
  const text = script.slice(0, 4900);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const audioStream = await el.textToSpeech.convert(voiceId, {
        text,
        modelId: DEFAULT_MODEL,
        outputFormat: "mp3_44100_128",
      });

      // Collect ReadableStream<Uint8Array> into a Buffer
      const chunks: Uint8Array[] = [];
      const reader = audioStream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }

      const audio = Buffer.concat(chunks);

      if (audio.length === 0) {
        console.warn("ElevenLabs returned empty audio, retrying...");
        continue;
      }

      return {
        audio,
        voiceId,
        model: DEFAULT_MODEL,
        characterCount: text.length,
      };
    } catch (error) {
      console.error(
        `ElevenLabs attempt ${attempt + 1} failed:`,
        error
      );
      if (attempt === 1) return null;
      // Brief delay before retry
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return null;
}

/**
 * Available voices for the UI to display.
 */
export function getAvailableVoices() {
  return Object.entries(VOICES).map(([name, id]) => ({ name, id }));
}
