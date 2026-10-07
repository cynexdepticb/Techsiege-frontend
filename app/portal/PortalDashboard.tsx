"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download, Ticket, Timer, SignOut, UsersThree, MapPin, CalendarBlank,
  Check, Clock, Bank, Trophy, Medal, ArrowRight, Ticket as TicketIcon, Gauge,
} from "@phosphor-icons/react";
import { TRACK_LABELS, type TrackId } from "@/lib/tracks";
import { authFetch, getSession, signOut } from "@/lib/auth";

type Member = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  branch_year: string;
  is_lead: boolean;
  ticket_id: string | null;
  ticket_status: string | null;
  checked_in_at: string | null;
  pdf_filename: string | null;
};

type Registration = {
  registered?: boolean;
  email?: string;
  team: Record<string, string> | null;
  members: Member[];
  venue?: string;
  dates?: string;
};

type Checkpoint = {
  id: string;
  title: string;
  description: string;
  deadline: string | null;
  max_points: number;
  myPoints: number | null;
  myFeedback: string;
};

type BoardRow = { rank: number; teamName: string; total: number; mine: boolean };

function timeLeft(iso: string | null): string {
  if (!iso) return "No deadline";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "Closed";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h >= 48) return `${Math.floor(h / 24)}d ${h % 24}h left`;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function statusTone(s: string): string {
  if (["CONFIRMED", "VERIFIED", "CHECKED_IN", "GENERATED", "SENT"].includes(s)) return "border-lime2/40 bg-lime2/10 text-lime2";
  if (["PAYMENT_PENDING", "PENDING", "PAYMENT_VERIFICATION"].includes(s)) return "border-amber-400/40 bg-amber-400/10 text-amber-200";
  if (["RESUBMISSION_REQUIRED"].includes(s)) return "border-orange-400/40 bg-orange-400/10 text-orange-300";
  if (["PAYMENT_REJECTED", "REJECTED", "FAILED", "CANCELLED"].includes(s)) return "border-red-400/40 bg-red-400/10 text-red-300";
  return "border-white/15 bg-white/5 text-slate-300";
}

function Pill({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold ${tone ?? "border-white/15 bg-white/5 text-slate-300"}`}>
      {children}
    </span>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.06] ${className ?? "h-24"}`} aria-hidden />;
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm ${className ?? ""}`}>
      {children}
    </section>
  );
}

function CardTitle({ icon, title, aside }: { icon: React.ReactNode; title: string; aside?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        <span className="text-accent">{icon}</span> {title}
      </h2>
      {aside}
    </div>
  );
}

function CheckpointMap({ checkedCount, scoredCount }: { checkedCount: number; scoredCount: number }) {
  const items = [
    { title: "Check-in", desc: "Verify tickets and settle at your workspace.", done: checkedCount > 0 },
    { title: "Architecture review", desc: "Show tools, memory, data flow, and safety plan.", done: scoredCount >= 1 },
    { title: "Working demo", desc: "Prove the agent can complete a real task.", done: scoredCount >= 2 },
    { title: "Final evaluation", desc: "Submit, demo, and receive judge feedback.", done: scoredCount >= 3 },
  ];

  return (
    <Card>
      <CardTitle icon={<Timer size={16} />} title="Checkpoint map" aside={<span className="text-[11px] text-muted">4 gates</span>} />
      <ol className="grid gap-3 md:grid-cols-4">
        {items.map((item, i) => {
          const current = !item.done && items.slice(0, i).every((x) => x.done);
          return (
            <li key={item.title} className={`rounded-2xl border p-4 ${item.done ? "border-lime2/30 bg-lime2/[0.06]" : current ? "border-accent/40 bg-accent/[0.06]" : "border-white/10 bg-white/[0.02]"}`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-bold ${item.done ? "border-lime2/40 text-lime2" : current ? "border-accent/50 text-accent" : "border-white/15 text-muted"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.done ? "bg-lime2/10 text-lime2" : current ? "bg-accent/10 text-accent" : "bg-white/5 text-muted"}`}>
                  {item.done ? "Done" : current ? "Next" : "Locked"}
                </span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{item.desc}</p>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

export default function PortalDashboard() {
  const router = useRouter();
  const [data, setData] = useState<Registration | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [live, setLive] = useState<{ total: number; checkpoints: Checkpoint[] } | null>(null);
  const [board, setBoard] = useState<BoardRow[]>([]);
  const [, setTick] = useState(0);
  const [tab, setTab] = useState("status");

  function scrollTo(id: string, key: string) {
    setTab(key);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    if (s.kind === "organizer") {
      router.replace("/admin");
      return;
    }
    setName(s.name);
    let cancelled = false;
    async function loadLive() {
      try {
        const [lr, br] = await Promise.all([
          authFetch("/api/portal/live"),
          authFetch("/api/portal/leaderboard"),
        ]);
        const lb = await lr.json();
        const bb = await br.json();
        if (!cancelled && lr.ok && lb.ok) setLive({ total: lb.total, checkpoints: lb.checkpoints });
        if (!cancelled && br.ok && bb.ok) setBoard(bb.leaderboard);
      } catch {
        /* live section stays stale until next poll */
      }
    }
    loadLive();
    const liveTimer = setInterval(loadLive, 15000);
    const clockTimer = setInterval(() => setTick((t) => t + 1), 1000);
    (async () => {
      try {
        const res = await authFetch("/api/portal/registration");
        const body = await res.json();
        if (cancelled) return;
        if (!res.ok || !body.ok) {
          if (res.status === 401) router.replace("/login");
          else setError(body.message ?? "Could not load your registration.");
          return;
        }
        setData(body);
      } catch {
        if (!cancelled) setError("Could not reach the server.");
      }
    })();
    return () => {
      cancelled = true;
      clearInterval(liveTimer);
      clearInterval(clockTimer);
    };
  }, [router]);

  async function download(ticketId: string) {
    setDownloading(ticketId);
    try {
      const res = await authFetch(`/api/portal/tickets/${ticketId}/pdf`);
      if (!res.ok) {
        setError("Could not download that ticket.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `techsiege-ticket-${ticketId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("Download failed. Try again.");
    } finally {
      setDownloading(null);
    }
  }

  async function logout() {
    await signOut();
    router.replace("/login");
  }

  if (error && !data) {
    return (
      <div className="mx-auto max-w-md pt-16 text-center">
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>
        <button onClick={logout} className="mt-4 text-sm text-accent underline">Sign in again</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4 pt-4">
        <Skeleton className="h-44" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!data.registered || !data.team) {
    const steps = [
      { n: "01", t: "Register team", d: "Add members and pick a track" },
      { n: "02", t: "Upload payment proof", d: "Pay by UPI and attach the receipt" },
      { n: "03", t: "Get tickets", d: "Verified tickets appear here" },
    ];
    return (
      <div className="mx-auto max-w-2xl pt-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-b from-accent/[0.08] to-transparent p-8 text-center sm:p-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Welcome{name ? `, ${name}` : ""}</p>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            One step from the arena
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Your account is ready. Register your team to unlock tickets, event updates, and scores.
          </p>
          <a href="/register" className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-black shadow-glow transition hover:-translate-y-0.5 hover:brightness-110">
            Register your team <ArrowRight size={16} weight="bold" />
          </a>
          <ol className="mx-auto mt-9 grid max-w-lg gap-3 text-left sm:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="font-mono text-xs text-accent">{s.n}</p>
                <p className="mt-1.5 text-sm font-semibold text-white">{s.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
          <button onClick={logout} className="mt-7 text-xs text-muted underline hover:text-slate-300">
            Use a different email
          </button>
        </motion.div>
      </div>
    );
  }

  const t = data.team;
  const confirmed = t.registration_status === "CONFIRMED";
  const myRank = board.find((b) => b.mine)?.rank ?? null;
  const trackLabel = TRACK_LABELS[(t.track_id as TrackId) ?? ""] ?? t.track_id ?? "";
  const ticketCount = data.members.filter((m) => m.ticket_id).length;
  const checkedCount = data.members.filter((m) => m.ticket_status === "CHECKED_IN").length;
  const scoredCount = live?.checkpoints.filter((c) => c.myPoints !== null).length ?? 0;

  const steps = [
    { label: "Registered", done: true, icon: <Check size={14} weight="bold" /> },
    {
      label: t.registration_status === "RESUBMISSION_REQUIRED" ? "Proof needed again" : t.registration_status === "PAYMENT_REJECTED" ? "Payment rejected" : "Payment verified",
      done: confirmed,
      current: !confirmed,
      icon: confirmed ? <Check size={14} weight="bold" /> : <Bank size={14} />,
    },
    { label: "Tickets issued", done: ticketCount > 0, current: confirmed && ticketCount === 0, icon: <TicketIcon size={14} /> },
    { label: "Checked in", done: checkedCount > 0, icon: <UsersThree size={14} /> },
  ];

  return (
    <div className="space-y-5 pb-24 md:pb-0">
      {/* ── Sticky app bar (mobile) ──────────────────────────── */}
      <div className="sticky top-0 z-30 -mx-4 border-b border-white/[0.07] bg-void/90 px-4 py-2.5 backdrop-blur-xl sm:-mx-6 sm:px-6 md:hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-mono text-xs font-bold text-accent">{t.team_code}</span>
          <span className="shrink-0 font-mono text-xs text-muted">
            <span className="font-bold text-white">{live?.total ?? 0}</span> pts
            {myRank ? ` · #${myRank}` : ""}
          </span>
        </div>
      </div>
      {/* ── Hero identity band ─────────────────────────────── */}
      <motion.header
        id="p-status"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent/[0.10] via-transparent to-violet2/[0.08] p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="text-xs text-muted">Signed in{name ? ` as ${name}` : ""}</p>
            <h1 className="font-display mt-1 break-words text-2xl font-bold tracking-tight text-white sm:text-4xl">
              {t.team_name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-xs font-bold text-accent">{t.team_code}</span>
              <Pill tone={statusTone(t.registration_status)}>{t.registration_status}</Pill>
              <Pill tone={statusTone(t.payment_status)}>{t.payment_status}</Pill>
            </div>
            {/* progress stepper */}
            <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2" aria-label="Registration progress">
              {steps.map((s, i) => (
                <li key={s.label} className="flex items-center gap-2">
                  {i > 0 && <span className="h-px w-4 bg-white/15" aria-hidden />}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                      s.done
                        ? "border-lime2/40 bg-lime2/10 text-lime2"
                        : s.current
                          ? "border-accent/50 bg-accent/10 text-accent"
                          : "border-white/10 text-muted"
                    }`}
                  >
                    {s.icon} {s.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {(live !== null || board.length > 0) && (
              <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-center">
                <p className="font-display text-4xl font-bold text-accent">{live?.total ?? 0}</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-muted">
                  points{myRank ? ` · rank #${myRank}` : ""}
                </p>
              </div>
            )}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-red-400/50 hover:text-red-200"
            >
              <SignOut size={15} /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </motion.header>

      {error && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

      {!confirmed && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/[0.06] p-4 text-sm">
          <Clock size={18} className="mt-0.5 shrink-0 text-amber-200" />
          <div>
            <p className="font-semibold text-amber-200">Payment verification is pending.</p>
            <p className="mt-1 leading-relaxed text-muted">
              {t.registration_status === "RESUBMISSION_REQUIRED"
                ? `The Ops team asked for new payment proof: ${t.rejection_reason || "see your email"}. Reply to the resubmission email if you need help.`
                : "Your tickets and live scores unlock here automatically once the Ops team verifies your payment."}
            </p>
            {t.payment_reference && <p className="mt-2 font-mono text-xs text-muted">Ref: {t.payment_reference}</p>}
          </div>
        </div>
      )}

      <CheckpointMap checkedCount={checkedCount} scoredCount={scoredCount} />

      {/* ── Team + event facts ─────────────────────────────── */}
      <div id="p-team" className="grid scroll-mt-20 gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardTitle icon={<UsersThree size={16} />} title={`Team · ${data.members.length} members`} />
          <ul className="space-y-3">
            {data.members.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 font-display text-sm font-bold text-accent" aria-hidden>
                  {initials(m.full_name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {m.full_name}
                    {m.is_lead && <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 align-middle text-[10px] font-bold text-accent">LEAD</span>}
                  </p>
                  <p className="truncate text-xs text-muted">{m.email}{m.branch_year ? ` / ${m.branch_year}` : ""}</p>
                </div>
                {m.ticket_id ? (
                  <button
                    onClick={() => download(m.ticket_id!)}
                    disabled={downloading === m.ticket_id}
                    title={m.pdf_filename ?? `Ticket ${m.ticket_id}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/40 px-3.5 py-2 text-xs font-semibold text-accent transition hover:bg-accent/10 disabled:opacity-60 max-sm:w-full max-sm:justify-center"
                  >
                    <Download size={13} /> {downloading === m.ticket_id ? "..." : m.ticket_status === "CHECKED_IN" ? "Checked in" : "Ticket"}
                  </button>
                ) : (
                  <span className="shrink-0 font-mono text-[11px] text-muted">no ticket yet</span>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardTitle icon={<Ticket size={16} />} title="Event" />
            <dl className="space-y-2.5 text-sm">
              <div className="flex gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-muted" />
                <dd className="text-slate-200">{data.venue ?? ""}{t.city ? ` / ${t.city}` : ""}</dd>
              </div>
              <div className="flex gap-2.5">
                <CalendarBlank size={15} className="mt-0.5 shrink-0 text-muted" />
                <dd className="text-slate-200">{data.dates ?? ""}</dd>
              </div>
              {trackLabel && (
                <div className="flex gap-2.5">
                  <Trophy size={15} className="mt-0.5 shrink-0 text-muted" />
                  <dd className="text-slate-200">{trackLabel}</dd>
                </div>
              )}
              {t.institution && (
                <div className="flex gap-2.5">
                  <Bank size={15} className="mt-0.5 shrink-0 text-muted" />
                  <dd className="text-slate-200">{t.institution}</dd>
                </div>
              )}
            </dl>
            {t.project_idea && (
              <p className="mt-4 rounded-xl bg-white/[0.03] p-3 text-xs italic leading-relaxed text-slate-300">
                “{t.project_idea}”
              </p>
            )}
          </Card>

          {board.length > 0 && (
            <Card>
              <div id="p-board" className="scroll-mt-20" />
              <CardTitle icon={<Medal size={16} />} title="Leaderboard" aside={<span className="flex items-center gap-1.5 text-[11px] text-lime2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime2" /> live</span>} />
              <ol className="space-y-1.5">
                {board.slice(0, 8).map((b) => (
                  <li
                    key={b.rank}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm ${b.mine ? "border-accent/50 bg-accent/[0.07]" : "border-transparent hover:border-white/10"}`}
                  >
                    <span className={`w-6 font-mono text-xs font-bold ${b.rank <= 3 ? "text-amber-200" : "text-muted"}`}>#{b.rank}</span>
                    <span className={`flex-1 truncate font-semibold ${b.mine ? "text-accent" : "text-slate-200"}`}>{b.teamName}</span>
                    <span className="font-mono text-xs text-accent">{b.total}</span>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </div>
      </div>

      {/* ── Live checkpoints ───────────────────────────────── */}
      <Card>
        <div id="p-scores" className="scroll-mt-20" />
        <CardTitle
          icon={<Timer size={16} />}
          title="Checkpoints"
        />
        {live && live.checkpoints.length > 0 ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {live.checkpoints.map((c, i) => {
              const pct = Math.max(0, Math.min(100, Math.round(((c.myPoints ?? 0) / Math.max(1, c.max_points)) * 100)));
              const closed = c.deadline ? new Date(c.deadline).getTime() < Date.now() : false;
              return (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.06, 0.3) }}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold text-white">{c.title}</p>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${closed ? "border-white/10 text-muted" : "border-amber-400/40 bg-amber-400/10 text-amber-200"}`}>
                      <Timer size={12} /> {timeLeft(c.deadline)}
                    </span>
                  </div>
                  {c.description && <p className="mt-1.5 text-xs leading-relaxed text-muted">{c.description}</p>}
                  <div className="mt-3 flex items-baseline justify-between text-xs">
                    <span className="text-muted">Max {c.max_points}</span>
                    {c.myPoints !== null ? (
                      <span className="font-mono font-bold text-lime2">{c.myPoints} pts</span>
                    ) : (
                      <span className="font-mono text-muted">awaiting score</span>
                    )}
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.title} score`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${c.myPoints !== null ? "bg-gradient-to-r from-accent to-lime2" : "bg-white/10"}`}
                    />
                  </div>
                  {c.myFeedback && <p className="mt-2.5 rounded-lg bg-white/[0.03] p-2.5 text-xs italic leading-relaxed text-slate-300">“{c.myFeedback}”</p>}
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <p className="font-display text-base font-bold text-white">Checkpoints go live at kickoff</p>
            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted">
              Scores and judge feedback appear here once the event starts.
            </p>
          </div>
        )}
      </Card>

      <p className="pb-2 text-center text-xs text-muted">
        {data.dates} / {data.venue}
      </p>

      {/* ── Bottom tab bar (mobile app feel) ─────────────────── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-void/95 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Portal sections"
      >
        <div className="grid grid-cols-4">
          {[
            { key: "status", label: "Status", icon: <Gauge size={20} />, id: "p-status" },
            { key: "team", label: "Team", icon: <UsersThree size={20} />, id: "p-team" },
            { key: "scores", label: "Scores", icon: <Timer size={20} />, id: "p-scores" },
            { key: "board", label: "Board", icon: <Trophy size={20} />, id: "p-board" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => scrollTo(item.id, item.key)}
              aria-current={tab === item.key ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-semibold transition ${
                tab === item.key ? "text-accent" : "text-slate-400 active:text-slate-200"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
