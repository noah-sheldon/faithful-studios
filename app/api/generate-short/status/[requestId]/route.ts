// app/api/generate-short/status/[requestId]/route.ts

import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { requestId: string } }
) {
  const requestId = params.requestId;

  if (!requestId) {
    return new Response(JSON.stringify({ error: "Missing requestId" }), {
      status: 400,
    });
  }

  try {
    const job = await prisma.videoJob.findUnique({
      where: { requestId },
    });

    if (!job) {
      return new Response(JSON.stringify({ error: "Job not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        requestId: job.requestId,
        status: job.status,
        videoUrl: job.videoUrl,
        error: job.error,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch status", detail: String(err) }),
      { status: 500 }
    );
  }
}
