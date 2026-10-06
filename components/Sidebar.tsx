"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X, House, PencilLine, SignIn, UserCircle, ShieldCheck, SignOut } from "@phosphor-icons/react";
import { NAV_LINKS, SITE } from "@/lib/content";
import { getSession, signOut, type Session } from "@/lib/auth";

export default function Sidebar({ open, onClose, dockedDesktop = false }: { open: boolean; onClose: () => void; dockedDesktop?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [hasTeam, setHasTeam] = useState<boolean | null>(null);
  const shouldLoad = open || dockedDesktop;

  useEffect(() => {
    if (!shouldLoad) return;
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
  }, [shouldLoad]);

  // Register is for newcomers: hidden for organizers (can't register) and for
  // participants who already have a team. Unknown state → show it.
  const showRegister = !session || (session.kind === "participant" && hasTeam === false);

  useEffect(() => {
    if (!dockedDesktop) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function logout() {
    await signOut();
    setSession(null);
    onClose();
    router.push("/");
  }

  const pages = [
    { href: "/", label: "Home", icon: <House size={18} /> },
    ...(showRegister
      ? [{ href: "/register", label: "Register team", icon: <PencilLine size={18} /> }]
      : []),
    ...(session?.kind === "participant"
      ? [{ href: "/portal", label: "My portal", icon: <UserCircle size={18} /> }]
      : []),
    ...(session?.kind === "organizer"
      ? [{ href: "/admin", label: "Organizer dashboard", icon: <ShieldCheck size={18} /> }]
      : []),
    ...(!session ? [{ href: "/login", label: "Sign in", icon: <SignIn size={18} /> }] : []),
  ];

  const linkCls = (active: boolean) =>
    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${
      active ? "bg-accent/15 font-semibold text-accent" : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"} ${dockedDesktop ? "lg:pointer-events-none" : ""}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"} ${dockedDesktop ? "lg:hidden" : ""}`}
      />
      <aside
        role="dialog"
        aria-label="Site navigation"
        className={`pointer-events-auto absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col border-r border-white/10 bg-navy shadow-glow transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${dockedDesktop ? "lg:max-w-none lg:translate-x-0 lg:shadow-none" : ""}`}
      >
        <div className="flex items-center justify-between border-b border-white/5 p-4">
          <span className="font-display text-base font-bold text-white">
            {SITE.shortName} <span className="ml-1 rounded-full border border-accent/40 px-2 py-0.5 text-[10px] text-accent">{SITE.year}</span>
          </span>
          <button onClick={onClose} aria-label="Close menu" className={`rounded-lg border border-white/10 p-2 text-white hover:border-accent/40 ${dockedDesktop ? "lg:hidden" : ""}`}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4" aria-label="All pages">
          <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-widest text-muted">Pages</p>
          <ul className="space-y-1">
            {pages.map((p) => (
              <li key={p.href + p.label}>
                <a href={p.href} onClick={onClose} aria-current={pathname === p.href ? "page" : undefined} className={linkCls(pathname === p.href)}>
                  <span className="text-accent">{p.icon}</span>
                  {p.label}
                </a>
              </li>
            ))}
          </ul>

          <p className="px-4 pb-2 pt-6 text-[11px] font-bold uppercase tracking-widest text-muted">On the home page</p>
          <ul className="space-y-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href.startsWith("#") ? `/${l.href}` : l.href} onClick={onClose} className={linkCls(false)}>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-white/5 p-4">
          {session ? (
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{session.name || session.email}</p>
                <p className="truncate font-mono text-[11px] text-muted">{session.role}</p>
              </div>
              <button onClick={logout} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-slate-200 hover:border-red-400/50">
                <SignOut size={14} /> Out
              </button>
            </div>
          ) : (
            <a href="/login" onClick={onClose} className="block rounded-full bg-accent py-2.5 text-center text-sm font-bold text-black hover:brightness-110">
              Sign in →
            </a>
          )}
        </div>
      </aside>
    </div>
  );
}
