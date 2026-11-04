import Link from "next/link";
import type { EventDefinition } from "@/lib/events";

export default function EventCard({ event }: { event: EventDefinition }) {
  return <Link href={`/events/${event.slug}`} className="group relative flex min-h-[270px] flex-col justify-between overflow-hidden border-2 border-[#56e7ff]/25 bg-[#10182d] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#f5f25d] hover:shadow-[4px_4px_0_#ef6b4a]" style={{ "--event-soft": event.softAccent } as React.CSSProperties}>
    <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(circle at 90% 10%, var(--event-soft), transparent 50%)" }} aria-hidden="true" />
    <div className="relative flex items-start justify-between"><span className="font-mono text-xs text-[#56e7ff]">LVL {event.number}</span><span className="border border-[#56e7ff]/40 px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[.16em] text-[#f5f25d]">{event.category}</span></div>
    <div className="relative"><h2 className="font-mono text-2xl font-black uppercase tracking-[-0.05em]" style={{ color: event.accent }}>{event.shortName}</h2><p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">{event.tagline}</p></div>
    <div className="relative flex items-center justify-between border-t border-[#56e7ff]/20 pt-4 font-mono text-[10px] uppercase tracking-[.12em] text-slate-500"><span>Press enter to view</span><span className="text-[#f5f25d] transition group-hover:translate-x-1" aria-hidden="true">START / ENTER ARENA ↗</span></div>
  </Link>;
}
