// utils/generateScenePrompts.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateScenePrompts(
  description: string
): Promise<string[]> {
  const prompt = `
You are a professional video director creating a short 30-second product ad composed of 3 distinct scenes.

Write exactly 3 grounded, cinematic scenes that:
- Begin with something visually eye-catching or emotionally engaging
- Each feature one person using the product in a realistic and natural setting
- Are gender-appropriate and avoid mismatches (e.g., avoid a man wearing a woman's dress unless contextually relevant)
- Use realistic, simple physical actions easy to animate or film (e.g. sipping, walking, typing)
- Are set in familiar locations (kitchen, street, gym, office, bedroom, etc.)
- Each line must be short: under 20 words, and no more than 2 lines of text
- The third scene must be a natural call-to-action, like “Try it today”, “Available now”, etc.

Product: "${description}"

Examples:

Product: Running shoes
1. A woman laces up on her doorstep as morning light hits — she bolts off smiling.
2. A man jogs past traffic, feet pounding pavement — lightweight and focused.
3. Shoes by the door — “Run your way. Get yours now.”

Now generate 3 short, human-centered ad scenes for the product above.
`.trim();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const text = response.choices[0].message.content || "";
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}
