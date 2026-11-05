import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { FEST } from "@/lib/events";
import "./globals.css";
const display = Space_Grotesk({ subsets: ["latin"], variable: "--next-font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--next-font-body", display: "swap" });



export const metadata: Metadata = {
  title: `${FEST.name} — ${FEST.tagline}`,
  description: "A campus-wide series of build, solve, defend, engineer and compete events.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://techsiege.in"),
  openGraph: {
    title: `${FEST.name} — ${FEST.tagline}`,
    description: `A campus-wide series of events at ${FEST.address}.`,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} bg-canvas font-body antialiased`}>{children}</body>
    </html>
  );
}
