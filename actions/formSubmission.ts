"use server";

import { requireAdmin } from '@/lib/requireAdmin';

import connectDB from "@/lib/dbConnect";
import FormSubmission from "@/models/FormSubmission";
import { revalidatePath } from "next/cache";

// Must match the `status` enum in models/FormSubmission.ts.
const SUBMISSION_STATUSES: string[] = ["new", "read", "replied", "closed"];

// Public submissions are saved by lib/inboxStore.ts (saveFormSubmission), which
// is not a server action, so bots cannot write to the inbox directly.

export async function getAllFormSubmissions(type?: string) {
  await requireAdmin();
  try {
    await connectDB();
    const filter = type && type !== "all" ? { type } : {};
    const submissions = await FormSubmission.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(submissions));
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    return [];
  }
}

export async function updateFormSubmissionStatus(
  id: string,
  status: "new" | "read" | "replied" | "closed"
) {
  await requireAdmin();
  // findByIdAndUpdate skips enum validation by default, so check it here.
  if (!SUBMISSION_STATUSES.includes(status)) {
    return { success: false, message: "Invalid status" };
  }
  try {
    await connectDB();
    await FormSubmission.findByIdAndUpdate(id, { status });
    revalidatePath("/admin/inbox");
    return { success: true, message: "Status updated" };
  } catch (error) {
    console.error("Error updating submission status:", error);
    return { success: false, message: "Failed to update status" };
  }
}

export async function updateFormSubmissionNotes(id: string, notes: string) {
  await requireAdmin();
  try {
    await connectDB();
    await FormSubmission.findByIdAndUpdate(id, { notes });
    revalidatePath("/admin/inbox");
    return { success: true, message: "Notes updated" };
  } catch (error) {
    console.error("Error updating submission notes:", error);
    return { success: false, message: "Failed to update notes" };
  }
}

export async function deleteFormSubmission(id: string) {
  await requireAdmin();
  try {
    await connectDB();
    await FormSubmission.findByIdAndDelete(id);
    revalidatePath("/admin/inbox");
    return { success: true, message: "Submission deleted" };
  } catch (error) {
    console.error("Error deleting submission:", error);
    return { success: false, message: "Failed to delete submission" };
  }
}
