// utils/imageToVideo.ts
import axios from "axios";

interface VideoResult {
  url: string;
}

async function pollFalJob(
  appId: string,
  requestId: string,
  interval = 3000,
  maxAttempts = 20
): Promise<any> {
  const statusUrl = `https://queue.fal.run/${appId}/requests/${requestId}/status`;
  const resultUrl = `https://queue.fal.run/${appId}/requests/${requestId}`;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const statusRes = await axios.get(statusUrl, {
      headers: {
        Authorization: `Bearer ${process.env.FAL_KEY}`,
      },
    });

    const status = statusRes.data?.status;

    if (status === "completed") {
      const resultRes = await axios.get(resultUrl, {
        headers: {
          Authorization: `Bearer ${process.env.FAL_KEY}`,
        },
      });
      return resultRes.data;
    } else if (status === "failed") {
      throw new Error("Fal job failed");
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error("Fal job polling timed out");
}

export async function imageToVideo(
  imageUrl: string,
  prompt: string,
  duration: number
): Promise<VideoResult> {
  const appId = "fal-ai/kling-video/v2.1/standard/image-to-video";

  const queueRes = await axios.post(
    `https://queue.fal.run/${appId}`,
    {
      input: {
        image_url: imageUrl,
        prompt,
        duration,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const requestId = queueRes.data?.request_id;
  if (!requestId) throw new Error("Failed to get Fal request ID");

  const result = await pollFalJob(appId, requestId);
  const videoUrl = result?.output?.video_url;

  if (!videoUrl) throw new Error("No video URL returned from Fal");

  return { url: videoUrl };
}
