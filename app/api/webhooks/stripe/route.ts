import { NextRequest, NextResponse } from "next/server";
import { stripe, validateStripeConfig } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { SessionInsert } from "@/lib/types";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  validateStripeConfig();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Extract metadata
      const metadata = session.metadata;
      if (!metadata) {
        console.error("No metadata found in checkout session");
        return NextResponse.json(
          { error: "Missing metadata" },
          { status: 400 }
        );
      }

      const {
        professional_id,
        professional_name,
        professional_company,
        student_name,
        student_email,
      } = metadata;

      if (!professional_id || !student_name || !student_email) {
        console.error("Missing required metadata fields");
        return NextResponse.json(
          { error: "Incomplete metadata" },
          { status: 400 }
        );
      }

      // Get payment intent ID
      const paymentIntentId = session.payment_intent as string;
      if (!paymentIntentId) {
        console.error("No payment intent ID found");
        return NextResponse.json(
          { error: "Missing payment intent" },
          { status: 400 }
        );
      }

      // Create session record in database
      const supabase = createAdminClient();

      // Fetch professional to get calendly_link
      const { data: professional, error: professionalError } = await supabase
        .from("professional_profiles")
        .select("calendly_link")
        .eq("id", professional_id)
        .single();

      if (professionalError) {
        console.error("Error fetching professional:", professionalError);
      }

      const sessionData: SessionInsert = {
        professional_id,
        student_name,
        student_email,
        stripe_payment_intent_id: paymentIntentId,
        amount_cents: session.amount_total || 0,
        status: "PAID",
      };

      const { data: sessionRecord, error: insertError } = await supabase
        .from("sessions")
        .insert(sessionData)
        .select()
        .single();

      if (insertError) {
        console.error("Error creating session record:", insertError);
        return NextResponse.json(
          { error: "Failed to create session record" },
          { status: 500 }
        );
      }

      // Send email notifications (stub)
      console.log("📧 [EMAIL STUB] Payment Confirmation & Scheduling Link");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`\n📨 Email to Student: ${student_email}`);
      console.log(`Subject: Payment Confirmed - Session with ${professional_name}`);
      console.log(`\nHi ${student_name},`);
      console.log(`\nYour payment has been confirmed!`);
      console.log(`Amount: $${(session.amount_total || 0) / 100}`);
      console.log(`Professional: ${professional_name} (${professional_company})`);
      console.log(`\nNext Step: Schedule your session`);
      if (professional?.calendly_link) {
        console.log(`Calendly Link: ${professional.calendly_link}`);
      }
      console.log(`Or visit: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking/success?session_id=${session.id}`);
      
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`\n📨 Email to Professional: (from professional profile)`);
      console.log(`Subject: New Paid Session Booked - ${student_name}`);
      console.log(`\nHi ${professional_name},`);
      console.log(`\nYou have a new paid session booking!`);
      console.log(`Student: ${student_name} (${student_email})`);
      console.log(`Amount: $${(session.amount_total || 0) / 100}`);
      console.log(`\nThe student will schedule via your Calendly link.`);
      if (professional?.calendly_link) {
        console.log(`Your Calendly: ${professional.calendly_link}`);
      }
      console.log(`\nSession ID: ${sessionRecord.id}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
      console.error("Error processing checkout.session.completed:", error);
      return NextResponse.json(
        { error: "Failed to process webhook" },
        { status: 500 }
      );
    }
  }

  // Return 200 for other event types
  return NextResponse.json({ received: true }, { status: 200 });
}
