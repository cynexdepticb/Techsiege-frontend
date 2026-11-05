"use client";

import Link from "next/link";
import { useState } from "react";
import { EVENTS } from "@/lib/events";

export default function ArenaConsole() {
  const [selected, setSelected] = useState(EVENTS[0]);

  return (
    <div className="arena-console" aria-label="TechSiege arena selector">
      <div className="console-header">
        <span>Arena selector</span>
        <span>{EVENTS.length} events open</span>
      </div>
      <div className="console-stage">
        <div className="console-mark">{selected.number}</div>
        <div className="console-stage-detail">
          <h3 className="console-event-name" style={{ color: selected.accentColor }}>
            {selected.name}
          </h3>
          <p className="console-event-desc">{selected.plainDescription}</p>
          <div className="console-event-meta">
            <span>Fee {selected.fee}</span>
            <span>Team {selected.teamSize}</span>
          </div>
          <Link
            href={`/events/${selected.slug}`}
            className="console-view-details"
          >
            View details
          </Link>
        </div>
      </div>
      <div className="console-arena-list" role="tablist" aria-label="Select an event">
        {EVENTS.map((event) => (
          <button
            key={event.slug}
            role="tab"
            aria-selected={selected.slug === event.slug}
            className={`console-arena ${selected.slug === event.slug ? "console-arena--active" : ""}`}
            style={{ "--event-accent": event.accentColor } as React.CSSProperties}
            onClick={() => setSelected(event)}
          >
            <span>{event.number}</span>
            <strong>{event.shortName}</strong>
            <i aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
