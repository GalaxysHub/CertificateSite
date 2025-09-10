"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateProfileSchema, type UpdateProfileFormData } from "@/lib/validations/auth";

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email,
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to update profile");
        return;
      }

      setSuccess("Profile updated successfully");
      
      // Clear password fields
      reset({
        name: data.name,
        email: data.email,
        currentPassword: "",
        newPassword: "",
      });

      // Refresh the page to show updated data
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <input
                {...register("name")}
                id="name"
                type="text"
                className="border-input bg-background w-full rounded-md border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                className="border-input bg-background w-full rounded-md border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-sm font-medium">
                    Current Password
                  </label>
                  <input
                    {...register("currentPassword")}
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    className="border-input bg-background w-full rounded-md border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={isLoading}
                  />
                  {errors.currentPassword && (
                    <p className="text-sm text-red-600">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </label>
                  <input
                    {...register("newPassword")}
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    className="border-input bg-background w-full rounded-md border px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={isLoading}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-red-600">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}