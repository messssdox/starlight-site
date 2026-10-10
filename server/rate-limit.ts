// A simple "no more than N times per window" check, stored in D1.
// Visitors are identified by a one-way scrambled code made from their IP address, never the address itself.
import type { D1Database } from "./db.ts";

export async function visitorCode(request: Request): Promise<string> {
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`starlight:${ip}`));
  return [...new Uint8Array(bytes)].slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const keyFor = (action: string, visitor: string, windowSeconds: number, now: number) =>
  `${action}:${visitor}:${Math.floor(now / windowSeconds)}`;

/** Counts one more attempt. Returns true while the visitor is still within the limit. */
export async function allow(db: D1Database, action: string, visitor: string, limit: number, windowSeconds: number, now = Date.now() / 1000) {
  const row = await db
    .prepare("INSERT INTO rate_limits (key, hits, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET hits = hits + 1 RETURNING hits")
    .bind(keyFor(action, visitor, windowSeconds, now), Math.ceil(now + windowSeconds))
    .first<{ hits: number }>();
  // Tidy away old windows now and then.
  if (Math.random() < 0.05) await db.prepare("DELETE FROM rate_limits WHERE expires_at < ?").bind(Math.floor(now)).run();
  return (row?.hits ?? 1) <= limit;
}

/** Looks at the count without adding to it. */
export async function isOver(db: D1Database, action: string, visitor: string, limit: number, windowSeconds: number, now = Date.now() / 1000) {
  const row = await db.prepare("SELECT hits FROM rate_limits WHERE key = ?").bind(keyFor(action, visitor, windowSeconds, now)).first<{ hits: number }>();
  return (row?.hits ?? 0) >= limit;
}
