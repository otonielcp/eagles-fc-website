// store/leagueStore.ts
import { create } from "zustand";

// Define the store state type
type LeagueStore = {
  selectedLeague: string;
  selectedSeason: string;
  selectedCompetition: string;
  setSelectedLeague: (league: string) => void;
  setSelectedSeason: (season: string) => void;
  setSelectedCompetition: (competition: string) => void;
};

const useLeagueStore = create<LeagueStore>((set) => ({
  selectedLeague: "All", // Default league
  selectedSeason: "SP2025", // Default season
  selectedCompetition: "All competitions", // Default competition

  setSelectedLeague: (league: string) => set({ selectedLeague: league }),
  setSelectedSeason: (season: string) => set({ selectedSeason: season }),
  setSelectedCompetition: (competition: string) =>
    set({ selectedCompetition: competition }),
}));

export default useLeagueStore;
