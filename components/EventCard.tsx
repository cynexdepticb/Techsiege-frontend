import Link from "next/link";
import type { EventDefinition } from "@/lib/events";

export default function EventCard({ event }: { event: EventDefinition }) {
  return <Link href={`/events/${event.slug}`} className="event-card" style={{ "--event-accent": event.accent } as React.CSSProperties}><div className="event-card-top"><span className="event-number">{event.number}</span><span className="event-category">{event.category}</span></div><div><h2 className="event-card-title">{event.shortName}</h2><p className="mt-4 max-w-[18rem] text-muted">{event.tagline}</p></div><div className="event-card-footer"><span>Mission ready</span><span className="event-enter">Start</span></div></Link>;
}
