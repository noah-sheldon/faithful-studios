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
    - Start with a viral hook or unexpected moment that grabs attention immediately
    - Each feature one person using the product in a natural, realistic setting
    - Highlight a specific benefit, feeling, or outcome of using the product
    - Are visually grounded — no floating objects, fantasy, or unrealistic elements
    - Use clear, physical actions that are easy for AI to generate (e.g. sipping, walking, typing)
    - Happen in simple everyday locations (desk, couch, gym, kitchen, park, street)
    - Don’t need transitions — each scene can stand alone, like visual beats
    - Each scene must be under 2 lines and no more than 20 words
     - The third scene should be a natural and compelling call-to-action (e.g., "Check it out now", "Buy today", "Search now") that encourages viewer engagement

    Product: "${description}"

    Examples:

    Product: Noise-cancelling headphones
    1. A crowded café goes silent as a man puts on headphones — instant calm.
    2. A woman jogs, music flowing, blocking out the city noise.
    3. She smiles, tapping headphones — “Experience peace. Try yours today.”
    4. A man focuses at his laptop, undisturbed by chatter around.
    5. Headphones rest on a sleek dock — ready for tomorrow’s adventure.

    Product: Huel (meal replacement drink)
    1. A student grabs a chilled Huel bottle, catching the morning rush eye.
    2. At the gym, a quick shake — energy fueling the workout.
    3. She lounges, sipping Huel — “Skip the prep. Get yours now.”
    4. A busy professional drinks Huel while typing at a desk.
    5. The empty bottle lands in recycling — easy and eco-friendly.

    Product: Productivity app
    1. A woman taps “Start Focus” — her world narrows, distractions fade.
    2. A man stretches after a “Break time” notification — refreshed.
    3. She glances at a progress streak — “Boost your productivity today.”
    4. Voice input adds a task — “Buy milk” appears instantly.
    5. A progress chart fills — motivation building with every task.

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
