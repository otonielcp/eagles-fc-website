"use client";

import { useState, useEffect } from "react";
import { getSliderById, updateSlider, uploadSliderImage, uploadSliderLogo } from "@/actions/slider";
import { Slider, SliderFormData, SliderType, GameSliderData } from "@/types/slider";
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
import ImageUpload from "@/components/admin/news/ImageUpload";
import LogoUploader from "@/components/admin/shared/LogoUploader";
import TeamLogoInput from "@/components/admin/sliders/TeamLogoInput";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

interface EditSliderFormProps {
  sliderId: string;
}

const defaultGameData: GameSliderData = {
  homeTeamName: "",
  homeTeamLogo: "",
  awayTeamName: "",
  awayTeamLogo: "",
  leagueLogo: "",
  matchDate: "",
  matchTime: "",
  matchLocation: "",
  leftPlayerImage: "",
  rightPlayerImage: "",
};

export default function EditSliderForm({ sliderId }: EditSliderFormProps) {
  const router = useRouter();
  const [sliderType, setSliderType] = useState<SliderType>("text");
  const [formData, setFormData] = useState<SliderFormData>({
    type: "text",
    title: "",
    content: "",
    image: "",
    link: "/",
    buttonText: "READ MORE",
    order: 0,
    isActive: true,
    gameData: defaultGameData,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const slider = await getSliderById(sliderId);
        if (slider) {
          const type = slider.type || "text";
          setSliderType(type);
          setFormData({
            type,
            title: slider.title,
            content: slider.content,
            image: slider.image,
            link: slider.link,
            buttonText: slider.buttonText,
            order: slider.order,
            isActive: slider.isActive,
            gameData: slider.gameData || defaultGameData,
          });
        } else {
          toast.error("Slider not found");
          router.push("/admin/sliders");
        }
      } catch (error) {
        toast.error("Failed to load slider");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlider();
  }, [sliderId, router]);

  const handleTypeChange = (type: SliderType) => {
    setSliderType(type);
    setFormData(prev => ({
      ...prev,
      type,
      buttonText: type === "game" ? "VIEW MATCH" : "READ MORE",
      link: type === "game" ? "/fixtures" : "/",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please upload a background image");
      return;
    }

    if (sliderType === "game") {
      if (!formData.gameData?.homeTeamName || !formData.gameData?.awayTeamName) {
        toast.error("Please enter both team names");
        return;
      }
      if (!formData.gameData?.homeTeamLogo || !formData.gameData?.awayTeamLogo) {
        toast.error("Please upload both team logos");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await updateSlider(sliderId, formData);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/sliders");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the slider");
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

  const handleGameDataChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      gameData: {
        ...defaultGameData,
        ...prev.gameData,
        [name]: value,
      },
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value) || 0 });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const result = await uploadSliderImage(formDataUpload);
      console.log("Image upload result:", result);

      if (result.success && result.url) {
        console.log("Setting new image URL:", result.url);
        setFormData(prev => {
          const updated = { ...prev, image: result.url || "" };
          console.log("Updated formData.image:", updated.image);
          return updated;
        });
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

  const handleLogoChange = (field: keyof GameSliderData, url: string) => {
    setFormData(prev => ({
      ...prev,
      gameData: {
        ...defaultGameData,
        ...prev.gameData,
        [field]: url,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Hero Slider</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Slider Type Selector */}
          <div className="space-y-2">
            <Label>Slider Type</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={sliderType === "text" ? "default" : "outline"}
                onClick={() => handleTypeChange("text")}
                className={sliderType === "text" ? "bg-[#C5A464] hover:bg-[#B39355]" : ""}
              >
                Text Slider
              </Button>
              <Button
                type="button"
                variant={sliderType === "game" ? "default" : "outline"}
                onClick={() => handleTypeChange("game")}
                className={sliderType === "game" ? "bg-[#C5A464] hover:bg-[#B39355]" : ""}
              >
                Game Slider
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              {sliderType === "text"
                ? "Standard slider with title, content, and call-to-action button"
                : "Match slider showing team logos, game time, and location"}
            </p>
          </div>

          {/* Background Image - Common to both types */}
          <div className="space-y-2">
            <Label>Background Image</Label>
            <ImageUpload
              onImageUpload={handleImageUpload}
              isUploading={imageUploading}
              imageUrl={formData.image}
            />
            <p className="text-xs text-gray-500">Recommended size: 1920x1080px for best results</p>
          </div>

          {/* Text Slider Fields */}
          {sliderType === "text" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., DEVELOPING TOMORROW'S CHAMPIONS TODAY"
                  required
                  maxLength={200}
                />
                <p className="text-xs text-gray-500">This will be displayed in uppercase on the hero section</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write a brief description for this slide..."
                  required
                  maxLength={500}
                  rows={4}
                />
                <p className="text-xs text-gray-500">{formData.content.length}/500 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Link URL</Label>
                <Input
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="e.g., /programs or /about"
                  required
                />
                <p className="text-xs text-gray-500">Where should the button link to?</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  placeholder="e.g., READ MORE"
                />
              </div>
            </>
          )}

          {/* Game Slider Fields */}
          {sliderType === "game" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Match Title (Optional)</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., SEASON OPENER or CHAMPIONSHIP MATCH"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500">Optional headline displayed above the match</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Home Team */}
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-lg mb-4">Home Team (Left)</h3>
                  <TeamLogoInput
                    label="Home Team Name"
                    teamName={formData.gameData?.homeTeamName || ""}
                    teamLogo={formData.gameData?.homeTeamLogo || ""}
                    onTeamNameChange={(name) => handleLogoChange("homeTeamName", name)}
                    onLogoChange={(url) => handleLogoChange("homeTeamLogo", url)}
                    placeholder="e.g., Eagles FC"
                    required
                  />
                </div>

                {/* Away Team */}
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-lg mb-4">Away Team (Right)</h3>
                  <TeamLogoInput
                    label="Away Team Name"
                    teamName={formData.gameData?.awayTeamName || ""}
                    teamLogo={formData.gameData?.awayTeamLogo || ""}
                    onTeamNameChange={(name) => handleLogoChange("awayTeamName", name)}
                    onLogoChange={(url) => handleLogoChange("awayTeamLogo", url)}
                    placeholder="e.g., Rival FC"
                    required
                  />
                </div>
              </div>

              {/* League Logo */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">League/Competition (Center)</h3>
                <LogoUploader
                  currentLogo={formData.gameData?.leagueLogo || ""}
                  onLogoChange={(url) => handleLogoChange("leagueLogo", url)}
                  label="League Logo"
                  uploadAction={uploadSliderLogo}
                />
              </div>

              {/* Match Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matchDate">Match Date</Label>
                  <Input
                    id="matchDate"
                    name="matchDate"
                    type="datetime-local"
                    value={formData.gameData?.matchDate || ""}
                    onChange={handleGameDataChange}
                  />
                  <p className="text-xs text-gray-500">Used for countdown timer</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matchTime">Display Time (Optional)</Label>
                  <Input
                    id="matchTime"
                    name="matchTime"
                    value={formData.gameData?.matchTime || ""}
                    onChange={handleGameDataChange}
                    placeholder="e.g., 7:00 PM CST"
                  />
                  <p className="text-xs text-gray-500">Shown below countdown</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matchLocation">Location/Stadium</Label>
                  <Input
                    id="matchLocation"
                    name="matchLocation"
                    value={formData.gameData?.matchLocation || ""}
                    onChange={handleGameDataChange}
                    placeholder="e.g., Memorial Stadium"
                  />
                </div>
              </div>

              {/* Player Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-lg mb-4">Left Player Image (Optional)</h3>
                  <p className="text-xs text-gray-500 mb-4">Player image displayed on the left side of the slider</p>
                  <LogoUploader
                    currentLogo={formData.gameData?.leftPlayerImage || ""}
                    onLogoChange={(url) => handleLogoChange("leftPlayerImage", url)}
                    label="Left Player"
                    uploadAction={uploadSliderLogo}
                  />
                </div>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-lg mb-4">Right Player Image (Optional)</h3>
                  <p className="text-xs text-gray-500 mb-4">Player image displayed on the right side of the slider</p>
                  <LogoUploader
                    currentLogo={formData.gameData?.rightPlayerImage || ""}
                    onLogoChange={(url) => handleLogoChange("rightPlayerImage", url)}
                    label="Right Player"
                    uploadAction={uploadSliderLogo}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Additional Info (Optional)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Any additional information about the match..."
                  maxLength={500}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Match Link</Label>
                <Input
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="e.g., /fixtures/match-id"
                  required
                />
                <p className="text-xs text-gray-500">Link to match details or tickets page</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  placeholder="e.g., VIEW MATCH"
                />
              </div>
            </>
          )}

          {/* Common Fields */}
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
            <p className="text-xs text-gray-500">Lower numbers display first</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                handleSwitchChange("isActive", checked)
              }
            />
            <Label htmlFor="isActive">Active (show on homepage)</Label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/sliders")}
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
              "Update Slider"
            )}
          </Button>
        </CardFooter>
      </form>
      <Toaster position="top-center" richColors />
    </Card>
  );
}
