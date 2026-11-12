"use server";

import { requireAdmin } from '@/lib/requireAdmin';

import connectDB from "@/lib/dbConnect";
import PartnershipInquiry from "@/models/PartnershipInquiry";
import { revalidatePath } from "next/cache";

// Must match the `status` enum in models/PartnershipInquiry.ts.
const INQUIRY_STATUSES: string[] = ["new", "contacted", "in_progress", "closed"];

export async function getAllPartnershipInquiries() {
  await requireAdmin();
  try {
    await connectDB();
    const inquiries = await PartnershipInquiry.find({})
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(inquiries));
  } catch (error) {
    console.error("Error fetching partnership inquiries:", error);
    return [];
  }
}

export async function getPartnershipInquiryById(id: string) {
  await requireAdmin();
  try {
    await connectDB();
    const inquiry = await PartnershipInquiry.findById(id).lean();
    if (!inquiry) return null;
    return JSON.parse(JSON.stringify(inquiry));
  } catch (error) {
    console.error("Error fetching partnership inquiry:", error);
    return null;
  }
}

// Public inquiries are saved by lib/inboxStore.ts (savePartnershipInquiry), which
// is not a server action, so bots cannot write to the inbox directly.

export async function updatePartnershipInquiryStatus(
  id: string,
  status: "new" | "contacted" | "in_progress" | "closed"
) {
  await requireAdmin();
  // findByIdAndUpdate skips enum validation by default, so check it here.
  if (!INQUIRY_STATUSES.includes(status)) {
    return { success: false, message: "Invalid status" };
  }
  try {
    await connectDB();
    await PartnershipInquiry.findByIdAndUpdate(id, { status });
    revalidatePath("/admin/partnerships");
    return { success: true, message: "Status updated" };
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return { success: false, message: "Failed to update status" };
  }
}

export async function updatePartnershipInquiryNotes(id: string, notes: string) {
  await requireAdmin();
  try {
    await connectDB();
    await PartnershipInquiry.findByIdAndUpdate(id, { notes });
    revalidatePath("/admin/partnerships");
    return { success: true, message: "Notes updated" };
  } catch (error) {
    console.error("Error updating inquiry notes:", error);
    return { success: false, message: "Failed to update notes" };
  }
}

export async function deletePartnershipInquiry(id: string) {
  await requireAdmin();
  try {
    await connectDB();
    await PartnershipInquiry.findByIdAndDelete(id);
    revalidatePath("/admin/partnerships");
    return { success: true, message: "Inquiry deleted" };
  } catch (error) {
    console.error("Error deleting partnership inquiry:", error);
    return { success: false, message: "Failed to delete inquiry" };
  }
}
