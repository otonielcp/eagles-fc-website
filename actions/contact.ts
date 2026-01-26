"use server";

import { log } from 'console';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface PlayerRegistrationData {
  // Player Information
  playerFirstName: string;
  playerLastName: string;
  playerSuffix?: string;
  playerGender: string;
  playerBirthday: string;
  position: string;
  currentClub?: string;
  teamName?: string;
  yearsPlaying?: string;
  soccerExperience?: string;
  
  // Parent/Guardian Information
  parentFirstName: string;
  parentLastName: string;
  parentSuffix?: string;
  parentEmail: string;
  parentPhone: string;
  
  // Address Information
  street: string;
  city: string;
  state: string;
  zipcode: string;
}

interface PartnershipFormData {
  firstName: string;
  lastName: string;
  title?: string;
  businessName: string;
  businessWebsite?: string;
  email: string;
  phone: string;
  description?: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
}

// Create transporter function to avoid repetition
async function createTransporter() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify connection configuration
  await transporter.verify();
  return transporter;
}

export async function sendContactEmail(formData: ContactFormData): Promise<ContactResponse> {
  try {
    const { name, email, phone, subject, message } = formData;
    log(1, process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER, process.env.SMTP_PASS);

    const transporter = await createTransporter();
    console.log(process.env.SMTP_USER, process.env.SMTP_TO);
    
    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to:  process.env.SMTP_TO, // Send to the same email
      subject: `New Contact Form Submission: ${subject} - Eagles FC`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #BD9B58; border-bottom: 2px solid #BD9B58; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <div style="background: white; padding: 15px; border-left: 4px solid #BD9B58; border-radius: 0 5px 5px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            <em>Sent from Eagles FC Website - ${new Date().toLocaleString()}</em>
          </p>
        </div>
      `,
      text: `
        New Contact Form Submission - Eagles FC
        
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        
        Message:
        ${message}
        
        ---
        Sent from Eagles Nebraska FC Website
        ${new Date().toLocaleString()}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Your message has been sent successfully!'
    };

  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email. Please try again later.'
    };
  }
}

export async function sendPlayerRegistrationEmail(formData: PlayerRegistrationData): Promise<ContactResponse> {
  try {
    const transporter = await createTransporter();
    
    // Email content for player registration
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_TO, // Send to the same email
      subject: 'New Player Registration - Eagles Nebraska FC',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <h2 style="color: #C6A76D; border-bottom: 2px solid #C6A76D; padding-bottom: 10px;">
            New Player Registration
          </h2>
          
          <!-- Player Information -->
          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #C6A76D; margin-top: 0;">Player Information</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <p><strong>Name:</strong> ${formData.playerFirstName} ${formData.playerLastName} ${formData.playerSuffix || ''}</p>
              <p><strong>Gender:</strong> ${formData.playerGender}</p>
              <p><strong>Birthday:</strong> ${formData.playerBirthday}</p>
              <p><strong>Position:</strong> ${formData.position}</p>
              ${formData.currentClub ? `<p><strong>Current Club:</strong> ${formData.currentClub}</p>` : ''}
              ${formData.teamName ? `<p><strong>Team Name:</strong> ${formData.teamName}</p>` : ''}
              ${formData.yearsPlaying ? `<p><strong>Years Playing:</strong> ${formData.yearsPlaying}</p>` : ''}
            </div>
            ${formData.soccerExperience ? `<p><strong>Soccer Experience:</strong> ${formData.soccerExperience}</p>` : ''}
          </div>
          
          <!-- Parent/Guardian Information -->
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #C6A76D; margin-top: 0;">Parent/Guardian Information</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <p><strong>Name:</strong> ${formData.parentFirstName} ${formData.parentLastName} ${formData.parentSuffix || ''}</p>
              <p><strong>Email:</strong> ${formData.parentEmail}</p>
              <p><strong>Phone:</strong> ${formData.parentPhone}</p>
            </div>
          </div>
          
          <!-- Address Information -->
          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #C6A76D; margin-top: 0;">Address</h3>
            <p><strong>Street:</strong> ${formData.street}</p>
            <p><strong>City:</strong> ${formData.city}</p>
            <p><strong>State:</strong> ${formData.state}</p>
            <p><strong>Zipcode:</strong> ${formData.zipcode}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            <em>Sent from Eagles Nebraska FC Website - ${new Date().toLocaleString()}</em>
          </p>
        </div>
      `,
      text: `
        New Player Registration - Eagles Nebraska FC
        
        PLAYER INFORMATION:
        Name: ${formData.playerFirstName} ${formData.playerLastName} ${formData.playerSuffix || ''}
        Gender: ${formData.playerGender}
        Birthday: ${formData.playerBirthday}
        Position: ${formData.position}
        ${formData.currentClub ? `Current Club: ${formData.currentClub}` : ''}
        ${formData.teamName ? `Team Name: ${formData.teamName}` : ''}
        ${formData.yearsPlaying ? `Years Playing: ${formData.yearsPlaying}` : ''}
        ${formData.soccerExperience ? `Soccer Experience: ${formData.soccerExperience}` : ''}
        
        PARENT/GUARDIAN INFORMATION:
        Name: ${formData.parentFirstName} ${formData.parentLastName} ${formData.parentSuffix || ''}
        Email: ${formData.parentEmail}
        Phone: ${formData.parentPhone}
        
        ADDRESS:
        Street: ${formData.street}
        City: ${formData.city}
        State: ${formData.state}
        Zipcode: ${formData.zipcode}
        
        ---
        Sent from Eagles Nebraska FC Website
        ${new Date().toLocaleString()}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Player registration has been submitted successfully!'
    };

  } catch (error) {
    console.error('Error sending player registration email:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit registration. Please try again later.'
    };
  }
}

// Generic function for different inquiry types
async function sendInquiryEmail(formData: ContactFormData, inquiryType: string): Promise<ContactResponse> {
  try {
    const { firstName, lastName, email, phone, message } = formData;
    const transporter = await createTransporter();
    
    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_TO,
      subject: `New ${inquiryType} Inquiry - Eagles Nebraska FC`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C6A76D; border-bottom: 2px solid #C6A76D; padding-bottom: 10px;">
            New ${inquiryType} Inquiry
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <div style="background: white; padding: 15px; border-left: 4px solid #C6A76D; border-radius: 0 5px 5px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            <em>Sent from Eagles Nebraska FC Website - ${new Date().toLocaleString()}</em>
          </p>
        </div>
      `,
      text: `
        New ${inquiryType} Inquiry - Eagles Nebraska FC
        
        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone}
        
        Message:
        ${message}
        
        ---
        Sent from Eagles Nebraska FC Website
        ${new Date().toLocaleString()}
      `
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Your inquiry has been sent successfully!'
    };

  } catch (error) {
    console.error(`Error sending ${inquiryType} inquiry email:`, error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send inquiry. Please try again later.'
    };
  }
}

// Specific functions for each inquiry type
export async function sendOperationsInquiry(formData: ContactFormData): Promise<ContactResponse> {
  return sendInquiryEmail(formData, 'Operations');
}

export async function sendMarketingInquiry(formData: ContactFormData): Promise<ContactResponse> {
  return sendInquiryEmail(formData, 'Marketing');
}

export async function sendMediaInquiry(formData: ContactFormData): Promise<ContactResponse> {
  return sendInquiryEmail(formData, 'Media');
}

export async function sendPartnershipInquiry(formData: PartnershipFormData): Promise<ContactResponse> {
  try {
    const transporter = await createTransporter();
    
    // Email content for partnership inquiry
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_TO,
      subject: 'New Partnership Inquiry - Eagles Nebraska FC',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C6A76D; border-bottom: 2px solid #C6A76D; padding-bottom: 10px;">
            New Partnership Inquiry
          </h2>
          
          <!-- Contact Information -->
          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #C6A76D; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
            ${formData.title ? `<p><strong>Title:</strong> ${formData.title}</p>` : ''}
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
          </div>
          
          <!-- Business Information -->
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #C6A76D; margin-top: 0;">Business Information</h3>
            <p><strong>Business Name:</strong> ${formData.businessName}</p>
            ${formData.businessWebsite ? `<p><strong>Website:</strong> <a href="${formData.businessWebsite}" style="color: #C6A76D;">${formData.businessWebsite}</a></p>` : ''}
          </div>
          
          ${formData.description ? `
          <!-- Business Description -->
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Business Description:</h3>
            <div style="background: white; padding: 15px; border-left: 4px solid #C6A76D; border-radius: 0 5px 5px 0;">
              ${formData.description.replace(/\n/g, '<br>')}
            </div>
          </div>
          ` : ''}
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            <em>Sent from Eagles Nebraska FC Website - ${new Date().toLocaleString()}</em>
          </p>
        </div>
      `,
      text: `
        New Partnership Inquiry - Eagles Nebraska FC
        
        CONTACT INFORMATION:
        Name: ${formData.firstName} ${formData.lastName}
        ${formData.title ? `Title: ${formData.title}` : ''}
        Email: ${formData.email}
        Phone: ${formData.phone}
        
        BUSINESS INFORMATION:
        Business Name: ${formData.businessName}
        ${formData.businessWebsite ? `Website: ${formData.businessWebsite}` : ''}
        
        ${formData.description ? `BUSINESS DESCRIPTION:\n${formData.description}` : ''}
        
        ---
        Sent from Eagles Nebraska FC Website
        ${new Date().toLocaleString()}
      `
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Partnership inquiry has been sent successfully!'
    };

  } catch (error) {
    console.error('Error sending partnership inquiry email:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send partnership inquiry. Please try again later.'
    };
  }
}