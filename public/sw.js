const CACHE_NAME = "macrolift-shell-v1";
const BASE_PATH = new URL(self.registration.scope).pathname;
const fromBase = (path) => `${BASE_PATH}${path}`.replace(/\/{2,}/g, "/");
const APP_SHELL = [
  BASE_PATH,
  fromBase("index.html"),
  fromBase("manifest.webmanifest"),
  fromBase("favicon.svg"),
  fromBase("apple-touch-icon.png"),
  fromBase("icons/icon-192.png"),
  fromBase("icons/icon-512.png"),
  fromBase("icons/maskable-512.png"),
  fromBase("icons/macrolift-icon.svg"),
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match(fromBase("index.html")))),
  );
});
