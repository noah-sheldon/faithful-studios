import { fal } from "@fal-ai/client";
import { v4 as uuidv4 } from "uuid";
import { uploadToHetzner } from "@/utils/uploadToHetzner";
import { prisma } from "@/lib/prisma";

// FAL API key should already be set in env
fal.config({ credentials: process.env.FAL_KEY! });

interface GenerateWearableParams {
  modelBuffer: Buffer;
  garmentBuffer: Buffer;
  description: string;
}

export async function generateWearable({
  modelBuffer,
  garmentBuffer,
  description,
}: GenerateWearableParams): Promise<{ requestId: string; status: "queued" }> {
  const requestId = uuidv4();

  await prisma.videoJob.create({
    data: {
      id: uuidv4(),
      requestId,
      description,
      lang: "n/a",
      status: "queued",
      currentStep: "queued",
      type: "wearable",
      falAudioJob: requestId,
      updatedAt: new Date(),
    },
  });

  queueMicrotask(async () => {
    try {
      const modelUrl = await uploadToHetzner(modelBuffer, "image/png");
      const garmentUrl = await uploadToHetzner(garmentBuffer, "image/png");

      await prisma.videoJob.update({
        where: { requestId },
        data: {
          imageUrl: garmentUrl,
          cleanImageUrl: modelUrl,
          currentStep: "uploaded_inputs",
        },
      });

      const result = await fal.subscribe("fal-ai/fashn/tryon/v1.5", {
        input: {
          model_image: modelUrl,
          garment_image: garmentUrl,
          category: "auto",
          mode: "balanced",
          garment_photo_type: "auto",
          moderation_level: "permissive",
          seed: 42,
          num_samples: 2,
          segmentation_free: true,
          output_format: "png",
        },
        logs: true,
        onQueueUpdate: async (update) => {
          if (update.status) {
            await prisma.videoJob.update({
              where: { requestId },
              data: {
                currentStep: update.status.toLowerCase(),
              },
            });
          }
        },
      });

      const outputUrls = result.data?.images?.map((img: any) => img.url) || [];

      await prisma.videoJob.update({
        where: { requestId },
        data: {
          videoUrl: outputUrls[0],
          status: "done",
          currentStep: "done",
          mergedImageUrl: result.data.images.map(
            (img: { url: string }) => img.url
          ),
        },
      });

      console.log(`[${requestId}] Wearable generation complete`);
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
