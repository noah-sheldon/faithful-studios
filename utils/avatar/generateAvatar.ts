import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { generateScript } from "./generateScript";
// import { textToSpeech } from "./textToSpeech";
import { generateAvatarVideo } from "./generateAvatarVideo";
import { composeVideo } from "./composeVideo";

interface GenerateAvatarParams {
  description: string;
  lang: string;
  avatarId?: string; // default: emily_primary
}

export async function generateAvatar({
  description,
  lang,
  avatarId = "marcus_primary",
}: GenerateAvatarParams): Promise<{ requestId: string; status: "queued" }> {
  const requestId = uuidv4();
  console.log(`[${requestId}] Job created for language: ${lang}`);

  await prisma.videoJob.create({
    data: {
      requestId,
      lang,
      description,
      type: "avatar",
      status: "queued",
      currentStep: "queued",
      falVideoJob: requestId,
    },
  });

  queueMicrotask(async () => {
    try {
      console.log(`[${requestId}] Step: generating script`);
      const script = await generateScript(description, lang);

      await prisma.videoJob.update({
        where: { requestId },
        data: {
          currentStep: "script_done",
        },
      });

      // console.log(`[${requestId}] Step: generating audio`);
      // const audio = await textToSpeech(script);

      // await prisma.videoJob.update({
      //   where: { requestId },
      //   data: {
      //     currentStep: "audio_done",
      //     audioUrl: audio.url,
      //   },
      // });

      console.log(`[${requestId}] Step: generating avatar video`);
      const video = await generateAvatarVideo({ script, avatarId });

      await prisma.videoJob.update({
        where: { requestId },
        data: {
          currentStep: "avatar_video_done",
        },
      });

      console.log(`[${requestId}] Step: composing final video`);
      const finalUrl = await composeVideo({
        videoUrl: video.url,
      });

      await prisma.videoJob.update({
        where: { requestId },
        data: {
          currentStep: "done",
          status: "done",
          videoUrl: finalUrl,
        },
      });

      console.log(`[${requestId}] Step: done 🎉`);
    } catch (err) {
      console.error(`[${requestId}] Error:`, err);
      await prisma.videoJob.update({
        where: { requestId },
        data: {
          status: "error",
          currentStep: "error",
          error: String(err),
        },
      });
    }
  });

  return { requestId, status: "queued" };
}
