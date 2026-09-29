/**
 * Shared constants and types for the careers / hiring system.
 *
 * Imported by both client components and server actions, so nothing here may
 * touch the database, env secrets or Node-only APIs.
 */

export const DEPARTMENTS = {
  coaching: "Coaching",
  administration: "Administration",
} as const;
export type Department = keyof typeof DEPARTMENTS;

export const EMPLOYMENT_TYPES = {
  full_time: "Full-time",
  part_time: "Part-time",
  seasonal: "Seasonal",
  volunteer: "Volunteer",
  contract: "Contract",
} as const;
export type EmploymentType = keyof typeof EMPLOYMENT_TYPES;

export const JOB_STATUSES = {
  draft: "Draft",
  open: "Open",
  closed: "Closed",
} as const;
export type JobStatus = keyof typeof JOB_STATUSES;

/** Pipeline order matters: the admin stepper renders these left to right. */
export const PIPELINE_STAGES = ["new", "screening", "interview", "offer", "hired"] as const;
export const EXIT_STAGES = ["rejected", "withdrawn"] as const;
export const STAGES = [...PIPELINE_STAGES, ...EXIT_STAGES] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  new: "New",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Not selected",
  withdrawn: "Withdrawn",
};

export const COACHING_LICENSES = [
  "US Soccer Grassroots (4v4 / 7v7 / 9v9 / 11v11)",
  "US Soccer D License",
  "US Soccer C License",
  "US Soccer B License",
  "US Soccer A License",
  "United Soccer Coaches Diploma",
  "Goalkeeping License",
  "International / other federation license",
] as const;

export const AGE_GROUPS = ["U6–U8", "U9–U10", "U11–U12", "U13–U14", "U15+", "Adult"] as const;

export const PLAYING_LEVELS = [
  "None",
  "Youth / recreational",
  "High school",
  "Club / competitive",
  "College",
  "Semi-pro / professional",
] as const;

export const ADMIN_SKILLS = [
  "Player registration",
  "Scheduling & field coordination",
  "Bookkeeping / payments",
  "Communications & newsletters",
  "Social media",
  "Event planning",
  "Fundraising & sponsorship",
  "Uniforms & equipment",
  "Volunteer coordination",
  "Data entry & records",
] as const;

export const AVAILABILITY_OPTIONS = [
  "Weekday afternoons",
  "Weekday evenings",
  "Saturdays",
  "Sundays",
  "Weekday daytime",
  "Travel for tournaments",
] as const;

export const SAFESPORT_STATUSES = {
  current: "Current",
  expired: "Expired",
  none: "Not yet completed",
} as const;
export type SafeSportStatus = keyof typeof SAFESPORT_STATUSES;

export const HEARD_ABOUT_OPTIONS = [
  "Eagles FC website",
  "Social media",
  "Current coach or staff",
  "Club family / parent",
  "Job board",
  "Other",
] as const;

/**
 * Compliance checks an admin works through before someone is cleared to work
 * with players. Everyone who has regular contact with minors needs SafeSport
 * and a background check; the rest only apply to coaches.
 */
export const COMPLIANCE_ITEMS = {
  safeSportVerified: { label: "SafeSport certificate verified", coachingOnly: false },
  backgroundCheckCleared: { label: "Background check cleared", coachingOnly: false },
  referencesChecked: { label: "References checked", coachingOnly: false },
  licenseVerified: { label: "Coaching license verified", coachingOnly: true },
  cprVerified: { label: "CPR / First Aid verified", coachingOnly: true },
} as const;
export type ComplianceKey = keyof typeof COMPLIANCE_ITEMS;

/** Items that must be done before someone is hired to work with minors. */
export const REQUIRED_BEFORE_HIRE: ComplianceKey[] = ["safeSportVerified", "backgroundCheckCleared"];

export function complianceKeysFor(department: Department | "" | undefined): ComplianceKey[] {
  return (Object.keys(COMPLIANCE_ITEMS) as ComplianceKey[]).filter(
    (key) => department === "coaching" || !COMPLIANCE_ITEMS[key].coachingOnly
  );
}

export const RESUME_MAX_BYTES = 3 * 1024 * 1024; // keeps the request under Vercel's 4.5 MB body cap
export const RESUME_TYPES: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

/** `/careers/apply` is the general-application route, so no job may claim it. */
export const RESERVED_SLUGS = ["apply"];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Today's date in the club's timezone as YYYY-MM-DD, for comparing deadlines. */
export function clubToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(new Date());
}

export function isPastDeadline(deadline: string | undefined | null): boolean {
  return !!deadline && deadline < clubToday();
}

/** Formats a stored YYYY-MM-DD date without shifting it through UTC. */
export function formatDateOnly(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats a stored datetime-local value ("YYYY-MM-DDTHH:mm", club-local wall
 * clock). Parsing a zone-less ISO string yields local time and formatting
 * prints local time, so the wall clock survives on any server timezone.
 */
export function formatWallClock(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Shapes returned by the actions (plain JSON, safe to pass to client components)
// ---------------------------------------------------------------------------

export interface PublicJob {
  _id: string;
  title: string;
  slug: string;
  department: Department;
  employmentType: EmploymentType;
  location: string;
  team: string;
  compensation: string;
  startDate: string;
  applicationDeadline: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  preferred: string[];
  benefits: string[];
  createdAt: string;
}

export interface AdminJob extends PublicJob {
  status: JobStatus;
  updatedAt: string;
  applicantCount: number;
  newApplicantCount: number;
}

export type JobInput = Omit<PublicJob, "_id" | "slug" | "createdAt"> & { status: JobStatus };

export interface ApplicationReference {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface ActivityEntry {
  _id: string;
  kind: "note" | "event" | "email";
  text: string;
  at: string;
}

export interface ApplicationSummary {
  _id: string;
  referenceCode: string;
  jobId: string | null;
  jobTitle: string;
  department: Department;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  yearsExperience: number;
  stage: Stage;
  rating: number;
  compliance: Record<ComplianceKey, boolean>;
  hasResume: boolean;
  createdAt: string;
}

export interface ApplicationDetail extends ApplicationSummary {
  zip: string;
  isAdult: boolean;
  workAuthorized: boolean;
  backgroundCheckAck: boolean;
  safeSportStatus: SafeSportStatus;
  cprCertified: boolean;
  licenses: string[];
  ageGroups: string[];
  playingLevel: string;
  adminSkills: string[];
  software: string;
  availability: string[];
  earliestStart: string;
  languages: string;
  coverLetter: string;
  linkedinUrl: string;
  heardAbout: string;
  references: ApplicationReference[];
  resume: { fileName: string; mimeType: string; size: number } | null;
  interview: { scheduledAt: string; location: string; details: string } | null;
  activity: ActivityEntry[];
  updatedAt: string;
}
