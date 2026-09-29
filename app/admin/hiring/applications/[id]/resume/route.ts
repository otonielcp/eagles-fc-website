import mongoose from "mongoose";
import connectDB from "@/lib/dbConnect";
import { requireAdmin } from "@/lib/requireAdmin";
import JobApplication from "@/models/JobApplication";
import ApplicationFile from "@/models/ApplicationFile";
import { RESUME_TYPES } from "@/lib/hiring";

/**
 * Streams an applicant's resume to a signed-in admin. Middleware already
 * guards /admin, but this checks the session itself too, because a route that
 * serves personal documents should not depend on a matcher staying correct.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return new Response("Not found", { status: 404 });
  }

  await connectDB();
  const application: any = await JobApplication.findById(id).select("resume firstName lastName").lean();
  if (!application?.resume?.file) {
    return new Response("Not found", { status: 404 });
  }

  // Not lean(): a lean read returns BSON Binary instead of a Buffer.
  const file = await ApplicationFile.findById(application.resume.file);
  if (!file || !RESUME_TYPES[file.mimeType]) {
    return new Response("Not found", { status: 404 });
  }

  const downloadName = `${application.lastName}-${application.firstName}-resume${RESUME_TYPES[file.mimeType]}`.replace(
    /[^A-Za-z0-9._-]/g,
    "_"
  );

  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.mimeType,
      // Always download, never render inline on the admin origin.
      "Content-Disposition": `attachment; filename="${downloadName}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
