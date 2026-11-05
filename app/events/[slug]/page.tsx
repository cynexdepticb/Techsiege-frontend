import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventPage from "@/components/EventPage";
import { EVENTS, getEvent } from "@/lib/events";

export function generateStaticParams() { return EVENTS.map(({ slug }) => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata { const event = getEvent(params.slug); return { title: event ? `${event.name} — TechSiege` : "Event — TechSiege", description: event?.plainDescription }; }
export default function EventRoute({ params }: { params: { slug: string } }) { const event = getEvent(params.slug); if (!event) notFound(); return <EventPage event={event} />; }
