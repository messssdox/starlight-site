// The site owner's inbox, used by the /admin page. Every request needs the ADMIN_PASSWORD.
//   GET  /api/admin/messages                      -> { messages: [...] } newest first
//   POST /api/admin/messages { id, action }       -> action is approve | hide | read | delete
import { json, type Context } from "../../../server/db.ts";
import { requireAdmin } from "../../../server/admin.ts";

export const onRequestGet = async ({ request, env }: Context) => {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  const { results } = await env.COUNTER_DB.prepare(
    `SELECT id, created_at, kind, email, first_name, star_sign, body, show_publicly, status, approved_at
     FROM messages ORDER BY id DESC LIMIT 500`,
  ).all();
  return json({ messages: results });
};

const ACTIONS: Record<string, string> = {
  // Only praise the sender agreed to share can go on the wall.
  approve: "UPDATE messages SET status = 'approved', approved_at = datetime('now') WHERE id = ? AND kind = 'praise' AND show_publicly = 1",
  hide: "UPDATE messages SET status = 'hidden', approved_at = NULL WHERE id = ?",
  read: "UPDATE messages SET status = 'read' WHERE id = ? AND status = 'new'",
  delete: "DELETE FROM messages WHERE id = ?",
};

export const onRequestPost = async ({ request, env }: Context) => {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  let body: { id?: unknown; action?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Expected JSON." }, 400);
  }
  const id = Number(body?.id);
  const sql = typeof body?.action === "string" ? ACTIONS[body.action] : undefined;
  if (!Number.isInteger(id) || id < 1 || !sql) return json({ error: "Unknown message or action." }, 400);
  await env.COUNTER_DB.prepare(sql).bind(id).run();
  return json({ ok: true });
};
