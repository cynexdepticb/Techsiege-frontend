/**
 * API base helper. With the Next rewrite proxy (next.config.js),
 * relative "/api/..." calls already reach the Express backend on :5000
 * server-side with no CORS. Use apiUrl() only when you need an absolute
 * URL (e.g. outside fetch proxy contexts).
 */
export const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/$/, "") || "";

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}
