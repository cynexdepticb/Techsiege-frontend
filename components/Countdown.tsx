"use client";

import { useEffect, useState } from "react";
import { FEST } from "@/lib/events";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = +new Date(FEST.startDate) - Date.now();
      if (diff <= 0) {
        setTime({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown">
      <dl className="countdown-list">
        <div>
          <dt className="countdown-label">Days</dt>
          <dd className="countdown-value">{pad(time.d)}</dd>
        </div>
        <div>
          <dt className="countdown-label">Hours</dt>
          <dd className="countdown-value">{pad(time.h)}</dd>
        </div>
        <div>
          <dt className="countdown-label">Minutes</dt>
          <dd className="countdown-value">{pad(time.m)}</dd>
        </div>
        <div>
          <dt className="countdown-label">Seconds</dt>
          <dd className="countdown-value">{pad(time.s)}</dd>
        </div>
      </dl>
    </div>
  );
}
