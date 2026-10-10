// The Cloudflare Worker in front of the site. Requests to /api/* go to the
// handlers in functions/api/ (written in the Cloudflare Pages style); every
// other request is served from the built site in ./dist.
import * as counter from "../functions/api/counter";

type Handler = (context: PagesContext) => Response | Promise<Response>;
type HandlerModule = Partial<Record<"onRequest" | "onRequestGet" | "onRequestPost" | "onRequestPut" | "onRequestDelete" | "onRequestPatch", Handler>>;

interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  data: Record<string, unknown>;
  waitUntil(promise: Promise<unknown>): void;
  next(): Promise<Response>;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  [binding: string]: unknown;
}

// One line per API route. Add new handlers from functions/api/ here.
const routes: Record<string, HandlerModule> = {
  "/api/counter": counter,
};

const METHOD_EXPORT: Record<string, keyof HandlerModule> = {
  GET: "onRequestGet",
  HEAD: "onRequestGet",
  POST: "onRequestPost",
  PUT: "onRequestPut",
  DELETE: "onRequestDelete",
  PATCH: "onRequestPatch",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default {
  async fetch(request: Request, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    if (!path.startsWith("/api/")) return env.ASSETS.fetch(request);

    const mod = routes[path];
    if (!mod) return json(404, { error: "Not found" });
    const handler = mod[METHOD_EXPORT[request.method] ?? "onRequest"] ?? mod.onRequest;
    if (!handler) return json(405, { error: "Method not allowed" });

    try {
      return await handler({
        request,
        env,
        params: {},
        data: {},
        waitUntil: (p) => ctx.waitUntil(p),
        next: () => env.ASSETS.fetch(request),
      });
    } catch (err) {
      // Most often the database isn't connected yet (no COUNTER_DB binding).
      console.error(err);
      return json(503, { error: "This feature isn't switched on yet." });
    }
  },
};
