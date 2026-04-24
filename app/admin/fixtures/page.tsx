"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Pencil, PlusCircle, Trash2, ListChecks } from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import img from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllFixtures, deleteFixture, deleteFixtures } from "@/actions/fixture";

// This would be replaced with actual API functions
const fetchFixtures = async () => {
  const fixtures = await getAllFixtures();
  return fixtures;
};

export default function FixturesManagement() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCompetition, setFilterCompetition] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const router = useRouter();

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleMany = (ids: string[], checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) ids.forEach((id) => next.add(id));
      else ids.forEach((id) => next.delete(id));
      return next;
    });
  };

  useEffect(() => {
    const loadFixtures = async () => {
      try {
        const data = await fetchFixtures();
        setFixtures(data);
      } catch (error) {
        console.error("Failed to fetch fixtures:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFixtures();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this fixture? This cannot be undone.")) {
      return;
    }
    try {
      await deleteFixture(id);
      setFixtures((prev: any[]) => prev.filter((fixture: any) => fixture._id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success("Fixture deleted successfully");
    } catch (error) {
      console.error("Failed to delete fixture:", error);
      toast.error("Failed to delete fixture");
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (
      !window.confirm(
        `Delete ${ids.length} fixture${ids.length === 1 ? "" : "s"}? This cannot be undone.`
      )
    ) {
      return;
    }
    setBulkDeleting(true);
    try {
      const result = await deleteFixtures(ids);
      setFixtures((prev: any[]) => prev.filter((fixture: any) => !selectedIds.has(fixture._id)));
      setSelectedIds(new Set());
      toast.success(`Deleted ${result.deletedCount ?? ids.length} fixture(s)`);
    } catch (error) {
      console.error("Failed to bulk delete fixtures:", error);
      toast.error("Failed to delete fixtures");
    } finally {
      setBulkDeleting(false);
    }
  };

  const filteredFixtures = fixtures.filter((fixture: any) => {
    // Apply competition filter
    if (filterCompetition !== "all" && fixture.competitionType !== filterCompetition) {
      return false;
    }

    // Apply status filter
    if (filterStatus !== "all" && fixture.status !== filterStatus) {
      return false;
    }

    // Apply search filter
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      return (
        fixture.homeTeam.toLowerCase().includes(lowercaseQuery) ||
        fixture.awayTeam.toLowerCase().includes(lowercaseQuery) ||
        fixture.stadium.toLowerCase().includes(lowercaseQuery)
      );
    }

    return true;
  });

  const upcomingFixtures = filteredFixtures.filter((fixture: any) =>
    fixture.status === "SCHEDULED"
  );

  const pastFixtures = filteredFixtures.filter((fixture: any) =>
    fixture.status === "FT" || fixture.status === "CANCELLED" || fixture.status === "POSTPONED"
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fixtures Management</h1>
        <Link href="/admin/fixtures/add">
          <Button className="bg-[#C5A464] hover:bg-[#B39355]">
            <PlusCircle className="h-4 w-4 mr-2" /> Add Fixture
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Fixtures</CardTitle>
          <CardDescription>
            Manage team fixtures and results. You can filter by competition, status, or search for specific fixtures.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by team or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={filterCompetition} onValueChange={setFilterCompetition}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by competition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Competitions</SelectItem>
                  <SelectItem value="PREMIER LEAGUE">Premier League</SelectItem>
                  <SelectItem value="FA CUP">FA Cup</SelectItem>
                  <SelectItem value="CARABAO CUP">Carabao Cup</SelectItem>
                  <SelectItem value="CHAMPIONS LEAGUE">Champions League</SelectItem>
                  <SelectItem value="EUROPA LEAGUE">Europa League</SelectItem>
                  <SelectItem value="FRIENDLY">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="LIVE">Live</SelectItem>
                  <SelectItem value="FT">Full Time</SelectItem>
                  <SelectItem value="POSTPONED">Postponed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="upcoming">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming Fixtures</TabsTrigger>
                <TabsTrigger value="past">Past Fixtures</TabsTrigger>
              </TabsList>
              {selectedIds.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {bulkDeleting
                    ? "Deleting..."
                    : `Delete Selected (${selectedIds.size})`}
                </Button>
              )}
            </div>

            <TabsContent value="upcoming">
              {loading ? (
                <div className="text-center py-10">Loading fixtures...</div>
              ) : upcomingFixtures.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No upcoming fixtures found. Add a new fixture to get started.</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox
                            aria-label="Select all upcoming fixtures"
                            checked={
                              upcomingFixtures.length > 0 &&
                              upcomingFixtures.every((f: any) => selectedIds.has(f._id))
                            }
                            onCheckedChange={(checked) =>
                              toggleMany(
                                upcomingFixtures.map((f: any) => f._id),
                                checked === true
                              )
                            }
                          />
                        </TableHead>
                        <TableHead>Competition</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Match</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingFixtures.map((fixture: any) => (
                        <TableRow key={fixture._id} data-state={selectedIds.has(fixture._id) ? "selected" : undefined}>
                          <TableCell>
                            <Checkbox
                              aria-label="Select fixture"
                              checked={selectedIds.has(fixture._id)}
                              onCheckedChange={(checked) =>
                                toggleOne(fixture._id, checked === true)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {fixture.leagueLogo && (
                                <div className="h-6 w-6 relative">
                                  <img
                                    src={fixture.leagueLogo}
                                    alt={fixture.competition}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              <span>{fixture.competition}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{fixture.date}</span>
                              <span className="text-sm text-gray-500">{fixture.time}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 relative">
                                <img
                                  src={fixture.homeTeamLogo}
                                  alt={fixture.homeTeam}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                />
                              </div>
                              <span>{fixture.homeTeam}</span>
                              <span className="px-2">vs</span>
                              <div className="h-6 w-6 relative">
                                <img
                                  src={fixture.awayTeamLogo}
                                  alt={fixture.awayTeam}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                />
                              </div>
                              <span>{fixture.awayTeam}</span>
                            </div>
                          </TableCell>
                          <TableCell>{fixture.stadium}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#BD9B58]/20 text-[#BD9B58]">
                              {fixture.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/admin/fixtures/${fixture._id}/edit`)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/admin/fixtures/${fixture._id}/timeline`)}
                              >
                                <ListChecks className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500"
                                onClick={() => handleDelete(fixture._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {loading ? (
                <div className="text-center py-10">Loading fixtures...</div>
              ) : pastFixtures.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No past fixtures found.</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox
                            aria-label="Select all past fixtures"
                            checked={
                              pastFixtures.length > 0 &&
                              pastFixtures.every((f: any) => selectedIds.has(f._id))
                            }
                            onCheckedChange={(checked) =>
                              toggleMany(
                                pastFixtures.map((f: any) => f._id),
                                checked === true
                              )
                            }
                          />
                        </TableHead>
                        <TableHead>Competition</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Match</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastFixtures.map((fixture: any) => (
                        <TableRow key={fixture._id} data-state={selectedIds.has(fixture._id) ? "selected" : undefined}>
                          <TableCell>
                            <Checkbox
                              aria-label="Select fixture"
                              checked={selectedIds.has(fixture._id)}
                              onCheckedChange={(checked) =>
                                toggleOne(fixture._id, checked === true)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {fixture.leagueLogo && (
                                <div className="h-6 w-6 relative">
                                  <img
                                    src={fixture.leagueLogo}
                                    alt={fixture.competition}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              <span>{fixture.competition}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{fixture.date}</span>
                              <span className="text-sm text-gray-500">{fixture.time}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 relative">
                                <img
                                  src={fixture.homeTeamLogo}
                                  alt={fixture.homeTeam}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                />
                              </div>
                              <span>{fixture.homeTeam}</span>
                              <span className="px-2">vs</span>
                              <div className="h-6 w-6 relative">
                                <img
                                  src={fixture.awayTeamLogo}
                                  alt={fixture.awayTeam}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                />
                              </div>
                              <span>{fixture.awayTeam}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {fixture.homeScore} - {fixture.awayScore}
                            </div>
                          </TableCell>
                          <TableCell>{fixture.stadium}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/admin/fixtures/${fixture._id}/edit`)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/admin/fixtures/${fixture._id}/timeline`)}
                              >
                                <ListChecks className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500"
                                onClick={() => handleDelete(fixture._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Toaster position="top-center" richColors />
    </div>
  );
} 