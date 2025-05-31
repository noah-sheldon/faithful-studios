// utils/translateScript.ts
import OpenAI from "openai";

export async function translateScript(
  scriptParts: string[],
  targetLang: string
): Promise<string[]> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

  const translated: string[] = [];
  for (const text of scriptParts) {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Only translate the following sentence into ${targetLang}. Do not explain anything. Just return the translated sentence:\n\n"${text}"`,
        },
      ],
    });

    translated.push(response.choices[0].message.content || "");
  }

  return translated;
}
