"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTeamById } from "@/actions/team";
import { Team } from "@/types/team";
import EditTeamForm from "@/components/admin/teams/EditTeamForm";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditTeamPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const teamData = await getTeamById(id);
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
  }, [id, router]);

  const handleCancel = () => {
    router.push("/admin/teams");
  };

  const handleTeamUpdated = (updatedTeam: Team) => {
    setTeam(updatedTeam);
    router.push("/admin/teams");
  };

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
        <h1 className="text-2xl font-bold tracking-tight">Edit Team</h1>
        <p className="text-muted-foreground">
          Update the details of your team
        </p>
      </div>
      <EditTeamForm
        team={team}
        onCancel={handleCancel}
        onTeamUpdated={handleTeamUpdated}
      />
      <Toaster position="top-center" richColors />
    </div>
  );
} 