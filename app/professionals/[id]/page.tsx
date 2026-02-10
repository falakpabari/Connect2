"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProfessionalProfile } from "@/lib/types";
import { formatPriceWithSession } from "@/lib/utils";
import BookingRequestModal from "@/components/BookingRequestModal";

export default function ProfessionalProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("professional_profiles")
        .select("*")
        .eq("id", id)
        .eq("is_approved", true)
        .single();

      if (error || !data) {
        notFound();
      }

      setProfile(data as ProfessionalProfile);
      setLoading(false);
    }

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    notFound();
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-8 py-12 text-white">
            <h1 className="text-4xl font-bold">{profile.name}</h1>
            <p className="text-xl mt-2 text-gray-200">
              {profile.role_title} at {profile.company}
            </p>
            <p className="text-lg mt-1 text-gray-300">{profile.industry}</p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {profile.bio}
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
                    {formatPriceWithSession(profile.price_cents)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="block w-full bg-gray-900 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors text-center"
              >
                Request Session
              </button>

              {profile.calendly_link && (
                <div className="mt-4 text-center">
                  <a
                    href={profile.calendly_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Or schedule directly via Calendly →
                  </a>
                </div>
              )}

              <p className="text-sm text-gray-500 text-center mt-4">
                Submit a request and we&apos;ll coordinate scheduling
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

      {showModal && (
        <BookingRequestModal
          professionalId={profile.id}
          professionalName={profile.name}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
