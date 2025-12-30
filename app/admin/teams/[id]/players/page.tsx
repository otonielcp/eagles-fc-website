"use client";

import { useState, useEffect } from "react";
import { getTeamById } from "@/actions/team";
import { getPlayersByTeamId, deletePlayer } from "@/actions/player";
import { Team, Player } from "@/types/team";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";

export default function TeamPlayersPage() {
  const params: { id: string } = useParams();
  const teamId = params.id;
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, playersData] = await Promise.all([
          getTeamById(teamId),
          getPlayersByTeamId(teamId)
        ]);
        
        setTeam(teamData);
        setPlayers(playersData);
      } catch (error) {
        toast.error("Failed to load team data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId]);

  const handleDelete = async (id: string) => {
    setDeleteLoading(id);
    try {
      const result = await deletePlayer(id);
      if (result.success) {
        toast.success(result.message);
        setPlayers(players.filter((player) => player._id !== id));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the player");
      console.error(error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Group players by position
  const goalkeepers = players.filter(player => player.position === "Goalkeeper");
  const defenders = players.filter(player => 
    ["Defender", "Center Back", "Full Back", "Wing Back"].includes(player.position)
  );
  const midfielders = players.filter(player => 
    ["Midfielder", "Defensive Midfielder", "Central Midfielder", "Attacking Midfielder"].includes(player.position)
  );
  const forwards = players.filter(player => 
    ["Forward", "Winger", "Striker"].includes(player.position)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Team not found</h3>
        <Link href="/admin/teams" className="mt-4 inline-block">
          <Button className="bg-[#C5A464] hover:bg-[#B39355]">
            Back to Teams
          </Button>
        </Link>
      </div>
    );
  }

  const renderPlayerTable = (positionPlayers: Player[], positionTitle: string) => {
    if (positionPlayers.length === 0) {
      return (
        <div className="text-center py-6 border rounded-lg">
          <h3 className="text-lg font-medium">No {positionTitle} found</h3>
          <p className="text-muted-foreground mt-1">
            Add players to this position
          </p>
        </div>
      );
    }

    return (
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Jersey #</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positionPlayers.map((player) => (
              <TableRow key={player._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {player.image ? (
                      <div className="h-10 w-10 relative rounded-full overflow-hidden">
                        <img
                          src={player.image}
                          alt={`${player.firstName} ${player.lastName}`}
                          
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs font-medium">
                          {player.firstName.charAt(0)}{player.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">
                        {player.displayName || `${player.firstName} ${player.lastName}`}
                        {player.isCaptain && (
                          <Badge className="ml-2 bg-[#C5A464]">Captain</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {player.firstName} {player.lastName}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{player.jerseyNumber}</TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>{getAge(player.dateOfBirth)}</TableCell>
                <TableCell>{player.nationality}</TableCell>
                <TableCell>
                  {player.isActive ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/teams/${teamId}/players/edit/${player._id}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the player and remove the data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(player._id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                            disabled={deleteLoading === player._id}
                          >
                            {deleteLoading === player._id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : null}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/teams">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{team.name} Players</h1>
          </div>
          <p className="text-muted-foreground">
            Manage players for the {team.category} team
          </p>
        </div>
        <Link href={`/admin/teams/${teamId}/players/add`}>
          <Button className="bg-[#C5A464] hover:bg-[#B39355]">
            <Plus className="mr-2 h-4 w-4" /> Add Player
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          {team.image ? (
            <div className="h-16 w-16 relative rounded-md overflow-hidden">
              <img
                src={team.image}
                alt={team.name}
                
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-500 text-xl font-medium">
                {team.shortName.substring(0, 2)}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{team.name}</h2>
            <p className="text-gray-500">{team.category} • {players.length} Players</p>
            
            {team.sponsor?.isActive && team.sponsor?.name && (
              <div className="flex items-center mt-1">
                <span className="text-sm text-[#C5A464] mr-2">Team Sponsor:</span>
                {team.sponsor.logo ? (
                  <div className="h-5 w-5 relative mr-1">
                    <img
                      src={team.sponsor.logo}
                      alt={team.sponsor.name}
                      
                      className="object-contain"
                    />
                  </div>
                ) : null}
                <span className="text-sm font-medium">
                  {team.sponsor.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All Players ({players.length})</TabsTrigger>
          <TabsTrigger value="goalkeepers">Goalkeepers ({goalkeepers.length})</TabsTrigger>
          <TabsTrigger value="defenders">Defenders ({defenders.length})</TabsTrigger>
          <TabsTrigger value="midfielders">Midfielders ({midfielders.length})</TabsTrigger>
          <TabsTrigger value="forwards">Forwards ({forwards.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {players.length === 0 ? (
            <div className="text-center py-10 border rounded-lg">
              <h3 className="text-lg font-medium">No players found</h3>
              <p className="text-muted-foreground mt-1">
                Get started by adding a new player
              </p>
              <Link href={`/admin/teams/${teamId}/players/add`} className="mt-4 inline-block">
                <Button className="bg-[#C5A464] hover:bg-[#B39355] mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add Player
                </Button>
              </Link>
            </div>
          ) : renderPlayerTable(players, "players")}
        </TabsContent>
        
        <TabsContent value="goalkeepers">
          {renderPlayerTable(goalkeepers, "goalkeepers")}
        </TabsContent>
        
        <TabsContent value="defenders">
          {renderPlayerTable(defenders, "defenders")}
        </TabsContent>
        
        <TabsContent value="midfielders">
          {renderPlayerTable(midfielders, "midfielders")}
        </TabsContent>
        
        <TabsContent value="forwards">
          {renderPlayerTable(forwards, "forwards")}
        </TabsContent>
      </Tabs>
      
      <Toaster position="top-center" richColors />
    </div>
  );
} 