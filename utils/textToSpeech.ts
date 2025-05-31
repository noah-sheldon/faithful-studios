import { fal } from "@fal-ai/client";
import { v4 as uuidv4 } from "uuid";

interface AudioResult {
  url: string;
  duration: number;
}

// Optional: set API key if not using env variable
fal.config({ credentials: process.env.FAL_KEY });

export async function textToSpeech(
  scriptParts: string[],
): Promise<AudioResult[]> {
  const results: AudioResult[] = [];
  const voice = "Rachel";

  for (const text of scriptParts) {
    const result = await fal.subscribe(
      "fal-ai/elevenlabs/tts/multilingual-v2",
      {
        input: {
          text,
          voice,
          stability: 0.5,
          similarity_boost: 0.75,
        },
        logs: false,
      }
    );

    const url = result.data?.audio?.url;
    const duration = 5;

    if (!url) throw new Error("TTS generation failed");

    results.push({ url, duration });
  }

  return results;
}
