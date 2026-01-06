"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { searchTeams, getTeamLogoByName, uploadAndSaveTeamLogo, TeamLogoData } from "@/actions/teamLogo";

interface TeamLogoInputProps {
  label: string;
  teamName: string;
  teamLogo: string;
  onTeamNameChange: (name: string) => void;
  onLogoChange: (logoUrl: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function TeamLogoInput({
  label,
  teamName,
  teamLogo,
  onTeamNameChange,
  onLogoChange,
  placeholder = "Enter team name",
  required = false,
}: TeamLogoInputProps) {
  const [suggestions, setSuggestions] = useState<TeamLogoData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logoSaved, setLogoSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search for teams when name changes
  const handleNameChange = async (value: string) => {
    onTeamNameChange(value);
    setLogoSaved(false);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce search
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchTeams(value);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error("Error searching teams:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  // Handle team selection from suggestions
  const handleSelectTeam = (team: TeamLogoData) => {
    onTeamNameChange(team.name);
    onLogoChange(team.logo);
    setShowSuggestions(false);
    setSuggestions([]);
    setLogoSaved(true);
    toast.success(`Loaded ${team.name} logo`);
  };

  // Check for existing logo when input loses focus
  const handleBlur = async () => {
    // Delay to allow click on suggestion
    setTimeout(async () => {
      if (teamName && !teamLogo) {
        const existingTeam = await getTeamLogoByName(teamName);
        if (existingTeam) {
          onLogoChange(existingTeam.logo);
          setLogoSaved(true);
          toast.success(`Found existing logo for ${existingTeam.name}`);
        }
      }
      setShowSuggestions(false);
    }, 200);
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }

    if (!teamName.trim()) {
      toast.error("Please enter a team name first");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("teamName", teamName.trim());

      const result = await uploadAndSaveTeamLogo(formData);

      if (result.success && result.url) {
        onLogoChange(result.url);
        setLogoSaved(true);
        toast.success("Logo uploaded and saved for future use");
      } else {
        toast.error(result.message || "Failed to upload logo");
      }
    } catch (error) {
      toast.error("Error uploading logo");
      console.error(error);
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  // Clear logo
  const handleClearLogo = () => {
    onLogoChange("");
    setLogoSaved(false);
  };

  return (
    <div className="space-y-4">
      {/* Team Name Input with Autocomplete */}
      <div className="space-y-2 relative">
        <Label htmlFor={`team-name-${label}`}>{label}</Label>
        <div className="relative">
          <Input
            ref={inputRef}
            id={`team-name-${label}`}
            value={teamName}
            onChange={(e) => handleNameChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            className="pr-10"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
          {logoSaved && teamLogo && !isSearching && (
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((team) => (
              <button
                key={team._id}
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
                onClick={() => handleSelectTeam(team)}
              >
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-8 h-8 object-contain rounded"
                />
                <span className="capitalize">{team.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Logo Display and Upload */}
      <div className="flex items-center gap-4">
        {/* Logo Preview */}
        <div className="h-20 w-20 border rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
          {teamLogo ? (
            <img
              src={teamLogo}
              alt={`${teamName} logo`}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <div className="text-gray-400 text-xs text-center p-2">
              No logo
            </div>
          )}
        </div>

        {/* Upload/Clear Buttons */}
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <label className="cursor-pointer flex-1">
              <div className="flex items-center justify-center gap-2 border rounded-md p-2 hover:bg-gray-50 transition-colors">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span className="text-sm">
                  {isUploading ? "Uploading..." : teamLogo ? "Change" : "Upload"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading || !teamName.trim()}
              />
            </label>

            {teamLogo && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearLogo}
                className="px-3"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            {logoSaved
              ? "Logo saved - will be available for future use"
              : teamName
              ? "Upload a logo to save it for this team"
              : "Enter team name first"}
          </p>
        </div>
      </div>
    </div>
  );
}
