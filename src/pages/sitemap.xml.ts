// The sitemap search engines read: every public page on mystarlight.uk.
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// Public pages. /admin and the thank-you/oops pages after a form are left out on purpose.
const PAGES = ["/", "/reading/", "/numerology/", "/library/", "/glossary/", "/thoughts/", "/support/", "/credits/"];

export const GET: APIRoute = async ({ site }) => {
  const articles = await getCollection("library");
  const paths = [...PAGES, ...articles.map((a) => `/library/${a.id}/`)];
  const urls = paths.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
};
