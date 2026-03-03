"use server";

import connectDB from "@/lib/dbConnect";
import FormSubmission from "@/models/FormSubmission";
import { revalidatePath } from "next/cache";

export async function createFormSubmission(data: {
  type: "contact" | "registration" | "operations" | "marketing" | "media";
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  data?: Record<string, any>;
}) {
  try {
    await connectDB();
    await FormSubmission.create(data);
    revalidatePath("/admin/inbox");
    return { success: true };
  } catch (error) {
    console.error("Error saving form submission:", error);
    return { success: false };
  }
}

export async function getAllFormSubmissions(type?: string) {
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
