import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { SessionWithProfessional } from "@/lib/types";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch all sessions with professional details
    const { data: sessions, error } = await supabase
      .from("sessions")
      .select(`
        *,
        professional_profiles!sessions_professional_id_fkey (
          name,
          company
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching sessions:", error);
      return NextResponse.json(
        { error: "Failed to fetch sessions" },
        { status: 500 }
      );
    }

    // Transform the data to match SessionWithProfessional interface
    const sessionsWithProfessional: SessionWithProfessional[] = sessions.map((session: any) => ({
      ...session,
      professional_name: session.professional_profiles?.name || "Unknown",
      professional_company: session.professional_profiles?.company || "Unknown",
    }));

    return NextResponse.json(sessionsWithProfessional, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/admin/sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
