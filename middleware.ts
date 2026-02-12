import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define private routes that require beta access
  const privateRoutes = [
    "/professionals",
    "/admin",
    "/booking",
  ];

  // Check if the current path matches any private route
  const isPrivateRoute = privateRoutes.some((route) => 
    pathname.startsWith(route)
  );

  // If it's a private route, check PUBLIC_BETA environment variable
  if (isPrivateRoute) {
    const isPublicBeta = process.env.PUBLIC_BETA === "true";

    // If not in public beta, redirect to waitlist
    if (!isPublicBeta) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|waitlist).*)",
  ],
};
