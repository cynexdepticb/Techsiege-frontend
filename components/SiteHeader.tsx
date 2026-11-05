"use client";

import Link from "next/link";
import { useState } from "react";
import { FEST } from "@/lib/events";

const navLinks = [
  { label: "Events", href: "/#events" },
  { label: "Schedule", href: "/#schedule" },
  { label: "Prizes", href: "/#prizes" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

const hamburger = (
  <svg
    aria-hidden="true"
    className="menu-icon"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [festName, festYear] = FEST.name.split(" ");

  return (
    <header className="site-header sticky top-0 z-sticky-nav" aria-label="Main navigation">
      <nav className="container flex items-center justify-between py-4 px-6">
        <Link href="/" className="brand-mark" aria-label={`${FEST.name} home`}>
          {festName} <span>{festYear}</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="header-link">
              {link.label}
            </Link>
          ))}
          <a href="/#events" className="button button--nav">
            Register
          </a>
        </div>

        {/* Mobile: hamburger + always-visible Register */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            className="menu-button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? (
              <svg
                aria-hidden="true"
                className="menu-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              hamburger
            )}
          </button>
          <a href="/#events" className="button button--nav">
            Register
          </a>
        </div>

        {/* Mobile overlay menu */}
        <div
          className={`mobile-menu fixed inset-0 z-[50] flex flex-col items-center justify-center gap-8 bg-paper border border-rule text-ink p-12 text-center transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          role="menu"
          aria-hidden={!open}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="mobile-menu-link text-3xl font-display font-bold tracking-tight uppercase"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/#events"
            className="button"
            onClick={() => setOpen(false)}
          >
            Register
          </a>
        </div>
      </nav>
    </header>
  );
}
