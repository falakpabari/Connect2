"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Session, ProfessionalProfile } from "@/lib/types";
import { formatPriceWithSession } from "@/lib/utils";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [professional, setProfessional] = useState<ProfessionalProfile | null>(null);

  useEffect(() => {
    async function fetchSessionData() {
      if (!sessionId) {
        setError("No session ID provided");
        setLoading(false);
        return;
      }

      try {
        // Fetch session details from our API
        const response = await fetch(`/api/sessions/${sessionId}`);
        const data = await response.json();

        if (!response.ok || data.error) {
          setError(data.error || "Failed to load session details");
          setLoading(false);
          return;
        }

        setSessionData(data.session);
        setProfessional(data.professional);
        setLoading(false);
      } catch (err) {
        setError("An unexpected error occurred");
        setLoading(false);
      }
    }

    fetchSessionData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !sessionData || !professional) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-900 mb-2">Error</h1>
          <p className="text-red-700">{error || "Session not found"}</p>
          <Link
            href="/professionals"
            className="inline-block mt-4 text-red-900 hover:text-red-700 font-semibold"
          >
            ← Back to Professionals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Success Header */}
        <div className="bg-green-50 border-b border-green-200 px-8 py-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-green-900">Payment Confirmed!</h1>
              <p className="text-green-700 mt-1">Your session has been booked successfully</p>
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="px-8 py-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Professional:</span>
                <span className="font-semibold text-gray-900">{professional.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Company:</span>
                <span className="font-semibold text-gray-900">{professional.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-semibold text-gray-900">{professional.role_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-gray-900">
                  {formatPriceWithSession(sessionData.amount_cents)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Student:</span>
                <span className="font-semibold text-gray-900">{sessionData.student_name}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Next Steps</h2>
            <p className="text-gray-700 mb-4">
              Schedule your 30-minute session with {professional.name} using the link below:
            </p>

            {professional.calendly_link ? (
              <a
                href={professional.calendly_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-900 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors text-center"
              >
                Schedule Your Session
              </a>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  The professional&apos;s scheduling link is not yet available. You will receive an
                  email with scheduling instructions shortly.
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500 text-center mt-4">
              A confirmation email with your receipt and scheduling link has been sent to{" "}
              <span className="font-semibold">{sessionData.student_email}</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4">
          <div className="text-center">
            <Link
              href="/professionals"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              ← Browse More Professionals
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
