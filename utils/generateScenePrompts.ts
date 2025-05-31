// utils/generateScenePrompts.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateScenePrompts(
  description: string
): Promise<string[]> {
  const prompt = `
    You're a world-class video director creating a 30-second viral ad for the product below.

    Write 5 short scenes that:
    - Each feature one person using the product in a natural, realistic setting
    - Highlight a specific benefit, feeling, or outcome of using the product
    - Are visually grounded — no floating objects, fantasy, or unrealistic elements
    - Use clear, physical actions that are easy for AI to generate (e.g. sipping, walking, typing)
    - Happen in simple everyday locations (desk, couch, gym, kitchen, park, street)
    - Don’t need transitions — each scene can stand alone, like visual beats
    - Each scene must be under 2 lines and no more than 20 words

    Product: "${description}"

    Examples:

    Product: Noise-cancelling headphones
    1. A man puts on headphones in a busy café — the background fades, his face relaxes.
    2. A woman jogs past traffic, music in her ears — no honking, just rhythm.
    3. A guy works on his laptop with headphones on — focused, undisturbed.
    4. She taps the side of the headphones, hears her friend speak — ambient mode on.
    5. Headphones sit on a charging dock — small light glows, ready for tomorrow.

    Product: Huel (meal replacement drink)
    1. A student grabs a chilled Huel bottle from the fridge, shakes it, drinks while heading out.
    2. A gym-goer mixes Huel powder and water in a shaker — drinks, wipes sweat, satisfied.
    3. A woman lounges on the couch, sipping Huel and scrolling her phone — no meal prep stress.
    4. A guy skips the lunch line, drinking Huel while already working at his desk.
    5. An empty bottle drops into the recycling bin — clean and done.

    Product: Productivity app
    1. A woman taps “Start Focus” on the app, puts phone down — timer begins, she dives into writing.
    2. A man gets a gentle notification — “Break time” — he smiles and stretches.
    3. She checks her daily streak — 12 days straight — small celebratory animation plays.
    4. He adds a task with voice input — “Buy milk” — it appears instantly.
    5. App shows progress chart filling slowly — dopamine hit, motivation rising.

    Now write 5 grounded, cinematic scenes for the product described above.
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
