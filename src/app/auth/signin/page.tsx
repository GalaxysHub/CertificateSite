import { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In - Certificate Testing Platform",
  description:
    "Sign in to your account to access the certificate testing platform.",
};

export default function SignInPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <Suspense fallback={
        <div className="w-full max-w-md">
          <div className="animate-pulse space-y-4 rounded-lg border p-6">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      }>
        <SignInForm />
      </Suspense>
    </div>
  );
}
