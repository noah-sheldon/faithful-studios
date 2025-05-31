// utils/generateScenePrompts.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateScenePrompts(
  description: string
): Promise<string[]> {
  const prompt = `
    You're a world-class ad director. Based on the product description below, write 3 distinct marketing scenes for a 30-second video ad.
    
    Each scene must:
    - Be realistic and emotionally resonant
    - Showcase one key benefit of the product
    - Describe the visual setting in a short, cinematic way
    - Be easy to visualize for video generation
    
    Product: "${description}"
    
    Example:
    Product: Noise-cancelling headphones
    
    1. A young man walks through a noisy city, completely lost in his music — the sounds fade around him.
    2. He jogs through light rain; droplets bounce off the sleek, waterproof headphones.
    3. He’s on a 12-hour flight, headphones on, eyes closed — battery icon still shows 85%.
    
    Now write 3 scenes for the product above.
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
