import nodemailer from "nodemailer";
import { formatWallClock } from "@/lib/hiring";

const SITE_URL = (process.env.SITE_URL || "https://eaglesfc.org").replace(/\/$/, "");
const GOLD = "#C6A76D";

/** Where new-application alerts go. Falls back to the general club inbox. */
function hiringInbox(): string | undefined {
  return process.env.HIRING_EMAIL || process.env.SMTP_TO;
}

// Same SMTP settings as actions/contact.ts so both paths work against one host.
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/** Everything an applicant typed must pass through here before going into HTML. */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function multiline(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function layout(title: string, body: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
      <h2 style="color: ${GOLD}; border-bottom: 2px solid ${GOLD}; padding-bottom: 10px;">${escapeHtml(title)}</h2>
      ${body}
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #888; font-size: 12px; text-align: center;">
        <em>Eagles Nebraska FC · Grand Island, NE</em>
      </p>
    </div>
  `;
}

function row(label: string, value: string): string {
  return value ? `<p style="margin: 6px 0;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>` : "";
}

async function send(to: string, subject: string, html: string, text: string, replyTo?: string) {
  await createTransporter().sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
    text,
    ...(replyTo ? { replyTo } : {}),
  });
}

interface NewApplicationEmail {
  applicationId: string;
  referenceCode: string;
  jobTitle: string;
  department: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  yearsExperience: number;
  safeSportStatus: string;
  hasResume: boolean;
  coverLetter: string;
}

export async function sendNewApplicationAlert(app: NewApplicationEmail) {
  const to = hiringInbox();
  if (!to) return;
  const name = `${app.firstName} ${app.lastName}`;
  const link = `${SITE_URL}/admin/hiring/applications/${app.applicationId}`;

  const html = layout(
    "New Job Application",
    `
      <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        ${row("Position", app.jobTitle)}
        ${row("Department", app.department)}
        ${row("Reference", app.referenceCode)}
      </div>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        ${row("Name", name)}
        ${row("Email", app.email)}
        ${row("Phone", app.phone)}
        ${row("Location", [app.city, app.state].filter(Boolean).join(", "))}
        ${row("Years of experience", String(app.yearsExperience))}
        ${row("SafeSport", app.safeSportStatus)}
        ${row("Resume attached", app.hasResume ? "Yes (download in the admin portal)" : "No")}
      </div>
      ${
        app.coverLetter
          ? `<h3 style="color: #333;">Why Eagles FC</h3>
             <div style="background: white; padding: 15px; border-left: 4px solid ${GOLD};">${multiline(app.coverLetter)}</div>`
          : ""
      }
      <p style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background: ${GOLD}; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Review application
        </a>
      </p>
    `
  );

  const text = [
    `New application: ${app.jobTitle}`,
    `Reference: ${app.referenceCode}`,
    `Name: ${name}`,
    `Email: ${app.email}`,
    `Phone: ${app.phone}`,
    `Review: ${link}`,
  ].join("\n");

  await send(to, `New Application: ${app.jobTitle} — ${name}`, html, text, app.email);
}

export async function sendApplicationConfirmation(app: {
  email: string;
  firstName: string;
  jobTitle: string;
  referenceCode: string;
}) {
  const html = layout(
    "We received your application",
    `
      <p>Hi ${escapeHtml(app.firstName)},</p>
      <p>Thank you for applying for <strong>${escapeHtml(app.jobTitle)}</strong> with Eagles FC. Our team reviews every application and will contact you if your background is a match.</p>
      <div style="background: #f9f9f9; padding: 16px 20px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Your reference number:</strong> ${escapeHtml(app.referenceCode)}</p>
      </div>
      <p>Everyone who works with our players completes SafeSport training and a background check before starting, so if you move forward we will walk you through those steps.</p>
      <p>Go Eagles!<br>Eagles FC</p>
    `
  );
  const text = `Hi ${app.firstName},\n\nThank you for applying for ${app.jobTitle} with Eagles FC. Your reference number is ${app.referenceCode}. We will contact you if your background is a match.\n\nEagles FC`;
  await send(app.email, `Application received — ${app.jobTitle} | Eagles FC`, html, text, hiringInbox());
}

export async function sendInterviewInvite(app: {
  email: string;
  firstName: string;
  jobTitle: string;
  scheduledAt: string;
  location: string;
  details: string;
}) {
  const when = formatWallClock(app.scheduledAt);
  const html = layout(
    "Interview invitation",
    `
      <p>Hi ${escapeHtml(app.firstName)},</p>
      <p>Thanks again for your interest in <strong>${escapeHtml(app.jobTitle)}</strong>. We would like to meet with you.</p>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        ${row("When", `${when} (Central Time)`)}
        ${row("Where", app.location)}
      </div>
      ${app.details ? `<p>${multiline(app.details)}</p>` : ""}
      <p>If this time does not work, just reply to this email and we will find another.</p>
      <p>Eagles FC</p>
    `
  );
  const text = `Hi ${app.firstName},\n\nWe would like to interview you for ${app.jobTitle}.\nWhen: ${when} (Central Time)\n${app.location ? `Where: ${app.location}\n` : ""}${app.details ? `\n${app.details}\n` : ""}\nReply to this email if the time does not work.\n\nEagles FC`;
  await send(app.email, `Interview invitation — ${app.jobTitle} | Eagles FC`, html, text, hiringInbox());
}

export async function sendDeclineNotice(app: { email: string; firstName: string; jobTitle: string }) {
  const html = layout(
    "Update on your application",
    `
      <p>Hi ${escapeHtml(app.firstName)},</p>
      <p>Thank you for your interest in <strong>${escapeHtml(app.jobTitle)}</strong> and for the time you put into your application.</p>
      <p>After careful consideration, we have decided to move forward with other candidates for this role. We would be glad to hear from you again when future positions open. Keep an eye on our careers page.</p>
      <p>We wish you all the best,<br>Eagles FC</p>
    `
  );
  const text = `Hi ${app.firstName},\n\nThank you for your interest in ${app.jobTitle}. After careful consideration, we have decided to move forward with other candidates for this role. We would be glad to hear from you again when future positions open.\n\nEagles FC`;
  await send(app.email, `Your application — ${app.jobTitle} | Eagles FC`, html, text, hiringInbox());
}
