import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/monetization/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://buzzscoop.news"),
  title: {
    default: "BuzzScoop — Entertainment News",
    template: "%s | BuzzScoop",
  },
  description: "BuzzScoop — latest entertainment news, Netflix, Hollywood.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-white text-gray-900 antialiased min-h-screen flex flex-col dark:bg-gray-950 dark:text-gray-100">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <GoogleAnalytics />
      </body>
    </html>
  );
}