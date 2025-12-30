"use client";

import { useState } from "react";
import { createVideo, uploadVideoThumbnail } from "@/actions/video";
import { VideoFormData } from "@/types/video";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import ImageUpload from "../news/ImageUpload";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

export default function AddVideoForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<VideoFormData>({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.thumbnailUrl) {
      toast.error("Please upload a thumbnail");
      return;
    }

    if (!formData.videoUrl) {
      toast.error("Please provide a video URL");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createVideo(formData);
      
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/videos");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while creating the video");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleThumbnailUpload = async (file: File) => {
    setThumbnailUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadVideoThumbnail(formData);

      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, thumbnailUrl: result.url || "" }));
        toast.success("Thumbnail uploaded successfully");
      } else {
        toast.error(result.message || "Failed to upload thumbnail");
      }
    } catch (error) {
      toast.error("Error uploading thumbnail");
      console.error(error);
    } finally {
      setThumbnailUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Video</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/embed/..."
              required
            />
            <p className="text-xs text-gray-500">
              Use embed URLs for YouTube videos (e.g., https://www.youtube.com/embed/VIDEO_ID)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <ImageUpload
              onImageUpload={handleThumbnailUpload}
              isUploading={thumbnailUploading}
              imageUrl={formData.thumbnailUrl}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                handleSwitchChange("isActive", checked)
              }
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/videos")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#C5A464] hover:bg-[#B39355]"
            disabled={isSubmitting || thumbnailUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
              </>
            ) : (
              "Save Video"
            )}
          </Button>
        </CardFooter>
      </form>
      <Toaster position="top-center" richColors />
    </Card>
  );
} 