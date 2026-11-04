"use client";

import { FormEvent, useState } from "react";
import type { EventDefinition } from "@/lib/events";
import { TRACKS } from "@/lib/registration-data";

type Member = { fullName: string; email: string; phone: string; branchYear: string };
const blankMember = (): Member => ({ fullName: "", email: "", phone: "", branchYear: "" });

export default function EventRegistrationForm({ event }: { event: EventDefinition }) {
  const [members, setMembers] = useState<Member[]>([blankMember(), blankMember()]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  function updateMember(index: number, field: keyof Member, value: string) {
    setMembers((current) => current.map((member, i) => i === index ? { ...member, [field]: value } : member));
  }
  function addMember() { if (members.length < 4) setMembers((current) => [...current, blankMember()]); }
  function removeMember(index: number) { if (members.length > 2) setMembers((current) => current.filter((_, i) => i !== index)); }

  async function submit(eventObject: FormEvent<HTMLFormElement>) {
    eventObject.preventDefault();
    setBusy(true);
    setMessage(null);
    const form = new FormData(eventObject.currentTarget);
    form.set("eventSlug", event.slug);
    form.set("members", JSON.stringify(members));
    try {
      const response = await fetch("/api/register", { method: "POST", body: form });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || body.ok === false) {
        const details = Array.isArray(body.errors) ? body.errors.map((error: { message?: string }) => error.message).filter(Boolean).join(" ") : "";
        throw new Error(details || body.message || body.error || "Registration could not be submitted.");
      }
      eventObject.currentTarget.reset();
      setMembers([blankMember(), blankMember()]);
      setMessage({ kind: "success", text: `Registration received. Your team reference is ${body.teamCode}. Payment verification comes next.` });
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Registration could not be submitted." });
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-10" encType="multipart/form-data" style={{ "--event-accent": event.accent } as React.CSSProperties}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Team name" name="teamName" required placeholder="How should we call your squad?" />
        <Field label="Institution" name="institution" required placeholder="College or university" />
        <Field label="City" name="city" placeholder="Mangaluru" />
        {event.registrationTracks ? <label className="field-label">Problem space<select name="trackId" required defaultValue="" className="form-control mt-2"><option value="" disabled>Select a track</option>{TRACKS.map((track) => <option key={track.id} value={track.id}>{track.title}</option>)}</select></label> : <input type="hidden" name="trackId" value="autonomous" />}
      </div>

      <label className="field-label">What are you bringing?<textarea name="projectIdea" rows={4} maxLength={1000} placeholder={`A short note about your ${event.name.toLowerCase()} entry`} className="form-control mt-2 resize-y" /></label>

      <section className="form-section" aria-labelledby="members-heading">
        <div className="flex items-end justify-between gap-4"><div><h2 id="members-heading" className="form-heading">Your roster</h2><p className="mt-1 text-sm text-muted">Add two to four people. The first person becomes the team lead.</p></div><span className="text-sm text-accent">{members.length} / 4</span></div>
        <div className="mt-5 space-y-4">{members.map((member, index) => <div key={index} className="member-card"><div className="mb-4 flex items-center justify-between"><span className="event-number text-base">{index === 0 ? "Team lead" : `Member ${index + 1}`}</span>{index > 1 && <button type="button" onClick={() => removeMember(index)} className="text-sm text-muted hover:text-ember">Remove</button>}</div><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" value={member.fullName} onChange={(value) => updateMember(index, "fullName", value)} required /><Field label="Email" type="email" value={member.email} onChange={(value) => updateMember(index, "email", value)} required /><Field label="Phone" value={member.phone} onChange={(value) => updateMember(index, "phone", value)} required /><Field label="Branch / year" value={member.branchYear} onChange={(value) => updateMember(index, "branchYear", value)} placeholder="CSE · 3rd year" /></div></div>)}</div>
        {members.length < 4 && <button type="button" onClick={addMember} className="button button--quiet mt-5">Add member</button>}
      </section>

      <section className="form-section" aria-labelledby="payment-heading">
        <h2 id="payment-heading" className="form-heading">Payment proof</h2><p className="mt-1 text-sm text-muted">Pay ₹600 per team using the QR code, then attach the receipt.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-start"><div className="qr-card"><img src="/payment-qr.png" alt="Payment QR code" className="aspect-square w-full" /></div><div className="space-y-5"><Field label="UPI / bank reference" name="paymentReference" placeholder="Optional transaction reference" /><label className="field-label">Receipt screenshot<input name="screenshot" type="file" accept="image/png,image/jpeg,image/webp" required className="file-field mt-2" /></label></div></div>
      </section>

      <label className="agreement"><input name="agreeRules" type="checkbox" value="true" required /><span>I confirm that these details are accurate and agree to the event rules and payment verification process.</span></label>
      {message && <p role="status" className={`status-message ${message.kind === "success" ? "status-message--success" : "status-message--error"}`}>{message.text}</p>}
      <button type="submit" disabled={busy} className="button w-full">{busy ? "Sending registration…" : `Register for ${event.name}`}</button>
    </form>
  );
}

function Field({ label, name, type = "text", value, onChange, required, placeholder }: { label: string; name?: string; type?: string; value?: string; onChange?: (value: string) => void; required?: boolean; placeholder?: string }) {
  return <label className="field-label">{label}{required && <span className="text-ember"> *</span>}<input name={name} type={type} value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined} required={required} placeholder={placeholder} className="form-control mt-2" /></label>;
}
