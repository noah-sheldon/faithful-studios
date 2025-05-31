// app/api/generate-short/route.ts
import { generateShortForLanguage } from "@/utils/generateShortForLanguage";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const description = formData.get("description") as string;
    const rawLanguages = formData.get("languages");

    if (!file || !description || !rawLanguages) {
      return new Response(
        JSON.stringify({
          error: "Missing image, description, or languages",
        }),
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let languages: string[] = [];
    try {
      languages = JSON.parse(rawLanguages.toString());
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid languages format" }),
        { status: 400 }
      );
    }

    if (!Array.isArray(languages) || languages.length === 0) {
      return new Response(
        JSON.stringify({ error: "languages must be a non-empty array" }),
        { status: 400 }
      );
    }

    const results = await Promise.allSettled(
      languages.map((lang) =>
        generateShortForLanguage({ imageBuffer: buffer, description, lang })
      )
    );

    const output = results.map((res, idx) => {
      if (res.status === "fulfilled") {
        return {
          language: languages[idx],
          status: "success",
          requestId: res.value.requestId, // ✅ use requestId
        };
      } else {
        return {
          language: languages[idx],
          status: "error",
          error: String(res.reason),
        };
      }
    });

    return new Response(
      JSON.stringify({ status: "completed", results: output }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", detail: String(err) }),
      { status: 500 }
    );
  }
}
