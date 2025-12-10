const CACHE_NAME = 'calc-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cachedRes => {
      if (cachedRes) return cachedRes;
      return fetch(evt.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          // put a copy in cache (optional)
          try { cache.put(evt.request, fetchRes.clone()); } catch(e){}
          return fetchRes;
        });
      }).catch(()=> {
        // fallback for navigation requests
        if (evt.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
