"use server";

import connectDB from "@/lib/dbConnect";
import PartnershipInquiry from "@/models/PartnershipInquiry";
import { revalidatePath } from "next/cache";

export async function getAllPartnershipInquiries() {
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

export async function createPartnershipInquiry(data: {
  firstName: string;
  lastName?: string;
  title?: string;
  businessName: string;
  businessWebsite?: string;
  email: string;
  phone: string;
  description?: string;
}) {
  try {
    console.log("[PartnershipInquiry] Attempting to save:", data.email);
    await connectDB();
    console.log("[PartnershipInquiry] DB connected, creating document...");
    const inquiry = await PartnershipInquiry.create(data);
    console.log("[PartnershipInquiry] Saved successfully, id:", inquiry._id);
    revalidatePath("/admin/partnerships");
    return { success: true, id: inquiry._id.toString() };
  } catch (error: any) {
    console.error("[PartnershipInquiry] ERROR:", error?.message || error);
    console.error("[PartnershipInquiry] Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return { success: false, message: "Failed to save inquiry" };
  }
}

export async function updatePartnershipInquiryStatus(
  id: string,
  status: "new" | "contacted" | "in_progress" | "closed"
) {
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
