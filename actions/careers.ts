"use server";

/**
 * Public careers actions. Everything exported here is callable by anyone, so
 * it only ever returns open postings (whitelisted fields) and accepts new
 * applications. Admin-side reads and writes live in actions/hiring.ts.
 */

import { randomInt } from "crypto";
import { after } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/dbConnect";
import JobPosting from "@/models/JobPosting";
import JobApplication from "@/models/JobApplication";
import ApplicationFile from "@/models/ApplicationFile";
import {
  ADMIN_SKILLS,
  AGE_GROUPS,
  AVAILABILITY_OPTIONS,
  COACHING_LICENSES,
  DEPARTMENTS,
  PLAYING_LEVELS,
  RESUME_MAX_BYTES,
  RESUME_TYPES,
  SAFESPORT_STATUSES,
  clubToday,
  type PublicJob,
} from "@/lib/hiring";
import { sendApplicationConfirmation, sendNewApplicationAlert } from "@/lib/hiringEmails";

// Explicit field list: anything added to the model later stays private until
// someone decides it belongs on the public site.
function toPublicJob(doc: any): PublicJob {
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
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

function openJobFilter() {
  return {
    status: "open",
    $or: [{ applicationDeadline: "" }, { applicationDeadline: { $gte: clubToday() } }],
  };
}

export async function getOpenJobs(): Promise<PublicJob[]> {
  try {
    await connectDB();
    const jobs = await JobPosting.find(openJobFilter()).sort({ createdAt: -1 }).lean();
    return jobs.map(toPublicJob);
  } catch (error) {
    console.error("[careers] Error fetching open jobs:", error);
    return [];
  }
}

export async function getOpenJobBySlug(slug: string): Promise<PublicJob | null> {
  try {
    await connectDB();
    const job = await JobPosting.findOne({ ...openJobFilter(), slug: String(slug) }).lean();
    return job ? toPublicJob(job) : null;
  } catch (error) {
    console.error("[careers] Error fetching job:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Application submission
// ---------------------------------------------------------------------------

const optionalText = (max: number) => z.string().trim().max(max).default("");

const referenceSchema = z.object({
  name: z.string().trim().min(1).max(100),
  relationship: optionalText(100),
  phone: optionalText(30),
  email: z.string().trim().max(200).email("Enter a valid email for each reference").or(z.literal("")).default(""),
});

const applicationSchema = z.object({
  jobSlug: optionalText(100),
  department: z.enum(["coaching", "administration"]),
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().max(200).email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  city: optionalText(80),
  state: optionalText(40),
  zip: optionalText(15),
  isAdult: z.literal(true, { errorMap: () => ({ message: "You must be 18 or older to apply" }) }),
  workAuthorized: z.boolean(),
  backgroundCheckAck: z.literal(true, {
    errorMap: () => ({ message: "All staff must agree to a background check and SafeSport training" }),
  }),
  safeSportStatus: z.enum(Object.keys(SAFESPORT_STATUSES) as [keyof typeof SAFESPORT_STATUSES]),
  cprCertified: z.boolean(),
  yearsExperience: z.coerce.number().int().min(0).max(60),
  licenses: z.array(z.enum(COACHING_LICENSES)).max(COACHING_LICENSES.length).default([]),
  ageGroups: z.array(z.enum(AGE_GROUPS)).max(AGE_GROUPS.length).default([]),
  playingLevel: z.enum(PLAYING_LEVELS).or(z.literal("")).default(""),
  adminSkills: z.array(z.enum(ADMIN_SKILLS)).max(ADMIN_SKILLS.length).default([]),
  software: optionalText(300),
  availability: z.array(z.enum(AVAILABILITY_OPTIONS)).max(AVAILABILITY_OPTIONS.length).default([]),
  earliestStart: optionalText(60),
  languages: optionalText(200),
  coverLetter: z
    .string()
    .trim()
    .min(20, "Tell us a little more about why you want to join (at least 20 characters)")
    .max(5000, "Please keep your message under 5,000 characters"),
  linkedinUrl: z.string().trim().max(300).url("Enter a full link, starting with https://").or(z.literal("")).default(""),
  heardAbout: optionalText(100),
  references: z.array(referenceSchema).max(3).default([]),
  certify: z.literal(true, { errorMap: () => ({ message: "Please confirm your information is accurate" }) }),
  // Honeypot: hidden from people, filled in by bots.
  website: z.string().optional(),
});

export type ApplicationPayload = z.input<typeof applicationSchema>;

type SubmitResult = { success: true; referenceCode: string } | { success: false; message: string };

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I/L
function makeReferenceCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return `EFC-${code}`;
}

/** Checks the file's leading bytes: a renamed .exe or .html must not pass as a resume. */
function matchesSignature(bytes: Buffer, mimeType: string): boolean {
  const startsWith = (sig: number[]) => sig.every((b, i) => bytes[i] === b);
  switch (mimeType) {
    case "application/pdf":
      return startsWith([0x25, 0x50, 0x44, 0x46, 0x2d]); // %PDF-
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return startsWith([0x50, 0x4b, 0x03, 0x04]); // ZIP container
    case "application/msword":
      return startsWith([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]); // OLE2
    default:
      return false;
  }
}

function cleanFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() || "resume";
  return base.replace(/[^\w.\- ]+/g, "_").slice(0, 100);
}

const DUPLICATE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export async function submitApplication(formData: FormData): Promise<SubmitResult> {
  let payload: unknown;
  try {
    payload = JSON.parse(String(formData.get("payload") ?? ""));
  } catch {
    return { success: false, message: "Something went wrong reading the form. Please try again." };
  }

  const parsed = applicationSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Please check the form and try again." };
  }
  const input = parsed.data;

  // Bots get a convincing success so they do not retry with a different payload.
  if (input.website) {
    return { success: true, referenceCode: makeReferenceCode() };
  }

  // --- Resume (optional) -----------------------------------------------------
  const resumeEntry = formData.get("resume");
  let resume: { bytes: Buffer; fileName: string; mimeType: string } | null = null;
  if (resumeEntry instanceof File && resumeEntry.size > 0) {
    if (resumeEntry.size > RESUME_MAX_BYTES) {
      return { success: false, message: "Your resume must be 3 MB or smaller." };
    }
    if (!RESUME_TYPES[resumeEntry.type]) {
      return { success: false, message: "Please upload your resume as a PDF or Word document." };
    }
    const bytes = Buffer.from(await resumeEntry.arrayBuffer());
    if (!matchesSignature(bytes, resumeEntry.type)) {
      return { success: false, message: "That file does not look like a valid PDF or Word document." };
    }
    resume = { bytes, fileName: cleanFileName(resumeEntry.name), mimeType: resumeEntry.type };
  }

  try {
    await connectDB();

    // --- Which job? The department always comes from the posting, never the client.
    let job: any = null;
    if (input.jobSlug) {
      job = await JobPosting.findOne({ ...openJobFilter(), slug: input.jobSlug }).lean();
      if (!job) {
        return { success: false, message: "This position is no longer accepting applications." };
      }
    }
    const department = job ? job.department : input.department;
    const jobTitle = job ? job.title : `General Application: ${DEPARTMENTS[input.department as keyof typeof DEPARTMENTS]}`;

    const duplicate = await JobApplication.exists({
      email: input.email.toLowerCase(),
      job: job ? job._id : null,
      ...(job ? {} : { department }),
      createdAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
    });
    if (duplicate) {
      return {
        success: false,
        message:
          "We already received an application from this email for this position. If you need to update it, reply to your confirmation email.",
      };
    }

    const fileDoc = resume
      ? await ApplicationFile.create({
          data: resume.bytes,
          fileName: resume.fileName,
          mimeType: resume.mimeType,
          size: resume.bytes.length,
        })
      : null;

    const { jobSlug: _slug, website: _hp, certify: _certify, ...fields } = input;
    const isCoaching = department === "coaching";

    let application: any = null;
    for (let attempt = 0; attempt < 3 && !application; attempt++) {
      try {
        application = await JobApplication.create({
          ...fields,
          // Keep each record to the fields that apply to its department.
          licenses: isCoaching ? fields.licenses : [],
          ageGroups: isCoaching ? fields.ageGroups : [],
          playingLevel: isCoaching ? fields.playingLevel : "",
          adminSkills: isCoaching ? [] : fields.adminSkills,
          software: isCoaching ? "" : fields.software,
          referenceCode: makeReferenceCode(),
          job: job ? job._id : null,
          jobTitle,
          department,
          resume: fileDoc
            ? { file: fileDoc._id, fileName: fileDoc.fileName, mimeType: fileDoc.mimeType, size: fileDoc.size }
            : null,
          activity: [{ kind: "event", text: "Application submitted" }],
        });
      } catch (error: any) {
        // Retry only a reference-code collision; anything else is a real failure.
        if (error?.code === 11000 && error?.keyPattern?.referenceCode) continue;
        if (fileDoc) await ApplicationFile.findByIdAndDelete(fileDoc._id);
        throw error;
      }
    }
    if (!application) {
      if (fileDoc) await ApplicationFile.findByIdAndDelete(fileDoc._id);
      throw new Error("Could not allocate a reference code");
    }

    const applicationId = String(application._id);
    const referenceCode: string = application.referenceCode;

    // Email after the response is sent: the applicant should not wait on SMTP,
    // and a mail outage must never lose an application that is already saved.
    after(async () => {
      const [alert, confirmation] = await Promise.allSettled([
        sendNewApplicationAlert({
          applicationId,
          referenceCode,
          jobTitle,
          department: DEPARTMENTS[department as keyof typeof DEPARTMENTS],
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          city: input.city,
          state: input.state,
          yearsExperience: input.yearsExperience,
          safeSportStatus: SAFESPORT_STATUSES[input.safeSportStatus],
          hasResume: !!fileDoc,
          coverLetter: input.coverLetter,
        }),
        sendApplicationConfirmation({
          email: input.email,
          firstName: input.firstName,
          jobTitle,
          referenceCode,
        }),
      ]);
      if (alert.status === "rejected") console.error("[careers] Admin alert email failed:", alert.reason);
      if (confirmation.status === "rejected") {
        console.error("[careers] Confirmation email failed:", confirmation.reason);
      } else {
        await JobApplication.findByIdAndUpdate(applicationId, {
          $push: { activity: { kind: "email", text: "Confirmation email sent to applicant" } },
        }).catch(() => {});
      }
    });

    return { success: true, referenceCode };
  } catch (error: any) {
    console.error("[careers] Error saving application:", error?.message || error);
    return { success: false, message: "We could not submit your application right now. Please try again in a few minutes." };
  }
}
