import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";
import { PageHeader } from "@/components/PageHeader";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: `Register — ${SITE.name}`,
  description: `Register your 2–4 member team for ${SITE.name}, the 24-hour AI-agent hackathon in Mangaluru.`,
};

export default function RegisterPage() {
  return (
    <>
      <PageHeader label="Register" />
      <main className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[50rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Register your team</h1>
          </div>
          <RegisterForm />
        </div>
      </main>
    </>
  );
}
