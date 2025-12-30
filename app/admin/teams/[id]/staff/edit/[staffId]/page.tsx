"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStaffById } from "@/actions/staff";
import EditStaffForm from "@/components/admin/staff/EditStaffForm";
import { notFound } from "next/navigation";
import { Staff } from "@/types/team";
import { Loader2 } from "lucide-react";

export default function EditStaffPage() {
  const { id: teamId, staffId } = useParams();
  const [staff, setStaff] = useState<Staff | null>(null);

  // Fetch staff member details
  useEffect(() => {
    const fetchStaff = async () => {
      const staff = await getStaffById(staffId as string);
      setStaff(staff);
    };
    fetchStaff();
  }, [staffId]);

  if (!staff) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
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