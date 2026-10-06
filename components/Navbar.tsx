"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { List, SignOut } from "@phosphor-icons/react";
import { NAV_LINKS, SITE } from "@/lib/content";
import { getSession, signOut as authSignOut, type Session } from "@/lib/auth";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [hasTeam, setHasTeam] = useState<boolean | null>(null);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    setHasTeam(null);
    if (s?.kind === "participant") {
      fetch("/api/portal/registration", {
        headers: { Authorization: `Bearer ${s.token}` },
      })
        .then((r) => r.json())
        .then((d) => setHasTeam(d.registered === true))
        .catch(() => setHasTeam(null));
    }
  }, [pathname]);

  async function logout() {
    await authSignOut();
    setSession(null);
    setHasTeam(null);
    router.refresh();
  }

  const showRegister = !session || (session.kind === "participant" && hasTeam === false);
  const dashboardHref = session?.kind === "organizer" ? "/admin" : "/portal";
  const dashboardLabel = session?.kind === "organizer" ? "Dashboard" : "My portal";

  return (
    <>
    <header className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${scrolled ? "border-accent/15 bg-void/95" : "border-white/5 bg-void/80"}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6" aria-label="Main">
        {session && (
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-lg border border-white/10 p-2 text-white transition hover:border-accent/40"
          >
            <List size={20} />
          </button>
        )}
        <a href="#top" className="font-display text-lg font-bold tracking-tight text-white">
          {SITE.shortName}
          <span className="ml-2 hidden rounded-full border border-accent/40 px-2 py-0.5 text-[10px] font-semibold text-accent sm:inline">{SITE.year}</span>
        </a>
        <div className="ml-auto hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-slate-300 transition hover:text-accent">
              {l.label}
            </a>
          ))}
          {session ? (
            <>
              <a href={dashboardHref} className="text-sm font-semibold text-accent transition hover:brightness-110">
                {dashboardLabel}
              </a>
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-red-400/50"
              >
                <SignOut size={15} /> Sign out
              </button>
            </>
          ) : (
            <a href="/login" className="text-sm text-slate-300 transition hover:text-accent">
              Sign in
            </a>
          )}
          {showRegister && (
            <a
              href={SITE.registrationUrl}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.98]"
            >
              Register
            </a>
          )}
        </div>
        {session ? (
          <a
            href={dashboardHref}
            className="ml-auto rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black lg:hidden"
          >
            {dashboardLabel}
          </a>
        ) : (
          <a
            href={SITE.registrationUrl}
            className="ml-auto rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black lg:hidden"
          >
            Register
          </a>
        )}
      </nav>
    </header>
    <Sidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
}
