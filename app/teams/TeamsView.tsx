"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TRACK_LABELS, type TrackId } from "@/lib/tracks";
import { authFetch, getSession } from "@/lib/auth";

type TeamRow = {
  id: string;
  team_code: string | null;
  team_name: string;
  institution: string;
  city: string;
  track_id: string;
  project_idea?: string;
  registration_status: string;
  payment_status: string;
  submitted_at?: string;
  member_count: number;
  lead_name?: string;
  lead_email?: string;
  lead_phone?: string;
};

type Member = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  branch_year: string;
  is_lead: boolean;
  ticket_id: string | null;
  ticket_status: string | null;
};

type Detail = {
  team: TeamRow & Record<string, string>;
  members: Member[];
};

function badge(value: string) {
  const color: Record<string, string> = {
    CONFIRMED: "border-lime2/40 text-lime2",
    VERIFIED: "border-lime2/40 text-lime2",
    PAYMENT_PENDING: "border-amber-400/40 text-amber-200",
    PAYMENT_VERIFICATION: "border-accent/40 text-accent",
    PENDING: "border-amber-400/40 text-amber-200",
    RESUBMISSION_REQUIRED: "border-orange-400/40 text-orange-300",
    PAYMENT_REJECTED: "border-red-400/40 text-red-300",
    REJECTED: "border-red-400/40 text-red-300",
    CANCELLED: "border-white/15 text-muted",
  };
  return <span className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${color[value] ?? "border-white/15 text-slate-300"}`}>{value}</span>;
}

function trackLabel(id: string) {
  return TRACK_LABELS[id as TrackId] ?? id;
}

export default function TeamsView() {
  const router = useRouter();
  const [rows, setRows] = useState<TeamRow[]>([]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<"participant" | "organizer" | null>(null);
  const [reason, setReason] = useState("");
  const [decisionBusy, setDecisionBusy] = useState<"VERIFY" | "REJECT" | "RESUBMIT" | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login?next=/teams");
      return;
    }
    setKind(session.kind);

    (async () => {
      try {
        if (session.kind === "organizer") {
          const res = await authFetch("/api/admin/registrations?status=ALL");
          const data = await res.json();
          if (!res.ok || !data.ok) throw new Error(data.message ?? "Could not load teams.");
          setRows(data.registrations);
          return;
        }

        const res = await authFetch("/api/portal/registration");
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message ?? "Could not load your team.");
        if (data.team) {
          setDetail({ team: data.team, members: data.members ?? [] });
          setRows([{ ...data.team, member_count: data.members?.length ?? 0 }]);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load teams.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function openTeam(id: string) {
    if (kind !== "organizer") return;
    setError(null);
    try {
      const res = await authFetch(`/api/admin/registrations/${id}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message ?? "Could not load team details.");
      setDetail({ team: data.team, members: data.members ?? [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load team details.");
    }
  }

  async function decide(decision: "VERIFY" | "REJECT" | "RESUBMIT") {
    if (!detail || kind !== "organizer") return;
    const note = reason.trim();
    if ((decision === "REJECT" || decision === "RESUBMIT") && !note) {
      setError("Add a reason before rejecting or requesting resubmission.");
      return;
    }
    setDecisionBusy(decision);
    setError(null);
    try {
      const res = await authFetch(`/api/admin/registrations/${detail.team.id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, reason: note }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message ?? "Could not update payment status.");
      setRows((teams) =>
        teams.map((team) =>
          team.id === detail.team.id
            ? { ...team, registration_status: data.registrationStatus, payment_status: data.paymentStatus }
            : team,
        ),
      );
      setReason("");
      await openTeam(detail.team.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update payment status.");
    } finally {
      setDecisionBusy(null);
    }
  }

  if (loading) return <p className="text-sm text-muted">Loading teams...</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="rounded-2xl border border-white/10">
        <div className="border-b border-white/10 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{kind === "organizer" ? "All teams" : "My team"}</p>
          <h1 className="font-display mt-1 text-3xl font-bold text-white">Teams</h1>
          {error && <p role="alert" className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        </div>

        {rows.length === 0 ? (
          <div className="p-5 text-sm text-muted">No team registration found.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {rows.map((team) => (
              <button
                key={team.id}
                onClick={() => openTeam(team.id)}
                className="block w-full p-5 text-left transition hover:bg-white/[0.03]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{team.team_name}</p>
                    <p className="mt-1 text-xs text-muted">
                      <span className="font-mono text-accent">{team.team_code ?? "NO-CODE"}</span>
                      {" / "}
                      {team.institution}
                      {team.city ? ` / ${team.city}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {badge(team.registration_status)}
                    {badge(team.payment_status)}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
                  <span>{trackLabel(team.track_id)}</span>
                  <span>{team.member_count} members</span>
                  {team.lead_name && <span>Lead: {team.lead_name}</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <aside className="rounded-2xl border border-white/10 p-5">
        {!detail ? (
          <p className="text-sm text-muted">{kind === "organizer" ? "Select a team to see full details." : "Your team details will appear here after registration."}</p>
        ) : (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Team details</p>
            <h2 className="font-display mt-1 text-2xl font-bold text-white">{detail.team.team_name}</h2>
            <p className="mt-1 font-mono text-sm text-accent">{detail.team.team_code}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p><span className="text-muted">Institution:</span> {detail.team.institution}</p>
              <p><span className="text-muted">City:</span> {detail.team.city || "Not provided"}</p>
              <p><span className="text-muted">Track:</span> {trackLabel(detail.team.track_id)}</p>
              {detail.team.project_idea && <p><span className="text-muted">Idea:</span> {detail.team.project_idea}</p>}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {badge(detail.team.registration_status)}
              {badge(detail.team.payment_status)}
            </div>

            {kind === "organizer" && (
              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted">Payment Verification</p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder="Reason for reject or resubmission request"
                  className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none"
                />
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <button
                    onClick={() => decide("VERIFY")}
                    disabled={decisionBusy !== null}
                    className="rounded-full bg-lime2 px-3 py-2 text-xs font-bold text-black transition hover:brightness-110 disabled:opacity-60"
                  >
                    {decisionBusy === "VERIFY" ? "Verifying..." : "Verify"}
                  </button>
                  <button
                    onClick={() => decide("RESUBMIT")}
                    disabled={decisionBusy !== null}
                    className="rounded-full border border-amber-400/40 px-3 py-2 text-xs font-bold text-amber-200 transition hover:bg-amber-400/10 disabled:opacity-60"
                  >
                    {decisionBusy === "RESUBMIT" ? "Requesting..." : "Resubmit"}
                  </button>
                  <button
                    onClick={() => decide("REJECT")}
                    disabled={decisionBusy !== null}
                    className="rounded-full border border-red-400/40 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-400/10 disabled:opacity-60"
                  >
                    {decisionBusy === "REJECT" ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              </div>
            )}

            <h3 className="mt-6 text-xs font-bold uppercase tracking-widest text-muted">Members</h3>
            <ul className="mt-3 space-y-3">
              {detail.members.map((member) => (
                <li key={member.id} className="rounded-xl border border-white/10 p-3">
                  <p className="font-semibold text-white">
                    {member.full_name}
                    {member.is_lead && <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-accent">LEAD</span>}
                  </p>
                  <p className="mt-1 text-xs text-muted">{member.email}</p>
                  {member.branch_year && <p className="mt-1 text-xs text-muted">{member.branch_year}</p>}
                  {member.ticket_id && <p className="mt-2 font-mono text-xs text-lime2">{member.ticket_id} / {member.ticket_status}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
