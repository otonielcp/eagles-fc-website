"use client";

import { useEffect, useState } from "react";
import { Calendar, Archive, Eye, EyeOff, Check, X } from "lucide-react";
import { getAllSeasons } from "@/actions/fixture";
import { getActiveSeasons, setActiveSeasons } from "@/actions/settings";

interface SeasonData {
  name: string;
  isActive: boolean;
  fixtureCount?: number;
}

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<SeasonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    setLoading(true);
    try {
      const [allSeasons, activeSeasons] = await Promise.all([
        getAllSeasons(),
        getActiveSeasons(),
      ]);

      const seasonsWithStatus = allSeasons.map((season: string) => ({
        name: season,
        isActive: activeSeasons.length === 0 || activeSeasons.includes(season),
      }));

      setSeasons(seasonsWithStatus);
    } catch (error) {
      console.error("Error fetching seasons:", error);
      setMessage({ type: "error", text: "Failed to load seasons" });
    } finally {
      setLoading(false);
    }
  };

  const toggleSeason = (seasonName: string) => {
    setSeasons((prev) =>
      prev.map((season) =>
        season.name === seasonName
          ? { ...season, isActive: !season.isActive }
          : season
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const activeSeasonNames = seasons
        .filter((s) => s.isActive)
        .map((s) => s.name);

      await setActiveSeasons(activeSeasonNames);
      setMessage({ type: "success", text: "Seasons updated successfully! Archived seasons are now hidden from the public site." });
    } catch (error) {
      console.error("Error saving seasons:", error);
      setMessage({ type: "error", text: "Failed to save season settings" });
    } finally {
      setSaving(false);
    }
  };

  const activeCount = seasons.filter((s) => s.isActive).length;
  const archivedCount = seasons.filter((s) => !s.isActive).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A464]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Seasons</h1>
          <p className="text-gray-500 text-sm mt-1">
            Control which seasons are visible on the public website. Archived seasons will be hidden from fixtures, results, and filter dropdowns.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#C5A464] text-white px-6 py-2 rounded-md hover:bg-[#B39355] transition disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Seasons</p>
              <p className="text-xl font-bold">{seasons.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Seasons</p>
              <p className="text-xl font-bold text-green-600">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <Archive className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Archived Seasons</p>
              <p className="text-xl font-bold text-orange-600">{archivedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seasons List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">All Seasons</h2>
        </div>
        <div className="p-6">
          {seasons.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No seasons found. Seasons are created automatically when fixtures are added.
            </p>
          ) : (
            <div className="space-y-3">
              {seasons.map((season) => (
                <div
                  key={season.name}
                  className={`flex items-center justify-between p-4 rounded-lg border transition ${
                    season.isActive
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        season.isActive ? "bg-green-100" : "bg-gray-200"
                      }`}
                    >
                      {season.isActive ? (
                        <Eye className="h-5 w-5 text-green-600" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{season.name}</p>
                      <p className="text-sm text-gray-500">
                        {season.isActive
                          ? "Visible on public site"
                          : "Hidden from public site (archived)"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSeason(season.name)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 ${
                      season.isActive
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {season.isActive ? (
                      <>
                        <Archive className="h-4 w-4" />
                        Archive
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Restore
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">How Season Archiving Works</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>- Archived seasons are hidden from the fixtures and results pages</li>
          <li>- They are removed from the season dropdown filters</li>
          <li>- The data is not deleted - you can restore seasons at any time</li>
          <li>- Use this to keep your site clean by hiding past seasons</li>
        </ul>
      </div>
    </div>
  );
}
