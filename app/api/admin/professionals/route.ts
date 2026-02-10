import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { ProfessionalProfileInsert } from "@/lib/types";

// Log environment variable presence (boolean only, no actual values)
const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmailsPresent = !!process.env.ADMIN_EMAILS;

console.log('[Admin Professionals Route] Environment check:', {
  hasUrl,
  hasAnonKey,
  hasServiceRoleKey,
  adminEmailsPresent
});

export async function GET() {
  try {
    console.log('[GET /api/admin/professionals] Starting request');
    
    // Check admin auth (uses cookie-based client, no DB queries)
    const user = await requireAdmin();
    console.log('[GET /api/admin/professionals] Admin verified:', user.email);

    // Use service role client for DB operations (bypasses RLS)
    const supabase = await createAdminClient();
    console.log('[GET /api/admin/professionals] Admin client created');
    
    const { data, error } = await supabase
      .from("professional_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error('[GET /api/admin/professionals] Supabase error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: error
      });
      throw error;
    }

    console.log('[GET /api/admin/professionals] Success, fetched', data?.length || 0, 'profiles');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[GET /api/admin/professionals] Caught error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      fullError: error
    });
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to fetch profiles",
        hint: error instanceof Error && 'hint' in error ? (error as any).hint : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('[POST /api/admin/professionals] Starting request');
    
    // Check admin auth (uses cookie-based client, no DB queries)
    const user = await requireAdmin();
    console.log('[POST /api/admin/professionals] Admin verified:', user.email);

    const body: ProfessionalProfileInsert = await request.json();
    console.log('[POST /api/admin/professionals] Request body received');

    // Use service role client for DB operations (bypasses RLS)
    const supabase = await createAdminClient();
    console.log('[POST /api/admin/professionals] Admin client created');
    
    const { data, error } = await supabase
      .from("professional_profiles")
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('[POST /api/admin/professionals] Supabase error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: error
      });
      throw error;
    }

    console.log('[POST /api/admin/professionals] Success, created profile:', data?.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[POST /api/admin/professionals] Caught error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      fullError: error
    });
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to create profile",
        hint: error instanceof Error && 'hint' in error ? (error as any).hint : undefined
      },
      { status: 500 }
    );
  }
}
