import type { Metadata } from "next";
import PortalDashboard from "./PortalDashboard";
import { FloatingMenu } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "My registration — TechSiege",
  description: "Check your team's payment status and download ticket PDFs.",
  robots: "noindex",
};

export default function PortalPage() {
  return (
    <main className="relative min-h-screen w-full px-4 pb-24 pt-20 sm:px-6 lg:pl-[22rem] lg:pr-8 lg:pt-8">
      <FloatingMenu dockedDesktop />
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <PortalDashboard />
      </div>
    </main>
  );
}
