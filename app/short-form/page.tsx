"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ImageIcon, Languages, FileVideo } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "zh", label: "Chinese" },
];

export default function ShortForm() {
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestIds, setRequestIds] = useState<string[]>([]);

  async function handleSubmit() {
    if (!imageUrl || !description || selectedLanguages.length === 0) {
      toast.error(
        "Please fill in all fields and select at least one language."
      );
      return;
    }

    setIsLoading(true);

    const res = await fetch("/api/generate-short", {
      method: "POST",
      body: JSON.stringify({
        imageUrl,
        description,
        languages: selectedLanguages,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();
    const ids = json.results?.map((r) => r.requestId).filter(Boolean) || [];
    setRequestIds(ids);
    setIsLoading(false);

    if (json.status === "completed") {
      toast.success("Generation started.");
    } else {
      toast.error("Something went wrong.");
    }
  }

  function handleLanguageToggle(langCode: string, checked: boolean) {
    if (checked) {
      if (selectedLanguages.length >= 2) {
        toast.error("You can only select up to 2 languages.");
        return;
      }
      setSelectedLanguages((prev) => [...prev, langCode]);
    } else {
      setSelectedLanguages((prev) => prev.filter((c) => c !== langCode));
    }
  }

  return (
    <div className="w-full mt-10 px-4 py-8 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6"></h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-l-4 border-l-teal-500 shadow-md">
              <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex items-center gap-2">
                  <FileVideo className="h-5 w-5 text-teal-600" />
                  <h2 className="text-xl font-semibold text-slate-800">
                    Create Product Short
                  </h2>
                </div>
              </CardHeader>

              <CardContent className="pt-6 pb-4 px-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-slate-500" />
                      <Label className="text-slate-700">
                        Product Image URL
                      </Label>
                    </div>
                    <Input
                      placeholder="Paste image URL..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="border-slate-300 focus-visible:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700">
                      Product Description
                    </Label>
                    <Textarea
                      placeholder="Describe your product in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="resize-none border-slate-300 focus-visible:ring-teal-500"
                    />
                    <p className="text-xs text-slate-500">
                      Provide a clear description of your product&apos;s
                      features and benefits.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4 text-slate-500" />
                      <Label className="text-slate-700">
                        Target Languages (Max 2)
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 p-3 bg-slate-50 rounded-md">
                      {LANGUAGES.map((lang) => {
                        const checked = selectedLanguages.includes(lang.code);
                        const disabled =
                          !checked && selectedLanguages.length >= 2;

                        return (
                          <div
                            key={lang.code}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={lang.code}
                              checked={checked}
                              disabled={disabled}
                              onCheckedChange={(value: boolean) =>
                                handleLanguageToggle(lang.code, value)
                              }
                              className={
                                checked ? "text-teal-600 border-teal-600" : ""
                              }
                            />
                            <label
                              htmlFor={lang.code}
                              className={cn(
                                "text-sm font-medium leading-none select-none",
                                disabled ? "opacity-50" : "cursor-pointer"
                              )}
                            >
                              {lang.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50 border-t px-6 py-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    "Generate Video"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Generation Status
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                {requestIds.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
                    <FileVideo className="h-12 w-12 text-slate-300 mb-2" />
                    <p>No videos generated yet</p>
                    <p className="text-xs mt-1">
                      Submit the form to start generating videos
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {requestIds.map((id) => (
                      <VideoStatusCard key={id} requestId={id} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-teal-50 border-teal-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-teal-800 mb-2">
                  Tips for best results
                </h4>
                <ul className="text-sm text-teal-700 space-y-1.5">
                  <li>• Use high-quality product images</li>
                  <li>• Write detailed descriptions (50-200 words)</li>
                  <li>• Include key benefits and features</li>
                  <li>• Mention your target audience</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoStatusCard({ requestId }: { requestId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["video-status", requestId],
    queryFn: async () => {
      const res = await fetch(`/api/status/${requestId}`);
      if (!res.ok) throw new Error("Failed to fetch video status");
      return res.json();
    },
    refetchInterval: 3000,
  });

  if (error) {
    toast.error("Failed to fetch status");
    return null;
  }

  return (
    <Card className="overflow-hidden border-slate-200">
      <CardContent className="p-0">
        <div className="p-3 border-b bg-slate-50">
          <div className="flex justify-between items-center">
            <p className="text-xs font-medium text-slate-500 truncate">
              ID: {requestId.substring(0, 8)}...
            </p>
            <StatusBadge status={data?.status} isLoading={isLoading} />
          </div>
        </div>

        <div className="p-3">
          {isLoading || !data?.status ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
            </div>
          ) : data.status === "done" ? (
            <div className="rounded overflow-hidden border border-slate-200">
              <video src={data.videoUrl} controls className="w-full h-auto" />
              <div className="p-2 bg-slate-50 text-xs text-slate-600 flex justify-between">
                <span>Language: {data.language || "Unknown"}</span>
                <a
                  href={data.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline"
                >
                  Download
                </a>
              </div>
            </div>
          ) : data.status === "error" ? (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded">
              Error: {data.error || "Unknown error occurred"}
            </div>
          ) : (
            <div className="py-3 px-1">
              <div className="h-2 bg-slate-100 rounded overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{
                    width:
                      data.status === "processing"
                        ? "75%"
                        : data.status === "uploading"
                        ? "90%"
                        : "30%",
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                {data.status === "processing"
                  ? "Processing video..."
                  : data.status === "uploading"
                  ? "Uploading video..."
                  : "Preparing..."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({
  status,
  isLoading,
}: {
  status?: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
        Loading...
      </span>
    );
  }

  switch (status) {
    case "done":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
          Complete
        </span>
      );
    case "error":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
          Failed
        </span>
      );
    case "processing":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">
          Processing
        </span>
      );
    case "uploading":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
          Uploading
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-600">
          Pending
        </span>
      );
  }
}
