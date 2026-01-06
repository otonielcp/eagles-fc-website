"use server";

import { revalidatePath } from "next/cache";
import Fixture, { IFixture } from "@/models/Fixture";
import Slider from "@/models/Slider";
import connectDB from "@/lib/dbConnect";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to create or update slider from fixture data
async function syncFixtureToSlider(fixture: any) {
    try {
        console.log("Syncing fixture to slider:", fixture._id.toString());

        // Combine date and time into a proper datetime string for countdown
        let matchDateTime = "";
        if (fixture.date) {
            // fixture.date is stored as string like "2025-01-15"
            // fixture.time is stored as string like "7:00 PM"
            const dateStr = fixture.date.split("T")[0]; // Get just the date part
            matchDateTime = `${dateStr}T19:00:00`; // Default to 7PM if time parsing needed

            // Try to parse the time string
            if (fixture.time) {
                const timeMatch = fixture.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
                if (timeMatch) {
                    let hours = parseInt(timeMatch[1]);
                    const minutes = timeMatch[2];
                    const meridiem = timeMatch[3];

                    if (meridiem?.toUpperCase() === "PM" && hours !== 12) {
                        hours += 12;
                    } else if (meridiem?.toUpperCase() === "AM" && hours === 12) {
                        hours = 0;
                    }

                    matchDateTime = `${dateStr}T${String(hours).padStart(2, "0")}:${minutes}:00`;
                }
            }
        }

        // Generate a title from teams if no competition
        const title = fixture.competition?.toUpperCase() ||
                      `${fixture.homeTeam || "HOME"} VS ${fixture.awayTeam || "AWAY"}`;

        // Clean up the time string - remove duplicate AM/PM
        let cleanTime = fixture.time || "";
        const timeCleanMatch = cleanTime.match(/^(\d{1,2}:\d{2}\s*(AM|PM))/i);
        if (timeCleanMatch) {
            cleanTime = timeCleanMatch[1];
        }

        const sliderData = {
            type: "game" as const,
            title: title,
            content: "", // Empty for game sliders - not required
            image: fixture.matchImage || "/gameresultbg.jpeg", // Use matchImage or default
            link: `/fixtures`,
            buttonText: "VIEW MATCH",
            order: 0,
            isActive: true,
            fixtureId: fixture._id.toString(),
            gameData: {
                homeTeamName: fixture.homeTeam || "",
                homeTeamLogo: fixture.homeTeamLogo || "",
                awayTeamName: fixture.awayTeam || "",
                awayTeamLogo: fixture.awayTeamLogo || "",
                leagueLogo: fixture.leagueLogo || "",
                matchDate: matchDateTime,
                matchTime: cleanTime,
                matchLocation: fixture.stadium || "",
            },
        };

        console.log("Slider data prepared:", JSON.stringify(sliderData, null, 2));

        // Check if slider already exists for this fixture
        const existingSlider = await Slider.findOne({ fixtureId: fixture._id.toString() });

        if (existingSlider) {
            console.log("Updating existing slider:", existingSlider._id.toString());
            // Update existing slider but preserve admin-customized fields (like background image)
            const updatedSlider = await Slider.findByIdAndUpdate(existingSlider._id, {
                // Update game data from fixture
                "gameData.homeTeamName": sliderData.gameData.homeTeamName,
                "gameData.homeTeamLogo": sliderData.gameData.homeTeamLogo,
                "gameData.awayTeamName": sliderData.gameData.awayTeamName,
                "gameData.awayTeamLogo": sliderData.gameData.awayTeamLogo,
                "gameData.leagueLogo": sliderData.gameData.leagueLogo,
                "gameData.matchDate": sliderData.gameData.matchDate,
                "gameData.matchTime": sliderData.gameData.matchTime,
                "gameData.matchLocation": sliderData.gameData.matchLocation,
            }, { new: true });
            console.log("Slider updated successfully");
            return updatedSlider;
        } else {
            console.log("Creating new slider for fixture");
            // Create new slider
            const newSlider = await Slider.create(sliderData);
            console.log("New slider created:", newSlider._id.toString());
            return newSlider;
        }
    } catch (error) {
        console.error("Error syncing fixture to slider:", error);
        throw error;
    }
}

// Helper function to remove slider when fixture is unfeatured
async function removeFixtureSlider(fixtureId: string) {
    await Slider.findOneAndDelete({ fixtureId: fixtureId });
}

// Get all fixtures
export async function getAllFixtures() {
    try {
        await connectDB();
        const fixtures = await Fixture.find({}).sort({ date: -1 });

        return JSON.parse(JSON.stringify(fixtures));
    } catch (error) {
        console.error("Error fetching fixtures:", error);
        throw new Error("Failed to fetch fixtures");
    }
}

// Get fixture by ID
export async function getFixtureById(id: string) {
    try {
        await connectDB();
        const fixture = await Fixture.findById(id);

        if (!fixture) {
            throw new Error("Fixture not found");
        }

        return JSON.parse(JSON.stringify(fixture));
    } catch (error) {
        return null;
        // console.error(`Error fetching fixture with ID ${id}:`, error);
        // throw new Error("Failed to fetch fixture");
    }
}

// Create new fixture
export async function createFixture(fixtureData: Partial<IFixture>) {
    try {
        await connectDB();
        const newFixture = await Fixture.create(fixtureData);

        // If fixture is featured, create a slider for it
        if (fixtureData.isFeatured) {
            await syncFixtureToSlider(newFixture);
            revalidatePath("/admin/sliders");
        }

        revalidatePath("/admin/fixtures");
        return JSON.parse(JSON.stringify(newFixture));
    } catch (error) {
        console.error("Error creating fixture:", error);
        throw new Error("Failed to create fixture");
    }
}

// Update fixture
export async function updateFixture(id: string, fixtureData: Partial<IFixture>) {
    try {
        await connectDB();

        // Get the current fixture to check if isFeatured changed
        const currentFixture = await Fixture.findById(id);
        const wasFeatured = currentFixture?.isFeatured;
        const willBeFeatured = fixtureData.isFeatured;

        const updatedFixture = await Fixture.findByIdAndUpdate(
            id,
            { ...fixtureData },
            { new: true, runValidators: true }
        );

        if (!updatedFixture) {
            throw new Error("Fixture not found");
        }

        // Handle slider sync based on isFeatured changes
        if (willBeFeatured && !wasFeatured) {
            // Fixture became featured - create slider
            await syncFixtureToSlider(updatedFixture);
            revalidatePath("/admin/sliders");
        } else if (!willBeFeatured && wasFeatured) {
            // Fixture was unfeatured - remove slider
            await removeFixtureSlider(id);
            revalidatePath("/admin/sliders");
        } else if (willBeFeatured) {
            // Fixture is still featured - update slider with new data
            await syncFixtureToSlider(updatedFixture);
            revalidatePath("/admin/sliders");
        }

        revalidatePath("/admin/fixtures");
        revalidatePath(`/admin/fixtures/${id}/edit`);
        revalidatePath("/"); // Revalidate homepage for slider changes
        return JSON.parse(JSON.stringify(updatedFixture));
    } catch (error) {
        console.error(`Error updating fixture with ID ${id}:`, error);
        throw new Error("Failed to update fixture");
    }
}

// Delete fixture
export async function deleteFixture(id: string) {
    try {
        await connectDB();
        const deletedFixture = await Fixture.findByIdAndDelete(id);

        if (!deletedFixture) {
            throw new Error("Fixture not found");
        }

        // Also delete associated slider if it exists
        await removeFixtureSlider(id);

        revalidatePath("/admin/fixtures");
        revalidatePath("/admin/sliders");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error(`Error deleting fixture with ID ${id}:`, error);
        throw new Error("Failed to delete fixture");
    }
}

// Get fixtures by status
export async function getFixturesByStatus(status: string) {
    try {
        await connectDB();
        const fixtures = await Fixture.find({ status }).sort({ date: 1 });
        return JSON.parse(JSON.stringify(fixtures));
    } catch (error) {
        console.error(`Error fetching fixtures with status ${status}:`, error);
        throw new Error("Failed to fetch fixtures by status");
    }
}

// Get fixtures by competition
export async function getFixturesByCompetition(competition: string) {
    try {
        await connectDB();
        const fixtures = await Fixture.find({ competition }).sort({ date: 1 });

        return JSON.parse(JSON.stringify(fixtures));
    } catch (error) {
        console.error(`Error fetching fixtures for competition ${competition}:`, error);
        throw new Error("Failed to fetch fixtures by competition");
    }
}

export async function getFixturesByCompetitionType(competition: string) {
    try {
        await connectDB();

        const fixtures = await Fixture.find({ competitionType: competition }).sort({ date: 1 });

        return JSON.parse(JSON.stringify(fixtures));
    } catch (error) {
        console.error(`Error fetching fixtures for competition ${competition}:`, error);
        throw new Error("Failed to fetch fixtures by competition");
    }
}

// Get fixtures by month
export async function getFixturesByMonth(month: string) {
    try {
        await connectDB();
        const fixtures = await Fixture.find({ month }).sort({ date: 1 });
        return JSON.parse(JSON.stringify(fixtures));
    } catch (error) {
        console.error(`Error fetching fixtures for month ${month}:`, error);
        throw new Error("Failed to fetch fixtures by month");
    }
}

// Get fixtures by team
export async function getFixturesByTeam(teamName: string) {
    try {
        await connectDB();
        const fixtures = await Fixture.find({
            $or: [{ homeTeam: teamName }, { awayTeam: teamName }]
        }).sort({ date: 1 });
        return JSON.parse(JSON.stringify(fixtures));
    } catch (error) {
        console.error(`Error fetching fixtures for team ${teamName}:`, error);
        throw new Error("Failed to fetch fixtures by team");
    }
}

// Update fixture timeline
export async function updateFixtureTimeline(id: string, timeline: any[]) {
    try {
        await connectDB();
        console.log(timeline)
        const updatedFixture = await Fixture.findByIdAndUpdate(
            id,
            { timeline },
            { new: true, runValidators: true }
        );

        if (!updatedFixture) {
            throw new Error("Fixture not found");
        }

        return JSON.parse(JSON.stringify(updatedFixture));
    } catch (error) {
        console.error(`Error updating timeline for fixture with ID ${id}:`, error);
        throw new Error("Failed to update fixture timeline");
    }
}

// Add this new function to upload fixture logos
export async function uploadFixtureLogo(formData: FormData): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'logos';

        if (!file) {
            return { success: false, message: "No file provided" };
        }

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64String, {
            folder: `eagles-fc/${folder}`,
            resource_type: 'auto',
        });

        return {
            success: true,
            url: result.secure_url,
        };
    } catch (error: any) {
        console.error("Error uploading logo:", error);
        return {
            success: false,
            message: error.message || "Failed to upload logo"
        };
    }
}

export async function getTwoUpcomingMatches() {
    try {
        await connectDB();
        // Get the 2 soonest upcoming matches (closest to current date but still in future)
        const matches = await Fixture.find({
            status: "SCHEDULED",
        }).sort({ date: 1 }).limit(2);

        return JSON.parse(JSON.stringify(matches));
    } catch (error) {
        console.error("Error fetching upcoming matches:", error);
        throw new Error("Failed to fetch upcoming matches");
    }
}

export async function getUpcomingMatches() {
    try {
        await connectDB();
        const fixtures = await Fixture.find({
            status: "SCHEDULED",
        }).sort({ date: 1 });
        return JSON.parse(JSON.stringify(fixtures));
    } catch (error) {
        console.error("Error fetching upcoming matches:", error);
        throw new Error("Failed to fetch upcoming matches");
    }
}
// First, add this new server action to your @/actions/fixture.ts file

export async function getFilteredUpcomingMatches(
  competitionType?: string,
  season?: string,
  competition?: string
) {
  try {
    await connectDB();
    
    // Build filter object
    const filter: any = {
      status: "SCHEDULED",
    };

    // Filter by competition type (league)
    if (competitionType && competitionType !== "All") {
      filter.competitionType = competitionType;
    }

    // Filter by competition
    if (competition && competition !== "All competitions") {
      filter.competition = competition;
    }

    // Filter by season (extract year from season format like "SP2025")
    if (season && season !== "All") {
      const year = season.match(/\d{4}/)?.[0];
      if (year) {
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);
        filter.date = {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString()
        };
      }
    }

    console.log("Filter being applied:", filter);

    const fixtures = await Fixture.find(filter).sort({ date: 1 });
    
    return JSON.parse(JSON.stringify(fixtures));
  } catch (error) {
    console.error("Error fetching filtered upcoming matches:", error);
    throw new Error("Failed to fetch filtered upcoming matches");
  }
}


export async function getDistinctCompetitionTypes() {
  try {
    await connectDB();
    
    const competitionTypes = await Fixture.distinct("competitionType");
    
    // Filter out null/empty values and sort
    const filteredTypes = competitionTypes
      .filter(type => type && type.trim() !== "")
      .sort();
    
    return JSON.parse(JSON.stringify(filteredTypes));
  } catch (error) {
    console.error("Error fetching competition types:", error);
    throw new Error("Failed to fetch competition types");
  }
}

export async function getDistinctCompetitions() {
  try {
    await connectDB();
    
    const competitions = await Fixture.distinct("competition");
    
    // Filter out null/empty values and sort
    const filteredCompetitions = competitions
      .filter(comp => comp && comp.trim() !== "")
      .sort();
    
    return JSON.parse(JSON.stringify(filteredCompetitions));
  } catch (error) {
    console.error("Error fetching competitions:", error);
    throw new Error("Failed to fetch competitions");
  }
}

export async function getDistinctSeasons() {
  try {
    await connectDB();
    
    // Get all fixtures and extract years from dates
    const fixtures = await Fixture.find({}, { date: 1 });
    
    const seasons = new Set<string>();
    
    fixtures.forEach(fixture => {
      if (fixture.date) {
        const year = new Date(fixture.date).getFullYear();
        // Create season format like "SP2025" (Spring 2025)
        seasons.add(`SP${year}`);
      }
    });
    
    // Convert to array and sort in descending order (newest first)
    const sortedSeasons = Array.from(seasons).sort((a, b) => {
      const yearA = parseInt(a.substring(2));
      const yearB = parseInt(b.substring(2));
      return yearB - yearA;
    });
    
    return JSON.parse(JSON.stringify(sortedSeasons));
  } catch (error) {
    console.error("Error fetching seasons:", error);
    throw new Error("Failed to fetch seasons");
  }
}


export async function getLatestFullTimeMatch() {
    try {
        const connection = await connectDB();
        
        // Check if database connection was successful
        if (!connection) {
            console.error("Database connection failed");
            return null;
        }
        
        const fixtures = await Fixture.find({ status: "FT" }).sort({ date: -1 }).limit(1);
        const match = fixtures[0];
        
        // Return null if no match found instead of undefined
        if (!match) {
            return null;
        }
        
        return JSON.parse(JSON.stringify(match));
    } catch (error) {
        console.error("Error fetching latest full time match:", error);
        // Return null instead of throwing to prevent breaking the page
        return null;
    }
}

export async function getLatestFullTimeMatches() {
    try {
        await connectDB();
        const fixtures = await Fixture.find({ status: "FT" }).sort({ date: -1 });
        return JSON.parse(JSON.stringify(fixtures));
    } catch (error) {
        console.error("Error fetching latest full time match:", error);
        throw new Error("Failed to fetch latest full time match");
    }
}
// First, add this new server action to your @/actions/fixture.ts file

export async function getFilteredFullTimeMatches(
  competitionType?: string,
  season?: string,
  competition?: string
) {
  try {
    await connectDB();
    
    // Build filter object - start with status "FT" for completed matches
    const filter: any = {
      status: "FT", // Only completed matches
    };

    // Only add filters if meaningful values are provided
    // Filter by competition type (league) - only if not empty and not default
    if (competitionType && 
        competitionType !== "All" && 
        competitionType !== "" && 
        competitionType !== "All leagues") {
      filter.competitionType = competitionType;
    }

    // Filter by competition - only if not default "All competitions"
    if (competition && 
        competition !== "All competitions" && 
        competition !== "" && 
        competition !== "All") {
      filter.competition = competition;
    }

    // Filter by season - only if not empty and not default
    if (season && 
        season !== "All" && 
        season !== "" && 
        season !== "All seasons") {
      const year = season.match(/\d{4}/)?.[0];
      if (year) {
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);
        filter.date = {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString()
        };
      }
    }

    console.log("Results filter being applied:", filter);
    console.log("Original filter params:", { competitionType, season, competition });

    // Sort by date descending (newest first) for results
    const fixtures = await Fixture.find(filter).sort({ date: -1 });
    
    return JSON.parse(JSON.stringify(fixtures));
  } catch (error) {
    console.error("Error fetching filtered results:", error);
    throw new Error("Failed to fetch filtered results");
  }
}
