"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireRoles = [],
  fallback,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (requireAuth && !session) {
      router.push("/auth/signin");
      return;
    }

    if (
      requireRoles.length > 0 &&
      session?.user?.role &&
      !requireRoles.includes(session.user.role as UserRole)
    ) {
      router.push("/dashboard");
      return;
    }
  }, [session, status, requireAuth, requireRoles, router]);

  if (status === "loading") {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  if (requireAuth && !session) {
    return null; // Will redirect to signin
  }

  if (
    requireRoles.length > 0 &&
    session?.user?.role &&
    !requireRoles.includes(session.user.role as UserRole)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}