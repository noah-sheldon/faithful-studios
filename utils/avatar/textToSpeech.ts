import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

interface AudioResult {
  url: string;
  duration: number; // in seconds
}

export async function textToSpeech(script: string): Promise<AudioResult> {
  const result = await fal.subscribe("fal-ai/elevenlabs/tts/multilingual-v2", {
    input: {
      text: script,
      voice: "Rachel", // 🔒 hardcoded voice
      stability: 0.5,
      similarity_boost: 0.75,
    },
    logs: false,
  });

  const url = result.data?.audio?.url;

  if (!url) {
    throw new Error("TTS generation failed: No audio URL returned");
  }

  return {
    url,
    duration: 10, // can be estimated based on text if needed
  };
}
