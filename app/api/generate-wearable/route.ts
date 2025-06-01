// app/api/generate-wearable/route.ts
import { generateWearable } from "@/utils/wearable/generateWearable";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const modelFile = formData.get("model") as File | null;
    const garmentFile = formData.get("garment") as File | null;
    const description = formData.get("description") as string;

    if (!modelFile || !garmentFile || !description) {
      return new Response(
        JSON.stringify({ error: "Missing model, garment, or description" }),
        { status: 400 }
      );
    }

    const modelBuffer = Buffer.from(await modelFile.arrayBuffer());
    const garmentBuffer = Buffer.from(await garmentFile.arrayBuffer());

    const result = await generateWearable({
      modelBuffer,
      garmentBuffer,
      description,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", detail: String(err) }),
      { status: 500 }
    );
  }
}
