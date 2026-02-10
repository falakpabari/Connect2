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
  const [bookingLoading, setBookingLoading] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);

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

  const handlePaidBooking = async () => {
    if (!studentName.trim() || !studentEmail.trim()) {
      alert("Please enter your name and email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professional_id: profile.id,
          student_name: studentName.trim(),
          student_email: studentEmail.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        alert(data.error || "Failed to create checkout session");
        setBookingLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert("An unexpected error occurred");
      setBookingLoading(false);
    }
  };

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

              {!showBookingForm ? (
                <>
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="block w-full bg-gray-900 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors text-center"
                  >
                    Book Paid Session
                  </button>

                  <button
                    onClick={() => setShowModal(true)}
                    className="block w-full mt-3 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium text-base hover:bg-gray-50 transition-colors text-center border border-gray-300"
                  >
                    Request Free Intro
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
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="John Doe"
                      disabled={bookingLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="john@example.com"
                      disabled={bookingLoading}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handlePaidBooking}
                      disabled={bookingLoading}
                      className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bookingLoading ? "Processing..." : "Continue to Payment"}
                    </button>
                    <button
                      onClick={() => setShowBookingForm(false)}
                      disabled={bookingLoading}
                      className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    You&apos;ll be redirected to Stripe to complete your payment securely
                  </p>
                </div>
              )}
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
