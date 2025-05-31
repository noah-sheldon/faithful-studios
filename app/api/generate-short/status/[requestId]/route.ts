// app/api/generate-short/status/[requestId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const requestId = (await params).requestId;

  if (!requestId) {
    return NextResponse.json({ error: "Missing requestId" }, { status: 400 });
  }

  try {
    const job = await prisma.videoJob.findUnique({
      where: { requestId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      requestId: job.requestId,
      status: job.status,
      videoUrl: job.videoUrl,
      error: job.error,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch status", detail: String(err) },
      { status: 500 }
    );
  }
}
