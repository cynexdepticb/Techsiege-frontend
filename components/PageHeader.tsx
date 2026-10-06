"use client";
import { useState } from "react";
import { List } from "@phosphor-icons/react";
import { SITE } from "@/lib/content";
import Sidebar from "./Sidebar";

function MenuButton({ onOpen, className }: { onOpen: () => void; className?: string }) {
  return (
    <button
      onClick={onOpen}
      aria-label="Open menu"
      className={`rounded-lg border border-white/10 p-2 text-white transition hover:border-accent/40 ${className ?? ""}`}
    >
      <List size={20} />
    </button>
  );
}

/** Full top bar for sub-pages: menu + brand + back link. */
export function PageHeader({
  tag,
  backHref = "/",
  backLabel = "← Back to site",
  label,
}: {
  tag?: string;
  backHref?: string;
  backLabel?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="border-b border-white/5 bg-void/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6" aria-label={label ?? "Page"}>
          <MenuButton onOpen={() => setOpen(true)} />
          <a href="/" className="font-display text-lg font-bold tracking-tight text-white">
            {SITE.shortName}
            <span className="ml-2 rounded-full border border-accent/40 px-2 py-0.5 text-[10px] font-semibold text-accent">
              {tag ?? SITE.year}
            </span>
          </a>
          <a href={backHref} className="ml-auto text-sm text-slate-300 transition hover:text-accent">
            {backLabel}
          </a>
        </nav>
      </header>
      <Sidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** Floating menu button for pages without a top bar (login, portal). */
export function FloatingMenu({ dockedDesktop = false }: { dockedDesktop?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={`fixed left-4 top-4 z-40 ${dockedDesktop ? "lg:hidden" : ""}`}>
        <MenuButton onOpen={() => setOpen(true)} className="bg-void/80 backdrop-blur-xl" />
      </div>
      <Sidebar open={open} onClose={() => setOpen(false)} dockedDesktop={dockedDesktop} />
    </>
  );
}
