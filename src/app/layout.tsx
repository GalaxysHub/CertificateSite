import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "CertifyPro - Professional Certification Platform",
    template: "%s | CertifyPro"
  },
  description:
    "The world's leading platform for professional certification tests. Create, take, and manage certification exams with instant certificate generation.",
  keywords: [
    "certification", 
    "testing", 
    "online exams", 
    "certificates", 
    "education",
    "professional development",
    "skill assessment",
    "e-learning"
  ],
  authors: [{ name: "CertifyPro Team" }],
  creator: "CertifyPro",
  publisher: "CertifyPro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "CertifyPro - Professional Certification Platform",
    description: "The world's leading platform for professional certification tests with instant certificate generation.",
    siteName: "CertifyPro",
  },
  twitter: {
    card: "summary_large_image",
    title: "CertifyPro - Professional Certification Platform",
    description: "The world's leading platform for professional certification tests with instant certificate generation.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} bg-background min-h-screen font-sans antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1 pt-16">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
