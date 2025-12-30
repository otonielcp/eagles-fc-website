"use client";

import { useState, useEffect } from "react";
import { getAllTeams, deleteTeam } from "@/actions/team";
import { Team } from "@/types/team";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Users, UserCog } from "lucide-react";
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

export default function TeamsManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await getAllTeams();
        setTeams(teamsData);
      } catch (error) {
        toast.error("Failed to load teams");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleteLoading(id);
    try {
      const result = await deleteTeam(id);
      if (result.success) {
        toast.success(result.message);
        setTeams(teams.filter((team) => team._id !== id));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the team");
      console.error(error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teams Management</h1>
          <p className="text-muted-foreground">
            Manage your club's teams, players, and staff
          </p>
        </div>
        <Link href="/admin/teams/add">
          <Button className="bg-[#C5A464] hover:bg-[#B39355]">
            <Plus className="mr-2 h-4 w-4" /> Add Team
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <h3 className="text-lg font-medium">No teams found</h3>
          <p className="text-muted-foreground mt-1">
            Get started by adding a new team
          </p>
          <Link href="/admin/teams/add" className="mt-4 inline-block">
            <Button className="bg-[#C5A464] hover:bg-[#B39355] mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Team
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {team.image ? (
                        <div className="h-10 w-10 relative rounded-md overflow-hidden">
                          <img
                            src={team.image}
                            alt={team.name}
                            
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-gray-500">{team.shortName}</div>
                        {team.sponsor?.isActive && team.sponsor?.name && (
                          <div className="text-xs text-[#C5A464]">
                            Sponsored by: {team.sponsor.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{team.category}</TableCell>
                  <TableCell>
                    {team.isActive ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>{team.order}</TableCell>
                  <TableCell>{formatDate(team.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/teams/${team._id}/players`}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          title="Manage Players"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/teams/${team._id}/staff`}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          title="Manage Staff"
                        >
                          <UserCog className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/teams/edit/${team._id}`}>
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
                              delete the team and remove the data from our servers.
                              <br /><br />
                              <strong>Note:</strong> You cannot delete a team that has players or staff assigned to it.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(team._id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                              disabled={deleteLoading === team._id}
                            >
                              {deleteLoading === team._id ? (
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
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
} 