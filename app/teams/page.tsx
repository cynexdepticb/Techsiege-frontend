import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import TeamsView from "./TeamsView";

export const metadata: Metadata = {
  title: "Teams — TechSiege",
  description: "View TechSiege team details.",
  robots: "noindex",
};

export default function TeamsPage() {
  return (
    <>
      <PageHeader tag="Teams" backHref="/" backLabel="Back to site" label="Teams" />
      <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10 sm:px-6">
        <TeamsView />
      </main>
    </>
  );
}
