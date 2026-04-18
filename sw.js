const CACHE_NAME = 'sanctuary-cache-v1';
const assetsToCache = [
  '/',
  'index.html',
  'myprayer.html',
  'prayers.html',
  'songs.html',
  'logo.svg'
];

// Install the service worker and cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Serve files from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});