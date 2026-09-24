const CACHE_NAME = "capycalculus-v8";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js",
  "./game-content.js",
  "./activity-generator.js",
  "./course-context.js",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/mascote/capi-neutral.png",
  "./assets/mascote/capi-thinking.png",
  "./assets/mascote/capi-hint.png",
  "./assets/mascote/capi-happy.png",
  "./assets/mascote/capi-celebrate.png",
  "./assets/mascote/capi-encourage.png",
  "./assets/mascote/capi-review.png",
  "./assets/mascote/capi-focus.png",
  "./assets/illustrations/chain-rule.png",
  "./assets/badges/badge-01.png",
  "./assets/badges/badge-02.png",
  "./assets/badges/badge-03.png",
  "./assets/badges/badge-04.png",
  "./assets/badges/badge-05.png",
  "./assets/badges/badge-06.png",
  "./assets/badges/badge-07.png",
  "./assets/badges/badge-08.png",
  "./assets/badges/badge-09.png",
  "./assets/badges/badge-10.png",
  "./assets/badges/badge-11.png",
  "./assets/badges/badge-12.png",
  "./assets/scenarios/module-01.png",
  "./assets/scenarios/module-02.png",
  "./assets/scenarios/module-03.png",
  "./assets/scenarios/module-04.png",
  "./assets/scenarios/module-05.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) return;
  if (/\.(?:pdf|docx|md)$/i.test(requestUrl.pathname)) return;
  if ((event.request.headers.get("Accept") || "").includes("application/pdf")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
  );
});
