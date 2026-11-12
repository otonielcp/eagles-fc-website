"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getStaffById } from "@/actions/staff";
import EditStaffForm from "@/components/admin/staff/EditStaffForm";
import { Staff } from "@/types/team";
import { Button } from "@/components/ui/button";

export default function EditStaffPage() {
  const { id: teamId, staffId } = useParams();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch staff member details
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // Null when the staff member was deleted; throws for an invalid id.
        setStaff(await getStaffById(staffId as string));
      } catch (error) {
        console.error("Failed to load staff member:", error);
        setStaff(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [staffId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Staff member not found</h3>
        <Link href={`/admin/teams/${teamId}/staff`} className="mt-4 inline-block">
          <Button className="bg-[#C5A464] hover:bg-[#B39355]">Back to Staff</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Staff Member</h1>
      <EditStaffForm staff={staff} teamId={teamId as string} />
    </div>
  );
}
