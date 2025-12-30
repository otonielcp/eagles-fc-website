"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LogoUploaderProps {
  currentLogo: string;
  onLogoChange: (logoUrl: string, publicId?: string) => void;
  label: string;
  folder?: string;
  uploadAction?: (formData: FormData) => Promise<{ success: boolean; url?: string; message?: string }>;
}

export default function LogoUploader({
  currentLogo,
  onLogoChange,
  label,
  folder = "logos",
  uploadAction,
}: LogoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }

    setIsUploading(true);

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      let result;
      
      // Use the provided uploadAction if available, otherwise use the API endpoint
      if (uploadAction) {
        result = await uploadAction(formData);
      } else {
        // Send the file to your API endpoint (fallback to existing method)
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        result = await response.json();
      }
      
      if (result.success && result.url) {
        // Update the logo URL and store public_id for potential deletion later
        onLogoChange(result.url, result.public_id);
        
        // Show preview
        setPreviewUrl(URL.createObjectURL(file));
        
        toast.success("Logo uploaded successfully");
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {(currentLogo || previewUrl) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onLogoChange("");
              setPreviewUrl(null);
            }}
          >
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="h-20 w-20 border rounded-md flex items-center justify-center overflow-hidden bg-gray-50">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Logo preview"
              width={80}
              height={80}
              className="object-contain"
            />
          ) : currentLogo ? (
            <img
              src={currentLogo}
              alt="Current logo"
              width={80}
              height={80}
              className="object-contain"
            />
          ) : (
            <div className="text-gray-400 text-xs text-center p-2">
              No logo selected
            </div>
          )}
        </div>

        <div className="flex-1">
          <label
            htmlFor={`logo-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 border rounded-md p-2 hover:bg-gray-50 transition-colors">
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span className="text-sm">
                {isUploading ? "Uploading..." : "Upload logo"}
              </span>
            </div>
            <Input
              id={`logo-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Recommended: PNG or JPG, max 2MB
          </p>
        </div>
      </div>
    </div>
  );
} 