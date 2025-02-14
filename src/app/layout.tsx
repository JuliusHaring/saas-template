import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import Footer from "@/lib/components/shared/organisms/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KnexAI",
  description: "ChatBots für KMU",
  metadataBase: new URL("https://www.knex-ai.de"),
  alternates: {
    canonical: "https://www.knex-ai.de",
  },
  keywords: "chatbot, rag, ai, llm, chat, support",
  openGraph: {
    siteName: "KnexAI",
    type: "website",
    locale: "de_DE",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
  applicationName: "Menju",
  appleWebApp: {
    title: "Menju",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    // icon: [
    //   { url: "/favicon.ico", type: "image/x-icon" },
    //   { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    //   { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    //   { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    //   { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    //   { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    // ],
    // shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
    // apple: [
    //   { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
    //   { url: "/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
    // ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="flex-grow mb-[72px]">
          <Providers>{children}</Providers>
        </main>
        <Footer />
      </body>
    </html>
  );
}
