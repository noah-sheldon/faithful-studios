// utils/generateScriptFromScenes.ts
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateScriptFromScenes(
  scenePrompts: string[]
): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `You're a creative copywriter. For each scene below, write a concise, engaging 1-line script. Only return the 3 scripts numbered 1–3. No explanations.\n\n${scenePrompts
          .map((s, i) => `${i + 1}. ${s}`)
          .join("\n")}`,
      },
    ],
  });

  return (
    response.choices[0].message.content
      ?.split(/\n/)
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 3) ?? []
  );
}
