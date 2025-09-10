import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN" | "INSTRUCTOR";
    } & DefaultSession["user"];
  }

  interface User {
    role: "USER" | "ADMIN" | "INSTRUCTOR";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "USER" | "ADMIN" | "INSTRUCTOR";
  }
}
