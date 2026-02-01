import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/lib/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import AuthValidation from "@/lib/AuthValidator";
import Navbar from "@/components/custom/elements/navbar/page";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/lib/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IT Experiment - 1 | Modern Blog Platform",
    template: "%s | IT Experiment - 1",
  },
  description: "A secure, high-performance blog platform built with Next.js, Convex, and Clerk. Share your thoughts with a global community.",
  keywords: ["Blog", "Next.js", "Convex", "Clerk", "Security", "Web Development"],
  authors: [{ name: "IT Experiment Team" }],
  creator: "IT Experiment",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://it-experiment-1.vercel.app",
    siteName: "IT Experiment - 1",
    title: "IT Experiment - 1 | Modern Blog Platform",
    description: "A secure, high-performance blog platform built with Next.js, Convex, and Clerk.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IT Experiment - 1 Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IT Experiment - 1 | Modern Blog Platform",
    description: "A secure, high-performance blog platform built with Next.js, Convex, and Clerk.",
    images: ["/og-image.png"],
    creator: "@itexperiment",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider attribute="class" enableSystem defaultTheme="dark">
            <ConvexClientProvider>
              <AuthValidation>
                <Toaster position="bottom-right" />
                <Navbar />
                {children}
              </AuthValidation>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
