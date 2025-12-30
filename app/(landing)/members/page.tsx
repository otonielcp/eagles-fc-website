"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";
import { createMember, uploadMemberFile } from "@/actions/member";
import { MemberFormData } from "@/types/member";

type FormStep = "player-info" | "parent-info" | "emergency-contact" | "player-detail" | "association-info";

export default function AddMemberPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>("player-info");
  const [submitting, setSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  // Check for stored authentication
  useEffect(() => {
    const storedAuth = localStorage.getItem("members_auth");
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        // Only trust auth data that's less than 24 hours old
        if (authData.timestamp && (Date.now() - authData.timestamp < 24 * 60 * 60 * 1000)) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("members_auth");
        }
      } catch (e) {
        localStorage.removeItem("members_auth");
      }
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasAttempted(true);

    // Small delay to simulate verification
    setTimeout(() => {
      const correctPassword = process.env.NEXT_PUBLIC_MEMBERS_PASSWORD;

      if (password === correctPassword) {
        setIsAuthenticated(true);
        // Store authentication in localStorage
        localStorage.setItem("members_auth", JSON.stringify({
          authenticated: true,
          timestamp: Date.now()
        }));
        toast.success("Access granted");
      } else {
        toast.error("Incorrect password");
      }
      setIsLoading(false);
    }, 500);
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    suffix: "",
    dateOfBirth: "",
    gender: "",
    parentFirstName: "Jorge",
    parentLastName: "Gonzalez",
    parentSuffix: "",
    relationship: "",
    parentGender: "",
    country: "",
    address: "",
    city: "",
    state: "Nebraska",
    zipCode: "",
    homePhone: "",
    workPhone: "",
    cellPhone: "",
    email: "",
    profilePhoto: null,
    birthCertificate: null,
    emergencyContact: "Tania Zelaya",
    emergencyPhone: "7738150338",
    doctorContact: "",
    doctorPhone: "",
    birthCountry: "",
    citizenshipCountry: "",
    playedOutsideUS: "",
    medicalProblems: "",
    specialRequests: "",
    heightFeet: "",
    heightInches: "",
    weight: "",
    priorSeasons: "",
    schoolName: "",
    grade: "",
    playerRank: "",
    uniformShirtSize: "",
    uniformShortsSize: "",
    uniformSocksSize: "",
    associationEmergencyContact: "",
    allergies: "",
    emergencyContactHomePhone1: "",
    emergencyContactHomePhone2: "",
    otherMedicalConditions: "",
    insuranceCompany: "",
    medicalHospitalPhone: "",
    policyHolder: "",
    policyNumber: "",
    groupNumber: ""
  });

  // Store initial form data for reset
  const initialFormData = {
    firstName: "",
    lastName: "",
    suffix: "",
    dateOfBirth: "",
    gender: "",
    parentFirstName: "Jorge",
    parentLastName: "Gonzalez",
    parentSuffix: "",
    relationship: "",
    parentGender: "",
    country: "",
    address: "",
    city: "",
    state: "Nebraska",
    zipCode: "",
    homePhone: "",
    workPhone: "",
    cellPhone: "",
    email: "",
    profilePhoto: null,
    birthCertificate: null,
    emergencyContact: "Tania Zelaya",
    emergencyPhone: "7738150338",
    doctorContact: "",
    doctorPhone: "",
    birthCountry: "",
    citizenshipCountry: "",
    playedOutsideUS: "",
    medicalProblems: "",
    specialRequests: "",
    heightFeet: "",
    heightInches: "",
    weight: "",
    priorSeasons: "",
    schoolName: "",
    grade: "",
    playerRank: "",
    uniformShirtSize: "",
    uniformShortsSize: "",
    uniformSocksSize: "",
    associationEmergencyContact: "",
    allergies: "",
    emergencyContactHomePhone1: "",
    emergencyContactHomePhone2: "",
    otherMedicalConditions: "",
    insuranceCompany: "",
    medicalHospitalPhone: "",
    policyHolder: "",
    policyNumber: "",
    groupNumber: ""
  };

  // Function to reset form to initial state
  const resetForm = () => {
    setFormData(initialFormData);
    setUploadedFiles({
      profilePhoto: '',
      birthCertificate: ''
    });
    setCurrentStep("player-info");
  };

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleBack = () => {
    if (currentStep === "parent-info") {
      setCurrentStep("player-info");
    } else if (currentStep === "emergency-contact") {
      setCurrentStep("parent-info");
    } else if (currentStep === "player-detail") {
      setCurrentStep("emergency-contact");
    } else if (currentStep === "association-info") {
      setCurrentStep("player-detail");
    }
  };

  const handleNext = () => {
    if (currentStep === "player-info") {
      if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.gender) {
        toast.error("Please fill in all required fields");
        return;
      }
      setCurrentStep("parent-info");
    } else if (currentStep === "parent-info") {
      if (!formData.parentFirstName || !formData.parentLastName || !formData.address) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (!formData.homePhone && !formData.workPhone && !formData.cellPhone) {
        toast.error("Please provide at least one phone number");
        return;
      }
      setCurrentStep("emergency-contact");
    } else if (currentStep === "emergency-contact") {
      if (!formData.emergencyContact || !formData.emergencyPhone) {
        toast.error("Please provide emergency contact information");
        return;
      }
      setCurrentStep("player-detail");
    } else if (currentStep === "player-detail") {
      setCurrentStep("association-info");
    }
  };

  // Add state to track file upload progress
  const [isUploading, setIsUploading] = useState({
    profilePhoto: false,
    birthCertificate: false
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    profilePhoto: '',
    birthCertificate: ''
  });

  const handleFileChange = async (field: string, files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];

      // Update form data with the file object temporarily
      setFormData({
        ...formData,
        [field]: file
      });

      // Set uploading state
      setIsUploading(prev => ({ ...prev, [field]: true }));

      try {
        // Create form data for upload
        const fileFormData = new FormData();
        fileFormData.append('file', file);
        fileFormData.append('fileType', field);

        // Upload the file
        const response = await uploadMemberFile(fileFormData);

        if (response.success && response.url) {
          // Update the uploaded files state
          setUploadedFiles(prev => ({ ...prev, [field]: response.url as string }));
          // Update form data with the URL
          setFormData(prev => ({ ...prev, [field]: response.url }));
          toast.success(`${field === 'profilePhoto' ? 'Profile photo' : 'Birth certificate'} uploaded successfully`);
        } else {
          toast.error(response.message || `Failed to upload ${field}`);
        }
      } catch (error: any) {
        console.error(`Error uploading ${field}:`, error);
        toast.error(`Failed to upload ${field}: ${error.message || 'Unknown error'}`);
      } finally {
        setIsUploading(prev => ({ ...prev, [field]: false }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare the data for submission
      const memberData = {
        ...formData,
        // Use the uploaded file URLs instead of File objects
        profilePhoto: uploadedFiles.profilePhoto || formData.profilePhoto,
        birthCertificate: uploadedFiles.birthCertificate || formData.birthCertificate
      };

      // Call the createMember server action
      const response = await createMember(memberData as MemberFormData);

      if (response.success) {
        toast.success(response.message || "Member created successfully");
        // Reset form after successful creation
        resetForm();
        setTimeout(() => {
          router.push("/members");
        }, 1500);
      } else {
        toast.error(response.message || "Failed to create member");
      }
    } catch (error: any) {
      console.error("Error creating member:", error);
      toast.error(error.message || "Failed to create member");
    } finally {
      setSubmitting(false);
    }
  };

  // Show password protection screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-[#BD9B58]/20 rounded-full">
                <Lock className="w-10 h-10 text-[#BD9B58]" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Protected Area</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter the password to access the member registration form
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#BD9B58] focus:border-[#BD9B58]"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {hasAttempted && !isAuthenticated && (
                <p className="mt-2 text-sm text-red-600">
                  Incorrect password. Please try again.
                </p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#C5A464] hover:bg-[#B39355] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C5A464]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                Access Form
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Render the main form if authenticated
  return (
    <div className="p-6">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Create New Member Account</h1>
          <div className="flex space-x-4">
            <Button
              onClick={handleBack}
              variant="outline"
              className="px-6 flex items-center"
              disabled={currentStep === "player-info" || submitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={currentStep === "association-info" ? handleSubmit : handleNext}
              className="bg-[#C5A464] hover:bg-[#B39355] px-6"
              disabled={submitting}
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              Save & Next {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Form Steps Sidebar */}
            <div className="md:w-1/4">
              <nav className="space-y-3">
                <StepButton
                  isActive={currentStep === "player-info"}
                  isCompleted={currentStep !== "player-info"}
                  onClick={() => setCurrentStep("player-info")}
                  label="Player Info"
                />
                <StepButton
                  isActive={currentStep === "parent-info"}
                  isCompleted={["emergency-contact", "player-detail", "association-info"].includes(currentStep)}
                  onClick={() => currentStep !== "player-info" && setCurrentStep("parent-info")}
                  label="Parent Info"
                  disabled={currentStep === "player-info"}
                />
                <StepButton
                  isActive={currentStep === "emergency-contact"}
                  isCompleted={["player-detail", "association-info"].includes(currentStep)}
                  onClick={() => ["emergency-contact", "player-detail", "association-info"].includes(currentStep) && setCurrentStep("emergency-contact")}
                  label="Emergency Contact"
                  disabled={["player-info", "parent-info"].includes(currentStep)}
                />
                <StepButton
                  isActive={currentStep === "player-detail"}
                  isCompleted={currentStep === "association-info"}
                  onClick={() => ["player-detail", "association-info"].includes(currentStep) && setCurrentStep("player-detail")}
                  label="Player Detail Info"
                  disabled={["player-info", "parent-info", "emergency-contact"].includes(currentStep)}
                />
                <StepButton
                  isActive={currentStep === "association-info"}
                  isCompleted={false}
                  onClick={() => currentStep === "association-info" && setCurrentStep("association-info")}
                  label="Association Additional Info"
                  disabled={["player-info", "parent-info", "emergency-contact", "player-detail"].includes(currentStep)}
                />
              </nav>
            </div>

            {/* Form Content */}
            <div className="md:w-3/4">
              {currentStep === "player-info" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-medium">Player Information</h2>

                  {/* Player Legal First Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Player Legal First Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        required
                      />
                    </div>

                    {/* Legal Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Legal Last Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Suffix and DOB */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Suffix
                      </label>
                      <Select
                        value={formData.suffix}
                        onValueChange={(value) => handleChange("suffix", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jr">Jr.</SelectItem>
                          <SelectItem value="sr">Sr.</SelectItem>
                          <SelectItem value="ii">II</SelectItem>
                          <SelectItem value="iii">III</SelectItem>
                          <SelectItem value="iv">IV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        DOB (mm/dd/yyyy) <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        placeholder="MM/DD/YYYY"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleChange("gender", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "parent-info" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-medium">Parent Information</h2>

                  {/* Player First Name & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Player First Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="First name"
                        value={formData.parentFirstName}
                        onChange={(e) => handleChange("parentFirstName", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Last name"
                        value={formData.parentLastName}
                        onChange={(e) => handleChange("parentLastName", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Suffix
                      </label>
                      <Select
                        value={formData.parentSuffix}
                        onValueChange={(value) => handleChange("parentSuffix", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jr">Jr.</SelectItem>
                          <SelectItem value="sr">Sr.</SelectItem>
                          <SelectItem value="ii">II</SelectItem>
                          <SelectItem value="iii">III</SelectItem>
                          <SelectItem value="iv">IV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Relationship to Player & Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship To Player <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.relationship}
                        onValueChange={(value) => handleChange("relationship", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                          <SelectItem value="mother">Mother</SelectItem>
                          <SelectItem value="father">Father</SelectItem>
                          <SelectItem value="grandparent">Grandparent</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.parentGender}
                        onValueChange={(value) => handleChange("parentGender", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Country & Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => handleChange("country", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="mx">Mexico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Street address"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => handleChange("state", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nebraska">Nebraska</SelectItem>
                          <SelectItem value="Iowa">Iowa</SelectItem>
                          <SelectItem value="Kansas">Kansas</SelectItem>
                          <SelectItem value="Missouri">Missouri</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zip code <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Zip code"
                        value={formData.zipCode}
                        onChange={(e) => handleChange("zipCode", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Home Phone Number <span className="text-red-400">**</span>
                      </label>
                      <Input
                        placeholder="Home phone"
                        value={formData.homePhone}
                        onChange={(e) => handleChange("homePhone", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Phone Number <span className="text-red-400">**</span>
                      </label>
                      <Input
                        placeholder="Work phone"
                        value={formData.workPhone}
                        onChange={(e) => handleChange("workPhone", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Cell Phone & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cell Phone Number <span className="text-red-400">**</span>
                      </label>
                      <Input
                        placeholder="Cell phone"
                        value={formData.cellPhone}
                        onChange={(e) => handleChange("cellPhone", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="text-right text-sm text-gray-500">
                    <p><span className="text-red-500">*</span> = Required.</p>
                    <p><span className="text-red-400">**</span> = Fill Out At least One.</p>
                  </div>

                  {/* File Upload Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-2">
                        {uploadedFiles.profilePhoto ? (
                          <img
                            src={uploadedFiles.profilePhoto}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 text-center mb-1">Drag your Image here,</p>
                      <p className="text-sm text-[#BD9B58] text-center mb-2">or Browse</p>
                      <p className="text-xs text-gray-400">Support: JPG, JPG2000, PNG</p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        id="profilePhoto"
                        onChange={(e) => handleFileChange('profilePhoto', e.target.files)}
                        disabled={isUploading.profilePhoto}
                      />
                      <label htmlFor="profilePhoto" className="mt-4 cursor-pointer">
                        {isUploading.profilePhoto ? (
                          <span className="text-sm font-medium text-gray-500 flex items-center">
                            <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                            Uploading...
                          </span>
                        ) : uploadedFiles.profilePhoto ? (
                          <span className="text-sm font-medium text-green-600 flex items-center">
                            <Check className="w-4 h-4 mr-1" /> Uploaded
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-gray-700">Upload Profile Photo</span>
                        )}
                      </label>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-2">
                        {uploadedFiles.birthCertificate ? (
                          <img
                            src={uploadedFiles.birthCertificate}
                            alt="Birth Certificate"
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 text-center mb-1">Drag your Image here,</p>
                      <p className="text-sm text-[#BD9B58] text-center mb-2">or Browse</p>
                      <p className="text-xs text-gray-400">Support: JPG, JPG2000, PNG</p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        id="birthCertificate"
                        onChange={(e) => handleFileChange('birthCertificate', e.target.files)}
                        disabled={isUploading.birthCertificate}
                      />
                      <label htmlFor="birthCertificate" className="mt-4 cursor-pointer">
                        {isUploading.birthCertificate ? (
                          <span className="text-sm font-medium text-gray-500 flex items-center">
                            <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                            Uploading...
                          </span>
                        ) : uploadedFiles.birthCertificate ? (
                          <span className="text-sm font-medium text-green-600 flex items-center">
                            <Check className="w-4 h-4 mr-1" /> Uploaded
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-gray-700">Upload Birth Certificate</span>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "emergency-contact" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-medium">Emergency Contact Information</h2>

                  {/* Person to Notify in Emergency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Person to Notify in Emergency
                      </label>
                      <Input
                        placeholder="Full name"
                        value={formData.emergencyContact}
                        onChange={(e) => handleChange("emergencyContact", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telephone
                      </label>
                      <Input
                        placeholder="Phone number"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Doctor to Notify in Emergency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Doctor to Notify in Emergency
                      </label>
                      <Input
                        placeholder="Doctor's name"
                        value={formData.doctorContact}
                        onChange={(e) => handleChange("doctorContact", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telephone
                      </label>
                      <Input
                        placeholder="Phone number"
                        value={formData.doctorPhone}
                        onChange={(e) => handleChange("doctorPhone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "player-detail" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-medium">Player Detail Information</h2>

                  {/* Country of Birth, Citizenship, and Outside US */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country of Birth
                      </label>
                      <Select
                        value={formData.birthCountry}
                        onValueChange={(value) => handleChange("birthCountry", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="mx">Mexico</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country of Citizenship
                      </label>
                      <Select
                        value={formData.citizenshipCountry}
                        onValueChange={(value) => handleChange("citizenshipCountry", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="mx">Mexico</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Has this player played outside of the U.S.?
                      </label>
                      <Select
                        value={formData.playedOutsideUS}
                        onValueChange={(value) => handleChange("playedOutsideUS", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Medical problems and Special requests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        List any medical problem/ prohibition player has
                      </label>
                      <Textarea
                        placeholder="Enter medical information"
                        rows={4}
                        value={formData.medicalProblems}
                        onChange={(e) => handleChange("medicalProblems", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special request / Additional info?
                      </label>
                      <Textarea
                        placeholder="Enter special requests or information"
                        rows={4}
                        value={formData.specialRequests}
                        onChange={(e) => handleChange("specialRequests", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Height, Weight, Prior Seasons */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            placeholder=""
                            value={formData.heightFeet}
                            onChange={(e) => handleChange("heightFeet", e.target.value)}
                          />
                        </div>
                        <span>ft.</span>
                        <div className="flex-1">
                          <Input
                            placeholder=""
                            value={formData.heightInches}
                            onChange={(e) => handleChange("heightInches", e.target.value)}
                          />
                        </div>
                        <span>in.</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            placeholder=""
                            value={formData.weight}
                            onChange={(e) => handleChange("weight", e.target.value)}
                          />
                        </div>
                        <span>lbs.</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Prior Season Played
                      </label>
                      <Input
                        placeholder=""
                        value={formData.priorSeasons}
                        onChange={(e) => handleChange("priorSeasons", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* School Name, Grade, Player Rank */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        School Name
                      </label>
                      <Input
                        placeholder=""
                        value={formData.schoolName}
                        onChange={(e) => handleChange("schoolName", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grade
                      </label>
                      <Input
                        placeholder=""
                        value={formData.grade}
                        onChange={(e) => handleChange("grade", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Player Rank
                      </label>
                      <Input
                        placeholder=""
                        value={formData.playerRank}
                        onChange={(e) => handleChange("playerRank", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Uniform Sizes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Uniform Size: Shirt
                      </label>
                      <Select
                        value={formData.uniformShirtSize}
                        onValueChange={(value) => handleChange("uniformShirtSize", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xs">XS</SelectItem>
                          <SelectItem value="s">S</SelectItem>
                          <SelectItem value="m">M</SelectItem>
                          <SelectItem value="l">L</SelectItem>
                          <SelectItem value="xl">XL</SelectItem>
                          <SelectItem value="xxl">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Uniform Size: Shorts
                      </label>
                      <Select
                        value={formData.uniformShortsSize}
                        onValueChange={(value) => handleChange("uniformShortsSize", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xs">XS</SelectItem>
                          <SelectItem value="s">S</SelectItem>
                          <SelectItem value="m">M</SelectItem>
                          <SelectItem value="l">L</SelectItem>
                          <SelectItem value="xl">XL</SelectItem>
                          <SelectItem value="xxl">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Uniform Size: Socks
                      </label>
                      <Select
                        value={formData.uniformSocksSize}
                        onValueChange={(value) => handleChange("uniformSocksSize", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xs">XS</SelectItem>
                          <SelectItem value="s">S</SelectItem>
                          <SelectItem value="m">M</SelectItem>
                          <SelectItem value="l">L</SelectItem>
                          <SelectItem value="xl">XL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "association-info" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-medium">Association Additional Information</h2>

                  {/* Emergency Contact & Allergies */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        1. Emergency Contact
                      </label>
                      <Input
                        placeholder=""
                        value={formData.associationEmergencyContact}
                        onChange={(e) => handleChange("associationEmergencyContact", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        2. Any Allergies
                      </label>
                      <Input
                        placeholder=""
                        value={formData.allergies}
                        onChange={(e) => handleChange("allergies", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Emergency Contact Home Phones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        3. Emergency Contact Home Phone
                      </label>
                      <Input
                        placeholder=""
                        value={formData.emergencyContactHomePhone1}
                        onChange={(e) => handleChange("emergencyContactHomePhone1", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        4. Emergency Contact Home Phone
                      </label>
                      <Input
                        placeholder=""
                        value={formData.emergencyContactHomePhone2}
                        onChange={(e) => handleChange("emergencyContactHomePhone2", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Other Medical Conditions & Insurance Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        5. Other Medical Conditions
                      </label>
                      <Input
                        placeholder=""
                        value={formData.otherMedicalConditions}
                        onChange={(e) => handleChange("otherMedicalConditions", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        6. Medical and/or hospital insurance company
                      </label>
                      <Input
                        placeholder=""
                        value={formData.insuranceCompany}
                        onChange={(e) => handleChange("insuranceCompany", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Medical Hospital Phone & Policy Holder */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        7. Medical Hospital phone Number
                      </label>
                      <Input
                        placeholder=""
                        value={formData.medicalHospitalPhone}
                        onChange={(e) => handleChange("medicalHospitalPhone", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        8. Policy Holder
                      </label>
                      <Input
                        placeholder=""
                        value={formData.policyHolder}
                        onChange={(e) => handleChange("policyHolder", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Policy Number & Group # */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        9. Policy Number
                      </label>
                      <Input
                        placeholder=""
                        value={formData.policyNumber}
                        onChange={(e) => handleChange("policyNumber", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        10. Group #
                      </label>
                      <Input
                        placeholder=""
                        value={formData.groupNumber}
                        onChange={(e) => handleChange("groupNumber", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StepButtonProps {
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

function StepButton({ isActive, isCompleted, onClick, label, disabled = false }: StepButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center w-full p-3 rounded-md transition ${isActive
          ? "bg-[#e6d7b7] text-gray-800"
          : isCompleted
            ? "bg-gray-100 text-gray-800"
            : "bg-gray-100 text-gray-400"
        } ${!disabled && "hover:bg-[#e6d7b7]"}`}
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${isActive
          ? "bg-[#C5A464] text-white"
          : isCompleted
            ? "bg-green-500 text-white"
            : "bg-gray-300 text-white"
        }`}>
        {isCompleted ? <Check className="w-4 h-4" /> : null}
      </div>
      <span>{label}</span>
    </button>
  );
} 