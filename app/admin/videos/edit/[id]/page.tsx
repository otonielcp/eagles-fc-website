"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getVideoById } from "@/actions/video";
import { Video } from "@/types/video";
import EditVideoForm from "@/components/admin/videos/EditVideoForm";
import { toast, Toaster } from "sonner";
import { useParams } from "next/navigation";

export default function EditVideoPage() {
  const router = useRouter();
  const params: { id: string } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoData = await getVideoById(params.id);
        if (videoData) {
          setVideo(videoData);
        } else {
          toast.error("Video not found");
          router.push("/admin/videos");
        }
      } catch (error) {
        toast.error("Failed to load video");
        console.error(error);
        router.push("/admin/videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [params.id, router]);

  const handleCancel = () => {
    router.push("/admin/videos");
  };

  const handleVideoUpdated = (updatedVideo: Video) => {
    setVideo(updatedVideo);
    router.push("/admin/videos");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Video not found</h3>
        <button
          onClick={() => router.push("/admin/videos")}
          className="mt-4 px-4 py-2 bg-[#C5A464] text-white rounded-md hover:bg-[#B39355]"
        >
          Back to Video Management
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Video</h1>
        <p className="text-muted-foreground">
          Update the details of your video
        </p>
      </div>
      <EditVideoForm
        video={video}
        onCancel={handleCancel}
        onVideoUpdated={handleVideoUpdated}
      />
      <Toaster position="top-center" richColors />
    </div>
  );
} 