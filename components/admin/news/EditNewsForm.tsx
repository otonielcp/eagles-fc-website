"use client";

import { useState } from "react";
import { updateNews, uploadNewsImage } from "@/actions/news";
import { News, NewsFormData } from "@/types/news";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { format } from "date-fns";
import RichTextEditor from "@/components/richtexteditor/RichTextEditor"; // Import the reusable component

interface EditNewsFormProps {
  news: News;
  onCancel: () => void;
  onNewsUpdated: (news: News) => void;
}

export default function EditNewsForm({ news, onCancel, onNewsUpdated }: EditNewsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<NewsFormData>({
    title: news.title,
    content: news.content,
    summary: news.summary,
    image: news.image,
    author: news.author,
    category: news.category,
    isPublished: news.isPublished,
    isFeatured: news.isFeatured,
    publishDate: new Date(news.publishDate),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }

    // Check text content length before submission
    const summaryTextLength = formData.summary.replace(/<[^>]*>/g, '').length;
    if (summaryTextLength > 500) {
      toast.error("Summary text content cannot exceed 500 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateNews(news._id, formData);
      
      if (result.success && result.news) {
        toast.success(result.message);
        onNewsUpdated(result.news);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the news article");
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const result = await uploadNewsImage(formDataUpload);

      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, image: result.url || "" }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.message || "Failed to upload image");
      }
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setFormData({ ...formData, publishDate: date });
  };

  const handleSummaryChange = (value: string) => {
    setFormData({ ...formData, summary: value });
  };

  const handleContentChange = (value: string) => {
    setFormData({ ...formData, content: value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit News Article</CardTitle>
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
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <RichTextEditor
              value={formData.summary}
              onChange={handleSummaryChange}
              placeholder="Write a brief summary of the article..."
              minHeight="120px"
              maxLength={500}
              showCharCount={true}
              label="summary"
              className="mb-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write the full article content..."
              minHeight="300px"
              label="content"
              className="mb-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="News">News</SelectItem>
                <SelectItem value="Match Coverage">Match Coverage</SelectItem>
                <SelectItem value="Interviews">Interviews</SelectItem>
                <SelectItem value="Club Updates">Club Updates</SelectItem>
                <SelectItem value="Community">Community</SelectItem>
                <SelectItem value="Announcements">Announcements</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishDate">Publish Date</Label>
            <Input
              id="publishDate"
              name="publishDate"
              type="datetime-local"
              value={formData.publishDate ? format(new Date(formData.publishDate), "yyyy-MM-dd'T'HH:mm") : ""}
              onChange={handleDateChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Featured Image</Label>
            <ImageUpload
              onImageUpload={handleImageUpload}
              isUploading={imageUploading}
              imageUrl={formData.image}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) =>
                handleSwitchChange("isPublished", checked)
              }
            />
            <Label htmlFor="isPublished">Published</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) =>
                handleSwitchChange("isFeatured", checked)
              }
            />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#C5A464] hover:bg-[#B39355]"
            disabled={isSubmitting || imageUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
              </>
            ) : (
              "Update News Article"
            )}
          </Button>
        </CardFooter>
      </form>
      <Toaster position="top-center" richColors />
    </Card>
  );
}