"use client";

export type Session = {
  token: string;
  kind: "participant" | "organizer";
  role: string;
  name: string;
  email: string;
  expiresAt: string;
  profile?: { full_name: string; college: string; phone: string } | null;
};

const KEY = "techsiege_session";

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (!s.token) return null;
    return s;
  } catch {
    return null;
  }
}

export function saveSession(s: Session): void {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSession(): void {
  localStorage.removeItem(KEY);
}

/** fetch() that attaches the session token and clears it on 401. */
export async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const s = getSession();
  const res = await fetch(path, {
    ...init,
    headers: { ...(init?.headers ?? {}), ...(s ? { Authorization: `Bearer ${s.token}` } : {}) },
  });
  if (res.status === 401) clearSession();
  return res;
}

export async function signOut(): Promise<void> {
  try {
    await authFetch("/api/auth/logout", { method: "POST" });
  } catch {
    /* offline sign-out still clears locally */
  }
  clearSession();
}
