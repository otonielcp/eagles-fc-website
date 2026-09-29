"use server";

/**
 * Admin-only hiring actions. Every export calls requireAdmin() first: these
 * return applicant contact details, references and resumes, and server
 * actions are reachable without going through the /admin middleware.
 */

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import connectDB from "@/lib/dbConnect";
import { requireAdmin } from "@/lib/requireAdmin";
import JobPosting from "@/models/JobPosting";
import JobApplication from "@/models/JobApplication";
import ApplicationFile from "@/models/ApplicationFile";
import {
  COMPLIANCE_ITEMS,
  EMPLOYMENT_TYPES,
  JOB_STATUSES,
  REQUIRED_BEFORE_HIRE,
  RESERVED_SLUGS,
  STAGES,
  STAGE_LABELS,
  complianceKeysFor,
  formatWallClock,
  slugify,
  type AdminJob,
  type ApplicationDetail,
  type ApplicationSummary,
  type ComplianceKey,
  type JobInput,
  type JobStatus,
  type Stage,
} from "@/lib/hiring";
import { sendDeclineNotice, sendInterviewInvite } from "@/lib/hiringEmails";

type Result<T = undefined> =
  | ({ success: true; message: string; warning?: string } & (T extends undefined ? {} : { data: T }))
  | { success: false; message: string };

function fail(error: unknown, fallback: string): { success: false; message: string } {
  if (error instanceof Error && error.message === "Unauthorized") {
    return { success: false, message: "Your session has expired. Please log in again." };
  }
  console.error(`[hiring] ${fallback}:`, error);
  return { success: false, message: fallback };
}

function assertId(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new Error("Invalid id");
}

function refreshHiringPages() {
  revalidatePath("/admin/hiring", "layout");
  revalidatePath("/careers", "layout");
}

// ---------------------------------------------------------------------------
// Job postings
// ---------------------------------------------------------------------------

const listField = z
  .array(z.string().trim().max(300))
  .max(25)
  .transform((items) => items.filter(Boolean));

const jobSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  department: z.enum(["coaching", "administration"]),
  employmentType: z.enum(Object.keys(EMPLOYMENT_TYPES) as [keyof typeof EMPLOYMENT_TYPES]),
  location: z.string().trim().max(100),
  team: z.string().trim().max(100),
  compensation: z.string().trim().max(120),
  startDate: z.string().trim().max(60),
  applicationDeadline: z
    .string()
    .trim()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/, "Deadline must be a valid date"),
  summary: z.string().trim().max(400, "Summary must be 400 characters or fewer"),
  description: z.string().trim().max(8000),
  responsibilities: listField,
  requirements: listField,
  preferred: listField,
  benefits: listField,
  status: z.enum(Object.keys(JOB_STATUSES) as [JobStatus]),
});

async function uniqueSlug(title: string, excludeId?: string): Promise<string> {
  let base = slugify(title) || "position";
  if (RESERVED_SLUGS.includes(base)) base = `${base}-role`;
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    const taken = await JobPosting.exists({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    if (!taken) return candidate;
  }
}

function toAdminJob(doc: any, counts?: { total: number; fresh: number }): AdminJob {
  return {
    _id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    department: doc.department,
    employmentType: doc.employmentType,
    location: doc.location ?? "",
    team: doc.team ?? "",
    compensation: doc.compensation ?? "",
    startDate: doc.startDate ?? "",
    applicationDeadline: doc.applicationDeadline ?? "",
    summary: doc.summary ?? "",
    description: doc.description ?? "",
    responsibilities: doc.responsibilities ?? [],
    requirements: doc.requirements ?? [],
    preferred: doc.preferred ?? [],
    benefits: doc.benefits ?? [],
    status: doc.status,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
    applicantCount: counts?.total ?? 0,
    newApplicantCount: counts?.fresh ?? 0,
  };
}

async function applicantCounts(): Promise<Map<string, { total: number; fresh: number }>> {
  const rows = await JobApplication.aggregate([
    { $match: { job: { $ne: null } } },
    {
      $group: {
        _id: "$job",
        total: { $sum: 1 },
        fresh: { $sum: { $cond: [{ $eq: ["$stage", "new"] }, 1, 0] } },
      },
    },
  ]);
  return new Map(rows.map((r: any) => [String(r._id), { total: r.total, fresh: r.fresh }]));
}

export async function getJobsAdmin(): Promise<AdminJob[]> {
  try {
    await requireAdmin();
    await connectDB();
    const [jobs, counts] = await Promise.all([
      JobPosting.find({}).sort({ createdAt: -1 }).lean(),
      applicantCounts(),
    ]);
    return jobs.map((job: any) => toAdminJob(job, counts.get(String(job._id))));
  } catch (error) {
    fail(error, "Failed to load job postings");
    return [];
  }
}

export async function getJobAdmin(id: string): Promise<AdminJob | null> {
  try {
    await requireAdmin();
    assertId(id);
    await connectDB();
    const job = await JobPosting.findById(id).lean();
    if (!job) return null;
    const counts = await applicantCounts();
    return toAdminJob(job, counts.get(id));
  } catch (error) {
    fail(error, "Failed to load job posting");
    return null;
  }
}

export async function saveJob(id: string | null, input: JobInput): Promise<Result<{ id: string }>> {
  try {
    await requireAdmin();
    const parsed = jobSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message || "Please check the form" };
    }
    const data = parsed.data;
    await connectDB();

    if (!id) {
      const job = await JobPosting.create({ ...data, slug: await uniqueSlug(data.title) });
      refreshHiringPages();
      return { success: true, message: "Job posting created", data: { id: String(job._id) } };
    }

    assertId(id);
    const existing: any = await JobPosting.findById(id).lean();
    if (!existing) return { success: false, message: "Job posting not found" };

    // Links to a posting may already be shared once it has gone live, so the
    // slug only follows the title while the posting is still a draft.
    const slug =
      existing.status === "draft" && existing.title !== data.title
        ? await uniqueSlug(data.title, id)
        : existing.slug;

    await JobPosting.findByIdAndUpdate(id, { ...data, slug }, { runValidators: true });
    refreshHiringPages();
    return { success: true, message: "Job posting saved", data: { id } };
  } catch (error) {
    return fail(error, "Failed to save job posting");
  }
}

export async function setJobStatus(id: string, status: JobStatus): Promise<Result> {
  try {
    await requireAdmin();
    assertId(id);
    if (!(status in JOB_STATUSES)) return { success: false, message: "Invalid status" };
    await connectDB();
    await JobPosting.findByIdAndUpdate(id, { status });
    refreshHiringPages();
    return { success: true, message: `Posting ${status === "open" ? "published" : status === "closed" ? "closed" : "moved to drafts"}` };
  } catch (error) {
    return fail(error, "Failed to update posting status");
  }
}

export async function duplicateJob(id: string): Promise<Result<{ id: string }>> {
  try {
    await requireAdmin();
    assertId(id);
    await connectDB();
    const source: any = await JobPosting.findById(id).lean();
    if (!source) return { success: false, message: "Job posting not found" };
    const { _id, slug, createdAt, updatedAt, __v, ...rest } = source;
    const title = `${source.title} (copy)`.slice(0, 120);
    const copy = await JobPosting.create({ ...rest, title, status: "draft", slug: await uniqueSlug(title) });
    refreshHiringPages();
    return { success: true, message: "Posting duplicated as a draft", data: { id: String(copy._id) } };
  } catch (error) {
    return fail(error, "Failed to duplicate posting");
  }
}

/** Applications keep their job title snapshot, so deleting a posting never loses an applicant. */
export async function deleteJob(id: string): Promise<Result> {
  try {
    await requireAdmin();
    assertId(id);
    await connectDB();
    await JobPosting.findByIdAndDelete(id);
    refreshHiringPages();
    return { success: true, message: "Job posting deleted" };
  } catch (error) {
    return fail(error, "Failed to delete posting");
  }
}

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

function toSummary(doc: any): ApplicationSummary {
  return {
    _id: String(doc._id),
    referenceCode: doc.referenceCode,
    jobId: doc.job ? String(doc.job) : null,
    jobTitle: doc.jobTitle,
    department: doc.department,
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    phone: doc.phone,
    city: doc.city ?? "",
    state: doc.state ?? "",
    yearsExperience: doc.yearsExperience ?? 0,
    stage: doc.stage,
    rating: doc.rating ?? 0,
    compliance: {
      safeSportVerified: !!doc.compliance?.safeSportVerified,
      backgroundCheckCleared: !!doc.compliance?.backgroundCheckCleared,
      referencesChecked: !!doc.compliance?.referencesChecked,
      licenseVerified: !!doc.compliance?.licenseVerified,
      cprVerified: !!doc.compliance?.cprVerified,
    },
    hasResume: !!doc.resume,
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

function toDetail(doc: any): ApplicationDetail {
  return {
    ...toSummary(doc),
    zip: doc.zip ?? "",
    isAdult: !!doc.isAdult,
    workAuthorized: !!doc.workAuthorized,
    backgroundCheckAck: !!doc.backgroundCheckAck,
    safeSportStatus: doc.safeSportStatus,
    cprCertified: !!doc.cprCertified,
    licenses: doc.licenses ?? [],
    ageGroups: doc.ageGroups ?? [],
    playingLevel: doc.playingLevel ?? "",
    adminSkills: doc.adminSkills ?? [],
    software: doc.software ?? "",
    availability: doc.availability ?? [],
    earliestStart: doc.earliestStart ?? "",
    languages: doc.languages ?? "",
    coverLetter: doc.coverLetter ?? "",
    linkedinUrl: doc.linkedinUrl ?? "",
    heardAbout: doc.heardAbout ?? "",
    references: (doc.references ?? []).map((r: any) => ({
      name: r.name,
      relationship: r.relationship ?? "",
      phone: r.phone ?? "",
      email: r.email ?? "",
    })),
    resume: doc.resume
      ? { fileName: doc.resume.fileName, mimeType: doc.resume.mimeType, size: doc.resume.size }
      : null,
    interview: doc.interview
      ? {
          scheduledAt: doc.interview.scheduledAt,
          location: doc.interview.location ?? "",
          details: doc.interview.details ?? "",
        }
      : null,
    activity: (doc.activity ?? [])
      .map((a: any) => ({ _id: String(a._id), kind: a.kind, text: a.text, at: new Date(a.at).toISOString() }))
      .sort((a: any, b: any) => b.at.localeCompare(a.at)),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

async function loadDetail(id: string): Promise<ApplicationDetail | null> {
  const doc = await JobApplication.findById(id).lean();
  return doc ? toDetail(doc) : null;
}

const SUMMARY_FIELDS =
  "referenceCode job jobTitle department firstName lastName email phone city state yearsExperience stage rating compliance resume.fileName createdAt";

export async function getApplicationsAdmin(): Promise<ApplicationSummary[]> {
  try {
    await requireAdmin();
    await connectDB();
    const docs = await JobApplication.find({}).select(SUMMARY_FIELDS).sort({ createdAt: -1 }).lean();
    return docs.map(toSummary);
  } catch (error) {
    fail(error, "Failed to load applications");
    return [];
  }
}

export async function getApplicationAdmin(id: string): Promise<ApplicationDetail | null> {
  try {
    await requireAdmin();
    assertId(id);
    await connectDB();
    return await loadDetail(id);
  } catch (error) {
    fail(error, "Failed to load application");
    return null;
  }
}

export async function updateApplicationStage(
  id: string,
  stage: Stage,
  options: { notify?: boolean } = {}
): Promise<Result<ApplicationDetail>> {
  try {
    await requireAdmin();
    assertId(id);
    if (!STAGES.includes(stage)) return { success: false, message: "Invalid stage" };
    await connectDB();

    const app: any = await JobApplication.findById(id).lean();
    if (!app) return { success: false, message: "Application not found" };
    if (app.stage === stage) {
      return { success: true, message: "No change", data: toDetail(app) };
    }

    const events: { kind: "event" | "email"; text: string }[] = [
      { kind: "event", text: `Moved from ${STAGE_LABELS[app.stage as Stage]} to ${STAGE_LABELS[stage]}` },
    ];

    // Not a hard block, since some checks finish after an offer is accepted,
    // but hiring someone before they are cleared leaves a permanent record.
    if (stage === "hired") {
      const missing = REQUIRED_BEFORE_HIRE.filter((key) => !app.compliance?.[key]);
      if (missing.length) {
        events.push({
          kind: "event",
          text: `Marked hired before completing: ${missing.map((k) => COMPLIANCE_ITEMS[k].label).join(", ")}`,
        });
      }
    }

    let warning: string | undefined;
    if (stage === "rejected" && options.notify) {
      try {
        await sendDeclineNotice({ email: app.email, firstName: app.firstName, jobTitle: app.jobTitle });
        events.push({ kind: "email", text: "Decline email sent to applicant" });
      } catch (error) {
        console.error("[hiring] Decline email failed:", error);
        warning = "Stage updated, but the decline email could not be sent.";
      }
    }

    await JobApplication.findByIdAndUpdate(id, {
      stage,
      $push: { activity: { $each: events } },
    });
    refreshHiringPages();
    const data = await loadDetail(id);
    return { success: true, message: `Moved to ${STAGE_LABELS[stage]}`, warning, data: data! };
  } catch (error) {
    return fail(error, "Failed to update stage");
  }
}

const interviewSchema = z.object({
  scheduledAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Pick a date and time for the interview"),
  location: z.string().trim().max(300),
  details: z.string().trim().max(2000),
});

export async function scheduleInterview(
  id: string,
  input: { scheduledAt: string; location: string; details: string },
  options: { notify?: boolean } = {}
): Promise<Result<ApplicationDetail>> {
  try {
    await requireAdmin();
    assertId(id);
    const parsed = interviewSchema.safeParse(input);
    if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message || "Invalid interview" };
    const interview = parsed.data;
    await connectDB();

    const app: any = await JobApplication.findById(id).lean();
    if (!app) return { success: false, message: "Application not found" };

    const events: { kind: "event" | "email"; text: string }[] = [
      {
        kind: "event",
        text: `Interview ${app.interview ? "rescheduled" : "scheduled"} for ${formatWallClock(interview.scheduledAt)}`,
      },
    ];
    const update: Record<string, unknown> = { interview };
    if (app.stage === "new" || app.stage === "screening") {
      update.stage = "interview";
      events.push({ kind: "event", text: `Moved from ${STAGE_LABELS[app.stage as Stage]} to Interview` });
    }

    let warning: string | undefined;
    if (options.notify) {
      try {
        await sendInterviewInvite({ email: app.email, firstName: app.firstName, jobTitle: app.jobTitle, ...interview });
        events.push({ kind: "email", text: "Interview invitation emailed to applicant" });
      } catch (error) {
        console.error("[hiring] Interview email failed:", error);
        warning = "Interview saved, but the invitation email could not be sent.";
      }
    }

    await JobApplication.findByIdAndUpdate(id, { ...update, $push: { activity: { $each: events } } });
    refreshHiringPages();
    const data = await loadDetail(id);
    return { success: true, message: "Interview saved", warning, data: data! };
  } catch (error) {
    return fail(error, "Failed to schedule interview");
  }
}

export async function cancelInterview(id: string): Promise<Result<ApplicationDetail>> {
  try {
    await requireAdmin();
    assertId(id);
    await connectDB();
    await JobApplication.findByIdAndUpdate(id, {
      interview: null,
      $push: { activity: { kind: "event", text: "Interview cancelled" } },
    });
    const data = await loadDetail(id);
    if (!data) return { success: false, message: "Application not found" };
    return { success: true, message: "Interview cancelled", data };
  } catch (error) {
    return fail(error, "Failed to cancel interview");
  }
}

export async function setApplicationRating(id: string, rating: number): Promise<Result> {
  try {
    await requireAdmin();
    assertId(id);
    const value = Math.round(Number(rating));
    if (!(value >= 0 && value <= 5)) return { success: false, message: "Rating must be 0–5" };
    await connectDB();
    await JobApplication.findByIdAndUpdate(id, { rating: value });
    return { success: true, message: value ? `Rated ${value} of 5` : "Rating cleared" };
  } catch (error) {
    return fail(error, "Failed to save rating");
  }
}

export async function setComplianceItem(id: string, key: ComplianceKey, value: boolean): Promise<Result<ApplicationDetail>> {
  try {
    await requireAdmin();
    assertId(id);
    if (!(key in COMPLIANCE_ITEMS)) return { success: false, message: "Unknown checklist item" };
    await connectDB();
    const app: any = await JobApplication.findById(id).select("department").lean();
    if (!app) return { success: false, message: "Application not found" };
    if (!complianceKeysFor(app.department).includes(key)) {
      return { success: false, message: "That check does not apply to this role" };
    }
    await JobApplication.findByIdAndUpdate(id, {
      [`compliance.${key}`]: !!value,
      $push: {
        activity: { kind: "event", text: `${value ? "Checked" : "Unchecked"}: ${COMPLIANCE_ITEMS[key].label}` },
      },
    });
    const data = await loadDetail(id);
    return { success: true, message: "Checklist updated", data: data! };
  } catch (error) {
    return fail(error, "Failed to update checklist");
  }
}

export async function addApplicationNote(id: string, text: string): Promise<Result<ApplicationDetail>> {
  try {
    await requireAdmin();
    assertId(id);
    const body = String(text ?? "").trim();
    if (!body) return { success: false, message: "Write a note first" };
    if (body.length > 4000) return { success: false, message: "Notes must be 4,000 characters or fewer" };
    await connectDB();
    await JobApplication.findByIdAndUpdate(id, { $push: { activity: { kind: "note", text: body } } });
    const data = await loadDetail(id);
    if (!data) return { success: false, message: "Application not found" };
    return { success: true, message: "Note added", data };
  } catch (error) {
    return fail(error, "Failed to add note");
  }
}

export async function deleteApplicationNote(id: string, noteId: string): Promise<Result<ApplicationDetail>> {
  try {
    await requireAdmin();
    assertId(id);
    assertId(noteId);
    await connectDB();
    // Only free-text notes can be removed; the event and email log is the audit trail.
    await JobApplication.findByIdAndUpdate(id, { $pull: { activity: { _id: noteId, kind: "note" } } });
    const data = await loadDetail(id);
    if (!data) return { success: false, message: "Application not found" };
    return { success: true, message: "Note deleted", data };
  } catch (error) {
    return fail(error, "Failed to delete note");
  }
}

export async function deleteApplication(id: string): Promise<Result> {
  try {
    await requireAdmin();
    assertId(id);
    await connectDB();
    const app: any = await JobApplication.findByIdAndDelete(id).lean();
    if (app?.resume?.file) await ApplicationFile.findByIdAndDelete(app.resume.file);
    refreshHiringPages();
    return { success: true, message: "Application deleted" };
  } catch (error) {
    return fail(error, "Failed to delete application");
  }
}
