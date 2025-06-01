// app/components/GenerateProductForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Tablet } from "lucide-react";
import { toast } from "sonner";

export function GenerateProductForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/generate-product", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to generate 3D model");

      toast.success("3D model generated and stored successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while generating product model.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-l-4 border-l-teal-500 shadow-md">
      <CardHeader className="bg-slate-50 border-b pb-4">
        <div className="flex items-center gap-2">
          <Tablet className="h-5 w-5 text-teal-600" />
          <h2 className="text-xl font-semibold text-slate-800">
            Generate 3D Product Model
          </h2>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 pb-4 px-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label className="text-slate-700">Product Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t px-6 py-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Uploading...
              </>
            ) : (
              "Generate 3D Model"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
