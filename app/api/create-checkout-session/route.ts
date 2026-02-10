import { NextRequest, NextResponse } from "next/server";
import { stripe, validateStripeConfig } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    validateStripeConfig();
    const body = await request.json();
    const { professional_id, student_name, student_email } = body;

    // Validation
    if (!professional_id || typeof professional_id !== "string") {
      return NextResponse.json(
        { error: "Professional ID is required" },
        { status: 400 }
      );
    }

    if (!student_name || typeof student_name !== "string" || !student_name.trim()) {
      return NextResponse.json(
        { error: "Student name is required" },
        { status: 400 }
      );
    }

    if (!student_email || typeof student_email !== "string" || !student_email.trim()) {
      return NextResponse.json(
        { error: "Student email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student_email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Fetch professional details
    const supabase = await createAdminClient();
    const { data: professional, error: professionalError } = await supabase
      .from("professional_profiles")
      .select("id, name, company, role_title, price_cents, is_approved")
      .eq("id", professional_id)
      .single();

    if (professionalError || !professional) {
      return NextResponse.json(
        { error: "Professional not found" },
        { status: 404 }
      );
    }

    if (!professional.is_approved) {
      return NextResponse.json(
        { error: "Professional is not available for booking" },
        { status: 400 }
      );
    }

    // Get the base URL for success/cancel redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    request.headers.get("origin") || 
                    "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `30-Minute Session with ${professional.name}`,
              description: `${professional.role_title} at ${professional.company}`,
            },
            unit_amount: professional.price_cents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: student_email.trim(),
      success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/professionals/${professional_id}`,
      metadata: {
        professional_id: professional.id,
        professional_name: professional.name,
        professional_company: professional.company,
        student_name: student_name.trim(),
        student_email: student_email.trim(),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
