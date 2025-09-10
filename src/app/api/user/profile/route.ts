import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validations/auth";
import { db } from "@/lib/db";
import { verifyPassword, updateUserPassword } from "@/lib/auth-utils";
import { ZodError } from "zod";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it's already taken
    if (validatedData.email && validatedData.email !== user.email) {
      const existingUser = await db.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: "Email is already in use" },
          { status: 409 }
        );
      }
    }

    // Handle password change
    if (validatedData.newPassword && validatedData.currentPassword) {
      if (!user.password) {
        return NextResponse.json(
          { message: "Current password is not set" },
          { status: 400 }
        );
      }

      const isCurrentPasswordValid = await verifyPassword(
        validatedData.currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      await updateUserPassword(user.id, validatedData.newPassword);
    }

    // Update user profile
    const updateData: any = {};
    
    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
    }
    
    if (validatedData.email !== undefined) {
      updateData.email = validatedData.email;
      updateData.emailVerified = null; // Reset email verification when email changes
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}