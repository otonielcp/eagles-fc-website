"use client";

import { useState } from "react";
import { updatePlayer, uploadPlayerImage } from "@/actions/player";
import { Player, PlayerFormData, Team } from "@/types/team";
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
import { format } from "date-fns";

interface EditPlayerFormProps {
  player: Player;
  onCancel: () => void;
  onPlayerUpdated: (player: Player) => void;
}

export default function EditPlayerForm({ player, onCancel, onPlayerUpdated }: EditPlayerFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PlayerFormData>({
    firstName: player.firstName,
    lastName: player.lastName,
    displayName: player.displayName,
    jerseyNumber: player.jerseyNumber,
    position: player.position,
    dateOfBirth: player.dateOfBirth.split('T')[0],
    nationality: player.nationality,
    height: player.height,
    weight: player.weight,
    biography: player.biography,
    image: player.image,
    teamId: player.teamId,
    isActive: player.isActive,
    isCaptain: player.isCaptain,
    stats: {
      appearances: player.stats.appearances,
      goals: player.stats.goals,
      assists: player.stats.assists,
      yellowCards: player.stats.yellowCards,
      redCards: player.stats.redCards,
      minutes: player.stats.minutes,
      starts: player.stats.starts,
      substitutions: player.stats.substitutions,
      fouls: player.stats.fouls,
      penalties: player.stats.penalties,
      doubleYellowCards: player.stats.doubleYellowCards,
      shots: player.stats.shots,
      matchesPlayed: player.stats.matchesPlayed
    },
    socialMedia: {
      instagram: player.socialMedia.instagram,
      twitter: player.socialMedia.twitter,
      facebook: player.socialMedia.facebook
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.nationality) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await updatePlayer(player._id, formData);
      
      if (result.success && result.player) {
        toast.success(result.message);
        onPlayerUpdated(result.player);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the player");
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
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [name]: parseInt(value) || 0
      }
    }));
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

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const result = await uploadPlayerImage(file);
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

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Edit Player Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Player's first name"
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
                placeholder="Player's last name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Name to display on roster"
                required
              />
              <p className="text-xs text-gray-500">
                This is the name that will be displayed on the website
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jerseyNumber">Jersey Number *</Label>
              <Input
                id="jerseyNumber"
                name="jerseyNumber"
                type="number"
                value={formData.jerseyNumber}
                onChange={handleNumberChange}
                min={1}
                max={99}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => handleSelectChange("position", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                  <SelectItem value="Defender">Defender</SelectItem>
                  <SelectItem value="Center Back">Center Back</SelectItem>
                  <SelectItem value="Full Back">Full Back</SelectItem>
                  <SelectItem value="Wing Back">Wing Back</SelectItem>
                  <SelectItem value="Midfielder">Midfielder</SelectItem>
                  <SelectItem value="Defensive Midfielder">Defensive Midfielder</SelectItem>
                  <SelectItem value="Central Midfielder">Central Midfielder</SelectItem>
                  <SelectItem value="Attacking Midfielder">Attacking Midfielder</SelectItem>
                  <SelectItem value="Forward">Forward</SelectItem>
                  <SelectItem value="Winger">Winger</SelectItem>
                  <SelectItem value="Striker">Striker</SelectItem>
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
                placeholder="e.g. USA, England, Brazil"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="height">Height (ft)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleNumberChange}
                step="0.1"
                min={0}
                placeholder="e.g. 6.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleNumberChange}
                min={0}
                step="0.1"
                placeholder="e.g. 165.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="biography">Biography</Label>
            <Textarea
              id="biography"
              name="biography"
              value={formData.biography}
              onChange={handleInputChange}
              placeholder="Player's biography and career highlights"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Player Image</Label>
            <ImageUpload
              onImageUpload={handleImageUpload}
              isUploading={imageUploading}
              imageUrl={formData.image}
            />
            <p className="text-xs text-gray-500">
              Upload a player photo (recommended size: 800x800px)
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:items-center">
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
            <div className="flex items-center space-x-2">
              <Switch
                id="isCaptain"
                checked={formData.isCaptain}
                onCheckedChange={(checked) =>
                  handleSwitchChange("isCaptain", checked)
                }
              />
              <Label htmlFor="isCaptain">Team Captain</Label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Player Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="matchesPlayed">Matches Played</Label>
                <Input
                  id="matchesPlayed"
                  name="matchesPlayed"
                  type="number"
                  value={formData.stats.matchesPlayed}
                  onChange={handleStatsChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appearances">Appearances</Label>
                <Input
                  id="appearances"
                  name="appearances"
                  type="number"
                  value={formData.stats.appearances}
                  onChange={handleStatsChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minutes">Minutes</Label>
                <Input
                  id="minutes"
                  name="minutes"
                  type="number"
                  value={formData.stats.minutes}
                  onChange={handleStatsChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="starts">Starts</Label>
                <Input
                  id="starts"
                  name="starts"
                  type="number"
                  value={formData.stats.starts}
                  onChange={handleStatsChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="substitutions">Substitutions</Label>
                <Input
                  id="substitutions"
                  name="substitutions"
                  type="number"
                  value={formData.stats.substitutions}
                  onChange={handleStatsChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">Goals</Label>
                <Input
                  id="goals"
                  name="goals"
                  type="number"
                  value={formData.stats.goals}
                  onChange={handleStatsChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assists">Assists</Label>
                <Input
                  id="assists"
                  name="assists"
                  type="number"
                  value={formData.stats.assists}
                  onChange={handleStatsChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shots">Shots</Label>
                <Input
                  id="shots"
                  name="shots"
                  type="number"
                  value={formData.stats.shots}
                  onChange={handleStatsChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fouls">Fouls</Label>
                <Input
                  id="fouls"
                  name="fouls"
                  type="number"
                  value={formData.stats.fouls}
                  onChange={handleStatsChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="penalties">Penalties</Label>
                <Input
                  id="penalties"
                  name="penalties"
                  type="number"
                  value={formData.stats.penalties}
                  onChange={handleStatsChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yellowCards">Yellow Cards</Label>
                <Input
                  id="yellowCards"
                  name="yellowCards"
                  type="number"
                  value={formData.stats.yellowCards}
                  onChange={handleStatsChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doubleYellowCards">Double Yellow</Label>
                <Input
                  id="doubleYellowCards"
                  name="doubleYellowCards"
                  type="number"
                  value={formData.stats.doubleYellowCards}
                  onChange={handleStatsChange}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redCards">Red Cards</Label>
                <Input
                  id="redCards"
                  name="redCards"
                  type="number"
                  value={formData.stats.redCards}
                  onChange={handleStatsChange}
                  min={0}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              "Update Player"
            )}
          </Button>
        </CardFooter>
      </form>
      <Toaster position="top-center" richColors />
    </Card>
  );
} 