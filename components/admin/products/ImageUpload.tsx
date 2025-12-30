"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  currentImage: string;
  onUpload: (file: File) => void;
  isUploading: boolean;
  onClear: () => void;
}

export default function ImageUpload({
  currentImage,
  onUpload,
  isUploading,
  onClear,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {currentImage ? (
        <div className="relative border rounded-md overflow-hidden h-[300px]">
          <img
            src={currentImage}
            alt="Product image"
            
            className="object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full"
            onClick={onClear}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center h-[200px]">
            <Upload className="h-10 w-10 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500 mb-2">
              Drag and drop your image here, or click to select
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Select Image"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 