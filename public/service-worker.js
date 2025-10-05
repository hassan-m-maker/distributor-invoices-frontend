// public/service-worker.js
const CACHE_NAME = 'distributor-invoices-v1';
const FALLBACK_HTML = '/index.html';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  // cache the shell (index.html). Other assets will be cached on first load (runtime).
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([FALLBACK_HTML]))
  );
});

self.addEventListener('activate', (event) => {
  // take control immediately
  event.waitUntil(
    (async () => {
      await clients.claim();
      // optional: delete old caches (simple strategy)
      const keys = await caches.keys();
      await Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  // HTML navigations -> network first, fallback to cached index.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // update cache with the latest index.html
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(FALLBACK_HTML, copy));
          return res;
        })
        .catch(() => caches.match(FALLBACK_HTML))
    );
    return;
  }

  // For other requests: try cache first, then network; if network succeed, put in cache.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // only cache successful responses
          if (!res || res.status !== 200 || res.type === 'opaque') return res;
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(req, resClone).catch(() => {});
          });
          return res;
        })
        .catch(() => {
          // fallback: if request is for an image, you could return a fallback image here
          return caches.match(FALLBACK_HTML);
        });
    })
  );
});
