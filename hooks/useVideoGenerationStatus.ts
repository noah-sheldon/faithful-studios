import { useEffect, useState } from "react";

export function useVideoGenerationStatus(requestId: string) {
  const [status, setStatus] = useState<
    "queued" | "processing" | "done" | "error"
  >("queued");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/generate-short/status/${requestId}`);
        const data = await res.json();

        setStatus(data.status);
        setVideoUrl(data.videoUrl || null);
        setError(data.error || null);

        if (data.status === "done" || data.status === "error") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
        clearInterval(interval);
      }
    }, 3000); // poll every 3 seconds

    return () => clearInterval(interval);
  }, [requestId]);

  return { status, videoUrl, error };
}
