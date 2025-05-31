import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY!,
});

interface MergeInput {
  avatarUrl: string;
  cleanImageUrl: string;
  description: string;
}

function normalizeProductName(description: string): string {
  return description
    .replace(/^(a|an|the)\s+/i, "")
    .replace(/\.$/, "")
    .trim();
}

function buildMergePrompt(description: string): string {
  const productName = normalizeProductName(description.toLowerCase());
  return `Show the ${productName} in a natural, realistic way near or around the person. Choose a setting and placement that makes sense for how a human would typically interact with or use this product. The result should feel authentic, emotionally relatable, and visually cohesive — no floating objects or unnatural compositions.`;
}

export async function mergeAvatarAndProduct({
  avatarUrl,
  cleanImageUrl,
  description,
}: MergeInput): Promise<Buffer> {
  const prompt = buildMergePrompt(description);
  console.log("[mergeAvatarAndProduct] Prompt:", prompt);

  const result = await fal.subscribe("fal-ai/flux-pro/kontext/max/multi", {
    input: {
      prompt,
      image_urls: [avatarUrl, cleanImageUrl],
      guidance_scale: 3.5,
      output_format: "png",
      aspect_ratio: "9:16", // For mobile video format
      num_images: 1,
      safety_tolerance: "2",
    },
    logs: false,
  });

  const mergedImageUrl = result?.data?.images?.[0]?.url;

  if (!mergedImageUrl) {
    throw new Error("No merged image URL returned from FAL");
  }

  const imageResponse = await fetch(mergedImageUrl);
  if (!imageResponse.ok) {
    throw new Error(
      `Failed to fetch merged image: ${imageResponse.statusText}`
    );
  }

  const arrayBuffer = await imageResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
