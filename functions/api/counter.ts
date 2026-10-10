// The reading counter: a tiny serverless function that runs on Cloudflare Pages.
//   GET  /api/counter  -> { count: 12408 }
//   POST /api/counter  -> adds one, returns the new count
// It stores a single number in a free Cloudflare D1 database bound as COUNTER_DB.
// Each visitor can add at most 30 readings an hour, so nobody can inflate the number with a script.
// Setup steps are in the step-by-step guide ("Turning on the reading counter").
import { json, type Context } from "../../server/db.ts";
import { allow, visitorCode } from "../../server/rate-limit.ts";

const read = async (env: Context["env"]) => {
  const row = await env.COUNTER_DB.prepare("SELECT value FROM counters WHERE name = 'readings'").first<{ value: number }>();
  return json({ count: row?.value ?? 0 });
};

export const onRequestGet = async ({ env }: Context) => read(env);

export const onRequestPost = async ({ request, env }: Context) => {
  // If the rate-limit table hasn't been created yet (migration 0002), keep counting rather than break.
  const ok = await allow(env.COUNTER_DB, "counter", await visitorCode(request), 30, 60 * 60).catch(() => true);
  if (!ok) return read(env);
  const row = await env.COUNTER_DB.prepare(
    "INSERT INTO counters (name, value) VALUES ('readings', 1) ON CONFLICT(name) DO UPDATE SET value = value + 1 RETURNING value",
  ).first<{ value: number }>();
  return json({ count: row?.value ?? 0 });
};
