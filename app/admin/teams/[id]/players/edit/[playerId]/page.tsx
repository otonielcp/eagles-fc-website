"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPlayerById } from "@/actions/player";
import { Player } from "@/types/team";
import EditPlayerForm from "@/components/admin/players/EditPlayerForm";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditPlayerPage() {
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

  const handleCancel = () => {
    router.push(`/admin/teams/${id}/players`);
  };

  const handlePlayerUpdated = (updatedPlayer: Player) => {
    setPlayer(updatedPlayer);
    router.push(`/admin/teams/${id}/players`);
  };

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

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href={`/admin/teams/${id}/players`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Edit Player: {player.displayName}</h1>
        </div>
        <p className="text-muted-foreground">
          Update player information and statistics
        </p>
      </div>
      <EditPlayerForm
        player={player}
        onCancel={handleCancel}
        onPlayerUpdated={handlePlayerUpdated}
      />
      <Toaster position="top-center" richColors />
    </div>
  );
} 