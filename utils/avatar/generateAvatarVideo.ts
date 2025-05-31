import { fal } from "@fal-ai/client";

interface GenerateAvatarVideoParams {
  script: string;
  avatarId: string;
}

interface VideoResult {
  url: string;
}

fal.config({
  credentials: process.env.FAL_KEY,
});

export async function generateAvatarVideo({
  script,
  avatarId,
}: GenerateAvatarVideoParams): Promise<VideoResult> {
  const result = await fal.subscribe("veed/avatars/text-to-video", {
    input: {
      avatar_id: avatarId,
      text: script,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs.map((log) => log.message).forEach(console.log);
      }
    },
  });

  const videoUrl = result?.data?.video?.url;

  if (!videoUrl) {
    throw new Error(
      "Fal avatar video generation failed: No video URL returned"
    );
  }

  return { url: videoUrl };
}
