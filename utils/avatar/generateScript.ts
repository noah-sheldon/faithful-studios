import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateScript(
  description: string,
  lang: string
): Promise<string> {
  const prompt = `
  You're a world-class short-form scriptwriter creating viral vertical video scripts for creators and brands.
  
  Write a compelling 10-second script in ${lang} that:
  - Sounds like a real person speaking to camera
  - Opens with a strong hook or insight
  - Feels natural, unscripted, and emotionally engaging
  - Aligns with this message or idea: "${description}"
  - You can tell a story, teach something, inspire curiosity, or highlight a transformation
  - Avoid buzzwords, clickbait, or robotic tone
  - Limit to 3-4 natural spoken sentences
  - Keep it under 30 words total
  - **Respond only with the script text in ${lang}, no explanations or extra text.**
  
  Script:
  `.trim();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content?.trim() ?? "";
}
