// app/api/jobs/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const jobs = await prisma.videoJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load jobs", detail: String(error) }),
      { status: 500 }
    );
  }
}
