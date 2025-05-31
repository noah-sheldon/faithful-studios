import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

type ComposeSingleInput = {
  videoUrl: string;
};

export async function composeVideo({
  videoUrl,
}: ComposeSingleInput): Promise<string> {
  // Directly add captions to the original video
  const captioned = await fal.subscribe("fal-ai/auto-caption", {
    input: {
      video_url: videoUrl,
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
