import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Fetch all booking requests with professional details
    const { data: bookingRequests, error } = await supabase
      .from("booking_requests")
      .select(
        `
        *,
        professional_profiles!inner (
          name,
          company
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching booking requests:", error);
      return NextResponse.json(
        { error: "Failed to fetch booking requests" },
        { status: 500 }
      );
    }

    // Transform the data to flatten the professional details
    const transformedData = bookingRequests.map((request: any) => ({
      id: request.id,
      professional_id: request.professional_id,
      student_name: request.student_name,
      student_email: request.student_email,
      preferred_times: request.preferred_times,
      note: request.note,
      status: request.status,
      created_at: request.created_at,
      updated_at: request.updated_at,
      professional_name: request.professional_profiles.name,
      professional_company: request.professional_profiles.company,
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error in GET /api/admin/booking-requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
