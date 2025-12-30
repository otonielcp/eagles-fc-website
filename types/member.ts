// Basic member information types
export type Gender = "male" | "female" | "other";
export type Relationship = "parent" | "guardian" | "mother" | "father" | "grandparent" | "other";
export type Suffix = "jr" | "sr" | "ii" | "iii" | "iv" | "";
export type UniformSize = "xs" | "s" | "m" | "l" | "xl" | "xxl";
export type YesNoOption = "yes" | "no";
export type Country = "us" | "ca" | "mx" | "other";

// Member form data interface
export interface MemberFormData {
  // Player Info
  firstName: string;
  lastName: string;
  suffix: Suffix;
  dateOfBirth: string;
  gender: Gender;
  
  // Parent/Guardian Info
  parentFirstName: string;
  parentLastName: string;
  parentSuffix: Suffix;
  relationship: Relationship;
  parentGender: Gender;
  country: Country;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  homePhone: string;
  workPhone: string;
  cellPhone: string;
  email: string;
  profilePhoto: File | null;
  birthCertificate: File | null;
  
  // Emergency Contact
  emergencyContact: string;
  emergencyPhone: string;
  doctorContact: string;
  doctorPhone: string;
  
  // Player Details
  birthCountry: Country;
  citizenshipCountry: Country;
  playedOutsideUS: YesNoOption;
  medicalProblems: string;
  specialRequests: string;
  heightFeet: string;
  heightInches: string;
  weight: string;
  priorSeasons: string;
  schoolName: string;
  grade: string;
  playerRank: string;
  uniformShirtSize: UniformSize;
  uniformShortsSize: UniformSize;
  uniformSocksSize: UniformSize;
  
  // Association Additional Info
  associationEmergencyContact: string;
  allergies: string;
  emergencyContactHomePhone1: string;
  emergencyContactHomePhone2: string;
  otherMedicalConditions: string;
  insuranceCompany: string;
  medicalHospitalPhone: string;
  policyHolder: string;
  policyNumber: string;
  groupNumber: string;
}

// Form step options
export type FormStep = "player-info" | "parent-info" | "emergency-contact" | "player-detail" | "association-info";

// Type for API response when creating or fetching a member
export interface MemberResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  data: MemberFormData;
}
