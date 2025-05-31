import { fal } from "@fal-ai/client";

type ComposeInput = {
  videoUrls: string[];
  audioUrls: string[];
};

fal.config({
  credentials: process.env.FAL_KEY,
});

export async function composeVideo({
  videoUrls,
  audioUrls,
}: ComposeInput): Promise<string> {
  if (videoUrls.length !== 3 || audioUrls.length !== 3) {
    throw new Error(
      "composeVideo: Must provide exactly 3 video and 3 audio URLs"
    );
  }

  const defaultDuration = 5000;

  const tracks = [
    {
      id: "video",
      type: "video",
      keyframes: videoUrls.map((url: string, i: number) => ({
        url,
        timestamp: i * defaultDuration,
        duration: defaultDuration,
      })),
    },
    {
      id: "audio",
      type: "audio",
      keyframes: audioUrls.map((url: string, i: number) => ({
        url,
        timestamp: i * defaultDuration,
        duration: defaultDuration,
      })),
    },
  ];

  const result = await fal.subscribe("fal-ai/ffmpeg-api/compose", {
    input: { tracks },
    logs: true,
    onQueueUpdate(update: any) {
      if (update.status === "IN_PROGRESS") {
        update.logs?.forEach((log: any) => console.log(log.message));
      }
    },
  });

  const composedUrl = result.data?.video_url;
  if (!composedUrl) throw new Error("composeVideo: No video_url returned");

  const captioned = await fal.subscribe("fal-ai/auto-caption", {
    input: {
      video_url: composedUrl,
      txt_color: "white",
      txt_font: "Arial",
      font_size: 42,
      stroke_width: 1,
      left_align: "center",
      top_align: "center",
      refresh_interval: 1.5,
    },
    logs: false,
  });

  const finalUrl = captioned.data?.video_url;
  if (!finalUrl) throw new Error("composeVideo: Captioning failed");

  return finalUrl as string;
}
