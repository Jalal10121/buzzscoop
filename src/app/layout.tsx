import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
    other: [
      { rel: "android-chrome", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome", url: "/android-chrome-512x512.png" },
    ],
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://buzzscoop.news"),
  title: {
    default: "BuzzScoop — Entertainment News, Netflix, Hollywood",
    template: "%s | BuzzScoop",
  },
  description: "BuzzScoop brings you the latest entertainment news, Netflix updates, Hollywood buzz, and pop culture scoops — daily.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: { type: "website", siteName: "BuzzScoop", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}