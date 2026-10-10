// "Share your thoughts": receives praise, feedback and contact messages and stores them in D1.
//   POST /api/thoughts  (JSON from the page, or a plain form post when JavaScript is off)
// Spam protection: a hidden honeypot box, a "sent too fast" check, and at most 5 messages per hour per visitor.
// Messages are only ever read on the password-protected /admin page; emails are never shown publicly.
import { json, type Context } from "../../server/db.ts";
import { allow, visitorCode } from "../../server/rate-limit.ts";
import { looksLikeABot, validateSubmission } from "../../server/thoughts.ts";

const PER_HOUR = 5;

export const onRequestPost = async ({ request, env }: Context) => {
  const wantsJson = (request.headers.get("content-type") ?? "").includes("application/json");
  const reply = (ok: boolean, message: string, status = 200) =>
    wantsJson
      ? json(ok ? { ok, message } : { ok, error: message }, status)
      : Response.redirect(new URL(ok ? "/thoughts/thanks" : "/thoughts/oops", request.url).toString(), 303);

  let raw: Record<string, unknown>;
  try {
    raw = wantsJson ? await request.json() : Object.fromEntries(await request.formData());
  } catch {
    return reply(false, "Sorry, that message couldn't be read. Please try again.", 400);
  }
  if (!raw || typeof raw !== "object") return reply(false, "Sorry, that message couldn't be read. Please try again.", 400);

  // Bots get a cheerful "thanks" so they don't learn anything, but nothing is saved.
  if (looksLikeABot(raw)) return reply(true, "Thank you, your message has been sent.");

  const result = validateSubmission(raw);
  if (!result.ok) return reply(false, result.error, 400);

  if (!(await allow(env.COUNTER_DB, "thoughts", await visitorCode(request), PER_HOUR, 60 * 60))) {
    return reply(false, "You've sent a few messages already. Please try again in an hour.", 429);
  }

  const s = result.value;
  await env.COUNTER_DB.prepare(
    "INSERT INTO messages (kind, email, first_name, star_sign, body, show_publicly) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(s.kind, s.email, s.firstName, s.starSign, s.message, s.showPublicly ? 1 : 0)
    .run();

  return reply(true, s.showPublicly ? "Thank you! Your kind words will appear on the wall once they've been approved." : "Thank you, your message has been sent.");
};
