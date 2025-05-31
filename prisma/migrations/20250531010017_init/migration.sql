-- CreateTable
CREATE TABLE "VideoJob" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "videoUrl" TEXT,
    "error" TEXT,
    "falAudioJob" TEXT,
    "falVideoJob" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoJob_requestId_key" ON "VideoJob"("requestId");
