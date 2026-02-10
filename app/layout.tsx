import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connect2 - Professional Networking Marketplace",
  description: "Connect with top professionals from leading companies for career advice and mentorship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Connect2
              </Link>
              <nav className="flex gap-6">
                <Link
                  href="/professionals"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Browse Professionals
                </Link>
                <Link
                  href="/admin/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Admin
                </Link>
              </nav>
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
