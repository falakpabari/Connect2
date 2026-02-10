"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BookingRequestWithProfessional, SessionWithProfessional } from "@/lib/types";
import { formatPriceWithSession } from "@/lib/utils";

type StatusFilter = "ALL" | "NEW" | "CONTACTED" | "SCHEDULED";
type SessionStatusFilter = "ALL" | "PENDING" | "PAID" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
type TabType = "BOOKING_REQUESTS" | "PAID_SESSIONS";

export default function AdminBookingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("BOOKING_REQUESTS");
  const [bookings, setBookings] = useState<BookingRequestWithProfessional[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingRequestWithProfessional[]>([]);
  const [sessions, setSessions] = useState<SessionWithProfessional[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionWithProfessional[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sessionStatusFilter, setSessionStatusFilter] = useState<SessionStatusFilter>("ALL");
  const router = useRouter();

  useEffect(() => {
    checkAdminAndFetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Filter bookings based on selected status
    if (statusFilter === "ALL") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === statusFilter));
    }
  }, [statusFilter, bookings]);

  useEffect(() => {
    // Filter sessions based on selected status
    if (sessionStatusFilter === "ALL") {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter((s) => s.status === sessionStatusFilter));
    }
  }, [sessionStatusFilter, sessions]);

  async function checkAdminAndFetchBookings() {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    // Check if user is admin
    const response = await fetch("/api/admin/check");
    const { isAdmin: adminStatus } = await response.json();

    if (!adminStatus) {
      setError("Unauthorized: Admin access required");
      setLoading(false);
      return;
    }

    setIsAdmin(true);
    await fetchBookings();
    await fetchSessions();
  }

  async function fetchBookings() {
    const response = await fetch("/api/admin/booking-requests");
    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else {
      setBookings(data);
      setFilteredBookings(data);
    }
    setLoading(false);
  }

  async function fetchSessions() {
    const response = await fetch("/api/admin/sessions");
    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else {
      setSessions(data);
      setFilteredSessions(data);
    }
  }

  async function updateStatus(id: string, newStatus: "NEW" | "CONTACTED" | "SCHEDULED") {
    setMessage("");
    setError("");

    const response = await fetch(`/api/admin/booking-requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else {
      setMessage("Status updated successfully!");
      await fetchBookings();
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getStatusBadgeColor(status: string): string {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "CONTACTED":
        return "bg-yellow-100 text-yellow-800";
      case "SCHEDULED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getStatusCount(status: StatusFilter): number {
    if (status === "ALL") return bookings.length;
    return bookings.filter((b) => b.status === status).length;
  }

  function getSessionStatusCount(status: SessionStatusFilter): number {
    if (status === "ALL") return sessions.length;
    return sessions.filter((s) => s.status === status).length;
  }

  function getSessionStatusBadgeColor(status: string): string {
    switch (status) {
      case "PENDING":
        return "bg-gray-100 text-gray-800";
      case "PAID":
        return "bg-green-100 text-green-800";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-purple-100 text-purple-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "Unauthorized access"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Bookings Management</h1>
        <p className="text-gray-600 mt-2">Manage booking requests and paid sessions</p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Main Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("BOOKING_REQUESTS")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-base
              ${
                activeTab === "BOOKING_REQUESTS"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Booking Requests
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
              {bookings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("PAID_SESSIONS")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-base
              ${
                activeTab === "PAID_SESSIONS"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Paid Sessions
            <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
              {sessions.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Booking Requests Tab */}
      {activeTab === "BOOKING_REQUESTS" && (
        <>
          {/* Status Filter Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {(["ALL", "NEW", "CONTACTED", "SCHEDULED"] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      statusFilter === status
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {status}
                  <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                    {getStatusCount(status)}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  {statusFilter === "ALL"
                    ? "No booking requests yet."
                    : `No ${statusFilter.toLowerCase()} booking requests.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Professional
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preferred Times
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(booking.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.professional_name}
                          </div>
                          <div className="text-sm text-gray-500">{booking.professional_company}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.student_name}
                          </div>
                          <div className="text-sm text-gray-500">{booking.student_email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                          <div className="line-clamp-2">{booking.preferred_times}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                          <div className="line-clamp-2">{booking.note || "—"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              updateStatus(
                                booking.id,
                                e.target.value as "NEW" | "CONTACTED" | "SCHEDULED"
                              )
                            }
                            className={`text-xs font-semibold rounded-full px-3 py-1 bg-white border-0 focus:ring-2 focus:ring-slate-900/20 ${getStatusBadgeColor(
                              booking.status
                            )}`}
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="SCHEDULED">SCHEDULED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Paid Sessions Tab */}
      {activeTab === "PAID_SESSIONS" && (
        <>
          {/* Session Status Filter Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {(["ALL", "PAID", "SCHEDULED", "COMPLETED"] as SessionStatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setSessionStatusFilter(status)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      sessionStatusFilter === status
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {status}
                  <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                    {getSessionStatusCount(status)}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Sessions Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  {sessionStatusFilter === "ALL"
                    ? "No paid sessions yet."
                    : `No ${sessionStatusFilter.toLowerCase()} sessions.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Professional
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(session.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {session.professional_name}
                          </div>
                          <div className="text-sm text-gray-500">{session.professional_company}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {session.student_name}
                          </div>
                          <div className="text-sm text-gray-500">{session.student_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatPriceWithSession(session.amount_cents)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-xs font-semibold rounded-full px-3 py-1 ${getSessionStatusBadgeColor(session.status)}`}>
                            {session.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
