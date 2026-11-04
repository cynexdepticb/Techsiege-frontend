import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import type { EventDefinition } from "@/lib/events";

export default function RegistrationPlaceholder({ event }: { event: EventDefinition }) {
  return (
    <div className="detail-shell">
      <SiteHeader />
      <main className="relative flex min-h-[calc(100dvh-65px)] items-center overflow-clip">
        <div className="arcade-grid absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="container relative w-full py-16" style={{ "--event-accent": event.accent } as React.CSSProperties}>
          <div className="detail-card mx-auto max-w-2xl">
            <p className="event-number">{event.number} · {event.name}</p>
            <h1 className="detail-title mt-10">Access not ready.</h1>
            <p className="mt-7 max-w-xl text-ink2">The {event.name} entry form is being configured with its own fee, rules and eligibility. Check back when the terminal goes live.</p>
            <Link href={`/events/${event.slug}`} className="button button--quiet mt-10">Return to mission</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
