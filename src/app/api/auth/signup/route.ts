import { NextRequest, NextResponse } from "next/server";
import { signUpSchema } from "@/lib/validations/auth";
import { createUser } from "@/lib/auth-utils";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = signUpSchema.parse(body);
    
    // Create the user
    const user = await createUser({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
    });

    // Return success response (don't include password or sensitive data)
    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message === "User with this email already exists") {
        return NextResponse.json(
          { message: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}