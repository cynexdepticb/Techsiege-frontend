"use client";
import { useEffect, useState } from "react";
import { Reveal, SectionHeading } from "./Reveal";
import { SITE } from "@/lib/content";

type Sponsor = { name: string; tier: string; amount: number };

const inr = (n: number) => (n > 0 ? ` · ₹${n.toLocaleString("en-IN")}` : "");

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[] | null>(null);

  useEffect(() => {
    fetch("/api/sponsors")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.sponsors)) setSponsors(d.sponsors);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="sponsors" className="scroll-mt-20 border-y border-white/5 bg-navy/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title={sponsors && sponsors.length > 0 ? "Our sponsors" : "Sponsors — announcing soon"}
          sub="We're lining up partners who want to meet 200+ builders. Check back shortly."
        />
        {sponsors && sponsors.length > 0 ? (
          <ul className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((s) => (
              <li key={`${s.name}-${s.tier}`} className="glass rounded-2xl p-6 text-center">
                <p className="font-display text-lg font-bold text-white">{s.name}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent">
                  {s.tier}{inr(s.amount)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <Reveal className="text-center">
            <div className="glass mx-auto max-w-3xl rounded-2xl border-dashed p-8">
              <p className="font-display text-xl font-bold text-white">Sponsor wall coming soon.</p>
              <p className="mt-2 text-sm text-muted">Tiers and confirmed logos will appear here once announced.</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={`mailto:${SITE.sponsorEmail}?subject=${encodeURIComponent("TechSiege 2026 sponsorship")}`} className="rounded-full bg-accent px-8 py-3 text-sm font-bold text-black shadow-glow hover:brightness-110">
                  Become a Sponsor →
                </a>
                <a href={`mailto:${SITE.sponsorEmail}`} className="rounded-full border border-white/15 px-8 py-3 text-sm font-semibold text-white hover:border-accent/50">
                  {SITE.sponsorEmail}
                </a>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
