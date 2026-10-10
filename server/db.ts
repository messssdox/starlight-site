// Minimal types for Cloudflare's D1 database, so the server code reads clearly without extra packages.
export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}
export interface D1Database {
  prepare(sql: string): D1Statement;
}

/** Everything the site's server functions can see. Set these in Cloudflare: Workers & Pages > starlight > Settings. */
export interface Env {
  /** The D1 database (the binding is still called COUNTER_DB from when it only held the counter). */
  COUNTER_DB: D1Database;
  /** The password for /admin. Add it as a secret in Cloudflare; at least 12 characters. */
  ADMIN_PASSWORD?: string;
}

export interface Context {
  request: Request;
  env: Env;
}

export const json = (body: unknown, status = 200, cache = "no-store") =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": cache } });
