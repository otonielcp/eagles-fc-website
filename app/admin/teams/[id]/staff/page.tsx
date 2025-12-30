"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTeamById } from "@/actions/team";
import { getStaffByTeamId, deleteStaff } from "@/actions/staff";
import { Team, Staff } from "@/types/team";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import { Plus, Pencil, Trash2, ArrowLeft, Loader2 } from "lucide-react";

export default function TeamStaffPage() {
  const params: { id: string } = useParams();
  const teamId = params.id;
  const [team, setTeam] = useState<Team | null>(null);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, staffData] = await Promise.all([
          getTeamById(teamId),
          getStaffByTeamId(teamId)
        ]);

        setTeam(teamData);
        setStaffMembers(staffData);
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
      await deleteStaff(id);
      toast.success("Staff member deleted successfully");
      setStaffMembers(staffMembers.filter((staff) => staff._id !== id));
    } catch (error) {
      toast.error("An error occurred while deleting the staff member");
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/teams')}
            className="h-9 w-9 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Team Staff</h1>
        </div>
        <Link href={`/admin/teams/${teamId}/staff/add`}>
          <Button className="bg-[#C5A464] hover:bg-[#B39355]">
            <Plus className="mr-2 h-4 w-4" /> Add Staff Member
          </Button>
        </Link>
      </div>

      <div className="border p-4 rounded-lg flex items-center gap-4">
        {team.image ? (
          <div className="h-16 w-16 relative rounded-md overflow-hidden">
            <img
              src={team.image}
              alt={team.name}

              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-16 w-16 bg-gray-200 rounded-md"></div>
        )}
        <div>
          <h2 className="text-xl font-semibold">{team.name}</h2>
          <p className="text-gray-500">{team.category} • {staffMembers.length} Staff Members</p>

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

      {staffMembers.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <h3 className="text-lg font-medium">No staff members found</h3>
          <p className="text-muted-foreground mt-1">
            Get started by adding a new staff member
          </p>
          <Link href={`/admin/teams/${teamId}/staff/add`} className="mt-4 inline-block">
            <Button className="bg-[#C5A464] hover:bg-[#B39355] mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Staff Member
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.map((staff) => (
                <TableRow key={staff._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {staff.image ? (
                        <div className="h-10 w-10 relative rounded-full overflow-hidden">
                          <img
                            src={staff.image}
                            alt={staff.displayName}

                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-xs">{staff.displayName.substring(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{staff.displayName}</div>
                        <div className="text-sm text-gray-500">{staff.firstName} {staff.lastName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell>{getAge(staff.dateOfBirth)}</TableCell>
                  <TableCell>{staff.nationality}</TableCell>
                  <TableCell>
                    {staff.isActive ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/teams/${teamId}/staff/edit/${staff._id}`}>
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
                            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {staff.displayName}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(staff._id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                              disabled={deleteLoading === staff._id}
                            >
                              {deleteLoading === staff._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Delete"
                              )}
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
    </div>
  );
} 