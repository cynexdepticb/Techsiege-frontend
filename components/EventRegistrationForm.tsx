"use client";

import { FormEvent, useState } from "react";
import type { EventDefinition } from "@/lib/events";
import { TRACKS } from "@/lib/registration-data";

type Member = { fullName: string; email: string; phone: string; branch: string; year: string };
type Values = { teamName: string; institution: string; trackId: string; paymentReference: string; agreeRules: boolean };
type Confirmation = { teamCode: string; emailNotice?: string | null };
type Errors = Record<string, string>;

const blankMember = (): Member => ({ fullName: "", email: "", phone: "", branch: "", year: "" });
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const indianPhonePattern = /^(?:\+91)?[6-9]\d{9}$/;

export default function EventRegistrationForm({ event }: { event: EventDefinition }) {
  const [values, setValues] = useState<Values>({ teamName: "", institution: "", trackId: "", paymentReference: "", agreeRules: false });
  const [members, setMembers] = useState<Member[]>(Array.from({ length: event.minTeamSize }, blankMember));
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  function updateValue(field: keyof Values, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function updateMember(index: number, field: keyof Member, value: string) {
    setMembers((current) => current.map((member, memberIndex) => memberIndex === index ? { ...member, [field]: value } : member));
    setErrors((current) => ({ ...current, [`member-${index}-${field}`]: "" }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (values.teamName.trim().length < 2) next.teamName = "Enter a team name with at least two characters.";
    if (values.institution.trim().length < 2) next.institution = "Enter your college name.";
    if (event.registrationTracks && !values.trackId) next.trackId = "Select a problem space.";
    if (values.paymentReference.trim().length < 3) next.paymentReference = "Enter the UPI transaction ID.";
    if (!paymentProof) next.screenshot = "Upload your UPI payment receipt.";
    if (!values.agreeRules) next.agreeRules = "You must accept the event rules.";
    if (members.length < event.minTeamSize || members.length > event.maxTeamSize) next.members = `Your team must have ${event.minTeamSize}–${event.maxTeamSize} members.`;

    members.forEach((member, index) => {
      const role = index === 0 ? "team leader" : `member ${index + 1}`;
      if (member.fullName.trim().length < 2) next[`member-${index}-fullName`] = `Enter the ${role}'s name.`;
      if (!emailPattern.test(member.email.trim())) next[`member-${index}-email`] = "Enter a valid email address.";
      const phone = member.phone.replace(/[\s-]/g, "");
      if (!indianPhonePattern.test(phone)) next[`member-${index}-phone`] = "Use a valid 10-digit Indian mobile number.";
      if (!member.branch.trim()) next[`member-${index}-branch`] = "Enter the branch.";
      if (!member.year.trim()) next[`member-${index}-year`] = "Enter the year.";
    });
    return next;
  }

  async function submit(eventObject: FormEvent<HTMLFormElement>) {
    eventObject.preventDefault();
    if (busy) return;
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmissionError("");
    if (Object.keys(nextErrors).length > 0) return;

    setBusy(true);
    const formData = new FormData(eventObject.currentTarget);
    formData.set("eventSlug", event.slug);
    formData.set("teamName", values.teamName.trim());
    formData.set("institution", values.institution.trim());
    formData.set("city", "");
    formData.set("trackId", event.registrationTracks ? values.trackId : "agentic-ai");
    formData.set("projectIdea", "");
    formData.set("paymentReference", values.paymentReference.trim());
    formData.set("members", JSON.stringify(members.map((member) => ({ fullName: member.fullName.trim(), email: member.email.trim(), phone: member.phone.replace(/[\s-]/g, ""), branchYear: `${member.branch.trim()} · ${member.year.trim()}` }))));
    formData.set("agreeRules", "true");

    try {
      const response = await fetch("/api/register", { method: "POST", body: formData });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || body.ok === false) {
        const detail = Array.isArray(body.errors) ? body.errors.map((error: { message?: string }) => error.message).filter(Boolean).join(" ") : "";
        throw new Error(detail || body.message || body.error || "Registration could not be submitted.");
      }
      setConfirmation({ teamCode: body.teamCode, emailNotice: body.emailNotice });
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Registration could not be submitted.");
    } finally {
      setBusy(false);
    }
  }

  if (confirmation) {
    return (
      <section className="registration-confirmation" role="status" aria-live="polite">
        <p className="event-number">Registration received</p>
        <h2 className="form-heading mt-4">You are in the verification queue.</h2>
        <p className="mt-4 text-ink2">Your registration ID is <strong>{confirmation.teamCode}</strong>. Save it for payment and check-in queries.</p>
        <ol className="confirmation-steps">
          <li>We verify the UPI receipt you submitted.</li>
          <li>The team leader receives an acknowledgement email.</li>
          <li>Confirmed teams receive their final event instructions.</li>
        </ol>
        {confirmation.emailNotice && <p className="form-error mt-5">{confirmation.emailNotice}</p>}
      </section>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-10" encType="multipart/form-data" style={{ "--event-accent": event.accentColor } as React.CSSProperties}>
      <section aria-labelledby="team-details-heading">
        <h2 id="team-details-heading" className="form-heading">Team details</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field id="teamName" label="Team name" value={values.teamName} onChange={(value) => updateValue("teamName", value)} error={errors.teamName} required placeholder="How should we call your squad?" />
          <Field id="institution" label="College" value={values.institution} onChange={(value) => updateValue("institution", value)} error={errors.institution} required placeholder="College or university" />
          {event.registrationTracks && <SelectField id="trackId" label="Problem space" value={values.trackId} onChange={(value) => updateValue("trackId", value)} error={errors.trackId} required><option value="">Select a track</option>{TRACKS.map((track) => <option key={track.id} value={track.id}>{track.title}</option>)}</SelectField>}
        </div>
      </section>

      <section className="form-section" aria-labelledby="roster-heading">
        <div className="flex items-end justify-between gap-4"><div><h2 id="roster-heading" className="form-heading">Your roster</h2><p className="mt-1 text-sm text-muted">Add between {event.minTeamSize} and {event.maxTeamSize} participants. The first person is the team leader.</p></div><span className="text-sm text-accent">{members.length} / {event.maxTeamSize}</span></div>
        {errors.members && <p className="form-error mt-3">{errors.members}</p>}
        <div className="mt-5 space-y-4">{members.map((member, index) => <MemberFields key={index} member={member} index={index} errors={errors} onChange={updateMember} onRemove={() => setMembers((current) => current.filter((_, memberIndex) => memberIndex !== index))} removable={index >= event.minTeamSize} />)}</div>
        {members.length < event.maxTeamSize && <button type="button" onClick={() => setMembers((current) => [...current, blankMember()])} className="button button--quiet mt-5">Add team member</button>}
      </section>

      <section className="form-section" aria-labelledby="payment-heading">
        <div className="payment-heading-row"><div><h2 id="payment-heading" className="form-heading">UPI payment</h2><p className="mt-1 text-sm text-muted">Pay the entry fee using the QR code, then provide the transaction ID and receipt.</p></div><div className="registration-fee" aria-label="Entry fee"><span>Entry fee</span><strong>{event.fee}</strong></div></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-start"><div className="qr-card"><img src="/payment-qr.png" alt="UPI payment QR code" className="aspect-square w-full" /></div><div className="space-y-5"><Field id="paymentReference" label="UPI transaction ID" value={values.paymentReference} onChange={(value) => updateValue("paymentReference", value)} error={errors.paymentReference} required placeholder="Enter the transaction reference" /><label className="field-label" htmlFor="screenshot">Payment receipt <span className="text-ember">*</span><input id="screenshot" name="screenshot" type="file" accept="image/png,image/jpeg,image/webp" onChange={(input) => { setPaymentProof(input.target.files?.[0] ?? null); setErrors((current) => ({ ...current, screenshot: "" })); }} aria-invalid={Boolean(errors.screenshot)} aria-describedby={errors.screenshot ? "screenshot-error" : undefined} className="file-field mt-2" />{errors.screenshot && <span id="screenshot-error" className="form-error">{errors.screenshot}</span>}</label></div></div>
      </section>

      <label className="agreement"><input name="agreeRules" type="checkbox" checked={values.agreeRules} onChange={(input) => updateValue("agreeRules", input.target.checked)} aria-invalid={Boolean(errors.agreeRules)} /><span>I confirm that these details are accurate and accept the rules for {event.name}.</span></label>
      {errors.agreeRules && <p className="form-error">{errors.agreeRules}</p>}
      {submissionError && <p role="alert" className="form-error">{submissionError}</p>}
      <button type="submit" disabled={busy} className="button w-full">{busy ? "Submitting registration…" : `Register for ${event.name}`}</button>
    </form>
  );
}

function MemberFields({ member, index, errors, onChange, onRemove, removable }: { member: Member; index: number; errors: Errors; onChange: (index: number, field: keyof Member, value: string) => void; onRemove: () => void; removable: boolean }) {
  const title = index === 0 ? "Team leader" : `Team member ${index + 1}`;
  return <fieldset className="member-card"><legend className="visually-hidden">{title}</legend><div className="mb-4 flex items-center justify-between"><span className="event-number text-base">{title}</span>{removable && <button type="button" onClick={onRemove} className="text-sm text-muted hover:text-ember">Remove</button>}</div><div className="grid gap-4 sm:grid-cols-2"><Field id={`member-${index}-fullName`} label="Full name" value={member.fullName} onChange={(value) => onChange(index, "fullName", value)} error={errors[`member-${index}-fullName`]} required /><Field id={`member-${index}-email`} label="Email" type="email" value={member.email} onChange={(value) => onChange(index, "email", value)} error={errors[`member-${index}-email`]} required /><Field id={`member-${index}-phone`} label="Phone" type="tel" value={member.phone} onChange={(value) => onChange(index, "phone", value)} error={errors[`member-${index}-phone`]} required placeholder="10-digit Indian number" /><Field id={`member-${index}-branch`} label="Branch" value={member.branch} onChange={(value) => onChange(index, "branch", value)} error={errors[`member-${index}-branch`]} required placeholder="CSE" /><Field id={`member-${index}-year`} label="Year" value={member.year} onChange={(value) => onChange(index, "year", value)} error={errors[`member-${index}-year`]} required placeholder="3rd year" /></div></fieldset>;
}

function Field({ id, label, type = "text", value, onChange, error, required, placeholder }: { id: string; label: string; type?: string; value: string; onChange: (value: string) => void; error?: string; required?: boolean; placeholder?: string }) {
  return <label className="field-label" htmlFor={id}>{label}{required && <span className="text-ember"> *</span>}<input id={id} name={id} type={type} value={value} onChange={(input) => onChange(input.target.value)} required={required} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="form-control mt-2" />{error && <span id={`${id}-error`} className="form-error">{error}</span>}</label>;
}

function SelectField({ id, label, value, onChange, error, required, children }: { id: string; label: string; value: string; onChange: (value: string) => void; error?: string; required?: boolean; children: React.ReactNode }) {
  return <label className="field-label" htmlFor={id}>{label}{required && <span className="text-ember"> *</span>}<select id={id} name={id} value={value} onChange={(input) => onChange(input.target.value)} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="form-control mt-2">{children}</select>{error && <span id={`${id}-error`} className="form-error">{error}</span>}</label>;
}
