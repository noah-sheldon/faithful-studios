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
  Package,
  Plus,
  Download,
  RefreshCw,
  Grid3X3,
  List,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Job = {
  requestId: string;
  status: string;
  currentStep?: string;
  videoUrl?: string;
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

const CREATE_OPTIONS = [
  {
    href: "/short-form",
    icon: FileVideo,
    label: "Short Form",
    description: "Create engaging short-form videos",
  },
  {
    href: "/poster",
    icon: ImageIcon,
    label: "Poster",
    description: "Design promotional posters",
  },
  {
    href: "/product-showcase",
    icon: Package,
    label: "Product Showcase",
    description: "Showcase your products",
  },
];

function VideoDialog({ isOpen, onClose, videoUrl, jobId }: VideoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-[90vw]">
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
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button asChild>
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

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState("all");
  const [videoDialog, setVideoDialog] = useState<{
    isOpen: boolean;
    url: string;
    jobId: string;
  }>({
    isOpen: false,
    url: "",
    jobId: "",
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/50 via-white to-slate-50">
      {/* Video Dialog */}
      <VideoDialog
        isOpen={videoDialog.isOpen}
        onClose={closeVideoDialog}
        videoUrl={videoDialog.url}
        jobId={videoDialog.jobId}
      />

      {/* Compact Header */}
      <div className="bg-white border-b border-teal-100 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-teal-800">
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
              className="gap-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-teal-800">Jobs</CardTitle>
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
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-4 bg-teal-50">
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
                  Completed ({completedJobs.length})
                </TabsTrigger>
                <TabsTrigger
                  value="progress"
                  className="text-xs data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                >
                  In Progress ({inProgressJobs.length})
                </TabsTrigger>
                <TabsTrigger
                  value="failed"
                  className="text-xs data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                >
                  Failed ({errorJobs.length})
                </TabsTrigger>
              </TabsList>

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
                  <ScrollArea className="h-[600px] pr-4">
                    {viewMode === "list" ? (
                      <div className="space-y-3">
                        {getFilteredJobs().map((job, index) => (
                          <div key={job.requestId}>
                            <CompactJobCard
                              job={job}
                              onViewVideo={openVideoDialog}
                            />
                            {index < getFilteredJobs().length - 1 && (
                              <Separator className="my-3 bg-teal-100" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getFilteredJobs().map((job) => (
                          <GridJobCard
                            key={job.requestId}
                            job={job}
                            onViewVideo={openVideoDialog}
                          />
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
  );
}

function CompactJobCard({
  job,
  onViewVideo,
}: {
  job: Job;
  onViewVideo: (url: string, jobId: string) => void;
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

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border ${statusInfo.borderColor} hover:shadow-md transition-all duration-200`}
    >
      <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
        <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {job.type === "avatar" ? (
            <span className="font-medium text-slate-900 text-sm">
              #{job.requestId.slice(0, 8)}
            </span>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium text-slate-900 text-sm cursor-help">
                  #{job.requestId.slice(0, 8)}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm bg-white border border-teal-100 shadow-lg p-3 rounded-lg text-sm text-slate-700">
                <div className="space-y-2">
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
          )}

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
        {job.status === "done" && job.videoUrl ? (
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

function GridJobCard({
  job,
  onViewVideo,
}: {
  job: Job;
  onViewVideo: (url: string, jobId: string) => void;
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
  const progressPercent = getProgressPercent(job.currentStep);

  return (
    <Card
      className={`hover:shadow-md transition-all duration-200 border-${
        statusInfo.borderColor.split("-")[1]
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${statusInfo.bgColor}`}>
              <StatusIcon className={`h-3 w-3 ${statusInfo.color}`} />
            </div>
            <span className="font-medium text-slate-900 text-sm">
              #{job.requestId.slice(0, 8)}
            </span>
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

        {job.status === "done" && job.videoUrl ? (
          <div className="space-y-3">
            <div
              className="relative w-full h-32 rounded border border-teal-200 overflow-hidden cursor-pointer group"
              onClick={() => onViewVideo(job.videoUrl!, job.requestId)}
            >
              <video
                src={job.videoUrl}
                className="w-full h-full object-cover"
                muted
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="h-8 w-8 text-white" />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1 border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
              onClick={() => onViewVideo(job.videoUrl!, job.requestId)}
            >
              <Play className="h-3 w-3" />
              View Video
            </Button>
          </div>
        ) : job.status === "error" ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-800 truncate">
              {job.error || "Unknown error"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">
                {job.currentStep || "queued"}
              </span>
              <span className="text-slate-500">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <Progress value={progressPercent} className="h-2 bg-teal-100" />
          </div>
        )}

        <p className="text-xs text-slate-500 font-mono mt-2 truncate">
          {job.requestId}
        </p>
      </CardContent>
    </Card>
  );
}

function getProgressPercent(step?: string, type?: string): number {
  const stepsByType: Record<string, string[]> = {
    avatar: ["queued", "script_done", "avatar_video_done", "done"],
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
