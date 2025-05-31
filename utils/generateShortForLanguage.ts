// utils/generateShortForLanguage.ts
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
  imageUrl: string;
  description: string;
  lang: string;
}

export async function generateShortForLanguage({
  imageUrl,
  description,
  lang,
}: GenerateShortParams): Promise<{
  requestId: string;
  status: "queued";
}> {
  const requestId = uuidv4();

  // Persist initial job record
  await prisma.videoJob.create({
    data: {
      requestId,
      imageUrl,
      lang,
      description,
      status: "queued",
    },
  });

  // Start async job
  queueMicrotask(async () => {
    try {
      const buffer = await removeBackground(imageUrl);
      const cleanImageUrl = await uploadToHetzner(buffer, "image/png");

      const scenePrompts = await generateScenePrompts(description);
      const script = await generateScriptFromScenes(scenePrompts);
      const translatedScript =
        lang === "en" ? script : await translateScript(script, lang);

      const audios = await textToSpeech(translatedScript, lang);

      const clips = await Promise.all(
        scenePrompts.map((scene: string, i: number) =>
          imageToVideo(cleanImageUrl, scene, audios[i].duration)
        )
      );

      const finalVideo = await composeVideo({
        videoUrls: clips.map((c) => c.url),
        audioUrls: audios.map((a) => a.url),
      });

      await prisma.videoJob.update({
        where: { requestId },
        data: {
          status: "done",
          videoUrl: finalVideo,
        },
      });
    } catch (err) {
      await prisma.videoJob.update({
        where: { requestId },
        data: {
          status: "error",
          error: String(err),
        },
      });
    }
  });

  return { requestId, status: "queued" };
}
