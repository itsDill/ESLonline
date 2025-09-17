/**
 * Service Worker for ESL Fun Online Games
 * Provides offline support and caching for game resources
 */

const CACHE_NAME = "esl-games-v1.0.0";
const STATIC_RESOURCES = [
  "/games/games.html",
  "/css/game-ads.css",
  "/js/game-ads.js",
  "/css/header.css",
  "/css/main.css",
  "/images/1.png",
  "/images/image copy 12.png",
  "/images/image copy 2.png",
  "/images/image copy 10.png",
];

// Install event - cache static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching static resources");
        return cache.addAll(STATIC_RESOURCES);
      })
      .catch((error) => {
        console.error("Cache installation failed:", error);
      })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip external requests (like Google Ads)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Try to fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline fallback for HTML pages
          if (event.request.destination === "document") {
            return caches.match("/offline.html");
          }

          // Return offline fallback for images
          if (event.request.destination === "image") {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666">Offline</text></svg>',
              { headers: { "Content-Type": "image/svg+xml" } }
            );
          }
        });
    })
  );
});

// Background sync for analytics (when online)
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync any pending analytics data when online
  try {
    const pendingData = await getStoredAnalytics();
    if (pendingData.length > 0) {
      await sendAnalytics(pendingData);
      await clearStoredAnalytics();
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

async function getStoredAnalytics() {
  // Get analytics data from IndexedDB
  return [];
}

async function sendAnalytics(data) {
  // Send analytics data to server
  return Promise.resolve();
}

async function clearStoredAnalytics() {
  // Clear sent analytics data
  return Promise.resolve();
}

// Push notifications (for future use)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: "/images/1.png",
      badge: "/images/1.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url,
      },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});

// Message handler for communication with main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
