"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
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
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ja", label: "Japanese" },
  { code: "it", label: "Italian" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
];

export default function ShortForm() {
  const [description, setDescription] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  async function handleSubmit() {
    if (!imageFile || !description || selectedLanguages.length === 0) {
      toast.error(
        "Please upload an image, write a description, and select languages."
      );
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("description", description);
      formData.append("languages", JSON.stringify(selectedLanguages));

      const res = await fetch("/api/generate-short", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (json.status === "completed") {
        toast.success("Generation started.");
        setDescription("");
        setSelectedLanguages(["en"]);
        setImageFile(null);
        setImagePreview(null);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit job.");
    } finally {
      setIsLoading(false);
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
    <div className="w-full px-4 py-10 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="mx-auto w-full max-w-screen-md">
        <Card className="border-l-4 border-teal-500 shadow-sm">
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
                  <Label className="text-slate-700">Upload Product Image</Label>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
                {imagePreview && (
                  <div className="relative mt-3 w-full max-w-sm aspect-[4/3]">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="rounded border object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Product Description</Label>
                <Textarea
                  placeholder="Describe your product in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="resize-none border-slate-300 focus-visible:ring-teal-500"
                />
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
                    const disabled = !checked && selectedLanguages.length >= 2;

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
                        />
                        <label
                          htmlFor={lang.code}
                          className={cn(
                            "text-sm font-medium select-none",
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
    </div>
  );
}
