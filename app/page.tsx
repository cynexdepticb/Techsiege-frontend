import Link from "next/link";
import EventCard from "@/components/EventCard";
import SiteHeader from "@/components/SiteHeader";
import { EVENTS } from "@/lib/events";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-arcade text-slate-100">
      <SiteHeader />
      <main>
        <section className="relative flex min-h-[calc(100dvh-65px)] items-center overflow-hidden border-b-2 border-cyan/30">
          <div className="arcade-grid absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="scanlines absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-cyan/10 blur-[100px]" aria-hidden="true" />
          <div className="relative mx-auto grid w-full max-w-7xl gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-24">
            <div className="animate-enter">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.28em] text-cyan">Your skills. Your arena. Your move.</p>
              <h1 className="mt-7 max-w-4xl font-mono text-[clamp(4rem,10vw,8.5rem)] font-black uppercase leading-[.78] tracking-[-.12em] text-yellow [text-shadow:5px_5px_0_#ef6b4a]">
                Five ways<br /><span className="text-cyan">to show up.</span>
              </h1>
              <p className="mt-9 max-w-xl font-mono text-sm leading-7 text-slate-300 sm:text-base">
                One campus. Five arenas. Zero room to play it safe.
              </p>
              <p className="mt-2 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                Welcome to TECHSIEGE//26 — where ideas become weapons, code becomes strategy, circuits come alive, and competition brings out your best.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href="#events" className="arcade-button arcade-button-primary">Select your arena <span>↓</span></a>
                <a href="#missions" className="arcade-button arcade-button-secondary">Explore the missions</a>
              </div>
            </div>

            <div className="animate-enter-delay relative mx-auto w-full max-w-[30rem] lg:max-w-none">
              <div className="hud-panel relative overflow-hidden p-5 sm:p-7">
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-br" />
                <div className="flex items-center justify-between border-b border-cyan/25 pb-4 font-mono text-[10px] uppercase tracking-[.18em]">
                  <span className="text-cyan">Mission select</span>
                  <span className="text-yellow">Player 01 / Online</span>
                </div>
                <div className="relative flex min-h-[220px] items-center justify-center py-8">
                  <div className="hud-reticle" aria-hidden="true"><span>TS</span></div>
                  <div className="absolute left-0 top-6 font-mono text-[9px] leading-5 text-slate-500">LOCATION<br /><strong className="text-slate-300">AIET / MLR</strong></div>
                  <div className="absolute bottom-6 right-0 text-right font-mono text-[9px] leading-5 text-slate-500">ACTIVE ARENAS<br /><strong className="text-cyan">05 ONLINE</strong></div>
                </div>
                <div className="grid grid-cols-5 gap-1 border-t border-cyan/25 pt-4">
                  {EVENTS.map((event) => <span key={event.slug} className="h-1.5" style={{ backgroundColor: event.accent }} title={event.name} />)}
                </div>
                <p className="mt-4 font-mono text-[9px] uppercase tracking-[.14em] text-slate-500">Select a mission below to begin</p>
              </div>
            </div>
          </div>
        </section>

        <section id="events" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="mb-10 flex flex-col justify-between gap-5 border-b border-cyan/20 pb-7 sm:flex-row sm:items-end">
            <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.28em] text-cyan">Mission select</p><h2 className="mt-3 font-mono text-4xl font-black uppercase tracking-[-.08em] text-yellow sm:text-6xl">Choose your arena.</h2></div>
            <p className="max-w-xs font-mono text-xs leading-6 text-slate-500 sm:text-right">Five challenges. Five different ways to prove yourself.</p>
          </div>
          <div id="missions" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{EVENTS.map((event) => <EventCard key={event.slug} event={event} />)}</div>
        </section>

        <section className="border-y-2 border-cyan/20 bg-[#0d1428]">
          <div className="mx-auto grid max-w-7xl gap-px bg-cyan/10 px-5 sm:grid-cols-3 sm:px-8">
            {[
              ["01", "Pick", "Choose your arena.", "Find the competition that matches your edge."],
              ["02", "Read", "Understand the rules.", "Every event gets its own mission brief."],
              ["03", "Enter", "Register for the event.", "Your arena. Your move. Your moment."],
            ].map(([number, label, title, copy]) => (
              <div key={number} className="bg-[#0d1428] py-10 sm:px-8 first:sm:pl-0 last:sm:pr-0">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-orange">{number} / {label}</p>
                <h3 className="mt-4 font-mono text-xl font-bold uppercase text-white">{title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">{copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="flex flex-col justify-between gap-3 px-5 py-8 font-mono text-[10px] uppercase tracking-[.16em] text-slate-600 sm:flex-row sm:px-8">
        <span>TECHSIEGE//26</span><span>AIET / MANGALURU / 2026</span>
      </footer>
    </div>
  );
}
