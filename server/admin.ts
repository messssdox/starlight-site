// Checks the /admin password. The password lives in Cloudflare as the ADMIN_PASSWORD secret,
// is sent by the admin page as "Authorization: Bearer <password>", and repeated wrong guesses are slowed down.
import { json, type Env } from "./db.ts";
import { allow, isOver, visitorCode } from "./rate-limit.ts";

const MIN_LENGTH = 12;
const FAIL_LIMIT = 10; // wrong passwords…
const FAIL_WINDOW = 15 * 60; // …per 15 minutes

async function sameText(a: string, b: string) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(a)), crypto.subtle.digest("SHA-256", enc.encode(b))]);
  const ax = new Uint8Array(x), by = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < ax.length; i++) diff |= ax[i] ^ by[i];
  return diff === 0;
}

/** Returns null when the request may continue, or the Response to send back instead. */
export async function requireAdmin(request: Request, env: Env): Promise<Response | null> {
  const password = env.ADMIN_PASSWORD ?? "";
  if (password.length < MIN_LENGTH) {
    return json({ error: `The admin password isn't set up yet. Add an ADMIN_PASSWORD secret (${MIN_LENGTH}+ characters) in Cloudflare.` }, 503);
  }
  const visitor = await visitorCode(request);
  if (await isOver(env.COUNTER_DB, "admin-fail", visitor, FAIL_LIMIT, FAIL_WINDOW)) {
    return json({ error: "Too many wrong passwords. Please wait 15 minutes and try again." }, 429);
  }
  const given = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!given || !(await sameText(given, password))) {
    await allow(env.COUNTER_DB, "admin-fail", visitor, FAIL_LIMIT, FAIL_WINDOW);
    return json({ error: "That password isn't right." }, 401);
  }
  return null;
}
