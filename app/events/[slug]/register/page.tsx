import { notFound } from "next/navigation";
import RegistrationPlaceholder from "@/components/RegistrationPlaceholder";
import { getEvent } from "@/lib/events";

export default function EventRegistrationRoute({ params }: { params: { slug: string } }) { const event = getEvent(params.slug); if (!event) notFound(); return <RegistrationPlaceholder event={event} />; }
