import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface AudioResult {
  url: string;
  duration: number; // in seconds
}

const voiceMap: Record<string, string> = {
  en: "Rachel", // English (US, UK, etc.)
  hi: "Ved", // Hindi (India)
  zh: "Yujin", // Chinese (Mandarin)
  ja: "Keisuke", // Japanese
  ko: "Jin", // Korean
  de: "Arnold", // German
  fr: "Charlotte", // French
  es: "Diego", // Spanish
  pt: "Mateus", // Portuguese (Brazil/Portugal)
  it: "Luca", // Italian
  ru: "Dmitry", // Russian
};

export async function textToSpeech(
  scriptParts: string[],
  lang: string
): Promise<AudioResult[]> {
  const results: AudioResult[] = [];
  const voice = voiceMap[lang] || "Rachel";

  for (const text of scriptParts) {
    const requestId = uuidv4();

    // 1. Submit to Fal queue
    const queueRes = await axios.post(
      `https://queue.fal.ai/fal-ai/elevenlabs/tts/multilingual-v2`,
      {
        input: {
          text,
          voice,
          language: lang,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FAL_KEY}`,
          "Content-Type": "application/json",
          "X-Request-ID": requestId,
        },
      }
    );

    const id = queueRes.data?.id;
    if (!id) throw new Error("Failed to enqueue TTS job");

    // 2. Poll until complete
    let status = "IN_PROGRESS";
    let audioUrl = "";
    let duration = 10;

    while (status === "IN_PROGRESS") {
      await new Promise((r) => setTimeout(r, 3000)); // wait 3 sec
      const statusRes = await axios.get(
        `https://queue.fal.ai/fal-ai/elevenlabs/tts/multilingual-v2/requests/${id}/status`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FAL_KEY}`,
          },
        }
      );

      status = statusRes.data.status;
      if (status === "COMPLETED") {
        const resultRes = await axios.get(
          `https://queue.fal.ai/fal-ai/elevenlabs/tts/multilingual-v2/requests/${id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.FAL_KEY}`,
            },
          }
        );

        audioUrl = resultRes.data?.output?.audio_url;
        duration = resultRes.data?.output?.duration || 10;
      }

      if (status === "FAILED") {
        throw new Error("TTS generation failed for one segment");
      }
    }

    if (!audioUrl) throw new Error("No audio URL returned");

    results.push({ url: audioUrl, duration });
  }

  return results;
}
