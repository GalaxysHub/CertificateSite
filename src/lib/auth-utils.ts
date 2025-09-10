import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { authOptions } from "./auth";
import { db } from "./db";
import type { UserRole } from "@/types";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }
  return user;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}) {
  const existingUser = await db.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  return db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || "USER",
    },
  });
}

export async function updateUserPassword(userId: string, newPassword: string) {
  const hashedPassword = await hashPassword(newPassword);
  
  return db.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

export function getAuthErrorMessage(error: string | null): string {
  switch (error) {
    case "CredentialsSignin":
      return "Invalid email or password. Please try again.";
    case "OAuthAccountNotLinked":
      return "Please use the same account you used to sign up.";
    case "EmailSignin":
      return "Unable to send verification email. Please try again.";
    case "SessionRequired":
      return "Please sign in to access this page.";
    default:
      return "An error occurred during authentication. Please try again.";
  }
}