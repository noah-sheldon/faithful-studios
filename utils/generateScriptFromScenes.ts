// utils/generateScriptFromScenes.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateScriptFromScenes(
  scenePrompts: string[]
): Promise<string[]> {
  const prompt = `
You're a world-class short-form copywriter creating viral 30-second video ads for TikTok, Reels, and YouTube Shorts.

Write 5 short voiceover scripts — one for each scene — to match the visuals below.

Each voiceover must:
- Be 2–3 short lines (max ~30 words)
- Hook the viewer instantly in line one
- Match the vibe and action of the scene
- Sound like a real creator talking to the camera
- Highlight a transformation, benefit, or relatable feeling
- Avoid buzzwords, clichés, or naming the product

Example:
Scene: A guy opens a cold can — fizz rises fast.
Voiceover: "That sound? Best part of my day. Cold, crisp, zero guilt."

Scenes:
${scenePrompts.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Write the 5 voiceover scripts, numbered 1–5.
`.trim();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const rawOutput = response.choices[0].message.content || "";

  return rawOutput
    .split(/\n+/)
    .map((line) =>
      line
        .replace(/^\d+\.\s*/, "") // remove number prefix
        .replace(/^Voiceover:\s*/i, "") // remove "Voiceover:" if present
        .trim()
    )
    .filter(Boolean)
    .slice(0, 3);
}
