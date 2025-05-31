import { generateScenePrompts } from "./generateScenePrompts";
import { generateScriptFromScenes } from "./generateScriptFromScenes";
import { translateScript } from "./translateScript";
import { textToSpeech } from "./textToSpeech";
import { imageToVideo } from "./imageToVideo";
import { composeVideo } from "./composeVideo";
import { removeBackground } from "./removeBackground";
import { uploadToHetzner } from "./uploadToHetzner";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

interface GenerateShortParams {
  imageBuffer: Buffer;
  description: string;
  lang: string;
}

export async function generateShortForLanguage({
  imageBuffer,
  description,
  lang,
}: GenerateShortParams): Promise<{
  requestId: string;
  status: "queued";
}> {
  const requestId = uuidv4();
  console.log(`[${requestId}] Job created for language: ${lang}`);

  // Initial job creation
  await prisma.videoJob.create({
    data: {
      requestId,
      lang,
      description,
      status: "queued",
      currentStep: "queued",
    },
  });

  queueMicrotask(async () => {
    try {
      console.log(`[${requestId}] Step: uploading original image`);
      const imageUrl = await uploadToHetzner(imageBuffer, "image/png");

      await prisma.videoJob.update({
        where: { requestId },
        data: {
          imageUrl,
          currentStep: "image_uploaded",
        },
      });

      console.log(`[${requestId}] Step: background removal`);
      const cleanedBuffer = await removeBackground(imageUrl);

      console.log(`[${requestId}] Step: uploading cleaned image`);
      const cleanImageUrl = await uploadToHetzner(cleanedBuffer, "image/png");

      await prisma.videoJob.update({
        where: { requestId },
        data: {
          currentStep: "bg_removed",
          cleanImageUrl: cleanImageUrl,
        },
      });

      console.log(`[${requestId}] Step: generating scene prompts`);
      const scenePrompts = await generateScenePrompts(description);

      await prisma.videoJob.update({
        where: { requestId },
        data: { currentStep: "scene_done" },
      });

      console.log(`[${requestId}] Step: generating script`);
      const script = await generateScriptFromScenes(scenePrompts);

      await prisma.videoJob.update({
        where: { requestId },
        data: { currentStep: "script_done" },
      });

      const translatedScript =
        lang === "en" ? script : await translateScript(script, lang);

      console.log(`[${requestId}] Step: generating audio`);
      const audios = await textToSpeech(translatedScript, lang);

      await prisma.videoJob.update({
        where: { requestId },
        data: { currentStep: "tts_done" },
      });

      console.log(`[${requestId}] Step: generating video clips`);
      const clips = await Promise.all(
        scenePrompts.map((scene, i) =>
          imageToVideo(cleanImageUrl, scene, audios[i].duration)
        )
      );

      await prisma.videoJob.update({
        where: { requestId },
        data: { currentStep: "video_done" },
      });

      console.log(`[${requestId}] Step: composing final video`);
      const finalVideo = await composeVideo({
        videoUrls: clips.map((c) => c.url),
        audioUrls: audios.map((a) => a.url),
      });

      await prisma.videoJob.update({
        where: { requestId },
        data: {
          status: "done",
          currentStep: "done",
          videoUrl: finalVideo,
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
