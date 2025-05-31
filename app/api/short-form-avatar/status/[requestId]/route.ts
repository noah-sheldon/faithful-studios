import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const requestId = (await params).requestId;
  const job = await prisma.videoJob.findUnique({
    where: { requestId: requestId },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: job.status,
    currentStep: job.currentStep,
    videoUrl: job.videoUrl,
    audioUrl: job.audioUrl,
    error: job.error,
  });
}
