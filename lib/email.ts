import { BookingRequestInsert } from "./types";

interface BookingNotificationPayload {
  bookingRequest: BookingRequestInsert & { id: string };
  professionalName: string;
  professionalCompany: string;
}

/**
 * Send email notification to admins when a new booking request is created.
 * 
 * TODO: Replace this stub with actual email service (e.g., Resend)
 * When implementing:
 * 1. Install resend: npm install resend
 * 2. Add RESEND_API_KEY to environment variables
 * 3. Replace console.log with actual email sending logic
 * 4. Use a proper email template
 */
export async function sendAdminBookingNotification(
  payload: BookingNotificationPayload
): Promise<void> {
  // Parse admin emails from environment variable
  const adminEmailsEnv = process.env.ADMIN_EMAILS;
  
  if (!adminEmailsEnv) {
    console.warn(
      "⚠️  ADMIN_EMAILS environment variable not set. Booking notification not sent."
    );
    return;
  }

  const adminEmails = adminEmailsEnv
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email.length > 0);

  if (adminEmails.length === 0) {
    console.warn("⚠️  No valid admin emails found. Booking notification not sent.");
    return;
  }

  // STUB: Log notification details (replace with actual email service)
  console.log("📧 [EMAIL STUB] New Booking Request Notification");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`To: ${adminEmails.join(", ")}`);
  console.log(`Subject: New Session Request - ${payload.professionalName}`);
  console.log("\nBooking Details:");
  console.log(`  Professional: ${payload.professionalName} (${payload.professionalCompany})`);
  console.log(`  Student: ${payload.bookingRequest.student_name}`);
  console.log(`  Email: ${payload.bookingRequest.student_email}`);
  console.log(`  Preferred Times: ${payload.bookingRequest.preferred_times}`);
  console.log(`  Note: ${payload.bookingRequest.note || "(none)"}`);
  console.log(`  Request ID: ${payload.bookingRequest.id}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // TODO: Implement actual email sending
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'Connect2 <notifications@yourdomain.com>',
  //   to: adminEmails,
  //   subject: `New Session Request - ${payload.professionalName}`,
  //   html: `<html>...</html>`
  // });
}
