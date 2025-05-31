// utils/removeBackground.ts
import axios from "axios";
import FormData from "form-data";

/**
 * Removes background from a given image URL using PhotoRoom
 * @param imageUrl Public image URL
 * @returns Cleaned image as a Buffer
 */
export async function removeBackground(imageUrl: string): Promise<Buffer> {
  // Step 1: Download original image
  const imageResponse = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  const imageBuffer = Buffer.from(imageResponse.data);

  // Step 2: Prepare FormData
  const form = new FormData();
  form.append("image_file", imageBuffer, "image.jpg");

  // Step 3: Send to PhotoRoom
  const removeBgResponse = await axios.post(
    "https://sdk.photoroom.com/v1/segment",
    form,
    {
      headers: {
        "x-api-key": process.env.PHOTOROOM_API_KEY!,
        ...form.getHeaders(),
      },
      responseType: "arraybuffer",
    }
  );

  return Buffer.from(removeBgResponse.data);
}
