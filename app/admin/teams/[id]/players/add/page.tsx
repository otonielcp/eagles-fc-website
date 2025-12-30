"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTeamById } from "@/actions/team";
import { Team } from "@/types/team";
import AddPlayerForm from "@/components/admin/players/AddPlayerForm";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AddPlayerPage() {
  const params: { id: string } = useParams();
  const teamId = params.id;
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const teamData = await getTeamById(teamId);
        if (teamData) {
          setTeam(teamData);
        } else {
          toast.error("Team not found");
          router.push("/admin/teams");
        }
      } catch (error) {
        toast.error("Failed to load team");
        console.error(error);
        router.push("/admin/teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId, router]);

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

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href={`/admin/teams/${teamId}/players`}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Add Player to {team.name}</h1>
        </div>
        <p className="text-muted-foreground">
          Add a new player to the {team.category} team
        </p>
      </div>
      <AddPlayerForm team={team} />
      <Toaster position="top-center" richColors />
    </div>
  );
} 