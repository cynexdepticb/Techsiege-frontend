import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import type { EventDefinition } from "@/lib/events";

export default function EventPage({ event }: { event: EventDefinition }) {
  const accent = { "--event-accent": event.accent } as React.CSSProperties;

  return (
    <div className="detail-shell">
      <SiteHeader />
      <main className="relative overflow-clip">
        <div className="arcade-grid absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="container relative py-16 sm:py-24" style={accent}>
          <Link href="/#events" className="page-link">Event select</Link>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div>
              <p className="event-number">{event.number} · {event.category}</p>
              <h1 className="detail-title mt-5">{event.name}</h1>
              <p className="mt-5 max-w-xl text-lg text-ink2 sm:text-xl">{event.tagline}</p>
              <p className="mt-8 max-w-2xl text-2xl leading-tight text-ink sm:text-3xl">{event.hook}</p>
            </div>
            <aside className="detail-card">
              <p className="text-sm leading-7 text-ink2">{event.description}</p>
              <Link href={`/events/${event.slug}/register`} className="button mt-8">Register your team</Link>
            </aside>
          </div>
          <section className="mt-20 border-t border-rule pt-8" aria-labelledby="event-details">
            <h2 id="event-details" className="section-title text-3xl">Mission details</h2>
            <ul className="detail-list">{event.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
          </section>
          <p className="mt-16 max-w-xl text-sm leading-7 text-muted">The mission brief may evolve, but your team can register now and secure its place in the arena.</p>
        </div>
      </main>
    </div>
  );
}
