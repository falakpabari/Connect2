import { NextRequest, NextResponse } from "next/server";
import { stripe, validateStripeConfig } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    validateStripeConfig();
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Verify the Stripe session exists
    let stripeSession;
    try {
      stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 404 }
      );
    }

    // Get payment intent ID
    const paymentIntentId = stripeSession.payment_intent as string;
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Fetch session from database
    const supabase = await createAdminClient();
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("*")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found in database" },
        { status: 404 }
      );
    }

    // Fetch professional details
    const { data: professional, error: professionalError } = await supabase
      .from("professional_profiles")
      .select("*")
      .eq("id", session.professional_id)
      .single();

    if (professionalError || !professional) {
      return NextResponse.json(
        { error: "Professional not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        session,
        professional,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
