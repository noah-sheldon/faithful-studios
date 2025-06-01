"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  FileVideo,
  ImageIcon,
  Plus,
  Download,
  RefreshCw,
  Grid3X3,
  List,
  Play,
  ChevronLeft,
  ChevronRight,
  Shirt,
  Box,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useState, Suspense, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamically import 3D components to avoid SSR issues
const Model3DViewer = dynamic(() => import("./components/model-3d-viewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-slate-100 rounded-lg">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
    </div>
  ),
});

type Job = {
  requestId: string;
  status: string;
  currentStep?: string;
  videoUrl?: string;
  mergedImageUrl?: string[];
  error?: string;
  createdAt?: string;
  type?: string;
  language?: string;
  description?: string;
  imageUrl?: string;
};

type VideoDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  jobId: string;
};

type ImageCarouselDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  jobId: string;
};

type Model3DDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  modelUrl: string;
  jobId: string;
};

const CREATE_OPTIONS = [
  {
    href: "/short-form",
    icon: FileVideo,
    label: "Short Form",
    description: "Create engaging short-form videos",
  },
  {
    href: "/short-form-avatar",
    icon: ImageIcon,
    label: "Short Form with Avatar",
    description: "Create engaging short-form videos with avatars",
  },
  {
    href: "/product-showcase?type=wearable",
    icon: Shirt,
    label: "Wearable",
    description: "Virtual try-on experiences",
  },
  {
    href: "/product-showcase?type=product",
    icon: Box,
    label: "Product 3D",
    description: "3D product visualization",
  },
];

function VideoDialog({ isOpen, onClose, videoUrl, jobId }: VideoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] sm:w-[90vw] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-teal-700 flex items-center gap-2">
            <FileVideo className="h-5 w-5" />
            Video Preview
          </DialogTitle>
          <DialogDescription>Job #{jobId.slice(0, 8)}</DialogDescription>
        </DialogHeader>
        <div className="relative rounded-lg overflow-hidden border border-teal-100 bg-black aspect-video">
          <video src={videoUrl} controls autoPlay className="w-full h-full" />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="sm:order-1 order-2"
          >
            Close
          </Button>
          <Button asChild className="gap-2 sm:order-2 order-1">
            <a
              href={videoUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ImageCarouselDialog({
  isOpen,
  onClose,
  images,
  jobId,
}: ImageCarouselDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const downloadImage = (url: string, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `wearable-${jobId.slice(0, 8)}-${index + 1}.png`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    images.forEach((url, index) => {
      setTimeout(() => downloadImage(url, index), index * 500);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-teal-700 flex items-center gap-2">
            <Shirt className="h-5 w-5" />
            Wearable Try-On Results
          </DialogTitle>
          <DialogDescription>
            Job #{jobId.slice(0, 8)} • {currentIndex + 1} of {images.length}
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <div className="relative aspect-[3/4] max-h-[70vh] rounded-lg overflow-hidden border border-teal-100 bg-slate-50">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Wearable result ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />

            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-teal-600" : "bg-slate-300"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadImage(images[currentIndex], currentIndex)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download Current</span>
              <span className="sm:hidden">Current</span>
            </Button>
            {images.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAll}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download All</span>
                <span className="sm:hidden">All</span>
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto mt-2 sm:mt-0"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Model3DDialog({
  isOpen,
  onClose,
  modelUrl,
  jobId,
}: Model3DDialogProps) {
  const downloadModel = () => {
    const link = document.createElement("a");
    link.href = modelUrl;
    link.download = `product-3d-${jobId.slice(0, 8)}.glb`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-teal-700 flex items-center gap-2">
            <Box className="h-5 w-5" />
            3D Product Model
          </DialogTitle>
          <DialogDescription>Job #{jobId.slice(0, 8)}</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <div className="relative aspect-square max-h-[60vh] rounded-lg overflow-hidden border border-teal-100 bg-gradient-to-br from-slate-50 to-slate-100">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                </div>
              }
            >
              <Model3DViewer modelUrl={modelUrl} />
            </Suspense>
          </div>

          {/* 3D Controls Info */}
          <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
            <h4 className="text-sm font-medium text-teal-800 mb-2">
              3D Controls
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-teal-700">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                <span>Left click + drag to rotate</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                <span>Right click + drag to pan</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                <span>Scroll to zoom in/out</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadModel}
            className="gap-2 w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Download Model
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto mt-2 sm:mt-0"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const [videoDialog, setVideoDialog] = useState<{
    isOpen: boolean;
    url: string;
    jobId: string;
  }>({
    isOpen: false,
    url: "",
    jobId: "",
  });
  const [imageDialog, setImageDialog] = useState<{
    isOpen: boolean;
    images: string[];
    jobId: string;
  }>({
    isOpen: false,
    images: [],
    jobId: "",
  });
  const [modelDialog, setModelDialog] = useState<{
    isOpen: boolean;
    url: string;
    jobId: string;
  }>({
    isOpen: false,
    url: "",
    jobId: "",
  });

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const {
    data: jobs,
    isLoading,
    refetch,
  } = useQuery<Job[]>({
    queryKey: ["video-jobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
    refetchInterval: 3000,
  });

  const completedJobs = jobs?.filter((job) => job.status === "done") || [];
  const inProgressJobs =
    jobs?.filter((job) => job.status !== "done" && job.status !== "error") ||
    [];
  const errorJobs = jobs?.filter((job) => job.status === "error") || [];

  const getFilteredJobs = () => {
    if (!jobs) return [];
    switch (activeTab) {
      case "completed":
        return completedJobs;
      case "progress":
        return inProgressJobs;
      case "failed":
        return errorJobs;
      default:
        return jobs;
    }
  };

  const openVideoDialog = (url: string, jobId: string) => {
    setVideoDialog({ isOpen: true, url, jobId });
  };

  const closeVideoDialog = () => {
    setVideoDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const openImageDialog = (images: string[], jobId: string) => {
    setImageDialog({ isOpen: true, images, jobId });
  };

  const closeImageDialog = () => {
    setImageDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const openModelDialog = (url: string, jobId: string) => {
    setModelDialog({ isOpen: true, url, jobId });
  };

  const closeModelDialog = () => {
    setModelDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-white to-slate-50">
        {/* Video Dialog */}
        <VideoDialog
          isOpen={videoDialog.isOpen}
          onClose={closeVideoDialog}
          videoUrl={videoDialog.url}
          jobId={videoDialog.jobId}
        />

        {/* Image Carousel Dialog */}
        <ImageCarouselDialog
          isOpen={imageDialog.isOpen}
          onClose={closeImageDialog}
          images={imageDialog.images}
          jobId={imageDialog.jobId}
        />

        {/* 3D Model Dialog */}
        <Model3DDialog
          isOpen={modelDialog.isOpen}
          onClose={closeModelDialog}
          modelUrl={modelDialog.url}
          jobId={modelDialog.jobId}
        />

        {/* Compact Header */}
        <div className="bg-white border-b border-teal-100 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-teal-800">
                  Content Studio
                </h1>
                <p className="text-sm text-teal-600">
                  Create and manage your content projects
                </p>
              </div>
              <Button
                onClick={() => refetch()}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="gap-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 self-start sm:self-auto"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Compact Create Section */}
          <Card className="border-teal-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-600" />
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-teal-800">
                <Plus className="h-5 w-5 text-teal-600" />
                Create New Content
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {CREATE_OPTIONS.map((option) => (
                  <Link key={option.href} href={option.href}>
                    <Card className="group hover:shadow-md transition-all duration-200 border-teal-100 hover:border-teal-300 cursor-pointer h-full">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-teal-50 group-hover:bg-teal-100 transition-colors">
                            <option.icon className="h-4 w-4 text-teal-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-900 group-hover:text-teal-700 transition-colors text-sm">
                              {option.label}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-teal-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-green-500" />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {completedJobs.length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-amber-500" />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      In Progress
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                      {inProgressJobs.length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-red-500" />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Failed</p>
                    <p className="text-2xl font-bold text-red-600">
                      {errorJobs.length}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-teal-500" />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Total Jobs
                    </p>
                    <p className="text-2xl font-bold text-teal-700">
                      {jobs?.length || 0}
                    </p>
                  </div>
                  <FileVideo className="h-8 w-8 text-teal-500 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs Section with Tabs and View Toggle */}
          <Card className="border-teal-200 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-600" />
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-lg text-teal-800">Jobs</CardTitle>
                {!isMobile && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-teal-200 rounded-lg p-1">
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={
                          viewMode === "list"
                            ? "bg-teal-600 hover:bg-teal-700"
                            : "hover:bg-teal-50 text-teal-700"
                        }
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={
                          viewMode === "grid"
                            ? "bg-teal-600 hover:bg-teal-700"
                            : "hover:bg-teal-50 text-teal-700"
                        }
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="overflow-x-auto pb-1">
                  <TabsList className="grid min-w-[300px] w-full grid-cols-4 mb-4 bg-teal-50">
                    <TabsTrigger
                      value="all"
                      className="text-xs data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                    >
                      All ({jobs?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger
                      value="completed"
                      className="text-xs data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                    >
                      Done ({completedJobs.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="progress"
                      className="text-xs data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                    >
                      Progress ({inProgressJobs.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="failed"
                      className="text-xs data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                    >
                      Failed ({errorJobs.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={activeTab} className="mt-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-2 text-teal-700">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading jobs...</span>
                      </div>
                    </div>
                  ) : getFilteredJobs().length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileVideo className="h-12 w-12 text-teal-300 mb-4" />
                      <h3 className="text-lg font-medium text-teal-800 mb-2">
                        {activeTab === "all"
                          ? "No jobs yet"
                          : `No ${activeTab} jobs`}
                      </h3>
                      <p className="text-teal-600 mb-4">
                        {activeTab === "all"
                          ? "Create your first content to get started"
                          : `No jobs in ${activeTab} status`}
                      </p>
                      {activeTab === "all" && (
                        <Link href="/short-form">
                          <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
                            <Plus className="h-4 w-4" />
                            Create Content
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px] sm:h-[600px] pr-4">
                      {isMobile || viewMode === "grid" ? (
                        <div className="space-y-4">
                          {getFilteredJobs().map((job) => (
                            <MobileJobCard
                              key={job.requestId}
                              job={job}
                              onViewVideo={openVideoDialog}
                              onViewImages={openImageDialog}
                              onView3DModel={openModelDialog}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {getFilteredJobs().map((job, index) => (
                            <div key={job.requestId}>
                              <DesktopJobCard
                                job={job}
                                onViewVideo={openVideoDialog}
                                onViewImages={openImageDialog}
                                onView3DModel={openModelDialog}
                              />
                              {index < getFilteredJobs().length - 1 && (
                                <Separator className="my-3 bg-teal-100" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Mobile-optimized job card
function MobileJobCard({
  job,
  onViewVideo,
  onViewImages,
  onView3DModel,
}: {
  job: Job;
  onViewVideo: (url: string, jobId: string) => void;
  onViewImages: (images: string[], jobId: string) => void;
  onView3DModel: (url: string, jobId: string) => void;
}) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "done":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          label: "Completed",
          badge: "success" as const,
        };
      case "error":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          label: "Failed",
          badge: "destructive" as const,
        };
      default:
        return {
          icon: Clock,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          label: "Processing",
          badge: "secondary" as const,
        };
    }
  };

  const statusInfo = getStatusInfo(job.status);
  const StatusIcon = statusInfo.icon;
  const progressPercent = getProgressPercent(job.currentStep, job.type);

  const getJobTypeIcon = (type?: string) => {
    switch (type) {
      case "wearable":
        return Shirt;
      case "product":
        return Box;
      default:
        return FileVideo;
    }
  };

  const JobTypeIcon = getJobTypeIcon(job.type);

  return (
    <Card className={`border ${statusInfo.borderColor} bg-white shadow-sm`}>
      <CardContent className="p-4 space-y-4">
        {/* Header with status and job info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
              <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <JobTypeIcon className="h-4 w-4 text-slate-500" />
                <span className="font-semibold text-slate-900">
                  #{job.requestId.slice(0, 8)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {job.requestId.slice(8, 20)}...
              </p>
            </div>
          </div>
          <Badge
            variant={
              statusInfo.badge === "success" ? "default" : statusInfo.badge
            }
            className={`${
              statusInfo.badge === "success"
                ? "bg-teal-600 hover:bg-teal-700"
                : ""
            }`}
          >
            {statusInfo.label}
          </Badge>
        </div>

        {/* Media Preview Section */}
        {job.status === "done" && job.type === "product" && job.videoUrl ? (
          <div className="space-y-3">
            <div
              className="relative w-full h-40 rounded-lg border border-teal-200 overflow-hidden cursor-pointer group bg-gradient-to-br from-slate-100 to-slate-200"
              onClick={() => onView3DModel(job.videoUrl!, job.requestId)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Box className="h-16 w-16 text-slate-600" />
              </div>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-center text-white">
                  <Box className="h-8 w-8 mx-auto mb-1" />
                  <p className="text-sm font-medium">View 3D Model</p>
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-teal-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                3D Model
              </div>
            </div>
            <Button
              className="w-full gap-2 bg-teal-600 hover:bg-teal-700 text-white h-12"
              onClick={() => onView3DModel(job.videoUrl!, job.requestId)}
            >
              <Eye className="h-4 w-4" />
              View 3D Model
            </Button>
          </div>
        ) : job.status === "done" &&
          job.type === "wearable" &&
          job.mergedImageUrl ? (
          <div className="space-y-3">
            <div
              className="relative w-full h-40 rounded-lg border border-teal-200 overflow-hidden cursor-pointer group"
              onClick={() => onViewImages(job.mergedImageUrl!, job.requestId)}
            >
              <Image
                src={job.mergedImageUrl[0] || "/placeholder.svg"}
                alt="Wearable result"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-center text-white">
                  <ImageIcon className="h-8 w-8 mx-auto mb-1" />
                  <p className="text-sm font-medium">View Images</p>
                </div>
              </div>
              {job.mergedImageUrl.length > 1 && (
                <div className="absolute top-3 right-3 bg-teal-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                  {job.mergedImageUrl.length} Images
                </div>
              )}
            </div>
            <Button
              className="w-full gap-2 bg-teal-600 hover:bg-teal-700 text-white h-12"
              onClick={() => onViewImages(job.mergedImageUrl!, job.requestId)}
            >
              <Eye className="h-4 w-4" />
              View Images ({job.mergedImageUrl.length})
            </Button>
          </div>
        ) : job.status === "done" && job.videoUrl ? (
          <div className="space-y-3">
            <div
              className="relative w-full h-40 rounded-lg border border-teal-200 overflow-hidden cursor-pointer group"
              onClick={() => onViewVideo(job.videoUrl!, job.requestId)}
            >
              <video
                src={job.videoUrl}
                className="w-full h-full object-cover"
                muted
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-center text-white">
                  <Play className="h-8 w-8 mx-auto mb-1" />
                  <p className="text-sm font-medium">Play Video</p>
                </div>
              </div>
            </div>
            <Button
              className="w-full gap-2 bg-teal-600 hover:bg-teal-700 text-white h-12"
              onClick={() => onViewVideo(job.videoUrl!, job.requestId)}
            >
              <Play className="h-4 w-4" />
              Play Video
            </Button>
          </div>
        ) : job.status === "error" ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                Error Details
              </span>
            </div>
            <p className="text-sm text-red-700">
              {job.error || "Unknown error occurred"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    Processing
                  </span>
                </div>
                <span className="text-sm font-medium text-amber-700">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-amber-700 capitalize">
                  {job.currentStep || "queued"}
                </p>
                <Progress
                  value={progressPercent}
                  className="h-3 bg-amber-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Job Details */}
        {(job.type || job.language || job.description) && (
          <div className="pt-2 border-t border-slate-100">
            <div className="space-y-2">
              {job.type && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-slate-600">Type:</span>
                  <span className="capitalize text-slate-800">{job.type}</span>
                </div>
              )}
              {job.language && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-slate-600">Language:</span>
                  <span className="text-slate-800">{job.language}</span>
                </div>
              )}
              {job.description && (
                <div className="text-sm">
                  <span className="font-medium text-slate-600">
                    Description:
                  </span>
                  <p className="text-slate-800 mt-1 line-clamp-2">
                    {job.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Desktop job card (simplified version of the original)
function DesktopJobCard({
  job,
  onViewVideo,
  onViewImages,
  onView3DModel,
}: {
  job: Job;
  onViewVideo: (url: string, jobId: string) => void;
  onViewImages: (images: string[], jobId: string) => void;
  onView3DModel: (url: string, jobId: string) => void;
}) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "done":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          label: "Completed",
          badge: "success" as const,
        };
      case "error":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          label: "Failed",
          badge: "destructive" as const,
        };
      default:
        return {
          icon: Clock,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          label: "Processing",
          badge: "secondary" as const,
        };
    }
  };

  const statusInfo = getStatusInfo(job.status);
  const StatusIcon = statusInfo.icon;
  const progressPercent = getProgressPercent(job.currentStep, job.type);

  const getJobTypeIcon = (type?: string) => {
    switch (type) {
      case "wearable":
        return Shirt;
      case "product":
        return Box;
      default:
        return FileVideo;
    }
  };

  const JobTypeIcon = getJobTypeIcon(job.type);

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border ${statusInfo.borderColor} hover:shadow-md transition-all duration-200`}
    >
      <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
        <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center gap-1">
            <JobTypeIcon className="h-3 w-3 text-slate-500" />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium text-slate-900 text-sm cursor-help">
                  #{job.requestId.slice(0, 8)}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm bg-white border border-teal-100 shadow-lg p-3 rounded-lg text-sm text-slate-700">
                <div className="space-y-2">
                  <div className="flex gap-1">
                    <span className="font-semibold text-teal-700">Type:</span>
                    <span className="capitalize">{job.type || "video"}</span>
                  </div>
                  {job.language && (
                    <div className="flex gap-1">
                      <span className="font-semibold text-teal-700">
                        Language:
                      </span>
                      <span>{job.language}</span>
                    </div>
                  )}
                  {job.description && (
                    <div>
                      <div className="font-semibold text-teal-700 mb-0.5">
                        Description:
                      </div>
                      <p className="text-slate-600 text-xs leading-snug line-clamp-4">
                        {job.description}
                      </p>
                    </div>
                  )}
                  {job.imageUrl && (
                    <div className="pt-1">
                      <a
                        href={job.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 text-xs underline hover:text-teal-800 transition-colors"
                      >
                        View Image
                      </a>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>

          <Badge
            variant={
              statusInfo.badge === "success" ? "default" : statusInfo.badge
            }
            className={`text-xs ${
              statusInfo.badge === "success"
                ? "bg-teal-600 hover:bg-teal-700"
                : ""
            }`}
          >
            {statusInfo.label}
          </Badge>
        </div>
        <p className="text-xs text-slate-500 font-mono">{job.requestId}</p>
      </div>

      <div className="flex-1 max-w-xs">
        {job.status === "done" && job.type === "product" && job.videoUrl ? (
          <div className="flex items-center gap-2">
            <div
              className="relative w-16 h-12 rounded border border-teal-200 overflow-hidden cursor-pointer group bg-gradient-to-br from-slate-100 to-slate-200"
              onClick={() => onView3DModel(job.videoUrl!, job.requestId)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Box className="h-6 w-6 text-slate-600" />
              </div>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Box className="h-4 w-4 text-white" />
              </div>
              <div className="absolute top-1 right-1 bg-teal-600 text-white text-xs px-1 rounded">
                3D
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
              onClick={() => onView3DModel(job.videoUrl!, job.requestId)}
            >
              <Box className="h-3 w-3 mr-1" />
              View 3D
            </Button>
          </div>
        ) : job.status === "done" &&
          job.type === "wearable" &&
          job.mergedImageUrl ? (
          <div className="flex items-center gap-2">
            <div
              className="relative w-16 h-12 rounded border border-teal-200 overflow-hidden cursor-pointer group"
              onClick={() => onViewImages(job.mergedImageUrl!, job.requestId)}
            >
              <Image
                src={job.mergedImageUrl[0] || "/placeholder.svg"}
                alt="Wearable result"
                fill
                className="object-cover"
                sizes="64px"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon className="h-4 w-4 text-white" />
              </div>
              {job.mergedImageUrl.length > 1 && (
                <div className="absolute top-1 right-1 bg-teal-600 text-white text-xs px-1 rounded">
                  {job.mergedImageUrl.length}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
              onClick={() => onViewImages(job.mergedImageUrl!, job.requestId)}
            >
              <ImageIcon className="h-3 w-3 mr-1" />
              View Images
            </Button>
          </div>
        ) : job.status === "done" && job.videoUrl ? (
          <div className="flex items-center gap-2">
            <div
              className="relative w-16 h-12 rounded border border-teal-200 overflow-hidden cursor-pointer group"
              onClick={() => onViewVideo(job.videoUrl!, job.requestId)}
            >
              <video
                src={job.videoUrl}
                className="w-full h-full object-cover"
                muted
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="h-4 w-4 text-white" />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
              onClick={() => onViewVideo(job.videoUrl!, job.requestId)}
            >
              <Play className="h-3 w-3 mr-1" />
              View Video
            </Button>
          </div>
        ) : job.status === "error" ? (
          <p className="text-xs text-red-600 truncate">
            {job.error || "Unknown error"}
          </p>
        ) : (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">
                {job.currentStep || "queued"}
              </span>
              <span className="text-slate-500">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <Progress value={progressPercent} className="h-1 bg-teal-100" />
          </div>
        )}
      </div>
    </div>
  );
}

function getProgressPercent(step?: string, type?: string): number {
  const stepsByType: Record<string, string[]> = {
    avatar: ["queued", "script_done", "avatar_video_done", "done"],
    wearable: ["queued", "uploaded_inputs", "processing", "generating", "done"],
    product: ["queued", "uploaded_inputs", "processing", "generating", "done"],
    default: [
      "queued",
      "bg_removed",
      "scene_done",
      "script_done",
      "tts_done",
      "video_done",
      "composed",
      "done",
    ],
  };

  const steps = stepsByType[type || "default"] || stepsByType["default"];
  const index = step ? steps.indexOf(step) : 0;
  if (index === -1) return 0;
  return ((index + 1) / steps.length) * 100;
}
