import { NextResponse } from "next/server";
import { generateAvatar } from "@/utils/avatar/generateAvatar";

type Body = {
  description: string;
  languages: string[]; // e.g. ["en", "es"]
};

export async function POST(req: Request) {
  const { description, languages }: Body = await req.json();

  if (!description || !languages?.length || languages.length > 2) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const jobs = await Promise.all(
    languages.map(async (lang) => {
      const { requestId, status } = await generateAvatar({ description, lang });

      return {
        requestId,
        lang,
        status,
      };
    })
  );

  return NextResponse.json({ jobs });
}
