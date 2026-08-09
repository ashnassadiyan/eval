import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import StoreProvider from "@/store/StoreProvider";
import Notification from "@/components/NotificationSystem";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://evalcv.com"),
  title: {
    default: "EvalCv — AI Resume Screening & Candidate Matching",
    template: "%s | EvalCv",
  },
  description:
    "AI-powered resume screening and candidate matching platform. Know how employers see your resume, analyze skills gaps, and match top talent faster.",
  keywords: [
    "AI Resume Screening",
    "Candidate Matching",
    "ATS Resume Checker",
    "Resume Parser",
    "Skills Gap Analysis",
    "Recruiter AI Tool",
    "Job Application Scanner",
    "EvalCv",
  ],
  authors: [{ name: "EvalCv Team" }],
  creator: "EvalCv",
  publisher: "EvalCv",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "EvalCv — AI Resume Screening & Candidate Matching",
    description:
      "Transform hiring and resume building with AI-driven resume scoring, skills gap analysis, and candidate matching.",
    url: "https://evalcv.com",
    siteName: "EvalCv",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EvalCv AI Resume Intelligence Platform Hero",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EvalCv — AI Resume Screening & Candidate Matching",
    description:
      "Transform hiring and resume building with AI-driven resume scoring, skills gap analysis, and candidate matching.",
    images: ["/og-image.png"],
    creator: "@EvalCv",
  },
};

import { FirebaseNotificationProvider } from "@/context/FirebaseNotificationContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-full flex flex-col bg-background text-foreground font-[family-name:var(--font-inter)]">
        {/* ✅ Redux Provider & Theme Provider wrap everything */}
        <StoreProvider>
          <ThemeProvider>
            <Notification />
            <AuthProvider>
              <FirebaseNotificationProvider>{children}</FirebaseNotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
