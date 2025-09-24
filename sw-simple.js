// Simple Service Worker for ESL Fun Online - Performance Optimization
const CACHE_NAME = "esl-fun-v1.2";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Resources to cache immediately
const STATIC_RESOURCES = [
  "/",
  "/index.html",
  "/css/header.css",
  "/css/main.css",
  "/js/navigation.js",
  "/images/hero.webp",
  "/images/logo-optimized.png",
];

// Install event - cache static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with fallback
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests and external resources we don't want to cache
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("facebook")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available and not expired
      if (response) {
        const cachedDate = new Date(response.headers.get("date"));
        const now = new Date();

        // If cache is fresh (less than 7 days), use it
        if (now - cachedDate < CACHE_DURATION) {
          return response;
        }
      }

      // Otherwise fetch from network and cache
      return fetch(event.request)
        .then((response) => {
          // Don't cache error responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Cache successful responses
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache anyway
          return (
            response ||
            new Response("Offline content not available", {
              status: 503,
              statusText: "Service Unavailable",
            })
          );
        });
    })
  );
});
