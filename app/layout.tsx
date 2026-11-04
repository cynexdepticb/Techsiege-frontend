import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "TechSiege/26 — Five ways to show up",
  description: "A campus-wide series of build, solve, defend, engineer and compete events.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://techsiege.in"),
  openGraph: {
    title: "TechSiege/26 — Five ways to show up",
    description: "A campus-wide series of events at AIET, Mangaluru.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} bg-void font-body antialiased`}>{children}</body>
    </html>
  );
}
