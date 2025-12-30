"use client";

import { useState } from "react";
import { updatePortfolioLogo, uploadLogoImage } from "@/actions/sponsorsLogo";
import { PortfolioLogo, PortfolioLogoFormData } from "@/types/sponsorsLogo";
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
import ImageUpload from "../news/ImageUpload";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

interface EditLogoFormProps {
  logo: PortfolioLogo;
  onCancel: () => void;
  onLogoUpdated: (logo: PortfolioLogo) => void;
}

export default function EditLogoForm({ logo, onCancel, onLogoUpdated }: EditLogoFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PortfolioLogoFormData>({
    name: logo.name,
    image: logo.image,
    category: logo.category,
    isActive: logo.isActive,
    order: logo.order,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please upload a logo image");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updatePortfolioLogo(logo._id, formData);

      if (result.success && result.logo) {
        toast.success(result.message);
        onLogoUpdated(result.logo);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the logo");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value) || 0 });
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
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadLogoImage(formData);

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Portfolio Logo</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={100}
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
                <SelectItem value="Sponsor">Sponsor</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
                <SelectItem value="Affiliate">Affiliate</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Footer">Footer</SelectItem>
                <SelectItem value="Header">Header</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleNumberChange}
              min={0}
            />
            <p className="text-xs text-gray-500">
              Logos are displayed in ascending order (0 appears first)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Logo Image</Label>
            <ImageUpload
              onImageUpload={handleImageUpload}
              isUploading={imageUploading}
              imageUrl={formData.image}
            />
            <p className="text-xs text-gray-500">
              For best results, upload a transparent PNG with a 1:1 aspect ratio
            </p>
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
              "Update Logo"
            )}
          </Button>
        </CardFooter>
      </form>
      <Toaster position="top-center" richColors />
    </Card>
  );
} 