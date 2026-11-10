import Link from "next/link";
import { EVENT_STATUS_LABELS, type EventDefinition } from "@/lib/events";

type DetailIconName = "teamSize" | "fee" | "prize";

export default function EventCard({ event }: { event: EventDefinition }) {
  const [teamFormat, attendance] = event.format.split(" · ");
  const details = [
    { key: "teamSize", label: "Team", value: event.teamSize },
    { key: "fee", label: "Fee", value: event.fee },
    { key: "prize", label: "Prize", value: event.prize },
  ] as const;

  return (
    <article className="event-card" style={{ "--event-accent": event.accentColor } as React.CSSProperties}>
      <header className="event-card-top">
        <span className="event-number">{event.number}</span>
        <span className="event-category">{event.categoryLabel}</span>
      </header>

      <div className="event-card-copy">
        <h2 className="event-card-title">{event.shortName}</h2>
        <p className="event-card-tagline">{event.tagline}</p>
        <p className="event-card-description">{event.plainDescription}</p>
      </div>

      <ul className="event-tags" aria-label="Event format">
        <li>{teamFormat}</li>
        <li>{attendance}</li>
      </ul>

      <dl className="event-details">
        {details.map(({ key, label, value }) => {
          return (
            <div key={key}>
              <dt><DetailIcon name={key} />{label}</dt>
              <dd>{value}</dd>
            </div>
          );
        })}
      </dl>

      <footer className="event-card-footer">
        <span className={"event-status event-status--" + event.status}>{EVENT_STATUS_LABELS[event.status]}</span>
        <div className="event-card-actions">
          <Link href={"/events/" + event.slug} className="event-card-action event-card-action--secondary">View details</Link>
          <Link href={"/events/" + event.slug} className="event-card-action">Register</Link>
        </div>
      </footer>
    </article>
  );
}

function DetailIcon({ name }: { name: DetailIconName }) {
  const common = { "aria-hidden": true, viewBox: "0 0 24 24", width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "teamSize") return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 5a3 3 0 0 1 0 6" /><path d="M21 20c0-2.4-1.4-4.5-3.5-5.5" /></svg>;
  if (name === "fee") return <svg {...common}><path d="M6 4h10" /><path d="M6 8h9" /><path d="M6 12h9" /><path d="M6 4c4.5 2.5 4.5 6.5 0 8l8 8" /></svg>;
  return <svg {...common}><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H4v1a4 4 0 0 0 4 4" /><path d="M16 6h4v1a4 4 0 0 1-4 4" /><path d="M12 13v4" /><path d="M8 21h8" /></svg>;
}
