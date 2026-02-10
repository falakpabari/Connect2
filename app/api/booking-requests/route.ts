import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { createAdminClient } from "@/lib/supabase/server";
import { BookingRequestInsert } from "@/lib/types";
import { sendAdminBookingNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { professional_id, student_name, student_email, preferred_times, note } = body;

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

    if (!preferred_times || typeof preferred_times !== "string" || !preferred_times.trim()) {
      return NextResponse.json(
        { error: "Preferred times are required" },
        { status: 400 }
      );
    }

    // Use admin client to insert (bypasses RLS)
    const supabase = createAdminClient();

    // First, verify the professional exists and is approved
    const { data: professional, error: professionalError } = await supabase
      .from("professional_profiles")
      .select("id, name, company, is_approved")
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

    // Insert booking request
    const bookingData: BookingRequestInsert = {
      professional_id,
      student_name: student_name.trim(),
      student_email: student_email.trim(),
      preferred_times: preferred_times.trim(),
      note: note?.trim() || undefined,
    };

    const { data: bookingRequest, error: insertError } = await supabase
      .from("booking_requests")
      .insert(bookingData)
      .select()
      .single();

    if (insertError || !bookingRequest) {
      console.error("Error inserting booking request:", insertError);
      return NextResponse.json(
        { error: "Failed to create booking request" },
        { status: 500 }
      );
    }

    // Send email notification to admins (stub)
    await sendAdminBookingNotification({
      bookingRequest: {
        ...bookingData,
        id: bookingRequest.id,
      },
      professionalName: professional.name,
      professionalCompany: professional.company,
    });

    return NextResponse.json(
      {
        success: true,
        id: bookingRequest.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/booking-requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
