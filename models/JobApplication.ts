import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplication extends Document {
  referenceCode: string;
  job: mongoose.Types.ObjectId | null; // null = general application
  jobTitle: string; // snapshot, survives the posting being deleted
  department: "coaching" | "administration";

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;

  isAdult: boolean;
  workAuthorized: boolean;
  backgroundCheckAck: boolean;
  safeSportStatus: "current" | "expired" | "none";
  cprCertified: boolean;

  yearsExperience: number;
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
  references: { name: string; relationship: string; phone: string; email: string }[];

  resume: {
    file: mongoose.Types.ObjectId;
    fileName: string;
    mimeType: string;
    size: number;
  } | null;

  stage: "new" | "screening" | "interview" | "offer" | "hired" | "rejected" | "withdrawn";
  rating: number;
  compliance: {
    safeSportVerified: boolean;
    backgroundCheckCleared: boolean;
    referencesChecked: boolean;
    licenseVerified: boolean;
    cprVerified: boolean;
  };
  interview: { scheduledAt: string; location: string; details: string } | null;
  activity: { kind: "note" | "event" | "email"; text: string; at: Date }[];

  createdAt: Date;
  updatedAt: Date;
}

const ReferenceSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    relationship: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
  },
  { _id: false }
);

const ActivitySchema = new Schema({
  kind: { type: String, enum: ["note", "event", "email"], required: true },
  text: { type: String, trim: true, required: true },
  at: { type: Date, default: Date.now },
});

const JobApplicationSchema: Schema = new Schema(
  {
    referenceCode: { type: String, required: true, unique: true },
    job: { type: Schema.Types.ObjectId, ref: "JobPosting", default: null },
    jobTitle: { type: String, trim: true, required: true },
    department: { type: String, enum: ["coaching", "administration"], required: true },

    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, required: true },
    phone: { type: String, trim: true, required: true },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    zip: { type: String, trim: true, default: "" },

    isAdult: { type: Boolean, required: true },
    workAuthorized: { type: Boolean, required: true },
    backgroundCheckAck: { type: Boolean, required: true },
    safeSportStatus: { type: String, enum: ["current", "expired", "none"], default: "none" },
    cprCertified: { type: Boolean, default: false },

    yearsExperience: { type: Number, min: 0, default: 0 },
    licenses: { type: [String], default: [] },
    ageGroups: { type: [String], default: [] },
    playingLevel: { type: String, trim: true, default: "" },
    adminSkills: { type: [String], default: [] },
    software: { type: String, trim: true, default: "" },

    availability: { type: [String], default: [] },
    earliestStart: { type: String, trim: true, default: "" },
    languages: { type: String, trim: true, default: "" },
    coverLetter: { type: String, trim: true, default: "" },
    linkedinUrl: { type: String, trim: true, default: "" },
    heardAbout: { type: String, trim: true, default: "" },
    references: { type: [ReferenceSchema], default: [] },

    resume: {
      type: new Schema(
        {
          file: { type: Schema.Types.ObjectId, ref: "ApplicationFile", required: true },
          fileName: { type: String, required: true },
          mimeType: { type: String, required: true },
          size: { type: Number, required: true },
        },
        { _id: false }
      ),
      default: null,
    },

    stage: {
      type: String,
      enum: ["new", "screening", "interview", "offer", "hired", "rejected", "withdrawn"],
      default: "new",
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    compliance: {
      safeSportVerified: { type: Boolean, default: false },
      backgroundCheckCleared: { type: Boolean, default: false },
      referencesChecked: { type: Boolean, default: false },
      licenseVerified: { type: Boolean, default: false },
      cprVerified: { type: Boolean, default: false },
    },
    interview: {
      type: new Schema(
        {
          scheduledAt: { type: String, required: true }, // datetime-local, club time
          location: { type: String, trim: true, default: "" },
          details: { type: String, trim: true, default: "" },
        },
        { _id: false }
      ),
      default: null,
    },
    activity: { type: [ActivitySchema], default: [] },
  },
  { timestamps: true }
);

JobApplicationSchema.index({ stage: 1, createdAt: -1 });
JobApplicationSchema.index({ job: 1, createdAt: -1 });
JobApplicationSchema.index({ email: 1, job: 1, createdAt: -1 });

export default mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);
