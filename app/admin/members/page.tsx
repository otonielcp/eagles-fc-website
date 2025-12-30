"use client";

import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllMembers, deleteMember } from "@/actions/member";

export default function MembersManagement() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const response = await getAllMembers();
                setMembers(response.map(member => ({
                    _id: member.id,
                    ...member.data,
                    createdAt: member.createdAt
                })));
            } catch (error) {
                console.error("Error fetching members:", error);
                toast.error("Failed to load members");
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    const handleDelete = async (id: string) => {
        setDeleteLoading(id);
        try {
            const result = await deleteMember(id);
            
            if (result.success) {
                // Optimistically update UI
                setMembers(members.filter((member) => member._id !== id));
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Error deleting member:", error);
            toast.error("Failed to delete member");
        } finally {
            setDeleteLoading(null);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MM/dd/yyyy");
        } catch (error) {
            return "Invalid date";
        }
    };

    return (
        <div className="p-6">
            <Toaster position="top-right" />
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Members Management</h1>
                    <p className="text-gray-500 mt-1">
                        View and manage your players, coaches, and staff members
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#C5A464] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : members.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-lg font-medium text-gray-500">No members found</h3>
                        <p className="text-gray-400 mt-1">No members available in the system</p>
                    </div>
                ) : (
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Team</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Jersey #</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Added On</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member) => (
                                    <TableRow key={member._id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/admin/members/${member._id}`} className="hover:underline text-[#BD9B58]">
                                                {member.firstName} {member.lastName}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{member.team}</TableCell>
                                        <TableCell>{member.position}</TableCell>
                                        <TableCell>{member.jerseyNumber}</TableCell>
                                        <TableCell>
                                            {new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()}
                                        </TableCell>
                                        <TableCell>
                                            {member.isActive ? (
                                                <Badge className="bg-green-500 hover:bg-green-600">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{formatDate(member.createdAt)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Are you absolutely sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently
                                                                delete the member and remove the data from our servers.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(member._id)}
                                                                className="bg-red-500 hover:bg-red-600 text-white"
                                                                disabled={deleteLoading === member._id}
                                                            >
                                                                {deleteLoading === member._id ? (
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
            </div>
        </div>
    );
}
