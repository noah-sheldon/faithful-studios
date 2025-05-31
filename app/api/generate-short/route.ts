// app/api/generate-short/route.ts
import { generateShortForLanguage } from "@/utils/generateShortForLanguage";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl, description, languages } = body;

    if (!imageUrl || !description || !Array.isArray(languages)) {
      return new Response(
        JSON.stringify({
          error: "Missing imageUrl, description or languages[]",
        }),
        { status: 400 }
      );
    }

    const results = await Promise.allSettled(
      languages.map((lang: string) =>
        generateShortForLanguage({ imageUrl, description, lang })
      )
    );

    const output = results.map((res, idx) => {
      if (res.status === "fulfilled") {
        return {
          language: languages[idx],
          status: "success",
          videoUrl: res.value,
        };
      } else {
        return {
          language: languages[idx],
          status: "error",
          error: res.reason,
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
      JSON.stringify({ error: "Internal server error", detail: err }),
      { status: 500 }
    );
  }
}
