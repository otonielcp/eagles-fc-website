"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isUploading: boolean;
  imageUrl: string;
}

export default function ImageUpload({
  onImageUpload,
  isUploading,
  imageUrl,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (!isUploading && e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!isUploading && e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (!isUploading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Opponent logo"
            className="w-full h-48 object-contain rounded-md"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={() => !isUploading && onImageUpload(new File([], ""))}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={handleButtonClick}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Change Image"}
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-6 ${
            dragActive ? "border-[#C5A464] bg-[#C5A464]/10" : "border-gray-300"
          } ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
          onDragEnter={!isUploading ? handleDrag : undefined}
          onDragLeave={!isUploading ? handleDrag : undefined}
          onDragOver={!isUploading ? handleDrag : undefined}
          onDrop={!isUploading ? handleDrop : undefined}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-gray-100 rounded-full">
              <ImageIcon className="h-6 w-6 text-gray-500" />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Drag and drop opponent logo here, or{" "}
                <button
                  type="button"
                  className={`text-[#C5A464] hover:text-[#B39355] font-medium ${
                    isUploading ? "cursor-not-allowed opacity-70" : ""
                  }`}
                  onClick={handleButtonClick}
                  disabled={isUploading}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>
            {isUploading && (
              <div className="w-8 h-8 border-2 border-[#C5A464] border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        id="image-upload"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={isUploading}
      />
    </div>
  );
} 