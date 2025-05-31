import { fal } from "@fal-ai/client";

interface VideoResult {
  url: string;
}

// Optional: configure credentials if not using env var
fal.config({
  credentials: process.env.FAL_KEY,
});

export async function imageToVideo(
  mergedImageUrl: string,
  prompt: string,
  duration: number = 5 // default to 5
): Promise<VideoResult> {
  const result = await fal.subscribe(
    "fal-ai/kling-video/v2.1/standard/image-to-video",
    {
      input: {
        prompt,
        image_url: mergedImageUrl,
        duration,
        negative_prompt: "blur, distort, low quality, no floating objects",
        cfg_scale: 0.5,
        aspect_ratio: "9:16",
      },
      logs: false,
    }
  );

  const videoUrl = result?.data?.video?.url;

  if (!videoUrl) throw new Error("No video URL returned from Fal");

  return { url: videoUrl };
}
