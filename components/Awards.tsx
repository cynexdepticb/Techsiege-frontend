import { Reveal, SectionHeading } from "./Reveal";
import { AWARDS, INNOVATION_AWARDS, SUBMISSION, SITE } from "@/lib/content";
import { Trophy, Robot, Lightbulb, GearSix, Crosshair, PresentationChart } from "@phosphor-icons/react/dist/ssr";

const OTHER_AWARD_ICONS: Record<string, React.ReactNode> = {
  "Most Autonomous Agent": <Robot size={26} weight="duotone" className="text-accent" aria-hidden="true" />,
  "Best Innovative Solution": <Lightbulb size={26} weight="duotone" className="text-accent" aria-hidden="true" />,
  "Best Engineered System": <GearSix size={26} weight="duotone" className="text-accent" aria-hidden="true" />,
  "Sharpest Problem Fit": <Crosshair size={26} weight="duotone" className="text-accent" aria-hidden="true" />,
  "Showstopper Demo": <PresentationChart size={26} weight="duotone" className="text-accent" aria-hidden="true" />,
};

export function Awards() {
  const podium = [AWARDS[1], AWARDS[0], AWARDS[2]].filter(Boolean);
  const blocks = ["h-16 sm:h-24", "h-24 sm:h-36", "h-14 sm:h-20"];
  const medals = ["text-slate-200", "text-yellow-300", "text-orange-300"];

  return (
    <section id="awards" className="scroll-mt-20 border-y border-white/5 bg-navy/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading kicker="Awards" title="₹65,000 prize pool" sub="Top three teams win cash prizes." />
        <Reveal>
          <ol className="mx-auto grid max-w-4xl grid-cols-3 items-end gap-2 sm:gap-4">
            {podium.map((a, i) => {
              const place = i === 1 ? "1" : i === 0 ? "2" : "3";
              return (
                <li key={a.title} className="flex flex-col items-center">
                  <Trophy size={i === 1 ? 44 : 36} weight="fill" className={`${medals[i]} drop-shadow sm:hidden`} aria-hidden="true" />
                  <Trophy size={i === 1 ? 56 : 44} weight="fill" className={`${medals[i]} hidden drop-shadow sm:block`} aria-hidden="true" />
                  <p className="mt-2 text-center font-mono text-xs font-bold text-lime2 sm:mt-3 sm:text-lg">{a.prize}</p>
                  <p className="mt-1 text-center text-xs font-semibold text-white sm:text-sm">{a.title}</p>
                  <div className={`mt-3 flex w-full items-center justify-center rounded-t-lg border border-white/10 bg-white text-black shadow-lg sm:mt-4 sm:rounded-t-xl ${blocks[i]}`}>
                    <span className="font-display text-3xl font-black sm:text-5xl">{place}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted">
          Awards are based on the final judging rubric and live demo performance.
        </p>
        <h3 className="font-display mt-10 text-center text-xl font-bold tracking-tight text-white">Other awards</h3>
        <ul className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-5">
          {INNOVATION_AWARDS.map((award) => (
            <li key={award.title} className="bg-void px-4 py-5">
              {OTHER_AWARD_ICONS[award.title]}
              <p className="mt-3 font-mono text-[11px] font-bold uppercase tracking-widest text-accent">{award.prize}</p>
              <h3 className="mt-2 text-sm font-semibold text-white">{award.title}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Submission() {
  return (
    <section id="submission" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="max-w-3xl">
        <SectionHeading
          align="left"
          title="What you ship on Day 2"
          sub="Submission closes 11:00 AM. Incomplete entries don't advance to screening."
        />
        <ol className="border-t border-white/10">
          {SUBMISSION.map((s, i) => (
            <Reveal key={s} delay={Math.min(i * 0.04, 0.2)}>
              <li className="flex items-baseline gap-4 border-b border-white/10 py-4">
                <span className="font-mono text-xs text-accent" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed text-slate-200">{s}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <p className="mt-4 text-xs text-muted">
          Questions? <a className="text-accent underline underline-offset-4" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
        </p>
      </div>
    </section>
  );
}
