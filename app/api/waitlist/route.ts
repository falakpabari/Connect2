import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, university, gradYear, interests, targetCompanies, note } = body;

    // Validate required fields
    if (!name || !email || !university || !gradYear) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!interests || interests.length === 0) {
      return NextResponse.json(
        { error: "At least one interest is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate graduation year
    const year = parseInt(gradYear);
    if (isNaN(year) || year < 2026 || year > 2030) {
      return NextResponse.json(
        { error: "Invalid graduation year" },
        { status: 400 }
      );
    }

    // Validate university is Brown University
    if (university !== "Brown University") {
      return NextResponse.json(
        { error: "Only Brown University students are eligible at this time" },
        { status: 400 }
      );
    }

    try {
      // Try to insert into Supabase
      const supabase = await createClient();
      
      const { error: insertError } = await supabase
        .from("waitlist_signups")
        .insert({
          name,
          email,
          university,
          grad_year: year,
          interests,
          target_companies: targetCompanies || null,
          note: note || null,
        });

      if (insertError) {
        // Log the error but don't fail the request
        console.error("Supabase insert error:", insertError);
        console.log("Waitlist signup (fallback):", {
          name,
          email,
          university,
          grad_year: year,
          interests,
          target_companies: targetCompanies,
          note,
        });
      } else {
        // Log success
        console.log("✅ Waitlist signup successfully saved to Supabase:", {
          name,
          email,
          university,
          grad_year: year,
        });
      }
    } catch (dbError) {
      // Database error - log and continue
      console.error("Database error:", dbError);
      console.log("Waitlist signup (fallback):", {
        name,
        email,
        university,
        grad_year: year,
        interests,
        target_companies: targetCompanies,
        note,
      });
    }

    // Always return success to the user
    return NextResponse.json(
      { success: true, message: "Successfully joined the waitlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
