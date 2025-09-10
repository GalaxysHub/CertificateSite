import { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In - Certificate Testing Platform",
  description:
    "Sign in to your account to access the certificate testing platform.",
};

export default function SignInPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <SignInForm />
    </div>
  );
}
