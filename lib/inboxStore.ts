// Saves public form submissions to the admin inbox.
//
// These used to be exported from 'use server' files (actions/formSubmission.ts
// and actions/partnershipInquiry.ts), which made them public endpoints: a bot
// could write to the inbox directly, skipping the human check in
// actions/contact.ts. This module has no 'use server' directive, so it can only
// be called from server code.
import connectDB from '@/lib/dbConnect';
import FormSubmission from '@/models/FormSubmission';
import PartnershipInquiry from '@/models/PartnershipInquiry';
import { revalidatePath } from 'next/cache';

export type FormSubmissionInput = {
  type: 'contact' | 'registration' | 'operations' | 'marketing' | 'media';
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  data?: Record<string, unknown>;
};

export type PartnershipInquiryInput = {
  firstName: string;
  lastName?: string;
  title?: string;
  businessName: string;
  businessWebsite?: string;
  email: string;
  phone: string;
  description?: string;
};

export async function saveFormSubmission(data: FormSubmissionInput) {
  try {
    await connectDB();
    const doc = await FormSubmission.create(data);
    revalidatePath('/admin/inbox');
    return { success: true, id: doc._id.toString() };
  } catch (error: any) {
    console.error('[FormSubmission] Failed to save:', error?.message || error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

export async function savePartnershipInquiry(data: PartnershipInquiryInput) {
  try {
    await connectDB();
    const inquiry = await PartnershipInquiry.create({
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      businessName: data.businessName,
      businessWebsite: data.businessWebsite,
      email: data.email,
      phone: data.phone,
      description: data.description,
    });
    revalidatePath('/admin/partnerships');
    revalidatePath('/admin/inbox');
    return { success: true, id: inquiry._id.toString() };
  } catch (error: any) {
    console.error('[PartnershipInquiry] Failed to save:', error?.message || error);
    return { success: false, message: 'Failed to save inquiry' };
  }
}
