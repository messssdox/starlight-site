// The reading counter: a tiny serverless function that runs on Cloudflare Pages.
//   GET  /api/counter  -> { count: 12408 }
//   POST /api/counter  -> adds one, returns the new count
// It stores a single number in a free Cloudflare D1 database bound as COUNTER_DB.
// Setup steps are in the step-by-step guide ("Turning on the reading counter").

interface Env {
  COUNTER_DB: D1Database;
}

// Minimal types so this file reads clearly without extra packages.
interface D1Database {
  prepare(sql: string): { first<T>(): Promise<T | null>; run(): Promise<unknown> };
}

const json = (body: unknown) =>
  new Response(JSON.stringify(body), { headers: { "content-type": "application/json", "cache-control": "no-store" } });

export const onRequestGet = async ({ env }: { env: Env }) => {
  const row = await env.COUNTER_DB.prepare("SELECT value FROM counters WHERE name = 'readings'").first<{ value: number }>();
  return json({ count: row?.value ?? 0 });
};

export const onRequestPost = async ({ env }: { env: Env }) => {
  const row = await env.COUNTER_DB.prepare(
    "INSERT INTO counters (name, value) VALUES ('readings', 1) ON CONFLICT(name) DO UPDATE SET value = value + 1 RETURNING value",
  ).first<{ value: number }>();
  return json({ count: row?.value ?? 0 });
};
