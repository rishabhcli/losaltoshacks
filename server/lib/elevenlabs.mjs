export async function generateSpeechWithElevenLabs(text, voiceId) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || "oO7sLA3dWfQXsKeSAjpA";
  const targetVoiceId = voiceId || defaultVoiceId;

  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is not set in the environment.");
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: {
      "Accept": "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": apiKey
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
  }

  // Return the web readable stream directly
  return response.body;
}
