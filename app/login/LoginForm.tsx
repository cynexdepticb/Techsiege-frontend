"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveSession, type Session } from "@/lib/auth";

type Mode = "login" | "signup";

export default function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const organizerMode = search.get("organizer") === "1";
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(search.get("error"));
  const [notice, setNotice] = useState<string | null>(null);

  const input =
    "min-h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition focus:border-accent/70 focus:outline-none focus:ring-2 focus:ring-accent/20";

  useEffect(() => {
    const raw = window.location.hash.startsWith("#oauth=")
      ? decodeURIComponent(window.location.hash.slice("#oauth=".length))
      : "";
    if (!raw) return;
    const params = new URLSearchParams(raw);
    const session: Session = {
      token: params.get("token") ?? "",
      kind: "participant",
      role: "participant",
      name: params.get("name") ?? "",
      email: params.get("email") ?? "",
      expiresAt: params.get("expiresAt") ?? "",
    };
    if (!session.token || !session.email) {
      setError("Google sign-in failed. Try again.");
      return;
    }
    saveSession(session);
    window.history.replaceState(null, "", "/login");
    router.replace("/portal");
  }, [router]);

  async function requestOtp(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const purpose = organizerMode ? "organizer" : "participant";
      const body =
        purpose === "participant"
          ? {
              email: email.trim(),
              purpose,
              mode,
              ...(mode === "signup"
                ? {
                    fullName: fullName.trim(),
                    college: college.trim(),
                    phone: phone.trim(),
                  }
                : {}),
            }
          : { email: email.trim(), purpose };

      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        const msg =
          data.errors?.map((x: { message: string }) => x.message).join(" ") ??
          data.message ??
          "Could not send a code. Try again.";
        setError(msg);
        return;
      }
      setStep("code");
      setNotice(data.message ?? "Code sent. Check your inbox and spam folder.");
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const purpose = organizerMode ? "organizer" : "participant";
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), purpose, code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message ?? "That code did not work.");
        return;
      }
      const session: Session = {
        token: data.token,
        kind: data.kind,
        role: data.role,
        name: data.name,
        email: data.email,
        expiresAt: data.expiresAt,
      };
      saveSession(session);
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next && next.startsWith("/") ? next : data.kind === "organizer" ? "/admin" : "/portal");
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setStep("email");
    setCode("");
    setError(null);
    setNotice(null);
  }

  return (
    <section className="relative w-full max-w-md" aria-label="Sign in form">
      {!organizerMode && step === "email" && (
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1" aria-label="Account action">
          {(["login", "signup"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={mode === item}
              onClick={() => switchMode(item)}
              className={`min-h-11 rounded-lg px-4 text-sm font-semibold transition ${
                mode === item ? "bg-accent text-black" : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item === "login" ? "Login" : "Sign up"}
            </button>
          ))}
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={requestOtp} className="mt-5 space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              {organizerMode ? "Organizer sign in" : mode === "login" ? "Welcome back" : "Create participant access"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {organizerMode
                ? "Use your organizer email code."
                : mode === "login"
                  ? "Use the email already added to a team."
                  : "Create access before team registration."}
            </p>
          </div>

          {!organizerMode && (
            <a
              href="/api/auth/google/start"
              className="flex min-h-11 w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:border-accent/50 hover:bg-white/[0.08]"
            >
              Continue with Google
            </a>
          )}

          {!organizerMode && <div className="h-px bg-white/10" />}

          {!organizerMode && mode === "signup" && (
            <>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-300">Full name</span>
                <input required minLength={2} maxLength={100} value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" className={input} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-300">College</span>
                <input required minLength={2} maxLength={160} value={college} onChange={(e) => setCollege(e.target.value)} autoComplete="organization" className={input} />
              </label>
            </>
          )}

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-300">Email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@college.edu" className={input} />
          </label>

          {!organizerMode && mode === "signup" && (
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-300">Phone</span>
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="+91 98765 43210" className={input} />
            </label>
          )}

          {error && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
          {!organizerMode && mode === "login" && (
            <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-relaxed text-muted">
              No code? Use Sign up first if your email has not been added to a team yet.
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="min-h-11 w-full rounded-xl bg-accent px-4 text-sm font-bold text-black transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-accent/50"
          >
            {busy ? "Sending code..." : "Send email code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Email verification</p>
            <h2 className="font-display mt-2 text-2xl font-bold text-white">Enter your code</h2>
            <p className="mt-1 text-sm text-muted">
              Sent to <span className="font-semibold text-slate-200">{email}</span>.
            </p>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-300">6-digit code</span>
            <input
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className={`${input} text-center font-mono text-xl tracking-[0.35em]`}
            />
          </label>

          {notice && <p role="status" className="rounded-xl border border-accent/25 bg-accent/5 p-3 text-sm text-slate-200">{notice}</p>}
          {error && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="min-h-11 w-full rounded-xl bg-accent px-4 text-sm font-bold text-black transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-accent/45 disabled:text-black/70"
          >
            {busy ? "Checking..." : "Continue"}
          </button>
          <div className="flex items-center justify-between gap-3 text-sm">
            <button type="button" onClick={() => setStep("email")} className="text-muted underline underline-offset-4 hover:text-slate-300">
              Change email
            </button>
            <button type="button" onClick={() => requestOtp()} disabled={busy} className="text-muted underline underline-offset-4 hover:text-slate-300 disabled:opacity-60">
              Resend code
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
