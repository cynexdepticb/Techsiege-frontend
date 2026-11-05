import Link from "next/link";
import { notFound } from "next/navigation";
import EventRegistrationForm from "@/components/EventRegistrationForm";
import SiteHeader from "@/components/SiteHeader";
import { getEvent } from "@/lib/events";

export default function EventRegistrationRoute({ params }: { params: { slug: string } }) {
  const event = getEvent(params.slug);
  if (!event) notFound();

  return (
    <div className="detail-shell">
      <SiteHeader />
      <main className="relative overflow-clip">
        <div className="arcade-grid absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="container relative py-12 sm:py-16" style={{ "--event-accent": event.accentColor } as React.CSSProperties}>
          <Link href={`/events/${event.slug}`} className="page-link">Return to mission</Link>
          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] lg:items-start">
            <aside className="lg:sticky lg:top-8">
              <p className="event-number">{event.number} · {event.categoryLabel}</p>
              <h1 className="detail-title mt-5">Enter {event.name}</h1>
              <p className="mt-7 max-w-sm text-lg leading-7 text-ink2">{event.registrationIntro}</p>
              <ul className="mt-8 space-y-3 border-l-2 border-[var(--event-accent)] pl-5 text-sm leading-6 text-muted">
                {event.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
            </aside>
            <section className="detail-card" aria-labelledby="registration-title">
              <h2 id="registration-title" className="section-title text-3xl">Registration</h2>
              <p className="mt-3 text-sm text-muted">Complete the team details, then submit your payment proof for verification.</p>
              <div className="mt-8"><EventRegistrationForm event={event} /></div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
