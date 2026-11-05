import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import type { EventDefinition, EventTimelineItem } from "@/lib/events";

const pending = "To be announced";

export default function EventPage({ event }: { event: EventDefinition }) {
  const accent = { "--event-accent": event.accentColor } as React.CSSProperties;
  const facts = [
    ...(event.eventDate ? [["Date", event.eventDate]] : []),
    ["Eligibility", event.eligibility],
    ["Format", event.format],
    ["Team size", event.teamSize],
    ["Fee", event.fee],
    ["Prize", event.prize],
    ["Registration deadline", event.deadline],
  ];

  return (
    <div className="detail-shell event-brief">
      <SiteHeader />
      <main className="relative overflow-clip">
        <div className="arcade-grid absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="container relative py-16 sm:py-24" style={accent}>
          <Link href="/#events" className="page-link">Event select</Link>
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
            <div>
              <p className="event-number">{event.number} · {event.categoryLabel}</p>
              <h1 className="detail-title mt-5">{event.name}</h1>
              <p className="mt-5 max-w-xl text-lg text-ink2 sm:text-xl">{event.tagline}</p>
              <p className="mt-8 max-w-2xl text-2xl leading-tight text-ink sm:text-3xl">{event.plainDescription}</p>
            </div>
            <aside className="detail-card">
              <p className="text-sm leading-7 text-ink2">{event.hook}</p>
              <Link href={`/events/${event.slug}/register`} className="button mt-8">Register for {event.name}</Link>
            </aside>
          </div>

          <section className="event-detail-section" aria-labelledby="event-facts">
            <h2 id="event-facts" className="section-title text-3xl">Event details</h2>
            <dl className="event-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </section>

          <div className="event-detail-columns">
            <ContentList id="event-rules" title="Rules" items={event.rules} />
            <ContentList id="event-judging" title="Judging criteria" items={event.judgingCriteria} />
          </div>
          {event.id === "hackathon" && <Timeline id="event-timeline" items={event.timeline} />}

          <div className="mt-16">
            <Link href={`/events/${event.slug}/register`} className="button">Register for {event.name}</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function ContentList({ id, title, items }: { id: string; title: string; items: string[] }) {
  return <section className="event-detail-section" aria-labelledby={id}><h2 id={id} className="section-title text-3xl">{title}</h2>{items.length > 0 ? <ul className="event-content-list">{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="event-empty">{pending}</p>}</section>;
}

function Timeline({ id, items }: { id: string; items: EventTimelineItem[] }) {
  return <section className="event-detail-section" aria-labelledby={id}><h2 id={id} className="section-title text-3xl">Timeline</h2>{items.length > 0 ? <ol className="event-timeline event-timeline--course">{items.map((item, index) => <li key={item.time + item.activity}><span className="timeline-point">{String(index + 1).padStart(2, "0")}</span><div><time>{item.time}</time><strong>{item.activity}</strong><p>{item.instruction ?? item.activity}</p></div></li>)}</ol> : <p className="event-empty">{pending}</p>}</section>;
}

