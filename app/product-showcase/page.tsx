// app/components/GenerateWearableForm.tsx
"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Package, Tablet } from "lucide-react";
import { toast } from "sonner";
import { GenerateProductForm } from "./generateProductForm";
import { useRouter } from "next/navigation";

function GenerateWearableForm() {
  const [description, setDescription] = useState("");
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [garmentFile, setGarmentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description || !modelFile || !garmentFile) {
      toast.error("Please provide description, model image and garment image.");
      return;
    }

    const formData = new FormData();
    formData.append("model", modelFile);
    formData.append("garment", garmentFile);
    formData.append("description", description);

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/generate-wearable", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit job");
      const json = await res.json();
      toast.success(`Wearable generation started! Job ID: ${json.requestId}`);

      setDescription("");
      setModelFile(null);
      setGarmentFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while generating wearable.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-l-4 border-l-teal-500 shadow-md">
      <CardHeader className="bg-slate-50 border-b pb-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-teal-600" />
          <h2 className="text-xl font-semibold text-slate-800">
            Generate Wearable Try-On
          </h2>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 pb-4 px-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label className="text-slate-700">Description</Label>
              <Textarea
                placeholder="Describe the product or campaign goal..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="resize-none border-slate-300 focus-visible:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">Model Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setModelFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">Garment Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setGarmentFile(e.target.files?.[0] || null)}
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
              "Generate Wearable"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function GeneratePageWithTabs() {
  const router = useRouter();
  const [type, setType] = useState<"wearable" | "product">("wearable");

  useEffect(() => {
    const urlType = new URLSearchParams(window.location.search).get("type");
    if (urlType === "product" || urlType === "wearable") {
      setType(urlType);
    }
  }, []);

  return (
    <div className="w-full mt-10 px-4 py-8 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="container mx-auto">
        <Tabs defaultValue={type} className="max-w-2xl mx-auto">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger
              value="wearable"
              onClick={() => router.push("/product-showcase?type=wearable")}
            >
              <Package className="w-4 h-4 mr-2" /> Wearable
            </TabsTrigger>
            <TabsTrigger
              value="product"
              onClick={() => router.push("/product-showcase?type=product")}
            >
              <Tablet className="w-4 h-4 mr-2" /> Product
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wearable">
            <GenerateWearableForm />
          </TabsContent>

          <TabsContent value="product">
            <GenerateProductForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
