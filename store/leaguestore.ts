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
  // Defaults are the "all" sentinels NavbarFix renders as options and
  // ResultsData treats as "no filter" — never a hard-coded season, or /results
  // silently hides every newer season.
  selectedLeague: "All leagues",
  selectedSeason: "All seasons",
  selectedCompetition: "All competitions",

  setSelectedLeague: (league: string) => set({ selectedLeague: league }),
  setSelectedSeason: (season: string) => set({ selectedSeason: season }),
  setSelectedCompetition: (competition: string) =>
    set({ selectedCompetition: competition }),
}));

export default useLeagueStore;
