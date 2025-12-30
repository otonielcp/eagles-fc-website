"use client"
import { useState, useEffect } from "react";
import { getAllStandings, updateStanding, updateTeamInStanding, deleteStanding, createStanding } from "@/actions/standings";
import axios from "axios";
// Import Shadcn UI components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { uploadTeamImage } from "@/actions/team";

// TypeScript interfaces (matching the client component)
interface TeamStanding {
  rank?: number;
  teamName: string;
  gamesPlayed: number;
  wins: number;
  ties: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  totalPoints: number;
  teamLogo?: string;  // Added team logo field
  clubInfo?: string;
  bracketCode?: string;
}
interface StandingMetadata {
  league: string;
  group: string;
  season: string;
}

interface StandingDocument {
  _id: string;
  metadata: StandingMetadata;
  standings: TeamStanding[];
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
    <span className="ml-3 text-gray-700">Loading standings...</span>
  </div>
);

// Admin Component
const AdminStandings = () => {
  const [standings, setStandings] = useState<StandingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editLeagueId, setEditLeagueId] = useState<string | null>(null);
  const [editTeamIndex, setEditTeamIndex] = useState<number | null>(null);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [isMetadataDialogOpen, setIsMetadataDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Scraper state
  const [scrapingUrl, setScrapingUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrapingError, setScrapingError] = useState<string | null>(null);

  // Form states for editing
  const [editTeam, setEditTeam] = useState<TeamStanding | null>(null);
  const [editMetadata, setEditMetadata] = useState<StandingMetadata | null>(null);

  // Field validations - track any validation errors
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Add state for the create standing dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newStandingMetadata, setNewStandingMetadata] = useState<StandingMetadata>({
    league: '',
    group: '',
    season: ''
  });

  // Add a new state for the Add Team dialog
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState<TeamStanding>({
    teamName: '',
    gamesPlayed: 0,
    wins: 0,
    ties: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    totalPoints: 0
  });

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    try {
      setLoading(true);
      const data = await getAllStandings();
      setStandings(data);
    } catch (err) {
      setError("Failed to load standings data");
      console.error("Error fetching standings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle scraping standings
  const handleScrapeStandings = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scrapingUrl.trim()) {
      setScrapingError("Please enter a valid URL");
      return;
    }

    try {
      setIsSubmitting(true);
      setScrapingError(null);

      const response = await axios.post('https://backend.eaglesnebraskafc.com/api/scrape', {
        url: scrapingUrl,
      });

      // Update the standings directly from the response if available
      // or refetch them from the server
      if (response.data.standings) {
        setStandings(prev => [...prev, response.data.standings]);
      } else {
        const data = await getAllStandings();
        setStandings(data);
      }

      // Show success message
      setSuccessMessage("Standings scraped successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Reset form
      setScrapingUrl('');
    } catch (err) {
      console.error("Error scraping standings:", err);
      if (axios.isAxiosError(err)) {
        setScrapingError(err.response?.data?.message || err.message || "Failed to scrape standings");
      } else {
        setScrapingError(err instanceof Error ? err.message : "Failed to scrape standings");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start editing a team
  const handleEditTeam = (leagueId: string, teamIndex: number, team: TeamStanding) => {
    setEditLeagueId(leagueId);
    setEditTeamIndex(teamIndex);
    setEditTeam({ ...team });
    setIsTeamDialogOpen(true);
    // Clear any previous validation errors
    setValidationErrors({});
  };

  // Start editing league metadata
  const handleEditMetadata = (leagueId: string, metadata: StandingMetadata) => {
    setEditLeagueId(leagueId);
    setEditMetadata({ ...metadata });
    setIsMetadataDialogOpen(true);
    // Clear any previous validation errors
    setValidationErrors({});
  };

  // Validate numeric input to prevent negative values
  const validateNumericInput = (name: string, value: number): boolean => {
    // All these fields should be non-negative
    const nonNegativeFields = ['gamesPlayed', 'wins', 'ties', 'losses', 'goalsFor', 'goalsAgainst', 'rank'];

    if (nonNegativeFields.includes(name) && value < 0) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: "Value cannot be negative"
      }));
      return false;
    }

    // Clear validation error if value is now valid
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }

    return true;
  };

  // Handle input changes for team editing with validation
  const handleTeamInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editTeam) return;

    const { name, value } = e.target;

    // Convert to number for numeric fields
    const numericFields = ['gamesPlayed', 'wins', 'ties', 'losses', 'goalsFor', 'goalsAgainst', 'rank'];

    if (numericFields.includes(name)) {
      // Parse the value and ensure it's not negative
      const numValue = parseInt(value) || 0;

      // Validate the numeric input
      const isValid = validateNumericInput(name, numValue);

      // Only update state if valid or empty (allowing for user to clear field)
      if (isValid || value === '') {
        setEditTeam({
          ...editTeam,
          [name]: value === '' ? 0 : numValue
        });
      }
    } else {
      // For non-numeric fields like teamName
      setEditTeam({
        ...editTeam,
        [name]: value
      });
    }
  };
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !editTeam) return;
    
    try {
      setUploadingLogo(true);
      setValidationErrors({});
      
      const file = e.target.files[0];
      
      // Check file size (max 500KB)
      const maxSizeInBytes = 500 * 1024; // 500KB
      if (file.size > maxSizeInBytes) {
        setValidationErrors({
          teamLogo: `File too large. Maximum size is 500KB, your file is ${(file.size / 1024).toFixed(0)}KB`
        });
        setUploadingLogo(false);
        return;
      }
      
      // Call the uploadTeamImage function
      const response = await uploadTeamImage(file);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to upload logo');
      }
      
      // Update team with logo URL
      setEditTeam({
        ...editTeam,
        teamLogo: response.url
      });
      
    } catch (err) {
      console.error('Error uploading logo:', err);
      setValidationErrors(prev => ({
        ...prev,
        teamLogo: "Failed to upload logo"
      }));
    } finally {
      setUploadingLogo(false);
    }
  };

  // Handle input changes for metadata editing
  const handleMetadataInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editMetadata) return;

    const { name, value } = e.target;
    setEditMetadata({
      ...editMetadata,
      [name]: value
    });
  };

  // Calculate derived values (goal difference and total points) when saving
  const calculateDerivedValues = (team: TeamStanding): TeamStanding => {
    const goalDifference = team.goalsFor - team.goalsAgainst;
    const totalPoints = (team.wins * 3) + team.ties;

    return {
      ...team,
      goalDifference,
      totalPoints
    };
  };

  // Validate team before saving
  const validateTeam = (team: TeamStanding): boolean => {
    const errors: { [key: string]: string } = {};

    // Check that games played equals wins + ties + losses
    const calculatedGamesPlayed = team.wins + team.ties + team.losses;
    if (team.gamesPlayed !== calculatedGamesPlayed) {
      errors.gamesPlayed = `Games played should equal sum of wins, ties, and losses (${calculatedGamesPlayed})`;
    }

    // Ensure team name is not empty
    if (!team.teamName.trim()) {
      errors.teamName = "Team name cannot be empty";
    }

    // Set validation errors and return validity
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save team changes
  const handleSaveTeam = async () => {
    if (!editLeagueId || editTeamIndex === null || !editTeam) return;

    // Validate the team before saving
    if (!validateTeam(editTeam)) {
      return; // Don't proceed if validation fails
    }

    try {
      setIsSubmitting(true);

      // Calculate goal difference and total points
      const teamWithCalculatedValues = calculateDerivedValues(editTeam);

      await updateTeamInStanding(
        editLeagueId,
        editTeamIndex,
        teamWithCalculatedValues
      );

      // Update the state directly rather than refetching
      setStandings(prevStandings => {
        return prevStandings.map(league => {
          if (league._id === editLeagueId) {
            const updatedStandings = [...league.standings];
            updatedStandings[editTeamIndex] = teamWithCalculatedValues;
            return {
              ...league,
              standings: updatedStandings
            };
          }
          return league;
        });
      });

      // Show success message
      setSuccessMessage("Team updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Reset editing state
      cancelEditing();
    } catch (err) {
      setError("Failed to update team");
      console.error("Error updating team:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save metadata changes
  const handleSaveMetadata = async () => {
    if (!editLeagueId || !editMetadata) return;

    // Validate metadata
    if (!editMetadata.league.trim() || !editMetadata.group.trim() || !editMetadata.season.trim()) {
      setValidationErrors({
        metadata: "All league information fields are required"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await updateStanding(editLeagueId, { metadata: editMetadata });

      // Update the state directly rather than refetching
      setStandings(prevStandings => {
        return prevStandings.map(league => {
          if (league._id === editLeagueId) {
            return {
              ...league,
              metadata: editMetadata
            };
          }
          return league;
        });
      });

      // Show success message
      setSuccessMessage("League information updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Reset editing state
      cancelEditing();
    } catch (err) {
      setError("Failed to update league information");
      console.error("Error updating metadata:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditLeagueId(null);
    setEditTeamIndex(null);
    setEditTeam(null);
    setEditMetadata(null);
    setIsTeamDialogOpen(false);
    setIsMetadataDialogOpen(false);
    setValidationErrors({});
  };

  // Handle delete standing
  const handleDelete = async (standingId: string) => {
    try {
      setIsSubmitting(true);

      await deleteStanding(standingId);

      // Update state directly rather than refetching
      setStandings(prevStandings =>
        prevStandings.filter(standing => standing._id !== standingId)
      );

      // Show success message
      setSuccessMessage("Standing deleted successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to delete standing");
      console.error("Error deleting standing:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes for new standing metadata
  const handleNewMetadataInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStandingMetadata({
      ...newStandingMetadata,
      [name]: value
    });
  };

  // Create a new standing
  const handleCreateStanding = async () => {
    // Validate metadata
    if (!newStandingMetadata.league.trim() || !newStandingMetadata.group.trim() || !newStandingMetadata.season.trim()) {
      setValidationErrors({
        metadata: "All league information fields are required"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create a new standing with empty teams array
      const newStanding = await createStanding({
        metadata: newStandingMetadata
      });

      // Update the state directly rather than refetching
      setStandings(prevStandings => [newStanding, ...prevStandings]);

      // Show success message
      setSuccessMessage("New standing created successfully");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Reset form and close dialog
      setNewStandingMetadata({
        league: '',
        group: '',
        season: ''
      });
      setIsCreateDialogOpen(false);
      setValidationErrors({});
    } catch (err) {
      setError("Failed to create new standing");
      console.error("Error creating standing:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start adding a team to a standing
  const handleAddTeam = (leagueId: string) => {
    setEditLeagueId(leagueId);
    // Reset the new team form
    setNewTeam({
      teamName: '',
      gamesPlayed: 0,
      wins: 0,
      ties: 0, 
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      totalPoints: 0
    });
    setIsAddTeamDialogOpen(true);
    setValidationErrors({});
  };

  // Handle input changes for new team with validation
  const handleNewTeamInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convert to number for numeric fields
    const numericFields = ['gamesPlayed', 'wins', 'ties', 'losses', 'goalsFor', 'goalsAgainst', 'rank'];

    if (numericFields.includes(name)) {
      // Parse the value and ensure it's not negative
      const numValue = parseInt(value) || 0;

      // Validate the numeric input
      const isValid = validateNumericInput(name, numValue);

      // Only update state if valid or empty
      if (isValid || value === '') {
        setNewTeam({
          ...newTeam,
          [name]: value === '' ? 0 : numValue
        });
      }
    } else {
      // For non-numeric fields like teamName
      setNewTeam({
        ...newTeam,
        [name]: value
      });
    }
  };

  // Handle logo upload for new team
  const handleNewTeamLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    try {
      setUploadingLogo(true);
      setValidationErrors({});
      
      const file = e.target.files[0];
      
      // Check file size (max 500KB)
      const maxSizeInBytes = 500 * 1024; // 500KB
      if (file.size > maxSizeInBytes) {
        setValidationErrors({
          teamLogo: `File too large. Maximum size is 500KB, your file is ${(file.size / 1024).toFixed(0)}KB`
        });
        setUploadingLogo(false);
        return;
      }
      
      // Call the uploadTeamImage function
      const response = await uploadTeamImage(file);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to upload logo');
      }
      
      // Update team with logo URL
      setNewTeam({
        ...newTeam,
        teamLogo: response.url
      });
      
    } catch (err) {
      console.error('Error uploading logo:', err);
      setValidationErrors(prev => ({
        ...prev,
        teamLogo: "Failed to upload logo"
      }));
    } finally {
      setUploadingLogo(false);
    }
  };

  // Add a new team to the standing
  const handleSaveNewTeam = async () => {
    if (!editLeagueId) return;

    // Validate the team before saving
    if (!validateTeam(newTeam)) {
      return; // Don't proceed if validation fails
    }

    try {
      setIsSubmitting(true);

      // Calculate goal difference and total points
      const teamWithCalculatedValues = calculateDerivedValues(newTeam);

      // Add the new team to the standing
      const updatedStanding = await updateStanding(editLeagueId, {
        $push: { standings: teamWithCalculatedValues }
      });

      // Update the state directly
      setStandings(prevStandings => {
        return prevStandings.map(league => {
          if (league._id === editLeagueId) {
            return updatedStanding;
          }
          return league;
        });
      });

      // Show success message
      setSuccessMessage("Team added successfully");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Reset and close dialog
      setIsAddTeamDialogOpen(false);
    } catch (err) {
      setError("Failed to add team");
      console.error("Error adding team:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Manage Standings</h1>

      {/* Success Message */}
      {successMessage && (
        <Alert className="mb-6 bg-green-50 border border-green-200">
          <AlertDescription className="text-green-700 font-medium">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Scraper Form */}
      <Card className="mb-8 border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-50 border-b border-gray-200 py-4 px-6">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Import Standings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleScrapeStandings} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scrapingUrl">Standings URL</Label>
              <div className="flex gap-3">
                <Input
                  id="scrapingUrl"
                  placeholder="Enter standings page URL to scrape"
                  value={scrapingUrl}
                  onChange={(e) => setScrapingUrl(e.target.value)}
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  className="bg-[#C5A464] hover:bg-[#B39355] text-white flex items-center gap-2 whitespace-nowrap"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Importing...</span>
                    </>
                  ) : (
                    'Import Standings'
                  )}
                </Button>
              </div>
              {scrapingError && (
                <p className="text-red-500 text-sm mt-1">{scrapingError}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Enter the URL of a standings page to import the data directly into the system.
                Supported formats: SportsAffinity, GotSport, and other league management systems.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Create Standings Button */}
      <div className="flex justify-end mb-6">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-[#C5A464] hover:bg-[#B39355] text-white"
        >
          Create New Standing
        </Button>
      </div>

      {/* Create Standing Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Standing</DialogTitle>
            <DialogDescription className="text-gray-500">
              Enter league information to create a new standing table
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-league">League Name</Label>
              <Input
                id="new-league"
                name="league"
                value={newStandingMetadata.league}
                onChange={handleNewMetadataInputChange}
                placeholder="e.g. Premier League"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-group">Group</Label>
              <Input
                id="new-group"
                name="group"
                value={newStandingMetadata.group}
                onChange={handleNewMetadataInputChange}
                placeholder="e.g. Group A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-season">Season</Label>
              <Input
                id="new-season"
                name="season"
                value={newStandingMetadata.season}
                onChange={handleNewMetadataInputChange}
                placeholder="e.g. 2023-2024"
              />
            </div>

            {/* Metadata validation error */}
            {validationErrors.metadata && (
              <Alert variant="destructive" className="bg-red-50 border-red-300">
                <AlertDescription className="text-red-700">
                  {validationErrors.metadata}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateDialogOpen(false);
                setValidationErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateStanding}
              className="bg-[#C5A464] hover:bg-[#B39355] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Standing'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Team</DialogTitle>
            <DialogDescription className="text-gray-500">
              Update team details in the standings table
            </DialogDescription>
          </DialogHeader>

          {editTeam && (
            <div className="overflow-y-auto pr-2 -mr-2 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    name="teamName"
                    value={editTeam.teamName}
                    onChange={handleTeamInputChange}
                    className={validationErrors.teamName ? "border-red-500" : ""}
                  />
                  {validationErrors.teamName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.teamName}</p>
                  )}
                </div>
                
                {/* Club Info Field */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="clubInfo">Club Info</Label>
                  <Input
                    id="clubInfo"
                    name="clubInfo"
                    value={editTeam.clubInfo || ''}
                    onChange={handleTeamInputChange}
                  />
                </div>
                
                {/* Bracket Code Field */}
                <div className="space-y-2">
                  <Label htmlFor="bracketCode">Bracket Code</Label>
                  <Input
                    id="bracketCode"
                    name="bracketCode"
                    value={editTeam.bracketCode || ''}
                    onChange={handleTeamInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rank">Rank</Label>
                  <Input
                    id="rank"
                    name="rank"
                    type="number"
                    min="0"
                    value={editTeam.rank || ''}
                    onChange={handleTeamInputChange}
                    className={validationErrors.rank ? "border-red-500" : ""}
                  />
                  {validationErrors.rank && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.rank}</p>
                  )}
                </div>
                
                {/* Team Logo Field */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="teamLogo">Team Logo</Label>
                  
                  {/* Current Logo Preview */}
                  {editTeam.teamLogo && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 mb-1">Current Logo:</p>
                      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center overflow-hidden rounded-md">
                        <img 
                          src={editTeam.teamLogo} 
                          alt={`${editTeam.teamName} logo`} 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Logo Upload */}
                  <div className="flex flex-col space-y-2">
                    <Input
                      id="teamLogo"
                      name="teamLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className={validationErrors.teamLogo ? "border-red-500" : ""}
                    />
                    {uploadingLogo && (
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading logo...
                      </div>
                    )}
                    {validationErrors.teamLogo && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.teamLogo}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Upload team logo. Max size: 500KB. Recommended size: 200x200px, PNG or JPG.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gamesPlayed">Games Played</Label>
                  <Input
                    id="gamesPlayed"
                    name="gamesPlayed"
                    type="number"
                    min="0"
                    value={editTeam.gamesPlayed}
                    onChange={handleTeamInputChange}
                    className={validationErrors.gamesPlayed ? "border-red-500" : ""}
                  />
                  {validationErrors.gamesPlayed && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.gamesPlayed}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wins">Wins</Label>
                  <Input
                    id="wins"
                    name="wins"
                    type="number"
                    min="0"
                    value={editTeam.wins}
                    onChange={handleTeamInputChange}
                    className={validationErrors.wins ? "border-red-500" : ""}
                  />
                  {validationErrors.wins && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.wins}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ties">Ties</Label>
                  <Input
                    id="ties"
                    name="ties"
                    type="number"
                    min="0"
                    value={editTeam.ties}
                    onChange={handleTeamInputChange}
                    className={validationErrors.ties ? "border-red-500" : ""}
                  />
                  {validationErrors.ties && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.ties}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="losses">Losses</Label>
                  <Input
                    id="losses"
                    name="losses"
                    type="number"
                    min="0"
                    value={editTeam.losses}
                    onChange={handleTeamInputChange}
                    className={validationErrors.losses ? "border-red-500" : ""}
                  />
                  {validationErrors.losses && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.losses}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalsFor">Goals For</Label>
                  <Input
                    id="goalsFor"
                    name="goalsFor"
                    type="number"
                    min="0"
                    value={editTeam.goalsFor}
                    onChange={handleTeamInputChange}
                    className={validationErrors.goalsFor ? "border-red-500" : ""}
                  />
                  {validationErrors.goalsFor && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.goalsFor}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalsAgainst">Goals Against</Label>
                  <Input
                    id="goalsAgainst"
                    name="goalsAgainst"
                    type="number"
                    min="0"
                    value={editTeam.goalsAgainst}
                    onChange={handleTeamInputChange}
                    className={validationErrors.goalsAgainst ? "border-red-500" : ""}
                  />
                  {validationErrors.goalsAgainst && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.goalsAgainst}</p>
                  )}
                </div>
                
                <div className="col-span-2 mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                  <p className="text-sm text-gray-600">Goal Difference: <span className="font-medium">{editTeam.goalsFor - editTeam.goalsAgainst}</span></p>
                  <p className="text-sm text-gray-600">Total Points: <span className="font-medium">{(editTeam.wins * 3) + editTeam.ties}</span></p>
                </div>
                
                {/* Global validation error message */}
                {Object.keys(validationErrors).length > 0 && !validationErrors.metadata && (
                  <div className="col-span-2 mt-2">
                    <Alert variant="destructive" className="bg-red-50 border-red-300">
                      <AlertDescription className="text-red-700">
                        Please fix the validation errors before saving
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={cancelEditing}
              disabled={isSubmitting || uploadingLogo}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveTeam}
              className="bg-[#C5A464] hover:bg-[#B39355] text-white"
              disabled={isSubmitting || uploadingLogo}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Metadata Dialog */}
      <Dialog open={isMetadataDialogOpen} onOpenChange={setIsMetadataDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit League Information</DialogTitle>
            <DialogDescription className="text-gray-500">
              Update league name, group, and season
            </DialogDescription>
          </DialogHeader>

          {editMetadata && (
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="league">League Name</Label>
                <Input
                  id="league"
                  name="league"
                  value={editMetadata.league}
                  onChange={handleMetadataInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">Group</Label>
                <Input
                  id="group"
                  name="group"
                  value={editMetadata.group}
                  onChange={handleMetadataInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="season">Season</Label>
                <Input
                  id="season"
                  name="season"
                  value={editMetadata.season}
                  onChange={handleMetadataInputChange}
                />
              </div>

              {/* Metadata validation error */}
              {validationErrors.metadata && (
                <Alert variant="destructive" className="bg-red-50 border-red-300">
                  <AlertDescription className="text-red-700">
                    {validationErrors.metadata}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={cancelEditing}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveMetadata}
              className="bg-[#C5A464] hover:bg-[#B39355] text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Team Dialog */}
      <Dialog open={isAddTeamDialogOpen} onOpenChange={setIsAddTeamDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add New Team</DialogTitle>
            <DialogDescription className="text-gray-500">
              Add a new team to the standings table
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto pr-2 -mr-2 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="new-team-name">Team Name</Label>
                <Input
                  id="new-team-name"
                  name="teamName"
                  value={newTeam.teamName}
                  onChange={handleNewTeamInputChange}
                  className={validationErrors.teamName ? "border-red-500" : ""}
                />
                {validationErrors.teamName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.teamName}</p>
                )}
              </div>
              
              {/* Club Info Field */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="new-club-info">Club Info</Label>
                <Input
                  id="new-club-info"
                  name="clubInfo"
                  value={newTeam.clubInfo || ''}
                  onChange={handleNewTeamInputChange}
                />
              </div>
              
              {/* Bracket Code Field */}
              <div className="space-y-2">
                <Label htmlFor="new-bracket-code">Bracket Code</Label>
                <Input
                  id="new-bracket-code"
                  name="bracketCode"
                  value={newTeam.bracketCode || ''}
                  onChange={handleNewTeamInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-rank">Rank</Label>
                <Input
                  id="new-rank"
                  name="rank"
                  type="number"
                  min="0"
                  value={newTeam.rank || ''}
                  onChange={handleNewTeamInputChange}
                  className={validationErrors.rank ? "border-red-500" : ""}
                />
                {validationErrors.rank && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.rank}</p>
                )}
              </div>
              
              {/* Team Logo Field */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="new-team-logo">Team Logo</Label>
                
                {/* Logo Preview */}
                {newTeam.teamLogo && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-500 mb-1">Logo:</p>
                    <div className="w-20 h-20 bg-gray-100 flex items-center justify-center overflow-hidden rounded-md">
                      <img 
                        src={newTeam.teamLogo} 
                        alt="Team logo" 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                )}
                
                {/* Logo Upload */}
                <div className="flex flex-col space-y-2">
                  <Input
                    id="new-team-logo"
                    name="teamLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleNewTeamLogoUpload}
                    disabled={uploadingLogo}
                    className={validationErrors.teamLogo ? "border-red-500" : ""}
                  />
                  {uploadingLogo && (
                    <div className="flex items-center text-xs text-gray-500">
                      <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Uploading logo...
                    </div>
                  )}
                  {validationErrors.teamLogo && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.teamLogo}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Upload team logo. Max size: 500KB. Recommended size: 200x200px, PNG or JPG.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-games-played">Games Played</Label>
                <Input
                  id="new-games-played"
                  name="gamesPlayed"
                  type="number"
                  min="0"
                  value={newTeam.gamesPlayed}
                  onChange={handleNewTeamInputChange}
                  className={validationErrors.gamesPlayed ? "border-red-500" : ""}
                />
                {validationErrors.gamesPlayed && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.gamesPlayed}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-wins">Wins</Label>
                <Input
                  id="new-wins"
                  name="wins"
                  type="number"
                  min="0"
                  value={newTeam.wins}
                  onChange={handleNewTeamInputChange}
                  className={validationErrors.wins ? "border-red-500" : ""}
                />
                {validationErrors.wins && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.wins}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-ties">Ties</Label>
                <Input
                  id="new-ties"
                  name="ties"
                  type="number"
                  min="0"
                  value={newTeam.ties}
                  onChange={handleNewTeamInputChange}
                  className={validationErrors.ties ? "border-red-500" : ""}
                />
                {validationErrors.ties && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.ties}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-losses">Losses</Label>
                <Input
                  id="new-losses"
                  name="losses"
                  type="number"
                  min="0"
                  value={newTeam.losses}
                  onChange={handleNewTeamInputChange}
                  className={validationErrors.losses ? "border-red-500" : ""}
                />
                {validationErrors.losses && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.losses}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-goals-for">Goals For</Label>
                <Input
                  id="new-goals-for"
                  name="goalsFor"
                  type="number"
                  min="0"
                  value={newTeam.goalsFor}
                  onChange={handleNewTeamInputChange}
                  className={validationErrors.goalsFor ? "border-red-500" : ""}
                />
                {validationErrors.goalsFor && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.goalsFor}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-goals-against">Goals Against</Label>
                <Input
                  id="new-goals-against"
                  name="goalsAgainst"
                  type="number"
                  min="0"
                  value={newTeam.goalsAgainst}
                  onChange={handleNewTeamInputChange}
                  className={validationErrors.goalsAgainst ? "border-red-500" : ""}
                />
                {validationErrors.goalsAgainst && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.goalsAgainst}</p>
                )}
              </div>
              
              <div className="col-span-2 mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                <p className="text-sm text-gray-600">Goal Difference: <span className="font-medium">{newTeam.goalsFor - newTeam.goalsAgainst}</span></p>
                <p className="text-sm text-gray-600">Total Points: <span className="font-medium">{(newTeam.wins * 3) + newTeam.ties}</span></p>
              </div>
              
              {/* Global validation error message */}
              {Object.keys(validationErrors).length > 0 && !validationErrors.metadata && (
                <div className="col-span-2 mt-2">
                  <Alert variant="destructive" className="bg-red-50 border-red-300">
                    <AlertDescription className="text-red-700">
                      Please fix the validation errors before saving
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddTeamDialogOpen(false);
                setValidationErrors({});
              }}
              disabled={isSubmitting || uploadingLogo}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNewTeam}
              className="bg-[#C5A464] hover:bg-[#B39355] text-white"
              disabled={isSubmitting || uploadingLogo}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Adding...
                </>
              ) : (
                'Add Team'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Standings List */}
      {standings.map((league: any) => (
        <Card key={league._id} className="mb-8 border border-gray-200 shadow-sm rounded-lg overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-200 py-4 px-6 flex flex-row justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {league.metadata.league} - {league.metadata.group} {league.metadata.season}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-[#4CAF50] hover:bg-[#3e8e41] text-white border-none"
                onClick={() => handleAddTeam(league._id)}
              >
                Add Team
              </Button>
              <Button
                variant="outline"
                className="bg-[#C5A464] hover:bg-[#B39355] text-white border-none"
                onClick={() => handleEditMetadata(league._id, league.metadata)}
              >
                Edit League Info
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-red-500 hover:bg-red-600 text-white border-none"
                  >
                    {isSubmitting === league._id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Standings</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete standings for {league.metadata.league} - {league.metadata.group} {league.metadata.season}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(league._id)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                      disabled={isSubmitting === league._id}
                    >
                      {isSubmitting === league._id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : null}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-left font-medium text-gray-600 text-sm">Pos</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-600 text-sm">Team</th>
                    <th className="py-3 px-4 text-center font-medium text-gray-600 text-sm">P</th>
                    <th className="py-3 px-4 text-center font-medium text-gray-600 text-sm">W</th>
                    <th className="py-3 px-4 text-center font-medium text-gray-600 text-sm">D</th>
                    <th className="py-3 px-4 text-center font-medium text-gray-600 text-sm">L</th>
                    <th className="py-3 px-4 text-center font-medium text-gray-600 text-sm">GF</th>
                    <th className="py-3 px-4 text-center font-medium text-gray-600 text-sm">GA</th>
                    <th className="py-3 px-4 text-center font-medium text-gray-600 text-sm">GD</th>
                    <th className="py-3 px-4 text-center font-medium text-gray-600 text-sm">Pts</th>
                    <th className="py-3 px-4 text-center font-medium text-gray-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {league.standings.map((team: TeamStanding, index: number) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">{team.rank || index + 1}</td>
                      <td className="py-3 px-4 font-medium">{team.teamName}</td>
                      <td className="py-3 px-4 text-center">{team.gamesPlayed}</td>
                      <td className="py-3 px-4 text-center">{team.wins}</td>
                      <td className="py-3 px-4 text-center">{team.ties}</td>
                      <td className="py-3 px-4 text-center">{team.losses}</td>
                      <td className="py-3 px-4 text-center">{team.goalsFor}</td>
                      <td className="py-3 px-4 text-center">{team.goalsAgainst}</td>
                      <td className="py-3 px-4 text-center">{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</td>
                      <td className="py-3 px-4 text-center font-semibold">{team.totalPoints}</td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTeam(league._id, index, team)}
                          className="bg-[#C5A464] text-white hover:bg-[#B39355] border-none"
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}

      {standings.length === 0 && !loading && (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No standings data available</p>
        </div>
      )}
    </div>
  );
};

export default AdminStandings;