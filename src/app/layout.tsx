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

// TODO: add description
const description =
  "";

const title = "REPLACE_ME";

export const metadata: Metadata = {
  title: title,
  description,
  metadataBase: new URL(NEXT_PUBLIC_BASE_URL),
  alternates: {
    canonical: NEXT_PUBLIC_BASE_URL,
  },
  keywords: [  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: NEXT_PUBLIC_BASE_URL,
    siteName: title,
    title,
    description,
    images: [
      {
        url: `${NEXT_PUBLIC_BASE_URL}/images/logo.jpg`,
        width: 1080,
        height: 1080,
        alt: "Logo",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
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
  applicationName: title,
  appleWebApp: {
    title: title,
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
  name: title,
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
