import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { ProfessionalProfile } from "@/lib/types";
import { formatPriceWithSession } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfessionalProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: profile, error } = await supabase
    .from("professional_profiles")
    .select("*")
    .eq("id", id)
    .eq("is_approved", true)
    .single();

  if (error || !profile) {
    notFound();
  }

  const typedProfile = profile as ProfessionalProfile;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-8 py-12 text-white">
          <h1 className="text-4xl font-bold">{typedProfile.name}</h1>
          <p className="text-xl mt-2 text-gray-200">
            {typedProfile.role_title} at {typedProfile.company}
          </p>
          <p className="text-lg mt-1 text-gray-300">{typedProfile.industry}</p>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {typedProfile.bio}
            </p>
          </div>

          {/* Session Info */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">30-Minute Session</h3>
                <p className="text-sm text-gray-600 mt-1">
                  One-on-one video call for career advice and mentorship
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">
                  {formatPriceWithSession(typedProfile.price_cents)}
                </p>
              </div>
            </div>

            {typedProfile.calendly_link ? (
              <a
                href={typedProfile.calendly_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-900 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors text-center"
              >
                Request Session
              </a>
            ) : (
              <a
                href={`mailto:?subject=Session Request with ${typedProfile.name}`}
                className="block w-full bg-gray-900 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors text-center"
              >
                Request Session
              </a>
            )}

            <p className="text-sm text-gray-500 text-center mt-4">
              You&apos;ll be redirected to schedule a time that works for both of you
            </p>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="mt-8 text-center">
        <Link
          href="/professionals"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back to all professionals
        </Link>
      </div>
    </div>
  );
}
