"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPlayerById } from "@/actions/player";
import { Player } from "@/types/team";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Instagram, Twitter, Facebook, Trophy } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { calculateAge } from "@/lib/utils";

export default function PlayerDetailsPage() {
  const params: { id: string; playerId: string } = useParams();
  const { id, playerId } = params;
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const playerData = await getPlayerById(playerId);
        if (playerData) {
          setPlayer(playerData);
        } else {
          toast.error("Player not found");
          router.push(`/admin/teams/${id}/players`);
        }
      } catch (error) {
        toast.error("Failed to load player");
        console.error(error);
        router.push(`/admin/teams/${id}/players`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId, id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Player not found</h3>
        <Link href={`/admin/teams/${id}/players`} className="mt-4 inline-block">
          <Button className="bg-[#C5A464] hover:bg-[#B39355]">
            Back to Players
          </Button>
        </Link>
      </div>
    );
  }

  const playerAge = calculateAge(new Date(player.dateOfBirth));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href={`/admin/teams/${id}/players`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Player Details</h1>
        </div>
        <Link href={`/admin/teams/${id}/players/edit/${player._id}`}>
          <Button className="bg-[#C5A464] hover:bg-[#B39355]">
            <Pencil className="mr-2 h-4 w-4" /> Edit Player
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                {player.image ? (
                  <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4">
                    <img
                      src={player.image}
                      alt={player.displayName}
                      
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <span className="text-gray-500 text-4xl font-medium">
                      {player.displayName.substring(0, 2)}
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold">{player.displayName}</h2>
                  <div className="flex items-center justify-center mt-1">
                    <Badge className="bg-[#C5A464] hover:bg-[#B39355]">
                      #{player.jerseyNumber}
                    </Badge>
                    {player.isCaptain && (
                      <Badge className="ml-2 bg-gray-800">
                        <Trophy className="h-3 w-3 mr-1" /> Captain
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-500 mt-1">{player.position}</p>
                </div>
                
                <div className="flex justify-center space-x-4 mt-4">
                  {player.socialMedia.instagram && (
                    <a 
                      href={`https://instagram.com/${player.socialMedia.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#C5A464]"
                    >
                      <Instagram />
                    </a>
                  )}
                  {player.socialMedia.twitter && (
                    <a 
                      href={`https://twitter.com/${player.socialMedia.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#C5A464]"
                    >
                      <Twitter />
                    </a>
                  )}
                  {player.socialMedia.facebook && (
                    <a 
                      href={`https://facebook.com/${player.socialMedia.facebook}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#C5A464]"
                    >
                      <Facebook />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{player.firstName} {player.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nationality</p>
                  <p className="font-medium">{player.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">
                    {format(new Date(player.dateOfBirth), "MMMM d, yyyy")} ({playerAge} years)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    {player.isActive ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </p>
                </div>
                {player.height > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Height</p>
                    <p className="font-medium">{player.height} ft</p>
                  </div>
                )}
                {player.weight > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{player.weight} lbs</p>
                  </div>
                )}
              </div>
              
              {player.biography && (
                <>
                  <Separator className="my-4" />
                  <h3 className="text-xl font-semibold mb-2">Biography</h3>
                  <p className="text-gray-700">{player.biography}</p>
                </>
              )}
              
              <Separator className="my-4" />
              <h3 className="text-xl font-semibold mb-4">Statistics</h3>
              
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Matches Played</p>
                  <p className="text-xl font-bold">{player.stats.matchesPlayed}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Minutes</p>
                  <p className="text-xl font-bold">{player.stats.minutes}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Starts</p>
                  <p className="text-xl font-bold">{player.stats.starts}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Substitutions</p>
                  <p className="text-xl font-bold">{player.stats.substitutions}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Goals</p>
                  <p className="text-xl font-bold">{player.stats.goals}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Assists</p>
                  <p className="text-xl font-bold">{player.stats.assists}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Shots</p>
                  <p className="text-xl font-bold">{player.stats.shots}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Fouls</p>
                  <p className="text-xl font-bold">{player.stats.fouls}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Penalties</p>
                  <p className="text-xl font-bold">{player.stats.penalties}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Yellow Cards</p>
                  <p className="text-xl font-bold">{player.stats.yellowCards}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Double Yellow</p>
                  <p className="text-xl font-bold">{player.stats.doubleYellowCards}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Red Cards</p>
                  <p className="text-xl font-bold">{player.stats.redCards}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Toaster position="top-center" richColors />
    </div>
  );
} 