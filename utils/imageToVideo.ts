import { fal } from "@fal-ai/client";

interface VideoResult {
  url: string;
}

// Optional: configure credentials if not using env var
fal.config({
  credentials: process.env.FAL_KEY,
});

export async function imageToVideo(
  imageUrl: string,
  prompt: string,
  duration: number = 5 // default to 10
): Promise<VideoResult> {
  const result = await fal.subscribe(
    "fal-ai/kling-video/v2.1/standard/image-to-video",
    {
      input: {
        prompt,
        image_url: imageUrl,
        duration,
        negative_prompt: "blur, distort, low quality",
        cfg_scale: 0.5,
      },
      logs: false,
    }
  );

  const videoUrl = result?.data?.video?.url;

  if (!videoUrl) throw new Error("No video URL returned from Fal");

  return { url: videoUrl };
}
