import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import {
  NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
} from "@/lib/utils/environment";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "KnexAI analysiert deine Website oder Dokumente und erstellt daraus in wenigen Minuten einen intelligenten Chatbot.";

export const metadata: Metadata = {
  title: "KnexAI – Chatbots für deine Inhalte",
  description,
  metadataBase: new URL(NEXT_PUBLIC_BASE_URL),
  alternates: {
    canonical: NEXT_PUBLIC_BASE_URL,
  },
  keywords: [
    "chatbot",
    "rag",
    "ai",
    "llm",
    "chat",
    "support",
    "website chatbot",
    "kundenservice",
  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: NEXT_PUBLIC_BASE_URL,
    siteName: "KnexAI",
    title: "KnexAI – Chatbots für deine Inhalte",
    description:
      "KnexAI analysiert deine Website oder Dokumente und erstellt daraus in wenigen Minuten einen intelligenten Chatbot.",
    images: [
      {
        url: `${NEXT_PUBLIC_BASE_URL}/images/logo.jpg`,
        width: 1080,
        height: 1080,
        alt: "KnexAI Logo",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KnexAI – Chatbots für deine Inhalte",
    description:
      "KnexAI verwandelt deine Website oder Dokumente in einen intelligenten Chatbot.",
    images: [`${NEXT_PUBLIC_BASE_URL}/images/logo.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
  applicationName: "KnexAI",
  appleWebApp: {
    title: "KnexAI",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KnexAI",
  url: NEXT_PUBLIC_BASE_URL,
  logo: `${NEXT_PUBLIC_BASE_URL}/images/logo.jpg`,
  description,
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      {NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <GoogleAnalytics gaId={NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      )}
      {NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID && (
        <GoogleTagManager gtmId={NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID} />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
