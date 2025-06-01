// app/api/generate-product/route.ts
import { generateProduct } from "@/utils/product/generateProduct";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return new Response(JSON.stringify({ error: "Missing product image" }), {
        status: 400,
      });
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    const result = await generateProduct({ imageBuffer });

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
