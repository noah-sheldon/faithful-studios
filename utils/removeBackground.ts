import { fal } from "@fal-ai/client";
import axios from "axios";

/**
 * Removes background using smoretalk-ai/rembg-enhance
 * @param imageUrl Publicly accessible image URL
 * @returns Buffer of the background-removed image
 */
export async function removeBackground(imageUrl: string): Promise<Buffer> {
  const result = await fal.subscribe("smoretalk-ai/rembg-enhance", {
    input: {
      image_url: imageUrl,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs?.forEach((log) => console.log(log.message));
      }
    },
  });

  const cleanedImageUrl = result.data.image.url;

  const response = await axios.get(cleanedImageUrl, {
    responseType: "arraybuffer",
  });

  return Buffer.from(response.data);
}
