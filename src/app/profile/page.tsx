import { Metadata } from "next";
import { requireAuth } from "@/lib/auth-utils";
import { ProfileForm } from "@/components/auth/profile-form";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Profile - Certificate Testing Platform",
  description: "Manage your account settings and profile information.",
};

export default async function ProfilePage() {
  const user = await requireAuth();
  
  // Fetch complete user data
  const userData = await db.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          tests: true,
          attempts: true,
          certificates: true,
        },
      },
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <ProfileForm user={userData} />
          </div>

          {/* Account Stats */}
          <div className="space-y-6">
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Account Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tests Created</span>
                  <span className="font-medium">{userData._count.tests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tests Attempted</span>
                  <span className="font-medium">{userData._count.attempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certificates Earned</span>
                  <span className="font-medium">{userData._count.certificates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Account Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium capitalize">
                    {userData.role.toLowerCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email Status</span>
                  <span className={`font-medium ${
                    userData.emailVerified ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {userData.emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}