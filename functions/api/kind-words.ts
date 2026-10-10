// The "Kind words" wall: only praise the sender agreed to share AND the site owner approved.
//   GET /api/kind-words  -> { words: [{ name, starSign, message, date }] }
// Only a first name, star sign, message and date leave the server. Emails never do.
import { json, type Context } from "../../server/db.ts";
import { publicName } from "../../server/thoughts.ts";

interface Row { first_name: string; star_sign: string; body: string; approved_at: string }

export const onRequestGet = async ({ env }: Context) => {
  const { results } = await env.COUNTER_DB.prepare(
    `SELECT first_name, star_sign, body, approved_at FROM messages
     WHERE kind = 'praise' AND show_publicly = 1 AND status = 'approved'
     ORDER BY approved_at DESC LIMIT 60`,
  ).all<Row>();
  const words = results.map((r) => ({ name: publicName(r.first_name), starSign: r.star_sign, message: r.body, date: r.approved_at.slice(0, 10) }));
  return json({ words }, 200, "public, max-age=60");
};
