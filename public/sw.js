// Starlight's service worker: lets the installed app open quickly and show
// pages you've already visited when there's no signal.
// Pages always try the internet first, so visitors never see an old version
// while they're online. Change VERSION to clear everything saved on phones.
const VERSION = "v1";
const PAGES = `starlight-pages-${VERSION}`;
const FILES = `starlight-files-${VERSION}`;
const OFFLINE = "/offline/";
const PRECACHE = ["/", OFFLINE, "/favicon.svg", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(PAGES).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== PAGES && k !== FILES).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Keep a cache from growing forever by dropping its oldest entries.
async function trim(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (const key of keys.slice(0, Math.max(0, keys.length - max))) await cache.delete(key);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Only our own site, and never the live counter, messages or admin.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin")) return;

  if (req.mode === "navigate") {
    // Pages: internet first, saved copy if offline, then the offline page.
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy)).then(() => trim(PAGES, 40));
          }
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match(OFFLINE)) || Response.error()),
    );
    return;
  }

  if (url.pathname.startsWith("/_astro/") || url.pathname.startsWith("/icons/") || url.pathname.startsWith("/animals/")) {
    // Styles, scripts and pictures: these never change once built, so use the saved copy.
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(FILES).then((c) => c.put(req, copy)).then(() => trim(FILES, 120));
            }
            return res;
          }),
      ),
    );
  }
});
