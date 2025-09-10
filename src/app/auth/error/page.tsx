import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthErrorMessage } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "Authentication Error - Certificate Testing Platform",
  description: "An error occurred during authentication.",
};

interface AuthErrorPageProps {
  searchParams: {
    error?: string;
  };
}

export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const error = searchParams.error;
  const errorMessage = getAuthErrorMessage(error || null);

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl text-red-600">
            Authentication Error
          </CardTitle>
          <CardDescription>
            We encountered an issue while trying to authenticate you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/auth/signin">Try Again</Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Go Home</Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            If you continue to experience issues, please{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contact support
            </Link>
            .
          </div>
        </CardContent>
      </Card>
    </div>
  );
}