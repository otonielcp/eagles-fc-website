"use client";

import { useState } from "react";
import { updateTeam, uploadTeamImage } from "@/actions/team";
import { Team, TeamFormData } from "@/types/team";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { ImageUp } from "lucide-react";

interface EditTeamFormProps {
  team: Team;
  onCancel: () => void;
  onTeamUpdated: (team: Team) => void;
}

export default function EditTeamForm({ team, onCancel, onTeamUpdated }: EditTeamFormProps) {
  const standardCategories = ["Senior", "U23", "U19", "U17", "U15", "Women", "Veterans", "Academy"];
  
  const [formData, setFormData] = useState<TeamFormData>({
    name: team.name,
    shortName: team.shortName,
    description: team.description,
    category: team.category,
    image: team.image,
    isActive: team.isActive,
    order: team.order,
    sponsor: team.sponsor,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [categoryType, setCategoryType] = useState<"standard" | "custom">(
    standardCategories.includes(team.category) ? "standard" : "custom"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.shortName || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateTeam(team._id, formData);

      if (result.success && result.team) {
        toast.success(result.message);
        onTeamUpdated(result.team);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the team");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const result = await uploadTeamImage(file);
      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, image: result.url || "" }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.message || "Failed to upload image");
      }
    } catch (error) {
      toast.error("An error occurred while uploading the image");
      console.error(error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSponsorLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUploading(true);
      try {
        const result = await uploadTeamImage(file);
        if (result.success && result.url) {
          setFormData((prev) => ({
            ...prev,
            sponsor: {
              ...prev.sponsor,
              logo: result.url || ""
            }
          }));
          toast.success("Sponsor logo uploaded successfully");
        } else {
          toast.error(result.message || "Failed to upload sponsor logo");
        }
      } catch (error) {
        toast.error("An error occurred while uploading the sponsor logo");
        console.error(error);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleCategoryTypeChange = (type: "standard" | "custom") => {
    setCategoryType(type);
    if (type === "standard" && !standardCategories.includes(formData.category)) {
      // Reset to default category if switching from custom to standard
      setFormData(prev => ({ ...prev, category: "Senior" }));
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Edit Team Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Senior Team, U19, Women's Team"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortName">Short Name *</Label>
            <Input
              id="shortName"
              name="shortName"
              value={formData.shortName}
              onChange={handleInputChange}
              placeholder="e.g. Senior, U19, Women"
              required
              maxLength={20}
            />
            <p className="text-xs text-gray-500">
              A shorter version of the team name (max 20 characters)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide a brief description of the team"
              required
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <Label>Category Type</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="standard-category"
                  checked={categoryType === "standard"}
                  onChange={() => handleCategoryTypeChange("standard")}
                  className="h-4 w-4 text-[#C5A464] focus:ring-[#C5A464]"
                />
                <Label htmlFor="standard-category" className="cursor-pointer">Standard Category</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="custom-category"
                  checked={categoryType === "custom"}
                  onChange={() => handleCategoryTypeChange("custom")}
                  className="h-4 w-4 text-[#C5A464] focus:ring-[#C5A464]"
                />
                <Label htmlFor="custom-category" className="cursor-pointer">Custom Category</Label>
              </div>
            </div>
            
            {categoryType === "standard" ? (
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="U23">U23</SelectItem>
                    <SelectItem value="U19">U19</SelectItem>
                    <SelectItem value="U17">U17</SelectItem>
                    <SelectItem value="U15">U15</SelectItem>
                    <SelectItem value="Women">Women</SelectItem>
                    <SelectItem value="Veterans">Veterans</SelectItem>
                    <SelectItem value="Academy">Academy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="custom-category-input">Custom Category *</Label>
                <Input
                  id="custom-category-input"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Enter a custom category"
                  required
                />
              </div>
            )}
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
              Teams with lower numbers will be displayed first
            </p>
          </div>

          <div className="space-y-2">
            <Label>Team Image</Label>
            <ImageUpload
              onImageUpload={handleImageUpload}
              isUploading={imageUploading}
              imageUrl={formData.image}
            />
            <p className="text-xs text-gray-500">
              Upload a team photo or logo (recommended size: 800x600px)
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

          <div className="space-y-6 mt-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Team Sponsor</h2>
              <p className="text-muted-foreground text-sm">
                Update sponsor information for this team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sponsorName">Sponsor Name</Label>
                <Input
                  id="sponsorName"
                  name="sponsor.name"
                  value={formData.sponsor?.name || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      sponsor: {
                        ...formData.sponsor,
                        name: e.target.value,
                      },
                    });
                  }}
                  placeholder="Enter sponsor name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsorWebsite">Sponsor Website</Label>
                <Input
                  id="sponsorWebsite"
                  name="sponsor.website"
                  value={formData.sponsor?.website || ""}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      sponsor: {
                        ...formData.sponsor,
                        website: e.target.value,
                      },
                    });
                  }}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sponsor Logo</Label>
              <div className="border border-dashed rounded-md p-4">
                {imageUploading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C5A464]"></div>
                  </div>
                ) : formData.sponsor?.logo ? (
                  <div className="relative w-full h-32 mb-2">
                    <Image
                      src={formData.sponsor.logo}
                      alt="Sponsor logo"
                      fill
                      className="object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          sponsor: {
                            ...formData.sponsor,
                            logo: "",
                          },
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32">
                    <ImageUp className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Drag and drop or click to upload
                    </p>
                  </div>
                )}
                <Input
                  id="sponsorLogo"
                  type="file"
                  accept="image/*"
                  className={formData.sponsor?.logo ? "hidden" : ""}
                  onChange={handleSponsorLogoUpload}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sponsorActive"
                checked={formData.sponsor?.isActive || false}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    sponsor: {
                      ...formData.sponsor,
                      isActive: !!checked,
                    },
                  });
                }}
              />
              <Label htmlFor="sponsorActive">
                Show this sponsor on team pages
              </Label>
            </div>
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
              "Update Team"
            )}
          </Button>
        </CardFooter>
      </form>
      <Toaster position="top-center" richColors />
    </Card>
  );
}
