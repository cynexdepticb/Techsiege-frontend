"use client";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, SignOut, ChartBar, UsersThree, Buildings, ArrowClockwise, ClipboardText, Trophy, Handshake, House, Receipt, Ticket, Paperclip, Warning, Check, Trash } from "@phosphor-icons/react";
import { TRACK_LABELS, type TrackId } from "@/lib/tracks";
import { getSession as getLoginSession, signOut as authSignOut } from "@/lib/auth";

const KEY = "cynex_admin_token";

type Stats = {
  generatedAt: string;
  totals: {
    teams: number; members: number; institutions: number; uniqueEmails: number;
    maxTeams: number; slotsLeft: number; capacityPct: number; avgTeamSize: number;
    last24h: number; membersLast24h: number;
  };
  byTrack: { id: string; label: string; count: number }[];
  byInstitution: { institution: string; n: number }[];
  byCity: { city: string; n: number }[];
  byDay: { day: string; iso: string; n: number }[];
  byTeamSize: { team_size: number; n: number }[];
  recent: {
    id: string; team_name: string; institution: string; city: string;
    track_label: string; project_idea: string; created_at: string;
    member_count: number; lead_name: string; lead_email: string; lead_phone: string;
  }[];
};

const bar = (pct: number) => ({ initial: { width: 0 }, whileInView: { width: `${pct}%` }, viewport: { once: true }, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } });

function HBar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <li>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="truncate text-slate-200">{label}</span>
        <span className="shrink-0 font-mono text-xs text-muted">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div {...bar(max ? (value / max) * 100 : 0)} className="h-full rounded-full bg-accent" />
      </div>
    </li>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.06] ${className ?? "h-24"}`} aria-hidden />;
}

type QueueRow = {
  id: string; team_code: string | null; team_name: string; institution: string; city: string;
  track_id: string; registration_status: string; payment_status: string;
  payment_reference: string; screenshot_present: boolean;
  submitted_at: string; verified_at: string | null; verified_by: string;
  rejection_reason: string; confirmation_email_status: string;
  member_count: number; lead_name: string; lead_email: string; lead_phone: string;
  ticket_count: number; checked_in_count: number;
};

const STATUS_FILTERS = ["PENDING", "ALL", "PAYMENT_PENDING", "PAYMENT_VERIFICATION", "RESUBMISSION_REQUIRED", "PAYMENT_REJECTED", "CONFIRMED", "CANCELLED"] as const;

function statusBadge(s: string) {
  const map: Record<string, string> = {
    CONFIRMED: "border-lime2/40 bg-lime2/10 text-lime2",
    PAYMENT_PENDING: "border-amber-400/40 bg-amber-400/10 text-amber-200",
    PAYMENT_VERIFICATION: "border-accent/40 bg-accent/10 text-accent",
    RESUBMISSION_REQUIRED: "border-orange-400/40 bg-orange-400/10 text-orange-300",
    PAYMENT_REJECTED: "border-red-400/40 bg-red-400/10 text-red-300",
    CANCELLED: "border-white/15 bg-white/5 text-muted",
    PENDING: "border-amber-400/40 bg-amber-400/10 text-amber-200",
    VERIFIED: "border-lime2/40 bg-lime2/10 text-lime2",
    REJECTED: "border-red-400/40 bg-red-400/10 text-red-300",
    SENT: "border-lime2/40 bg-lime2/10 text-lime2",
    FAILED: "border-red-400/40 bg-red-400/10 text-red-300",
    ACK_SENT: "border-lime2/40 bg-lime2/10 text-lime2",
    ACK_FAILED: "border-red-400/40 bg-red-400/10 text-red-300",
    NOT_SENT: "border-white/15 bg-white/5 text-muted",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] font-semibold ${map[s] ?? "border-white/15 bg-white/5 text-slate-300"}`}>
      {s}
    </span>
  );
}

function PaymentQueue({ token, onError }: { token: string; onError: (m: string) => void }) {
  const [filter, setFilter] = useState<string>("PENDING");
  const [rows, setRows] = useState<QueueRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const loadQueue = useCallback(async (f: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations?status=${f}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Could not load payment queue.");
        return;
      }
      setRows(data.registrations);
    } catch {
      onError("Could not reach the verification API.");
    } finally {
      setLoading(false);
    }
  }, [token, onError]);

  useEffect(() => { loadQueue(filter); }, [filter, loadQueue]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setSelected(null); }}
            aria-pressed={filter === f}
            className={`rounded-full px-4 py-1.5 font-mono text-xs transition ${filter === f ? "bg-accent text-black" : "border border-white/10 text-slate-300 hover:border-accent/40"}`}
          >
            {f}
          </button>
        ))}
        <button onClick={() => loadQueue(filter)} className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs text-slate-200 hover:border-accent/50">
          <ArrowClockwise size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-48" />
        </div>
      )}
      {!loading && rows.length === 0 && <p className="mt-6 text-sm text-muted">No registrations in this state.</p>}

      {!loading && rows.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-muted">
                <th scope="col" className="p-4 font-semibold">Team</th>
                <th scope="col" className="p-4 font-semibold">Leader</th>
                <th scope="col" className="p-4 font-semibold">Members</th>
                <th scope="col" className="p-4 font-semibold">Payment</th>
                <th scope="col" className="p-4 font-semibold">Submitted</th>
                <th scope="col" className="p-4 font-semibold">Status</th>
                <th scope="col" className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r) => (
                <tr key={r.id} className={`transition hover:bg-white/[0.02] ${selected === r.id ? "bg-accent/[0.04]" : ""}`}>
                  <td className="p-4">
                    <p className="font-semibold text-white">{r.team_name}</p>
                    <p className="font-mono text-xs text-accent">{r.team_code ?? "—"}</p>
                    <p className="mt-0.5 max-w-[220px] truncate text-xs text-muted">{r.institution}</p>
                    <p className="max-w-[220px] truncate text-xs text-muted">{[r.city, TRACK_LABELS[r.track_id as TrackId] ?? r.track_id].filter(Boolean).join(" · ")}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-300">{r.lead_name}</p>
                    <p className="text-xs text-muted">{r.lead_email}</p>
                  </td>
                  <td className="p-4 font-mono text-slate-300">
                    <span className="inline-flex items-center gap-1.5"><UsersThree size={14} className="text-muted" />{r.member_count}</span>
                    {r.ticket_count > 0 && <span className="block text-[11px] text-muted">{r.ticket_count} tickets · {r.checked_in_count} in</span>}
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">{statusBadge(r.payment_status)}</div>
                    {r.payment_reference && <p className="mt-1 font-mono text-[11px] text-muted">{r.payment_reference}</p>}
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-muted">{r.screenshot_present ? <><Receipt size={12} className="text-accent" /> proof attached</> : "no screenshot"}</p>
                  </td>
                  <td className="p-4 text-xs text-muted">{new Date(r.submitted_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {statusBadge(r.registration_status)}
                      {r.confirmation_email_status === "FAILED" && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-red-300"><Warning size={12} /> Email delivery failed</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelected(selected === r.id ? null : r.id)}
                      className="rounded-full border border-accent/40 px-4 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent/10"
                    >
                      {selected === r.id ? "Close" : "VIEW PAYMENT"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <VerifyPanel
          key={selected}
          token={token}
          teamId={selected}
          onDone={() => loadQueue(filter)}
          onDeleted={() => {
            setSelected(null);
            loadQueue(filter);
          }}
          onError={onError}
        />
      )}
    </div>
  );
}

function VerifyPanel({ token, teamId, onDone, onDeleted, onError }: { token: string; teamId: string; onDone: () => void; onDeleted: () => void; onError: (m: string) => void }) {
  const [detail, setDetail] = useState<{ team: Record<string, string>; members: Record<string, string>[]; decisions: Record<string, string>[] } | null>(null);
  const [shotUrl, setShotUrl] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/admin/registrations/${teamId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Could not load registration.");
        return;
      }
      setDetail(data);
      const img = await fetch(`/api/admin/payments/${teamId}/screenshot`, { headers: { Authorization: `Bearer ${token}` } });
      if (img.ok) {
        const blob = await img.blob();
        setShotUrl(URL.createObjectURL(blob));
      }
    })();
    return () => { if (shotUrl) URL.revokeObjectURL(shotUrl); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, token]);

  async function decide(decision: "VERIFY" | "REJECT" | "RESUBMIT") {
    if ((decision === "REJECT" || decision === "RESUBMIT") && !reason.trim()) {
      onError("A reason is required for reject / resubmission.");
      return;
    }
    if (decision === "VERIFY" && !window.confirm("Verify this payment? This will confirm the registration, generate individual PDF tickets and email the team leader with all PDF attachments. This cannot be undone from here.")) {
      return;
    }
    setBusy(decision);
    setResult(null);
    try {
      const res = await fetch(`/api/admin/registrations/${teamId}/decision`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ decision, reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Decision failed.");
        return;
      }
      const ticketCount = data.tickets?.length ?? data.pdfCount ?? 0;
      if (decision === "VERIFY") {
        if (data.duplicate) {
          setResult(
            `✓ Payment Verified\n✓ Registration Confirmed\n✓ ${ticketCount} Tickets Generated (Existing Reused)\n✓ Ticket PDFs Ready\n✓ Existing tickets & PDFs reused, no duplicate email sent.`,
          );
        } else if (data.emailFailed) {
          setResult(
            `✓ Payment Verified\n✓ Registration Confirmed\n✓ ${ticketCount} Tickets Generated\n✓ Ticket PDFs Ready\n⚠ Confirmation Email Failed: ${data.emailFailed}\n(Use RESEND TICKETS below to re-send the existing PDF attachments)`,
          );
        } else {
          setResult(
            `✓ Payment Verified\n✓ Registration Confirmed\n✓ ${ticketCount} Tickets Generated\n✓ Ticket PDFs Ready\n✓ Confirmation Email Sent with ${ticketCount} PDF attachment(s)`,
          );
        }
      } else if (decision === "REJECT") {
        setResult("Payment Rejected — registration moved to PAYMENT_REJECTED. No tickets generated, no confirmation email sent.");
      } else {
        setResult(
          `Resubmission requested.${data.resubmitEmailed ? " The leader has been emailed with what to fix." : ` ⚠ Notice email failed: ${data.resubmitEmailError ?? "unknown error"} — contact the team manually.`}`,
        );
      }
      onDone();
    } catch {
      onError("Could not reach the verification API.");
    } finally {
      setBusy(null);
    }
  }

  async function resend() {
    setBusy("RESEND");
    try {
      const res = await fetch(`/api/admin/registrations/${teamId}/resend`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Resend failed.");
        return;
      }
      setResult(`✓ Confirmation Email Re-Sent with ${data.pdfCount ?? "attached"} PDF tickets to the team leader.`);
      onDone();
    } catch {
      onError("Could not reach the verification API.");
    } finally {
      setBusy(null);
    }
  }

  async function destroy() {
    if (!window.confirm(`Delete team ${detail?.team?.team_name ?? teamId} permanently? Members, tickets, scores and files are removed. This cannot be undone.`)) {
      return;
    }
    if (!window.confirm("Really delete? Last chance.")) {
      return;
    }
    setBusy("DELETE");
    try {
      const res = await fetch(`/api/admin/registrations/${teamId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Delete failed.");
        return;
      }
      onDeleted();
    } catch {
      onError("Could not reach the verification API.");
    } finally {
      setBusy(null);
    }
  }

  async function downloadTicketPdf(ticketId: string, filename?: string) {
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        onError("Could not download ticket PDF.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `techsiege-ticket-${ticketId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      onError("Failed to download ticket PDF.");
    }
  }

  if (!detail) return (
    <div className="mt-4 space-y-3">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-64" />
    </div>
  );
  const t = detail.team;

  return (
    <section className="mt-4 rounded-2xl border border-accent/25 bg-accent/[0.03] p-6" aria-label="Verification dossier">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-lg font-bold text-white">{t.team_name} <span className="ml-2 font-mono text-sm text-accent">{t.team_code}</span></h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2"><dt className="w-28 shrink-0 text-muted">Institution</dt><dd className="text-slate-200">{t.institution}{t.city ? ` · ${t.city}` : ""}</dd></div>
            <div className="flex gap-2"><dt className="w-28 shrink-0 text-muted">Track</dt><dd className="text-slate-200">{t.track_id}</dd></div>
            {t.project_idea && <div className="flex gap-2"><dt className="w-28 shrink-0 text-muted">Idea</dt><dd className="text-slate-200">{t.project_idea}</dd></div>}
            <div className="flex gap-2"><dt className="w-28 shrink-0 text-muted">Reference</dt><dd className="font-mono text-slate-200">{t.payment_reference || "—"}</dd></div>
            <div className="flex gap-2"><dt className="w-28 shrink-0 text-muted">Submitted</dt><dd className="text-slate-200">{new Date(t.submitted_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</dd></div>
            <div className="flex gap-2"><dt className="w-28 shrink-0 text-muted">Status</dt><dd className="flex flex-wrap gap-1">{statusBadge(t.registration_status)} {statusBadge(t.payment_status)} {statusBadge(t.confirmation_email_status)}</dd></div>
            {t.rejection_reason && <div className="flex gap-2"><dt className="w-28 shrink-0 text-muted">Note</dt><dd className="text-slate-200">{t.rejection_reason}</dd></div>}
          </dl>

          {t.registration_status === "CONFIRMED" && (
            <div className="mt-4 rounded-xl border border-lime2/30 bg-lime2/5 p-3.5 text-xs text-lime2 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="inline-flex items-center gap-1"><Check size={13} weight="bold" /> Payment: VERIFIED</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1"><Check size={13} weight="bold" /> Registration: CONFIRMED</span>
              </div>
              <div className="inline-flex items-center gap-1 text-slate-300">
                <Check size={13} weight="bold" /> Tickets: {detail.members.filter((m) => m.ticket_id).length} PDF ticket(s) generated
              </div>
              <div className={t.confirmation_email_status === "FAILED" ? "text-red-300 font-semibold" : "text-slate-300"}>
                {t.confirmation_email_status === "SENT"
                  ? <span className="inline-flex items-center gap-1"><Check size={13} weight="bold" /> Email: Sent with {detail.members.filter((m) => m.ticket_id).length} PDF attachment(s)</span>
                  : t.confirmation_email_status === "FAILED"
                    ? <span className="inline-flex items-center gap-1"><Warning size={13} /> Email: FAILED (Existing PDFs intact on disk; click RESEND TICKETS below)</span>
                    : `• Email: ${t.confirmation_email_status}`}
              </div>
            </div>
          )}

          <h4 className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-400">Members ({detail.members.length})</h4>
          <ul className="mt-2 space-y-2">
            {detail.members.map((m) => (
              <li key={m.id} className="rounded-xl border border-white/10 p-3 text-sm">
                <p className="font-semibold text-white">{m.full_name} {m.is_lead ? <span className="ml-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-accent">LEAD</span> : null}</p>
                <p className="text-xs text-muted">{m.email} · {m.phone}{m.branch_year ? ` · ${m.branch_year}` : ""}</p>
                {m.ticket_id && (
                  <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="inline-flex items-center gap-1 font-semibold text-lime2"><Ticket size={13} /> {m.ticket_id}</span>
                    <span className="text-muted">· {m.ticket_status}</span>
                    {m.pdf_filename && <span className="inline-flex items-center gap-1 text-[11px] text-accent/90"><Paperclip size={12} /> {m.pdf_filename}</span>}
                    {m.checked_in_at && (
                      <span className="text-lime2 text-[11px]">
                        · in {new Date(m.checked_in_at).toLocaleString("en-IN", { timeStyle: "short" })}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => downloadTicketPdf(m.ticket_id, m.pdf_filename)}
                      className="ml-auto inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent transition hover:bg-accent/20"
                    >
                      <Download size={12} /> Download PDF
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {detail.decisions.length > 0 && (
            <>
              <h4 className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-400">Decision history</h4>
              <ul className="mt-2 space-y-1.5 text-xs text-muted">
                {detail.decisions.map((d, i) => (
                  <li key={i}>{new Date(d.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })} — <span className="font-mono text-slate-300">{d.decision}</span> by {d.admin_identity}{d.reason ? ` — ${d.reason}` : ""}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Payment screenshot</h4>
          <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-black/40">
            {shotUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shotUrl} alt="Payment screenshot" className="max-h-[420px] w-full object-contain" />
            ) : (
              <p className="p-6 text-sm text-muted">No screenshot on file.</p>
            )}
          </div>
          <label className="mt-4 block">
            <span className="mb-1 block text-xs font-semibold text-slate-300">Reason <span className="font-normal text-muted">(required for reject / resubmit, shown to team on request)</span></span>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} maxLength={1000} placeholder="e.g. UPI ref doesn't match the receipt amount" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none" />
          </label>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <button onClick={() => decide("VERIFY")} disabled={!!busy} className="rounded-full bg-lime2 px-4 py-2.5 text-sm font-bold text-black transition hover:brightness-110 disabled:opacity-60">
              {busy === "VERIFY" ? "Verifying…" : "VERIFY PAYMENT"}
            </button>
            <button onClick={() => decide("REJECT")} disabled={!!busy} className="rounded-full border border-red-400/50 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-400/10 disabled:opacity-60">
              {busy === "REJECT" ? "Rejecting…" : "REJECT PAYMENT"}
            </button>
            <button onClick={() => decide("RESUBMIT")} disabled={!!busy} className="rounded-full border border-orange-400/50 px-4 py-2.5 text-sm font-semibold text-orange-300 transition hover:bg-orange-400/10 disabled:opacity-60">
              {busy === "RESUBMIT" ? "Sending…" : "REQUEST RESUBMISSION"}
            </button>
          </div>
          {t.registration_status === "CONFIRMED" && (
            <button
              onClick={resend}
              disabled={!!busy}
              className={`mt-3 w-full rounded-full border px-4 py-2.5 text-sm font-bold transition disabled:opacity-60 ${
                t.confirmation_email_status === "FAILED"
                  ? "border-lime2 bg-lime2/15 text-lime2 hover:bg-lime2/25 ring-2 ring-lime2/30"
                  : "border-accent/50 text-accent hover:bg-accent/10"
              }`}
            >
              {busy === "RESEND" ? "Re-sending…" : "RESEND TICKETS"}
            </button>
          )}
          {result && (
            <div role="status" className="mt-3 whitespace-pre-line rounded-xl border border-lime2/30 bg-lime2/5 p-3.5 text-xs font-mono text-lime2">
              {result}
            </div>
          )}
          <button
            onClick={destroy}
            disabled={!!busy}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
          >
            <Trash size={13} /> {busy === "DELETE" ? "Deleting…" : "Delete team permanently"}
          </button>
        </div>
      </div>
    </section>
  );
}

function TeamsPanel({ token, onError }: { token: string; onError: (m: string) => void }) {
  const [rows, setRows] = useState<QueueRow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ team: Record<string, string>; members: Record<string, string>[] } | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const auth = { Authorization: `Bearer ${token}` };

  async function destroy(id: string, name: string) {
    if (!window.confirm(`Delete team ${name} permanently? Members, tickets, scores and files are removed. This cannot be undone.`)) {
      return;
    }
    if (!window.confirm("Really delete? Last chance.")) {
      return;
    }
    setBusy("DELETE");
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, { method: "DELETE", headers: auth });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Delete failed.");
        return;
      }
      setSelected(null);
      setDetail(null);
      loadAll();
    } catch {
      onError("Could not reach the API.");
    } finally {
      setBusy(null);
    }
  }

  async function loadAll() {
    try {
      const res = await fetch("/api/admin/registrations?status=ALL", { headers: auth });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Could not load teams.");
        return;
      }
      setRows(data.registrations);
    } catch {
      onError("Could not reach the API.");
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openTeam(id: string) {
    setSelected(id);
    setDetail(null);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, { headers: auth });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Could not load team details.");
        return;
      }
      setDetail({ team: data.team, members: data.members });
    } catch {
      onError("Could not reach the API.");
    }
  }

  async function decide(decision: "VERIFY" | "REJECT" | "RESUBMIT") {
    if (!detail) return;
    if ((decision === "REJECT" || decision === "RESUBMIT") && !reason.trim()) {
      onError("Add a reason before rejecting or requesting resubmission.");
      return;
    }
    setBusy(decision);
    try {
      const res = await fetch(`/api/admin/registrations/${detail.team.id}/decision`, {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({ decision, reason: reason.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Decision failed.");
        return;
      }
      setReason("");
      loadAll();
      openTeam(detail.team.id);
    } catch {
      onError("Could not reach the API.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="border-b border-white/10 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">All teams</p>
          <h2 className="font-display mt-1 text-2xl font-bold text-white">Teams</h2>
        </div>
        {rows.length === 0 ? (
          <p className="p-5 text-sm text-muted">No teams registered yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {rows.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => openTeam(r.id)}
                  aria-current={selected === r.id ? "true" : undefined}
                  className={`block w-full p-5 text-left transition hover:bg-white/[0.03] ${selected === r.id ? "bg-accent/[0.05]" : ""}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{r.team_name}</p>
                      <p className="mt-1 text-xs text-muted">
                        <span className="font-mono text-accent">{r.team_code ?? "NO-CODE"}</span>
                        {" / "}{r.institution}{r.city ? ` / ${r.city}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">{statusBadge(r.registration_status)}{statusBadge(r.payment_status)}</div>
                  </div>
                  <p className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span>{TRACK_LABELS[r.track_id as TrackId] ?? r.track_id}</span>
                    <span className="inline-flex items-center gap-1"><UsersThree size={13} /> {r.member_count}</span>
                    {r.lead_name && <span>Lead: {r.lead_name}</span>}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.02] p-5 lg:sticky lg:top-6">
        {!detail ? (
          <p className="text-sm text-muted">Select a team to see full details.</p>
        ) : (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Team details</p>
            <h3 className="font-display mt-1 text-2xl font-bold text-white">{detail.team.team_name}</h3>
            <p className="mt-1 font-mono text-sm text-accent">{detail.team.team_code}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p><span className="text-muted">Institution:</span> {detail.team.institution}</p>
              <p><span className="text-muted">City:</span> {detail.team.city || "Not provided"}</p>
              <p><span className="text-muted">Track:</span> {TRACK_LABELS[detail.team.track_id as TrackId] ?? detail.team.track_id}</p>
              {detail.team.project_idea && <p><span className="text-muted">Idea:</span> {detail.team.project_idea}</p>}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {statusBadge(detail.team.registration_status)}{statusBadge(detail.team.payment_status)}
            </div>
            <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Payment verification</p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                maxLength={1000}
                placeholder="Reason for reject or resubmission request"
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none"
              />
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <button onClick={() => decide("VERIFY")} disabled={!!busy} className="rounded-full bg-lime2 px-3 py-2 text-xs font-bold text-black transition hover:brightness-110 disabled:opacity-60">
                  {busy === "VERIFY" ? "…" : "Verify"}
                </button>
                <button onClick={() => decide("RESUBMIT")} disabled={!!busy} className="rounded-full border border-amber-400/40 px-3 py-2 text-xs font-bold text-amber-200 transition hover:bg-amber-400/10 disabled:opacity-60">
                  {busy === "RESUBMIT" ? "…" : "Resubmit"}
                </button>
                <button onClick={() => decide("REJECT")} disabled={!!busy} className="rounded-full border border-red-400/40 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-400/10 disabled:opacity-60">
                  {busy === "REJECT" ? "…" : "Reject"}
                </button>
              </div>
            </div>
            <button
              onClick={() => destroy(detail.team.id, detail.team.team_name)}
              disabled={!!busy}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
            >
              <Trash size={13} /> {busy === "DELETE" ? "Deleting…" : "Delete team permanently"}
            </button>
            <h4 className="mt-6 text-xs font-bold uppercase tracking-widest text-muted">Members</h4>
            <ul className="mt-3 space-y-2.5">
              {detail.members.map((m) => (
                <li key={m.id} className="rounded-xl border border-white/10 p-3">
                  <p className="text-sm font-semibold text-white">
                    {m.full_name}
                    {m.is_lead && <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-accent">LEAD</span>}
                  </p>
                  <p className="mt-1 text-xs text-muted">{m.email}</p>
                  {m.branch_year && <p className="mt-0.5 text-xs text-muted">{m.branch_year}</p>}
                  {m.ticket_id && <p className="mt-1.5 font-mono text-xs text-lime2">{m.ticket_id} / {m.ticket_status}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}

function CheckinPanel({ token, onError }: { token: string; onError: (m: string) => void }) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function checkin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ token: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Check-in failed.");
        return;
      }
      setResult(data.duplicate ? `Already checked in: ${data.memberName} (${data.ticketId}).` : `Checked in: ${data.memberName} — ${data.teamName} (${data.ticketId}).`);
      setInput("");
    } catch {
      onError("Could not reach the check-in API.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-sm text-muted">Scan a ticket QR (or type the ticket ID) to mark that participant checked in. Volunteer use only — participants can never self-check-in.</p>
      <form onSubmit={checkin} className="mt-4 flex gap-2">
        <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="TECHSIEGE:TICKET:… or TSG26-…" className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none" />
        <button type="submit" disabled={busy || !input.trim()} className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-black transition hover:brightness-110 disabled:opacity-60">
          {busy ? "…" : "Check in"}
        </button>
      </form>
      {result && <p role="status" className="mt-4 rounded-xl border border-lime2/30 bg-lime2/5 p-4 text-sm text-lime2">{result}</p>}
    </div>
  );
}

function OrganizersPanel({ token, onError }: { token: string; onError: (m: string) => void }) {
  const [rows, setRows] = useState<{ id: string; email: string; full_name: string; role: string; is_active: boolean }[]>([]);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "volunteer">("volunteer");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/organizers", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      onError(data.message ?? "Could not load organizers.");
      return;
    }
    setRows(data.organizers);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/organizers", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Could not add organizer.");
        return;
      }
      setEmail("");
      setFullName("");
      load();
    } catch {
      onError("Could not reach the API.");
    } finally {
      setBusy(false);
    }
  }

  async function setActive(id: string, isActive: boolean) {
    const res = await fetch(`/api/admin/organizers/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      onError(data.message ?? "Update failed.");
      return;
    }
    load();
  }

  const input = "rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none";

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-white">Organizer accounts</h2>
        <p className="mt-1 text-xs text-muted">They sign in at /login?organizer=1 with an email code.</p>
        <ul className="mt-4 space-y-2">
          {rows.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 p-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">{o.full_name}</p>
                <p className="truncate text-xs text-muted">{o.email} · <span className="font-mono">{o.role}</span>{o.is_active ? "" : " · deactivated"}</p>
              </div>
              <button
                onClick={() => setActive(o.id, !o.is_active)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${o.is_active ? "border-red-400/50 text-red-300 hover:bg-red-400/10" : "border-lime2/50 text-lime2 hover:bg-lime2/10"}`}
              >
                {o.is_active ? "Deactivate" : "Reactivate"}
              </button>
            </li>
          ))}
          {rows.length === 0 && <p className="text-sm text-muted">No organizer accounts yet.</p>}
        </ul>
      </section>
      <section className="rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-white">Add organizer</h2>
        <form onSubmit={add} className="mt-4 space-y-3">
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" maxLength={100} className={input} />
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@college.edu" className={input} />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value as "admin" | "volunteer")} className={`${input} [&>option]:bg-navy`}>
            <option value="volunteer">volunteer — check-in only</option>
            <option value="admin">admin — full access</option>
          </select>
          <button type="submit" disabled={busy} className="w-full rounded-full bg-accent py-2.5 text-sm font-bold text-black hover:brightness-110 disabled:opacity-60">
            {busy ? "Adding…" : "Add organizer →"}
          </button>
        </form>
      </section>
    </div>
  );
}

function ScoresPanel({ token, onError }: { token: string; onError: (m: string) => void }) {
  const [cps, setCps] = useState<{ id: string; title: string; description: string; deadline: string | null; max_points: number; sort_order: number; is_active: boolean; scored_teams: number }[]>([]);
  const [teams, setTeams] = useState<{ id: string; team_name: string; team_code: string }[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [maxPoints, setMaxPoints] = useState(100);
  const [teamId, setTeamId] = useState("");
  const [cpId, setCpId] = useState("");
  const [points, setPoints] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [scores, setScores] = useState<{ checkpoint_title: string; team_name: string; points: number; feedback: string }[]>([]);

  const auth = { Authorization: `Bearer ${token}` };

  async function loadAll() {
    const [c, t] = await Promise.all([
      fetch("/api/admin/checkpoints", { headers: auth }).then((r) => r.json()),
      fetch("/api/admin/registrations?status=CONFIRMED", { headers: auth }).then((r) => r.json()),
    ]);
    if (c.ok) {
      setCps(c.checkpoints);
      if (!cpId && c.checkpoints.length > 0) setCpId(c.checkpoints[0].id);
    } else onError(c.message ?? "Could not load checkpoints.");
    if (t.ok) {
      setTeams(t.registrations);
      if (!teamId && t.registrations.length > 0) setTeamId(t.registrations[0].id);
    }
    const s = await fetch("/api/admin/scores", { headers: auth }).then((r) => r.json());
    if (s.ok) setScores(s.scores.slice(0, 20));
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/checkpoints", {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, deadline: deadline ? new Date(deadline).toISOString() : "", maxPoints: Number(maxPoints) || 100 }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Could not create checkpoint.");
        return;
      }
      setTitle("");
      setDescription("");
      setDeadline("");
      loadAll();
    } finally {
      setBusy(false);
    }
  }

  async function score(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/scores", {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, checkpointId: cpId, points: Number(points), feedback }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Could not save score.");
        return;
      }
      setPoints("");
      setFeedback("");
      loadAll();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this checkpoint and all its scores?")) return;
    const res = await fetch(`/api/admin/checkpoints/${id}`, { method: "DELETE", headers: auth });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      onError(data.message ?? "Delete failed.");
      return;
    }
    loadAll();
  }

  const input = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none";

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-white">Checkpoints</h2>
        <ul className="mt-4 space-y-2">
          {cps.map((c) => (
            <li key={c.id} className="flex items-center gap-2 rounded-xl border border-white/10 p-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">{c.title} <span className="font-mono text-xs text-muted">/{c.max_points}</span></p>
                <p className="text-xs text-muted">
                  {c.deadline ? new Date(c.deadline).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "no deadline"} · {c.scored_teams} scored
                </p>
              </div>
              <button onClick={() => remove(c.id)} className="rounded-full border border-red-400/50 px-3 py-1 text-xs text-red-300 hover:bg-red-400/10">Delete</button>
            </li>
          ))}
          {cps.length === 0 && <p className="text-sm text-muted">No checkpoints yet — create the first one.</p>}
        </ul>
        <form onSubmit={create} className="mt-4 space-y-3 border-t border-white/5 pt-4">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title — e.g. Checkpoint 1: Demo" maxLength={120} className={input} />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description (optional)" maxLength={500} className={input} />
          <div className="grid grid-cols-2 gap-3">
            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={input} aria-label="Deadline" />
            <input type="number" min={1} value={maxPoints} onChange={(e) => setMaxPoints(Number(e.target.value))} className={input} aria-label="Max points" />
          </div>
          <button type="submit" disabled={busy} className="w-full rounded-full bg-accent py-2.5 text-sm font-bold text-black hover:brightness-110 disabled:opacity-60">
            {busy ? "Saving…" : "Add checkpoint →"}
          </button>
        </form>
      </section>
      <section className="rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-white">Score a team</h2>
        <form onSubmit={score} className="mt-4 space-y-3">
          <select value={teamId} onChange={(e) => setTeamId(e.target.value)} className={`${input} [&>option]:bg-navy`} aria-label="Team">
            {teams.map((t) => <option key={t.id} value={t.id}>{t.team_name} ({t.team_code})</option>)}
          </select>
          <select value={cpId} onChange={(e) => setCpId(e.target.value)} className={`${input} [&>option]:bg-navy`} aria-label="Checkpoint">
            {cps.map((c) => <option key={c.id} value={c.id}>{c.title} (/{c.max_points})</option>)}
          </select>
          <input required type="number" min={0} value={points} onChange={(e) => setPoints(e.target.value)} placeholder="Points" className={input} />
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Feedback for the team (visible to them)" rows={2} maxLength={2000} className={input} />
          <button type="submit" disabled={busy || !teamId || !cpId} className="w-full rounded-full bg-lime2 py-2.5 text-sm font-bold text-black hover:brightness-110 disabled:opacity-60">
            {busy ? "Saving…" : "Publish score →"}
          </button>
        </form>
        <h3 className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-400">Latest scores</h3>
        <ul className="mt-2 space-y-1.5 text-xs text-muted">
          {scores.map((s, i) => (
            <li key={i}><span className="font-mono text-accent">{s.points}</span> — {s.team_name} · {s.checkpoint_title}{s.feedback ? ` — “${s.feedback}”` : ""}</li>
          ))}
          {scores.length === 0 && <li>No scores yet.</li>}
        </ul>
      </section>
    </div>
  );
}

function LeaderboardPanel({ token, onError }: { token: string; onError: (m: string) => void }) {
  const [rows, setRows] = useState<{ rank: number; teamName: string; teamCode: string; total: number }[]>([]);

  useEffect(() => {
    fetch("/api/admin/leaderboard", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok || !data.ok) throw new Error(data.message ?? "Could not load leaderboard.");
        return data;
      })
      .then((data) => setRows(data.leaderboard))
      .catch((e) => onError(e.message ?? "Could not load leaderboard."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (rows.length === 0) return <p className="mt-6 text-sm text-muted">No scores published yet.</p>;
  return (
    <ol className="mt-6 space-y-2">
      {rows.map((b) => (
        <li key={b.rank} className="flex items-center gap-3 rounded-xl border border-white/10 p-3 text-sm">
          <span className="w-8 font-mono text-muted">#{b.rank}</span>
          <span className="flex-1 font-semibold text-white">{b.teamName}</span>
          <span className="font-mono text-xs text-muted">{b.teamCode}</span>
          <span className="font-mono text-accent">{b.total} pts</span>
        </li>
      ))}
    </ol>
  );
}

function SponsorsPanel({ token, onError }: { token: string; onError: (m: string) => void }) {
  const [rows, setRows] = useState<{ id: string; name: string; tier: string; amount: number; contact: string; status: string; is_visible: boolean; note: string }[]>([]);
  const [totals, setTotals] = useState<{ pledged: number; received: number; count: number; confirmed: number }>({ pledged: 0, received: 0, count: 0, confirmed: 0 });
  const [name, setName] = useState("");
  const [tier, setTier] = useState("gold");
  const [amount, setAmount] = useState("");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const auth = { Authorization: `Bearer ${token}` };
  const input = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none";

  async function load() {
    const res = await fetch("/api/admin/sponsors", { headers: auth });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      onError(data.message ?? "Could not load sponsors.");
      return;
    }
    setRows(data.sponsors);
    setTotals(data.totals);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/sponsors", {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({ name, tier, amount: Number(amount) || 0, contact }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        onError(data.message ?? "Could not add sponsor.");
        return;
      }
      setName("");
      setAmount("");
      setContact("");
      load();
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/admin/sponsors/${id}`, {
      method: "PATCH",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) onError(data.message ?? "Update failed.");
    else load();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this sponsor?")) return;
    const res = await fetch(`/api/admin/sponsors/${id}`, { method: "DELETE", headers: auth });
    const data = await res.json();
    if (!res.ok || !data.ok) onError(data.message ?? "Delete failed.");
    else load();
  }

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="mt-6">
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { k: "Pledged", v: inr(totals.pledged) },
          { k: "Received", v: inr(totals.received) },
          { k: "Sponsors", v: `${totals.confirmed}/${totals.count}` },
          { k: "Gap", v: inr(Math.max(0, totals.pledged - totals.received)) },
        ].map((x) => (
          <div key={x.k} className="rounded-2xl border border-white/10 p-4">
            <dd className="font-display text-2xl font-bold text-white">{x.v}</dd>
            <dt className="mt-1 text-xs text-muted">{x.k}</dt>
          </div>
        ))}
      </dl>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 p-6">
          <h2 className="text-sm font-semibold text-white">Pipeline</h2>
          <ul className="mt-4 space-y-2">
            {rows.map((s) => (
              <li key={s.id} className="rounded-xl border border-white/10 p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="flex-1 font-semibold text-white">{s.name}</p>
                  <span className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-[11px] text-slate-300">{s.tier} · {inr(s.amount)}</span>
                  <select value={s.status} onChange={(e) => patch(s.id, { status: e.target.value })} className="rounded-full border border-white/15 bg-navy px-2 py-1 font-mono text-[11px] text-accent [&>option]:bg-navy" aria-label="Status">
                    {(["interested", "confirmed", "paid", "dropped"] as const).map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                  {s.contact && <span>{s.contact}</span>}
                  <label className="ml-auto inline-flex cursor-pointer items-center gap-1.5">
                    <input type="checkbox" checked={s.is_visible} onChange={(e) => patch(s.id, { isVisible: e.target.checked })} className="h-3.5 w-3.5 accent-cyan-400" />
                    Show on website
                  </label>
                  <button onClick={() => remove(s.id)} className="text-red-300 hover:text-red-200">Delete</button>
                </div>
              </li>
            ))}
            {rows.length === 0 && <p className="text-sm text-muted">No sponsors yet — add the first one.</p>}
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 p-6">
          <h2 className="text-sm font-semibold text-white">Add sponsor</h2>
          <form onSubmit={add} className="mt-4 space-y-3">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Company / org name" maxLength={160} className={input} />
            <div className="grid grid-cols-2 gap-3">
              <select value={tier} onChange={(e) => setTier(e.target.value)} className={`${input} [&>option]:bg-navy`} aria-label="Tier">
                {(["title", "gold", "silver", "bronze", "supporter", "in-kind"] as const).map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount ₹" className={input} />
            </div>
            <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact email / phone" maxLength={254} className={input} />
            <button type="submit" disabled={busy} className="w-full rounded-full bg-accent py-2.5 text-sm font-bold text-black hover:brightness-110 disabled:opacity-60">
              {busy ? "Adding…" : "Add sponsor →"}
            </button>
          </form>
          <p className="mt-3 text-xs text-muted">Tick “Show on website” + status confirmed/paid to publish to the sponsor wall.</p>
        </section>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"analytics" | "payments" | "teams" | "checkin" | "organizers" | "scores" | "leaderboard" | "sponsors">("analytics");
  const [role, setRole] = useState<"admin" | "volunteer">("admin");
  const section = view === "scores" || view === "leaderboard" ? "evaluation" : view === "sponsors" ? "sponsor" : "registration";

  const SECTIONS = [
    {
      id: "registration" as const, label: "Registration", icon: <ClipboardText size={19} />,
      views: [
        { id: "analytics" as const, label: "Analytics" },
        { id: "teams" as const, label: "Teams" },
        { id: "payments" as const, label: "Verification queue" },
        { id: "checkin" as const, label: "Check-in scan" },
        { id: "organizers" as const, label: "Organizers" },
      ],
    },
    {
      id: "evaluation" as const, label: "Evaluation", icon: <Trophy size={19} />,
      views: [
        { id: "scores" as const, label: "Checkpoints & scoring" },
        { id: "leaderboard" as const, label: "Leaderboard" },
      ],
    },
    {
      id: "sponsor" as const, label: "Sponsor", icon: <Handshake size={19} />,
      views: [{ id: "sponsors" as const, label: "Sponsors" }],
    },
  ];

  function goSection(id: "registration" | "evaluation" | "sponsor") {
    setView(id === "registration" ? "analytics" : id === "evaluation" ? "scores" : "sponsors");
  }

  const sectionTitle = section === "registration" ? "Registration" : section === "evaluation" ? "Evaluation" : "Sponsor";
  const viewTitle =
    view === "payments" ? "Verification queue" : view === "analytics" ? "Analytics" : view === "teams" ? "Teams" : view === "checkin" ? "Check-in scan" : view === "scores" ? "Checkpoints & scoring" : view === "leaderboard" ? "Leaderboard" : view === "organizers" ? "Organizers" : "Sponsors";
  const [detailTeamId, setDetailTeamId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const onError = useCallback((m: string) => setError(m), []);

  const load = useCallback(async (t: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${t}` } });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStats(null);
        setError(data.message ?? "Could not load analytics.");
        return;
      }
      setStats(data);
    } catch {
      setError("Could not reach the analytics API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Prefer an organizer login session (/login?organizer=1); fall back to the legacy token.
    const s = getLoginSession();
    if (s && s.kind === "organizer") {
      setToken(s.token);
      setRole(s.role === "volunteer" ? "volunteer" : "admin");
      // Admins land on event analytics; volunteers go straight to check-in.
      setView(s.role === "volunteer" ? "checkin" : "analytics");
      load(s.token);
      return;
    }
    const saved = localStorage.getItem(KEY);
    if (saved) {
      setToken(saved);
      setRole("admin");
      load(saved);
    }
  }, [load]);

  useEffect(() => {
    if (!detailTeamId || !token) return;
    let cancelled = false;
    setDetailLoading(true);
    setDetailData(null);
    fetch(`/api/admin/registrations/${detailTeamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message ?? "Failed to load team details");
        return data;
      })
      .then((data) => {
        if (!cancelled) setDetailData(data);
      })
      .catch((e) => {
        if (!cancelled) onError(e.message ?? "Could not load team details");
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => { cancelled = true; };
  }, [detailTeamId, token, onError]);

  async function downloadCsv() {
    if (!token) return;
    const res = await fetch("/api/admin/registrations.csv", { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      setError("Export failed.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cynex-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function signOut() {
    localStorage.removeItem(KEY);
    authSignOut();
    setToken(null);
    setStats(null);
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">Organizer access</h1>
        <p className="mt-3 text-sm text-muted">Enter your organizer access token.</p>
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            localStorage.setItem(KEY, input.trim());
            setToken(input.trim());
            setRole("admin");
            load(input.trim());
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-300">Access token</span>
            <input
              type="password"
              required
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ADMIN_TOKEN"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none"
            />
          </label>
          {error && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-accent py-3 text-sm font-bold text-black transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60">
            {loading ? "Checking…" : "Unlock dashboard"}
          </button>
        </form>
        <p className="mt-4 text-xs text-muted">Organizers can also <a className="text-accent underline" href="/login?organizer=1">sign in with email code</a>.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Persistent organizer sidebar. */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-white/10 bg-navy/60" aria-label="Admin sections">
        <div className="flex items-center justify-between border-b border-white/5 p-3">
          <span className="font-display px-1 text-sm font-bold text-white">Organizer</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label="Sections">
          {role === "volunteer" ? (
            <button
              onClick={() => setView("checkin")}
              title="Check-in scan"
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${view === "checkin" ? "bg-accent/15 font-semibold text-accent" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
            >
              <ClipboardText size={19} className="shrink-0" />
              Check-in scan
            </button>
          ) : (
            SECTIONS.map((sec) => (
              <div key={sec.id}>
                <button
                  onClick={() => goSection(sec.id)}
                  title={sec.label}
                  aria-expanded={section === sec.id}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${section === sec.id ? "bg-accent/15 font-semibold text-accent" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
                >
                  <span className="shrink-0">{sec.icon}</span>
                  <span className="flex-1 text-left">{sec.label}</span>
                </button>
                {section === sec.id && (
                  <ul className="ml-5 mt-1 space-y-0.5 border-l border-white/10 pl-2">
                    {sec.views.map((v) => (
                      <li key={v.id}>
                        <button
                          onClick={() => setView(v.id)}
                          aria-current={view === v.id ? "page" : undefined}
                          className={`block w-full rounded-lg px-3 py-1.5 text-left text-[13px] transition ${view === v.id ? "bg-white/10 font-semibold text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
                        >
                          {v.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </nav>

        <div className="space-y-1 border-t border-white/5 p-2">
          <a
            href="/"
            title="Back to site"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <House size={19} className="shrink-0" />
            Back to site
          </a>
          <button
            onClick={signOut}
            title="Sign out"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:border-red-400/30 hover:text-red-200"
          >
            <SignOut size={19} className="shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 px-4 py-6 sm:px-8">
      <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent/[0.10] via-transparent to-violet2/[0.08] p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-accent/10 blur-3xl" aria-hidden />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{sectionTitle}</p>
          <h1 className="font-display mt-1 text-3xl font-bold tracking-tight text-white">{viewTitle}</h1>
          {stats && (
            <p className="mt-2 text-sm text-muted">
              Updated {new Date(stats.generatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => load(token)} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm text-slate-200 transition hover:border-accent/50">
            <ArrowClockwise size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button onClick={downloadCsv} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm text-slate-200 transition hover:border-accent/50">
            <Download size={16} /> Export CSV
          </button>
        </div>
        </div>
      </header>

      {error && <p role="alert" className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}

      {view === "payments" && (
        <div className="mt-6">
          <PaymentQueue token={token} onError={onError} />
        </div>
      )}

      {view === "teams" && role === "admin" && (
        <TeamsPanel token={token} onError={onError} />
      )}

      {view === "checkin" && (
        <div className="mt-6 rounded-2xl border border-white/10 p-6">
          <CheckinPanel token={token} onError={onError} />
        </div>
      )}

      {view === "organizers" && role === "admin" && (
        <OrganizersPanel token={token} onError={onError} />
      )}

      {view === "scores" && role === "admin" && (
        <ScoresPanel token={token} onError={onError} />
      )}

      {view === "leaderboard" && role === "admin" && (
        <LeaderboardPanel token={token} onError={onError} />
      )}

      {view === "sponsors" && role === "admin" && (
        <SponsorsPanel token={token} onError={onError} />
      )}

      {view === "analytics" && (
      <>
      {!stats && loading && <p className="mt-10 text-sm text-muted">Loading analytics…</p>}

      {stats && (
        <>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-white/5 py-8 lg:grid-cols-4">
            {[
              { k: "Teams", v: `${stats.totals.teams}`, s: `${stats.totals.slotsLeft} slots left of ${stats.totals.maxTeams}` },
              { k: "Members", v: `${stats.totals.members}`, s: `avg ${stats.totals.avgTeamSize} per team` },
              { k: "Colleges", v: `${stats.totals.institutions}`, s: "unique institutions" },
              { k: "Last 24h", v: `${stats.totals.last24h}`, s: `${stats.totals.membersLast24h} members` },
            ].map((x) => (
              <div key={x.k} className="flex flex-col">
                <dd className="font-display order-1 text-4xl font-bold tracking-tight text-white">{x.v}</dd>
                <dt className="order-2 mt-2 text-sm font-semibold text-slate-200">{x.k}</dt>
                <dd className="order-3 mt-1 text-xs text-muted">{x.s}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-semibold text-slate-300">Capacity</span>
              <span className="font-mono text-muted">{stats.totals.capacityPct}% of {stats.totals.maxTeams} team slots</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div {...bar(stats.totals.capacityPct)} className="h-full rounded-full bg-accent" />
            </div>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <Panel title="Registrations over time">
              {stats.byDay.length === 0 ? (
                <p className="text-sm text-muted">No registrations yet.</p>
              ) : (
                <>
                  <div className="flex h-40 items-end gap-2">
                    {stats.byDay.map((d) => (
                      <div key={d.iso} className="flex flex-1 flex-col items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-300">{d.n}</span>
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: `${(d.n / Math.max(...stats.byDay.map((x) => x.n))) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                          className="w-full rounded-t bg-accent/70"
                        />
                        <span className="text-[10px] text-muted">{d.day}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-muted">Unique emails: {stats.totals.uniqueEmails} · duplicate signups blocked</p>
                </>
              )}
            </Panel>

            <Panel title="Teams by track">
              {stats.byTrack.length === 0 ? (
                <p className="text-sm text-muted">No data yet.</p>
              ) : (
                <ul className="space-y-4">
                  {stats.byTrack.map((t) => (
                    <HBar key={t.id} label={t.label} value={t.count} max={stats.byTrack[0].count} />
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Top institutions">
              {stats.byInstitution.length === 0 ? (
                <p className="text-sm text-muted">No data yet.</p>
              ) : (
                <ul className="space-y-4">
                  {stats.byInstitution.map((i) => (
                    <HBar key={i.institution} label={i.institution} value={i.n} max={stats.byInstitution[0].n} />
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Cities and team sizes">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">Cities</p>
                  {stats.byCity.length === 0 ? (
                    <p className="text-sm text-muted">No data yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {stats.byCity.slice(0, 6).map((c) => (
                        <HBar key={c.city} label={c.city} value={c.n} max={stats.byCity[0].n} />
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">Team size</p>
                  {stats.byTeamSize.length === 0 ? (
                    <p className="text-sm text-muted">No data yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {stats.byTeamSize.map((s) => (
                        <HBar key={s.team_size} label={`${s.team_size} members`} value={s.n} max={Math.max(...stats.byTeamSize.map((x) => x.n))} />
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Panel>
          </div>

          <section className="mt-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 border-b border-white/10 p-5">
              <ChartBar size={18} className="text-accent" />
              <h2 className="text-sm font-semibold text-white">Latest registrations</h2>
            </div>
            {stats.recent.length === 0 ? (
              <p className="p-5 text-sm text-muted">Nothing yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-muted">
                      <th scope="col" className="p-4 font-semibold">Team</th>
                      <th scope="col" className="p-4 font-semibold">Institution</th>
                      <th scope="col" className="p-4 font-semibold">Track</th>
                      <th scope="col" className="p-4 font-semibold">Size</th>
                      <th scope="col" className="p-4 font-semibold">Lead contact</th>
                      <th scope="col" className="p-4 font-semibold">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stats.recent.map((r) => (
                      <tr key={r.id} onClick={() => setDetailTeamId(r.id)} className="cursor-pointer transition hover:bg-white/[0.02]">
                        <td className="p-4">
                          <p className="font-semibold text-white">{r.team_name}</p>
                          {r.project_idea && <p className="mt-0.5 line-clamp-1 text-xs text-muted">{r.project_idea}</p>}
                        </td>
                        <td className="p-4 text-slate-300">
                          {r.institution}
                          {r.city && <span className="block text-xs text-muted">{r.city}</span>}
                        </td>
                        <td className="p-4 text-slate-300">{r.track_label}</td>
                        <td className="p-4 font-mono text-slate-300">
                          <span className="inline-flex items-center gap-1.5">
                            <UsersThree size={14} className="text-muted" />{r.member_count}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-300">{r.lead_name}</p>
                          <a className="text-xs text-accent hover:underline" href={`mailto:${r.lead_email}`}>{r.lead_email}</a>
                          <p className="text-xs text-muted">{r.lead_phone}</p>
                        </td>
                        <td className="p-4 text-xs text-muted">
                          {new Date(r.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <p className="mt-8 flex items-center gap-2 text-xs text-muted">
            <Buildings size={14} /> Organizer-only view.
          </p>
        </>
      )}
      </>
      )}
      {detailTeamId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setDetailTeamId(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border border-white/10 bg-[#0b1220] p-6" onClick={e => e.stopPropagation()}>
            {detailLoading ? (
              <p className="text-sm text-muted">Loading…</p>
            ) : detailData ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl font-bold text-white">{detailData.team.team_name}</h3>
                  <button onClick={() => setDetailTeamId(null)} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300 hover:border-accent/50">Close</button>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-muted">Institution</dt><dd className="text-slate-200">{detailData.team.institution}{detailData.team.city ? ` · ${detailData.team.city}` : ''}</dd></div>
                  <div><dt className="text-muted">Track</dt><dd className="text-slate-200">{TRACK_LABELS[detailData.team.track_id as keyof typeof TRACK_LABELS] ?? detailData.team.track_id}</dd></div>
                  {detailData.team.project_idea && <div className="col-span-2"><dt className="text-muted">Project idea</dt><dd className="mt-1 text-slate-200">{detailData.team.project_idea}</dd></div>}
                </dl>
                <h4 className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-400">Members ({detailData.members.length})</h4>
                <ul className="mt-2 space-y-2">
                  {detailData.members.map((m: any) => (
                    <li key={m.id} className="rounded-xl border border-white/10 p-3 text-sm">
                      <p className="font-semibold text-white">{m.full_name} {m.is_lead && <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-accent">LEAD</span>}</p>
                      <p className="text-xs text-muted">{m.email} · {m.phone}{m.branch_year ? ` · ${m.branch_year}` : ''}</p>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
