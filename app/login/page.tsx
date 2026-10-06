import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in - TechSiege",
  description: "Sign in with a one-time email code.",
  robots: "noindex",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" aria-hidden />

      <a
        href="/"
        className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-void/80 px-4 py-2 text-xs font-semibold text-slate-200 backdrop-blur-xl transition hover:border-accent/50 hover:text-white sm:left-6 sm:top-6"
      >
        ← Back to site
      </a>
      <section className="glass relative grid w-full max-w-5xl overflow-hidden rounded-2xl lg:grid-cols-[0.95fr_1.05fr]" aria-label="TechSiege account access">
        <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <a href="/" className="font-display text-lg font-bold tracking-tight text-white">
            TechSiege
            <span className="ml-2 rounded-full border border-accent/40 px-2 py-0.5 text-[10px] font-semibold text-accent">
              2026
            </span>
          </a>
          <div className="mt-10 max-w-sm">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Participant portal</p>
            <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Sign in to your team space.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Access tickets, event updates, checkpoints, and transparent evaluation once your team is registered.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-5 sm:p-8">
          <Suspense fallback={<div className="h-80 w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03]" />}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
