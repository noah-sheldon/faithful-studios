import { fal } from "@fal-ai/client";
import { v4 as uuidv4 } from "uuid";
import { uploadToHetzner } from "@/utils/uploadToHetzner";
import { prisma } from "@/lib/prisma";

fal.config({ credentials: process.env.FAL_KEY! });

interface GenerateProductParams {
  imageBuffer: Buffer;
}

export async function generateProduct({
  imageBuffer,
}: GenerateProductParams): Promise<{ requestId: string; status: "queued" }> {
  const requestId = uuidv4();

  await prisma.videoJob.create({
    data: {
      id: uuidv4(),
      requestId,
      description: "3D Product Model",
      lang: "n/a",
      status: "queued",
      currentStep: "queued",
      type: "product",
      falVideoJob: requestId,
      updatedAt: new Date(),
    },
  });

  queueMicrotask(async () => {
    try {
      const imageUrl = await uploadToHetzner(imageBuffer, "image/png");

      await prisma.videoJob.update({
        where: { requestId },
        data: {
          imageUrl,
          currentStep: "uploaded_input",
        },
      });

      const result = await fal.subscribe("fal-ai/hyper3d/rodin", {
        input: {
          input_image_urls: [imageUrl],
          condition_mode: "concat",
          geometry_file_format: "glb",
          material: "Shaded",
          quality: "medium",
          tier: "Regular",
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

      const modelMeshUrl = result.data?.model_mesh?.url;
      const textureUrls = result.data?.textures?.map((t: any) => t.url) || [];

      await prisma.videoJob.update({
        where: { requestId },
        data: {
          videoUrl: modelMeshUrl,
          mergedImageUrl: textureUrls,
          status: "done",
          currentStep: "done",
        },
      });

      console.log(`[${requestId}] Product 3D model generation complete`);
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
