// utils/composeVideo.ts
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface ComposeInput {
  videoUrls: string[]; // 3 video clip URLs
  audioUrls: string[]; // 3 audio clip URLs
}

export async function composeVideo({
  videoUrls,
  audioUrls,
}: ComposeInput): Promise<string> {
  if (videoUrls.length !== 3 || audioUrls.length !== 3) {
    throw new Error("composeVideo: Must provide 3 video and 3 audio URLs");
  }

  const requestId = uuidv4();
  const response = await axios.post(
    `https://queue.fal.ai/fal-ai/ffmpeg/compose`,
    {
      input: {
        videos: videoUrls.map((video, i) => ({
          video,
          audio: audioUrls[i],
        })),
        format: "mp4",
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

  const composedUrl = response.data?.output?.video_url;
  if (!composedUrl)
    throw new Error("composeVideo: No output video_url returned");

  // 🟡 Auto-caption the composed video
  const captionRes = await axios.post(
    "https://queue.fal.ai/fal-ai/auto-caption",
    {
      input: {
        video: composedUrl,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const finalVideoUrl = captionRes.data?.output?.video_url;
  if (!finalVideoUrl)
    throw new Error("composeVideo: Failed to get captioned video");

  return finalVideoUrl;
}
