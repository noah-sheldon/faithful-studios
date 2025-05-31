"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Sparkles, Languages } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", label: "English" }, 
  { code: "ja", label: "Japanese" }, 
  { code: "ko", label: "Korean" },
  { code: "ms", label: "Malay" }, 
  { code: "th", label: "Thai" }, 
  { code: "ta", label: "Tamil" }, 
  { code: "it", label: "Italian" }, 
  { code: "de", label: "German" }, 
  { code: "fr", label: "French" }, 
  { code: "ar", label: "Arabic" }, 
  { code: "es", label: "Spanish" }, 
];

export default function ShortFormAvatarPage() {
  const [description, setDescription] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (!description || selectedLanguages.length === 0) {
      toast.error(
        "Please describe your message and select at least 1 language."
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/short-form-avatar", {
        method: "POST",
        body: JSON.stringify({ description, languages: selectedLanguages }),
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();

      if (Array.isArray(json.jobs)) {
        toast.success("Avatar video(s) generation started.");
        setDescription("");
        setSelectedLanguages(["en"]);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      console.error("Error submitting avatar job:", err);
      toast.error("Failed to submit avatar job.");
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
    <div className="w-full mt-10 px-4 py-8 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto">
          <Card className="border-l-4 border-l-teal-500 shadow-md">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-teal-600" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Create Short Form Avatar
                </h2>
              </div>
            </CardHeader>

            <CardContent className="pt-6 pb-4 px-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700">
                    Message / Script Description
                  </Label>
                  <Textarea
                    placeholder="What should the avatar say or promote?"
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
                  "Generate Avatar Video"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
