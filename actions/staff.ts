'use server'

import connectDB from '@/lib/dbConnect';
import Staff from '@/models/Staff';
import { revalidatePath } from 'next/cache';
import { Staff as StaffType, StaffFormData } from '@/types/team';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all staff members
export async function getAllStaff(): Promise<StaffType[]> {
    try {
        await connectDB();
        const staff = await Staff.find({}).sort({ order: 1, lastName: 1, firstName: 1 }).populate('teamId');
        return JSON.parse(JSON.stringify(staff));
    } catch (error) {
        console.error("Error fetching staff:", error);
        throw new Error("Failed to fetch staff");
    }
}

// Get active coaching staff
export async function getActiveCoaches(): Promise<StaffType[]> {
    try {
        await connectDB();
        const coaches = await Staff.find({
            isActive: true,
            role: { $in: ['Head Coach', 'Assistant Coach', 'Goalkeeper Coach', 'Fitness Coach'] }
        }).sort({ order: 1, lastName: 1, firstName: 1 }).populate('teamId');
        return JSON.parse(JSON.stringify(coaches));
    } catch (error) {
        console.error("Error fetching coaches:", error);
        throw new Error("Failed to fetch coaches");
    }
}

// Get staff by team ID
export async function getStaffByTeamId(teamId: string): Promise<StaffType[]> {
    try {
        await connectDB();
        const staff = await Staff.find({ teamId }).sort({ order: 1, lastName: 1, firstName: 1 });
        return JSON.parse(JSON.stringify(staff));
    } catch (error) {
        console.error("Error fetching staff by team ID:", error);
        throw new Error("Failed to fetch staff");
    }
}

// Get staff member by ID
export async function getStaffById(id: string): Promise<StaffType | null> {
    try {
        await connectDB();
        const staffMember = await Staff.findById(id).populate('teamId');
        if (!staffMember) return null;
        return JSON.parse(JSON.stringify(staffMember));
    } catch (error) {
        console.error("Error fetching staff member:", error);
        throw new Error("Failed to fetch staff member");
    }
}

// Upload staff image to Cloudinary
export async function uploadStaffImage(image: File): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
        // Read the file as an ArrayBuffer
        const bytes = await image.arrayBuffer();
        // Convert to Buffer for Cloudinary
        const buffer = Buffer.from(bytes);
        
        // Upload the buffer to Cloudinary
        const result = await cloudinary.uploader.upload(
            "data:image/jpeg;base64," + buffer.toString('base64'), 
            {
                folder: 'staff',
                resource_type: 'image',
                transformation: [{ width: 300, height: 300, crop: 'fill' }]
            }
        );
        
        return { 
            success: true, 
            url: result.secure_url 
        };
    } catch (error) {
        console.error("Error uploading staff image:", error);
        return { 
            success: false, 
            message: "Failed to upload staff image" 
        };
    }
}

// Create a new staff member
export async function createStaff(formData: StaffFormData): Promise<{ success: boolean; message: string; data?: StaffType }> {
    try {
        await connectDB();
        const { firstName, lastName, displayName, role, dateOfBirth, nationality, biography, image, teamId, isActive, order, socialMedia } = formData;

        // Create new staff member
        const staff = await Staff.create({
            firstName,
            lastName,
            displayName,
            role,
            dateOfBirth,
            nationality,
            biography,
            image,
            teamId,
            isActive,
            order,
            socialMedia
        });

        revalidatePath('/admin/coaches');
        return { 
            success: true, 
            message: "Staff member created successfully",
            data: JSON.parse(JSON.stringify(staff))
        };
    } catch (error) {
        console.error("Error creating staff member:", error);
        return { 
            success: false, 
            message: "Failed to create staff member" 
        };
    }
}

// Add the missing updateStaff function
export async function updateStaff(id: string, formData: StaffFormData): Promise<{ success: boolean; message: string; data?: StaffType }> {
    try {
        await connectDB();
        
        const staff = await Staff.findByIdAndUpdate(
            id,
            { ...formData },
            { new: true }
        );
        
        if (!staff) {
            return { 
                success: false, 
                message: "Staff member not found" 
            };
        }
        
        revalidatePath('/admin/coaches');
        return { 
            success: true, 
            message: "Staff member updated successfully",
            data: JSON.parse(JSON.stringify(staff))
        };
    } catch (error) {
        console.error("Error updating staff member:", error);
        return { 
            success: false, 
            message: "Failed to update staff member" 
        };
    }
}

// Delete staff member
export async function deleteStaff(id: string): Promise<void> {
    try {
        await connectDB();

        const staff = await Staff.findByIdAndDelete(id);
        if (!staff) throw new Error("Staff member not found");

        revalidatePath('/admin/coaches');
    } catch (error) {
        console.error("Error deleting staff member:", error);
        throw new Error("Failed to delete staff member");
    }
}
