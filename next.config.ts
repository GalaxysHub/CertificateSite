import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  images: {
    domains: ["localhost"],
    unoptimized: process.env.NODE_ENV === "development",
  },
  // Enable strict mode for better error handling
  reactStrictMode: true,
};

export default nextConfig;
