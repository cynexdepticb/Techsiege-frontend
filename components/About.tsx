import { Reveal, SectionHeading } from "./Reveal";
import { STATS, SITE } from "@/lib/content";
import { CheckCircle, XCircle } from "@phosphor-icons/react/dist/ssr";
import StatNumber from "./StatNumber";

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
      <SectionHeading
        title="Build agents that act"
        sub={`${SITE.shortName} rewards working systems with tools, memory, planning, and visible outcomes.`}
      />
      <Reveal>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-y border-white/5 py-10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dd className="font-display order-1 text-4xl font-bold tracking-tight text-white">
                <StatNumber value={s.value} />
              </dd>
              <dt className="order-2 mt-2 text-sm font-semibold text-slate-200">{s.label}</dt>
              <dd className="order-3 mt-1 text-xs text-muted">{s.sub}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <Reveal delay={0.1} className="mt-2 grid gap-8 py-10 sm:grid-cols-2 sm:gap-12">
        <div className="flex gap-3">
          <XCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-slate-500" aria-hidden="true" />
          <div>
            <h3 className="font-display text-base font-bold text-white">Prompt wrappers do not pass</h3>
            <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-muted">A chat UI without tools, memory, or multi-step behaviour will not clear screening.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <h3 className="font-display text-base font-bold text-white">Working agents do</h3>
            <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-muted">Show a system that plans, calls tools, handles errors, and proves what it did.</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
