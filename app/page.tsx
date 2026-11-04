import Link from "next/link";
import EventCard from "@/components/EventCard";
import SiteHeader from "@/components/SiteHeader";
import { EVENTS } from "@/lib/events";

const steps = [
  ["Pick", "Choose your arena.", "Find the challenge that matches your edge."],
  ["Read", "Understand the rules.", "Get the mission brief before you enter."],
  ["Enter", "Register for the event.", "Your roster, your arena, your move."],
] as const;

export default function HomePage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main id="main">
        <section className="hero-shell relative overflow-clip"><div className="arcade-grid absolute inset-0" aria-hidden="true" /><div className="scanlines absolute inset-0" aria-hidden="true" /><div className="container hero-grid relative"><div className="hero-copy"><h1 className="hero-title"><span className="hero-title-name">TECHSIEGE</span><span>2026</span></h1><p className="hero-lead">Five ways to show up. One campus, five arenas, and zero room to play it safe.</p><div className="hero-actions"><a href="#events" className="button">Select your arena</a><a href="#missions" className="button button--quiet">Explore the missions</a></div></div><div className="arena-console" aria-label="TechSiege arena selector"><div className="console-header"><span>Arena selector</span><span>Five live</span></div><div className="console-stage"><div className="console-mark">TS</div><p className="console-stage-copy">Choose a signal<br />and enter the arena.</p></div><div className="console-arena-list">{EVENTS.map((event) => <Link key={event.slug} href={`/events/${event.slug}`} className="console-arena" style={{ "--event-accent": event.accent } as React.CSSProperties}><span>{event.number}</span><strong>{event.shortName}</strong><i aria-hidden="true" /></Link>)}</div></div></div></section>
        <section id="events" className="section"><div className="container"><div className="section-heading"><h2 className="section-title">Choose your arena.</h2><p className="section-summary">Five challenges. Five different ways to prove yourself.</p></div><div id="missions" className="event-grid">{EVENTS.map((event) => <EventCard key={event.slug} event={event} />)}</div></div></section>
        <section className="process-band"><div className="container"><ol className="process-list">{steps.map(([label, title, copy], index) => <li key={label} className="process-step"><span className="process-number">{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
        <section className="section"><div className="container"><p className="closing-statement">The arena is waiting. Pick your event and bring your people.</p><Link href="#events" className="page-link">View all missions</Link></div></section>
      </main>
      <footer className="container footer-line"><span>TECHSIEGE 2026</span><span>AIET, Mangaluru, 2026</span></footer>
    </div>
  );
}
