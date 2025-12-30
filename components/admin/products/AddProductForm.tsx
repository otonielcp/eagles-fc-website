"use client";

import { useState } from "react";
import { createProduct, uploadProductImage } from "@/actions/product";
import { Product, ProductFormData } from "@/types/product";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, X } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface AddProductFormProps {
  onCancel: () => void;
  onProductAdded: (product: Product) => void;
}

export default function AddProductForm({ onCancel, onProductAdded }: AddProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    price: 0,
    description: "",
    image: "",
    category: "",
    isNewProduct: false,
    isFeatured: false,
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || 0 });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadProductImage(formData);

      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, image: result.url } as ProductFormData));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.category || !formData.image) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const result = await createProduct(formData);

      if (result.success && result.product) {
        onProductAdded(result.product);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to create product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">
                  Product Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    
                    value={formData.price || ""}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount Price</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    
                    value={formData.discount || ""}
                    onChange={handleNumberChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Footwear">Footwear</SelectItem>
                    <SelectItem value="Training Gear">Training Gear</SelectItem>
                    <SelectItem value="Souvenirs">Souvenirs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isNewProduct"
                    checked={formData.isNewProduct}
                    onCheckedChange={(checked) => handleSwitchChange("isNewProduct", checked)}
                  />
                  <Label htmlFor="isNewProduct">Mark as New</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
                  />
                  <Label htmlFor="isFeatured">Feature this Product</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>
                Product Image <span className="text-red-500">*</span>
              </Label>
              <ImageUpload
                currentImage={formData.image}
                onUpload={handleImageUpload}
                isUploading={imageUploading}
                onClear={() => setFormData(prev => ({ ...prev, image: "" }))}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || imageUploading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Product
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 