import { generateScenePrompts } from "./generateScenePrompts";
import { generateScriptFromScenes } from "./generateScriptFromScenes";
import { translateScript } from "./translateScript";
import { textToSpeech } from "./textToSpeech";
import { imageToVideo } from "./imageToVideo";
import { composeVideo } from "./composeVideo";
import { removeBackground } from "./removeBackground";
import { uploadToHetzner } from "./uploadToHetzner";
import { prisma } from "@/lib/prisma";
import { mergeAvatarAndProduct } from "./mergeAvatarAndProduct";
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
      id: uuidv4(),
      requestId,
      lang,
      type: "short",
      description,
      status: "queued",
      currentStep: "queued",
      updatedAt: new Date(),
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

      console.log(`[${requestId}] Step: merging avatar and product`);

      const avatarUrl =
        // "https://fal.media/files/rabbit/JGsbUSmOly3qCX6NVKHIu_feace60f3a494b9ba8b063db64cd940c.png"; // hardcoded just for now
        "https://fal.media/files/panda/4qN0lxMMWPB743chr3J3z_9fec6608b30a4280ac5ce5c7585b2e2a.png";

      const mergedBuffer = await mergeAvatarAndProduct({
        avatarUrl,
        cleanImageUrl,
        description: description,
      });

      const mergedImageUrl = await uploadToHetzner(mergedBuffer, "image/png");

      await prisma.videoJob.update({
        where: { requestId },
        data: {
          currentStep: "merged avatar and product",
          mergedImageUrl: [mergedImageUrl],
        },
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
      const audios = await textToSpeech(translatedScript);

      await prisma.videoJob.update({
        where: { requestId },
        data: { currentStep: "tts_done" },
      });

      console.log(`[${requestId}] Step: generating video clips`);
      const clips = await Promise.all(
        scenePrompts.map((scene, i) =>
          imageToVideo(mergedImageUrl, scene, audios[i].duration)
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
