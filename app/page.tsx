import Link from "next/link";
import Countdown from "@/components/Countdown";
import EventCard from "@/components/EventCard";
import { AboutSection, ContactSection, FaqSection, HowItWorks, PrizeSection, ScheduleSection, SiteFooter } from "@/components/FestivalSections";
import SiteHeader from "@/components/SiteHeader";
import { EVENTS, FEST } from "@/lib/events";

export default function HomePage() {
  const [festName, festYear] = FEST.name.split(" ");
  return <div className="page-shell"><SiteHeader /><main id="main"><section className="hero-shell hero-shell--masthead relative overflow-clip"><div className="scanlines absolute inset-0" aria-hidden="true" /><div className="container hero-grid relative"><div className="hero-copy"><h1 className="hero-title"><span className="hero-title-name">{festName}</span><span>{festYear}</span></h1><div className="hero-bottom"><div><div className="hero-info"><span>{FEST.venue}</span><span>{EVENTS.length} arenas</span><span>{FEST.prizePool} prize pool</span></div><p className="hero-lead">{FEST.tagline}</p><div className="hero-actions"><a href="#events" className="button">Select your arena</a><a href="#schedule" className="button button--quiet">View schedule</a></div></div><Countdown /></div></div></div></section><section id="events" className="section"><div className="container"><div className="section-heading"><h2 className="section-title">Choose your arena.</h2><p className="section-summary">Five challenges. Five different ways to prove yourself.</p></div><div className="event-grid">{EVENTS.map((event) => <EventCard key={event.slug} event={event} />)}</div></div></section><HowItWorks /><ScheduleSection /><PrizeSection /><AboutSection /><FaqSection /><ContactSection /><section className="section"><div className="container"><p className="closing-statement">The arena is waiting. Pick your event and bring your people.</p><Link href="#events" className="button mt-8">View all missions</Link></div></section></main><SiteFooter /></div>;
}
