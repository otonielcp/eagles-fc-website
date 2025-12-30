"use client";

import { useState } from "react";
import { createStaff, uploadStaffImage } from "@/actions/staff";
import { Staff, StaffFormData, Team } from "@/types/team";
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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface AddStaffFormProps {
  team: Team;
}

export default function AddStaffForm({ team }: AddStaffFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<StaffFormData>({
    firstName: "",
    lastName: "",
    displayName: "",
    role: "Head Coach",
    dateOfBirth: format(new Date(), "yyyy-MM-dd"),
    nationality: "",
    biography: "",
    image: "",
    teamId: team._id,
    isActive: true,
    order: 0,
    socialMedia: {
      instagram: "",
      twitter: "",
      facebook: ""
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const result = await uploadStaffImage(file);
      if (result.success && result.url) {
        setFormData({ ...formData, image: result.url });
        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.message || "Failed to upload image");
      }
    } catch (error) {
      toast.error("An error occurred while uploading the image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.nationality) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createStaff(formData);
      
      if (result.success) {
        toast.success(result.message);
        router.push(`/admin/teams/${team._id}/staff`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while creating the staff member");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value
      }
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Staff Member</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Enter display name (e.g., Coach James)"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Head Coach">Head Coach</SelectItem>
                    <SelectItem value="Assistant Coach">Assistant Coach</SelectItem>
                    <SelectItem value="Goalkeeper Coach">Goalkeeper Coach</SelectItem>
                    <SelectItem value="Fitness Coach">Fitness Coach</SelectItem>
                    <SelectItem value="Team Manager">Team Manager</SelectItem>
                    <SelectItem value="Physiotherapist">Physiotherapist</SelectItem>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Analyst">Analyst</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  placeholder="Enter nationality"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleInputChange}
                placeholder="Enter display order (lower numbers appear first)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="biography">Biography</Label>
              <Textarea
                id="biography"
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                placeholder="Enter staff member biography"
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUpload 
                onImageUpload={handleImageUpload} 
                imageUrl={formData.image}
                isUploading={isUploading}
              />
            </div>
            
            <div className="space-y-2 border p-4 rounded-lg">
              <Label>Social Media</Label>
              <div className="space-y-3 mt-3">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={formData.socialMedia.instagram}
                    onChange={handleSocialMediaChange}
                    placeholder="Instagram username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={formData.socialMedia.twitter}
                    onChange={handleSocialMediaChange}
                    placeholder="Twitter username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={formData.socialMedia.facebook}
                    onChange={handleSocialMediaChange}
                    placeholder="Facebook username"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive" 
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/teams/${team._id}/staff`)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-[#C5A464] hover:bg-[#B39355]"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Staff Member"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 