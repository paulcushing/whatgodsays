import type { Metadata, Viewport } from "next";
import { Mulish, Newsreader } from "next/font/google";
import "./globals.css";

import InstallPrompt from "./installprompt";
import RegisterSW from "./registersw";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ContentProvider } from "@/data/ContentProvider";

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const sans = Mulish({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "What God Says About You",
  description: "A beautiful sample of what Jesus says about YOU.",
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f6f8fb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} font-sans bg-page`}>
        <RegisterSW />
        <InstallPrompt />
        <ContentProvider>{children}</ContentProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
