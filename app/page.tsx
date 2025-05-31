"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import Link from "next/link";

type Job = {
  requestId: string;
  status: string;
  currentStep?: string;
  videoUrl?: string;
  error?: string;
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

export default function Dashboard() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Content Studio
          </h1>
          <p className="text-slate-600">
            Create and manage your content projects
          </p>
        </div>

        {/* Create Section */}
        <Card className="mb-8 border-0 shadow-md bg-white/80 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Plus className="h-5 w-5 text-teal-600" />
                  Create New Content
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Choose a content type to get started
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CREATE_OPTIONS.map((option) => (
                <Link key={option.href} href={option.href}>
                  <Card className="group hover:shadow-md transition-all duration-200 border-slate-200 hover:border-teal-300 cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-teal-50 group-hover:bg-teal-100 transition-colors">
                          <option.icon className="h-5 w-5 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 group-hover:text-teal-700 transition-colors">
                            {option.label}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">
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

        {/* Jobs Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-slate-700">
                  Completed
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {completedJobs.length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-slate-700">
                  In Progress
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {inProgressJobs.length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-slate-700">
                  Failed
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {errorJobs.length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/80">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileVideo className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium text-slate-700">
                  Total Jobs
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {jobs?.length || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Jobs Section */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-800">Recent Jobs</CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Track your content generation progress
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading jobs...</span>
                </div>
              </div>
            )}

            {!isLoading && jobs?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileVideo className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No jobs yet
                </h3>
                <p className="text-slate-500 mb-4">
                  Create your first content to get started
                </p>
                <Link href="/short-form">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Content
                  </Button>
                </Link>
              </div>
            )}

            <div className="space-y-4">
              {jobs?.map((job, index) => (
                <div key={job.requestId}>
                  <JobCard job={job} />
                  {index < jobs.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "done":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          label: "Completed",
          badge: "default",
        };
      case "error":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          label: "Failed",
          badge: "destructive",
        };
      default:
        return {
          icon: Clock,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          label: "Processing",
          badge: "secondary",
        };
    }
  };

  const statusInfo = getStatusInfo(job.status);
  const StatusIcon = statusInfo.icon;
  const progressPercent = getProgressPercent(job.currentStep);

  return (
    <Card
      className={`border-l-4 ${statusInfo.borderColor} transition-all duration-200 hover:shadow-md`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
              <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-slate-900">
                  Job #{job.requestId.slice(0, 8)}
                </span>
                <Badge
                  variant={
                    statusInfo.badge as
                      | "default"
                      | "secondary"
                      | "destructive"
                      | "outline"
                  }
                  className="text-xs"
                >
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 font-mono">
                ID: {job.requestId}
              </p>
            </div>
          </div>
        </div>

        {job.status === "done" && job.videoUrl ? (
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden border border-slate-200">
              <video
                src={job.videoUrl}
                controls
                className="w-full h-auto"
                preload="metadata"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">
                Video ready for download
              </span>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={job.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        ) : job.status === "error" ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <span className="font-medium">Error:</span>{" "}
              {job.error || "Unknown error occurred"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">
                Current step:{" "}
                <span className="font-medium">
                  {job.currentStep || "queued"}
                </span>
              </span>
              <span className="text-slate-500">
                {Math.round(progressPercent)}% complete
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getProgressPercent(step?: string): number {
  const steps = [
    "queued",
    "bg_removed",
    "scene_done",
    "script_done",
    "tts_done",
    "video_done",
    "composed",
    "done",
  ];
  const index = step ? steps.indexOf(step) : 0;
  return ((index + 1) / steps.length) * 100;
}
