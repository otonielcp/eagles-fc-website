import mongoose, { Schema, Document } from "mongoose";
import { MemberFormData } from "@/types/member";

// Interface for Member document (MongoDB document with the MemberFormData)
export interface IMember
  extends Document,
    Omit<MemberFormData, "profilePhoto" | "birthCertificate"> {
  // File fields need to be stored differently in MongoDB
  profilePhoto?: string; // URL or file path
  birthCertificate?: string; // URL or file path
  createdAt: Date;
  updatedAt: Date;
}

// Define the Member schema
const MemberSchema = new Schema<IMember>(
  {
    // Player Info
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    suffix: {
      type: String,
      enum: ["jr", "sr", "ii", "iii", "iv", ""],
      default: "",
    },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },

    // Parent/Guardian Info
    parentFirstName: { type: String, required: true, trim: true },
    parentLastName: { type: String, required: true, trim: true },
    parentSuffix: {
      type: String,
      enum: ["jr", "sr", "ii", "iii", "iv", ""],
      default: "",
    },
    relationship: {
      type: String,
      enum: ["parent", "guardian", "mother", "father", "grandparent", "other"],
      required: false,
    },
    parentGender: { type: String, enum: ["male", "female", "other"] },
    country: { type: String, enum: ["us", "ca", "mx", "other"] },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    homePhone: { type: String },
    workPhone: { type: String },
    cellPhone: { type: String },
    email: { type: String, required: true, trim: true, lowercase: true },
    profilePhoto: { type: String }, // URL or file path
    birthCertificate: { type: String }, // URL or file path

    // Emergency Contact
    emergencyContact: { type: String, required: true },
    emergencyPhone: { type: String, required: true },
    doctorContact: { type: String },
    doctorPhone: { type: String },

    // Player Details
    birthCountry: { type: String, enum: ["us", "ca", "mx", "other"] },
    citizenshipCountry: { type: String, enum: ["us", "ca", "mx", "other"] },
    playedOutsideUS: { type: String, enum: ["yes", "no"] },
    medicalProblems: { type: String },
    specialRequests: { type: String },
    heightFeet: { type: String },
    heightInches: { type: String },
    weight: { type: String },
    priorSeasons: { type: String },
    schoolName: { type: String },
    grade: { type: String },
    playerRank: { type: String },
    uniformShirtSize: {
      type: String,
      enum: ["xs", "s", "m", "l", "xl", "xxl"],
    },
    uniformShortsSize: {
      type: String,
      enum: ["xs", "s", "m", "l", "xl", "xxl"],
    },
    uniformSocksSize: {
      type: String,
      enum: ["xs", "s", "m", "l", "xl", "xxl"],
    },

    // Association Additional Info
    associationEmergencyContact: { type: String },
    allergies: { type: String },
    emergencyContactHomePhone1: { type: String },
    emergencyContactHomePhone2: { type: String },
    otherMedicalConditions: { type: String },
    insuranceCompany: { type: String },
    medicalHospitalPhone: { type: String },
    policyHolder: { type: String },
    policyNumber: { type: String },
    groupNumber: { type: String },
  },
  { timestamps: true }
);

// Check if model already exists to prevent overwriting during hot reload in development
const Member =
  mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema);

export default Member;
