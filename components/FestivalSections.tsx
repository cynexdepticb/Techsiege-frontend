"use client";

import Link from "next/link";
import { useState } from "react";
import { EVENTS, FEST } from "@/lib/events";

export function ScheduleSection() {
  const [day, setDay] = useState(FEST.schedule[0]?.id);
  const selected = FEST.schedule.find((item) => item.id === day) ?? FEST.schedule[0];
  if (!selected) return null;
  return <section id="schedule" className="section"><div className="container"><SectionHeading title="Schedule." copy="Arena timings will be confirmed in the final brief." /><div className="schedule-tabs" role="tablist" aria-label="Festival days">{FEST.schedule.map((item) => <button key={item.id} role="tab" aria-selected={item.id === selected.id} className={item.id === selected.id ? "schedule-tab schedule-tab--active" : "schedule-tab"} onClick={() => setDay(item.id)}>{item.label}<span>{item.date}</span></button>)}</div><ol className="schedule-list">{selected.entries.map((entry) => { const event = EVENTS.find((item) => item.id === entry.eventId); return <li key={entry.eventId} style={{ "--event-accent": event?.accentColor } as React.CSSProperties}><time>{entry.time}</time><strong>{entry.activity}</strong><span>{event?.categoryLabel}</span></li>; })}</ol></div></section>;
}

export function PrizeSection() {
  return <section id="prizes" className="section prize-band"><div className="container"><SectionHeading title="Prizes." copy="One pool. Five arenas. Five different ways to earn it." /><p className="prize-pool">{FEST.prizePool}</p><div className="prize-grid">{EVENTS.map((event) => <article key={event.id} className="prize-card" style={{ "--event-accent": event.accentColor } as React.CSSProperties}><span>{event.number}</span><h3>{event.name}</h3><p>{event.prize}</p></article>)}</div></div></section>;
}

export function AboutSection() {
  return <section id="about" className="section"><div className="container about-grid about-grid--single"><div><p className="event-number">About Techsiege</p><h2 className="section-title mt-5">Built for people who show up.</h2><p className="about-copy">{FEST.about}</p><p className="about-organizer">Organized by {FEST.organizer} · {FEST.address}</p></div></div></section>;
}

export function FaqSection() {
  return <section id="faq" className="section"><div className="container"><SectionHeading title="FAQ." copy="Clear answers now. Confirmed details as the brief lands." /><div className="faq-list">{FEST.faq.map((item) => <details key={item.question} className="faq-item"><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div></section>;
}

export function ContactSection() {
  const external = (value: string) => value.startsWith("http");
  return <section id="contact" className="section contact-band"><div className="container"><SectionHeading title="Contact." copy="Reach the right arena directly." /><div className="contact-grid"><div className="contact-card"><p>Email</p><a href={"mailto:" + FEST.contactEmail}>{FEST.contactEmail}</a><div className="contact-actions">{external(FEST.whatsappLink) ? <a className="button" href={FEST.whatsappLink}>WhatsApp</a> : <span className="button button--quiet" aria-disabled="true">WhatsApp [CONFIRM]</span>}</div><a className="page-link mt-8 inline-block" href={external(FEST.mapLink) ? FEST.mapLink : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(FEST.address)}>Open venue map</a></div><div className="coordinator-grid">{EVENTS.map((event) => <article key={event.id} style={{ "--event-accent": event.accentColor } as React.CSSProperties}><h3>{event.name}</h3>{event.coordinators.length ? event.coordinators.map((person) => person.phone ? <a key={person.name} href={"tel:" + person.phone}>{person.name} · {person.phone}</a> : <p key={person.name}>{person.name}</p>) : <p>[CONFIRM] Coordinator details</p>}</article>)}</div></div></div></section>;
}

export function HowItWorks() {
  const links = ["#events", "#faq", "/events/hackathon/register"];
  return <section className="process-band" id="how-it-works"><div className="container"><ol className="process-list">{[["Pick", "Choose your arena.", "Find the challenge that matches your edge."], ["Read", "Understand the rules.", "Open an arena page for the full brief."], ["Enter", "Register for the event.", "Submit your roster and payment proof."]].map(([label, title, copy], index) => <li key={label} className="process-step"><Link href={links[index]} className="process-link"><span className="process-number">{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></Link></li>)}</ol></div></section>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-grid"><div><Link href="/" className="brand-mark">{FEST.name}</Link><p>{FEST.address}</p></div><nav aria-label="Footer links"><a href="#events">Events</a><a href="#schedule">Schedule</a><a href="#faq">FAQ</a><a href="#contact">Contact</a></nav><div><a href={"mailto:" + FEST.contactEmail}>{FEST.contactEmail}</a><div className="footer-socials"><a href={FEST.whatsappLink} aria-label="WhatsApp">WA</a></div></div></div><div className="container footer-copy">© {new Date(FEST.startDate).getFullYear()} {FEST.name}. All rights reserved.</div></footer>;
}

function SectionHeading({ title, copy }: { title: string; copy: string }) { return <div className="section-heading"><h2 className="section-title">{title}</h2><p className="section-summary">{copy}</p></div>; }
