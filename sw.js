const CACHE_NAME = "sanctuary-v5";

// ✅ Only important lightweight files (safe cache)
const STATIC_ASSETS = [
  "index.html",
  "songs.html",
  "prayers.html",
  "myprayer.html",
  "manifest.json",
  "logo.png"
];

// 🔥 INSTALL (cache core files)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 🔥 ACTIVATE (clean old cache)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 🔥 FETCH (smart caching strategy)
self.addEventListener("fetch", event => {
  const request = event.request;

  // 🎯 For media files (audio/video) → dynamic caching
  if (request.url.includes(".mp3") || request.url.includes(".mp4")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return fetch(request)
          .then(response => {
            cache.put(request, response.clone()); // save for offline later
            return response;
          })
          .catch(() => caches.match(request)); // offline fallback
      })
    );
    return;
  }

  // 🎯 For normal files → cache first
  event.respondWith(
    caches.match(request).then(response => {
      return (
        response ||
        fetch(request).catch(() => {
          // 🔥 Offline fallback message
          return new Response(
            "📴 Offline 😔 இணையம் இல்லை... ஆனால் நீங்கள் சேமித்த ஜெபங்கள் கிடைக்கும் 🙏",
            {
              headers: { "Content-Type": "text/plain" }
            }
          );
        })
      );
    })
  );
});
