'use server'

import { revalidatePath } from 'next/cache';
import Ticket, { ITicket } from '@/models/Ticket';
import connectDB from '@/lib/dbConnect';
import mongoose from 'mongoose';
import { Ticket as TicketType, TicketFormData, TicketResponse } from '@/types/ticket';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Create a new ticket
 */
export async function createTicket(ticketData: TicketFormData): Promise<TicketResponse> {
  try {
    await connectDB();
    
    const ticket = await Ticket.create(ticketData);
    
    revalidatePath('/admin/tickets');
    revalidatePath('/tickets');
    
    return { success: true, ticket: JSON.parse(JSON.stringify(ticket)) };
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create ticket' 
    };
  }
}

/**
 * Get all tickets
 */
export async function getTickets(): Promise<TicketType[]> {
  try {
    await connectDB();
    
    const tickets = await Ticket.find()
      .sort({ date: 1 })
      .populate('teamId', 'name shortName image')
    
    return JSON.parse(JSON.stringify(tickets));
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    throw new Error(error.message || 'Failed to fetch tickets');
  }
}

/**
 * Get tickets for a specific team
 */
export async function getTeamTickets(teamId: string): Promise<TicketType[]> {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      throw new Error('Invalid team ID');
    }
    
    const tickets = await Ticket.find({ teamId })
      .sort({ date: 1 })
      .lean();
    
    return JSON.parse(JSON.stringify(tickets));
  } catch (error: any) {
    console.error('Error fetching team tickets:', error);
    throw new Error(error.message || 'Failed to fetch team tickets');
  }
}

/**
 * Get a specific ticket by ID
 */
export async function getTicket(ticketId: string): Promise<TicketType> {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new Error('Invalid ticket ID');
    }
    
    const ticket = await Ticket.findById(ticketId)
      .populate('teamId', 'name shortName image')
      .lean();
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    return JSON.parse(JSON.stringify(ticket));
  } catch (error: any) {
    console.error('Error fetching ticket:', error);
    throw new Error(error.message || 'Failed to fetch ticket');
  }
}

/**
 * Update a ticket
 */
export async function updateTicket(ticketId: string, ticketData: TicketFormData): Promise<TicketResponse> {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new Error('Invalid ticket ID');
    }
    
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      ticketData,
      { new: true, runValidators: true }
    );

    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    revalidatePath('/admin/tickets');
    revalidatePath('/tickets');
    
    return { success: true, ticket: JSON.parse(JSON.stringify(ticket)) };
  } catch (error: any) {
    console.error('Error updating ticket:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update ticket' 
    };
  }
}

/**
 * Delete a ticket
 */
export async function deleteTicket(ticketId: string): Promise<TicketResponse> {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new Error('Invalid ticket ID');
    }
    
    const ticket = await Ticket.findByIdAndDelete(ticketId);
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    revalidatePath('/admin/tickets');
    revalidatePath('/tickets');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting ticket:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete ticket' 
    };
  }
}

/**
 * Upload opponent image to Cloudinary
 */
export async function uploadOpponentImage(formData: FormData): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    const file = formData.get('file') as File;

    if (!file) {
      return { success: false, message: "No file provided" };
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'eagles-fc/opponents',
      resource_type: 'auto',
    });

    return {
      success: true,
      url: result.secure_url,
    };
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      message: error.message || "Failed to upload image"
    };
  }
} 