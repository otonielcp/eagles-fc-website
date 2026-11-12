'use server'

import { requireAdmin } from '@/lib/requireAdmin';
import { getMembersPassword, hasMembersSession, startMembersSession } from '@/lib/memberSession';
import { createHash, timingSafeEqual } from 'crypto';

import connectDB from '@/lib/dbConnect';
import Member from '@/models/Member';
import { revalidatePath } from 'next/cache';
import { MemberResponse, MemberFormData } from '@/types/member';
import { v2 as cloudinary } from 'cloudinary';

const MEMBERS_SESSION_EXPIRED = "Your access has expired. Please enter the members password again.";
const MEMBER_FILE_MAX_BYTES = 4.5 * 1024 * 1024;
const MEMBER_FILE_FIELDS = ['profilePhoto', 'birthCertificate'];

function passwordMatches(input: string, expected: string): boolean {
  // Hash both sides so the comparison is constant-time regardless of length.
  const a = createHash('sha256').update(input).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

// Check the members password on the server and start a signed session cookie.
export async function verifyMembersPassword(password: string): Promise<{ success: boolean; message?: string }> {
  const expected = getMembersPassword();
  if (!expected) {
    console.error('[members] MEMBERS_PASSWORD is not set; refusing all access');
    return { success: false, message: "Member registration is unavailable right now" };
  }

  if (typeof password !== 'string' || !passwordMatches(password, expected)) {
    return { success: false, message: "Incorrect password" };
  }

  if (!(await startMembersSession())) {
    return { success: false, message: "Member registration is unavailable right now" };
  }
  return { success: true };
}

// Lets the page restore access after a reload; the cookie itself is httpOnly.
export async function checkMembersAccess(): Promise<boolean> {
  return hasMembersSession();
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all members
export async function getAllMembers(): Promise<MemberResponse[]> {
  await requireAdmin();
  try {
    await connectDB();
    const members = await Member.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(members.map(member => ({
      id: member._id.toString(),
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString(),
      data: member
    }))));
  } catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members");
  }
}

// Get a single member by ID
export async function getMemberById(id: string): Promise<MemberResponse | null> {
  await requireAdmin();
  try {
    await connectDB();
    const member = await Member.findById(id);

    if (!member) {
      return null;
    }

    return {
      id: member._id.toString(),
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString(),
      data: JSON.parse(JSON.stringify(member))
    };
  } catch (error) {
    console.error("Error fetching member by ID:", error);
    return null;
  }
}

// Upload file to Cloudinary (profile photo or birth certificate)
export async function uploadMemberFile(formData: FormData): Promise<{ success: boolean; url?: string; message?: string; unauthorized?: boolean }> {
  if (!(await hasMembersSession())) {
    return { success: false, message: MEMBERS_SESSION_EXPIRED, unauthorized: true };
  }
  try {
    const file = formData.get('file');
    const fileType = formData.get('fileType'); // 'profilePhoto' or 'birthCertificate'

    if (!(file instanceof File) || file.size === 0) {
      return { success: false, message: "No file provided" };
    }

    if (typeof fileType !== 'string' || !MEMBER_FILE_FIELDS.includes(fileType)) {
      return { success: false, message: "Invalid file field" };
    }

    if (!(file.type.startsWith('image/') || file.type === 'application/pdf')) {
      return { success: false, message: "Please upload an image or a PDF" };
    }

    if (file.size > MEMBER_FILE_MAX_BYTES) {
      return { success: false, message: "File must be 4.5 MB or smaller" };
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: `eagles-fc/members/${fileType}`,
      resource_type: 'auto',
    });

    return {
      success: true,
      url: result.secure_url,
    };
  } catch (error: any) {
    console.error("Error uploading member file:", error);
    return {
      success: false,
      message: error.message || "Failed to upload file"
    };
  }
}

// Create a new member
export async function createMember(data: MemberFormData): Promise<{ success: boolean; message: string; member?: MemberResponse; unauthorized?: boolean }> {
  if (!(await hasMembersSession())) {
    return { success: false, message: MEMBERS_SESSION_EXPIRED, unauthorized: true };
  }
  try {
    await connectDB();

    // Convert File objects to URLs if they exist
    const memberData = {
      ...data,
      profilePhoto: typeof data.profilePhoto === 'string' ? data.profilePhoto : undefined, 
      birthCertificate: typeof data.birthCertificate === 'string' ? data.birthCertificate : undefined
    };

    const member = await Member.create(memberData);

    revalidatePath('/admin/members');
    revalidatePath('/members');

    return {
      success: true,
      message: "Member created successfully",
      member: {
        id: member._id.toString(),
        createdAt: member.createdAt.toISOString(),
        updatedAt: member.updatedAt.toISOString(),
        data: JSON.parse(JSON.stringify(member))
      }
    };
  } catch (error: any) {
    console.error("Error creating member:", error);
    return {
      success: false,
      message: error.message || "Failed to create member"
    };
  }
}

// Update a member
export async function updateMember(id: string, data: Partial<MemberFormData>): Promise<{ success: boolean; message: string; member?: MemberResponse }> {
  await requireAdmin();
  try {
    await connectDB();

    // Convert File objects to URLs if they exist
    const memberData = {
      ...data,
      profilePhoto: typeof data.profilePhoto === 'string' ? data.profilePhoto : undefined,
      birthCertificate: typeof data.birthCertificate === 'string' ? data.birthCertificate : undefined
    };

    const member = await Member.findByIdAndUpdate(
      id,
      { ...memberData },
      { new: true, runValidators: true }
    );

    if (!member) {
      return {
        success: false,
        message: "Member not found"
      };
    }

    revalidatePath('/admin/members');
    revalidatePath('/members');
    revalidatePath(`/members/${id}`);

    return {
      success: true,
      message: "Member updated successfully",
      member: {
        id: member._id.toString(),
        createdAt: member.createdAt.toISOString(),
        updatedAt: member.updatedAt.toISOString(),
        data: JSON.parse(JSON.stringify(member))
      }
    };
  } catch (error: any) {
    console.error(`Error updating member with ID ${id}:`, error);
    return {
      success: false,
      message: error.message || `Failed to update member with ID ${id}`
    };
  }
}

// Delete a member
export async function deleteMember(id: string): Promise<{ success: boolean; message: string }> {
  await requireAdmin();
  try {
    await connectDB();

    // Get the member to find file URLs
    const member = await Member.findById(id);

    if (!member) {
      return { success: false, message: "Member not found" };
    }

    // Delete profile photo from Cloudinary if it exists
    if (member.profilePhoto && member.profilePhoto.includes('cloudinary')) {
      try {
        const urlParts = member.profilePhoto.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `eagles-fc/members/profilePhoto/${filenameWithExtension.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting profile photo from Cloudinary:", cloudinaryError);
        // Continue with member deletion even if file deletion fails
      }
    }

    // Delete birth certificate from Cloudinary if it exists
    if (member.birthCertificate && member.birthCertificate.includes('cloudinary')) {
      try {
        const urlParts = member.birthCertificate.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `eagles-fc/members/birthCertificate/${filenameWithExtension.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting birth certificate from Cloudinary:", cloudinaryError);
        // Continue with member deletion even if file deletion fails
      }
    }

    // Delete the member
    await Member.findByIdAndDelete(id);

    revalidatePath('/admin/members');
    revalidatePath('/members');

    return { success: true, message: "Member deleted successfully" };
  } catch (error: any) {
    console.error(`Error deleting member with ID ${id}:`, error);
    return {
      success: false,
      message: error.message || `Failed to delete member with ID ${id}`
    };
  }
}

// Get recent members
export async function getRecentMembers(limit: number = 10): Promise<MemberResponse[]> {
  await requireAdmin();
  try {
    await connectDB();
    const members = await Member.find({})
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return JSON.parse(JSON.stringify(members.map(member => ({
      id: member._id.toString(),
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString(),
      data: member
    }))));
  } catch (error) {
    console.error("Error fetching recent members:", error);
    return [];
  }
}
