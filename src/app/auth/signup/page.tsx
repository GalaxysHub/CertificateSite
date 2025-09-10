import { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up - Certificate Testing Platform",
  description:
    "Create an account to start taking tests and earning certificates.",
};

export default function SignUpPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <SignUpForm />
    </div>
  );
}