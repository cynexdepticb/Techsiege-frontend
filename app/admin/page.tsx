import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: `Organizer dashboard — ${SITE.name}`,
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
