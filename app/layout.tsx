"use client";

import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    }
    checkAuth();
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <title>Connect2 - Professional Networking Marketplace</title>
        <meta
          name="description"
          content="Connect with top professionals from leading companies for career advice and mentorship."
        />
      </head>
      <body className="antialiased">
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Connect2
              </Link>
              {isAdminRoute && isAuthenticated && (
                <nav className="flex gap-6">
                  <Link
                    href="/admin/professionals"
                    className={`transition-colors ${
                      pathname === "/admin/professionals"
                        ? "text-gray-900 font-semibold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Professionals
                  </Link>
                  <Link
                    href="/admin/bookings"
                    className={`transition-colors ${
                      pathname === "/admin/bookings"
                        ? "text-gray-900 font-semibold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Bookings
                  </Link>
                </nav>
              )}
            </div>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50">{children}</main>
        <footer className="border-t border-gray-200 bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
            <p>&copy; 2026 Connect2. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
