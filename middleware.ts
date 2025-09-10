import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isProtectedRoute =
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/tests") ||
      req.nextUrl.pathname.startsWith("/certificates") ||
      req.nextUrl.pathname.startsWith("/profile");

    // If user is on an auth page and is already authenticated, redirect to dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If user is trying to access a protected route without being authenticated
    if (isProtectedRoute && !isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Role-based access control
    if (isAuth && token) {
      const userRole = token.role as string;
      
      // Admin routes
      if (req.nextUrl.pathname.startsWith("/admin") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Instructor routes  
      if (
        req.nextUrl.pathname.startsWith("/instructor") &&
        !["INSTRUCTOR", "ADMIN"].includes(userRole)
      ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Let the middleware function handle the logic
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};