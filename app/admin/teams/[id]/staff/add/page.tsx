"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTeamById } from "@/actions/team";
import { Team } from "@/types/team";
import AddStaffForm from "@/components/admin/staff/AddStaffForm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddStaffPage() {
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
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.push(`/admin/teams/${teamId}/staff`)}
          className="h-9 w-9 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add Staff Member</h1>
      </div>

      <p className="text-muted-foreground">
        Team: <span className="font-medium text-foreground">{team.name}</span>
      </p>

      <AddStaffForm team={team} />
    </div>
  );
} 