// Enhanced Service Worker for ESL Fun Online
// Version 2.1 - Performance Optimized

const CACHE_NAME = "eslfunonline-v2.1";
const STATIC_CACHE = "eslfunonline-static-v2.1";
const DYNAMIC_CACHE = "eslfunonline-dynamic-v2.1";

// PERFORMANCE OPTIMIZATION: Extended cache times
const CACHE_STRATEGIES = {
  // Long-term cache for static assets (1 year)
  STATIC_ASSETS: {
    name: STATIC_CACHE,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    strategy: "CacheFirst",
  },

  // Medium-term cache for CSS/JS (1 month)
  STYLES_SCRIPTS: {
    name: STATIC_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
    strategy: "StaleWhileRevalidate",
  },

  // Short-term cache for HTML (1 week)
  PAGES: {
    name: DYNAMIC_CACHE,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    strategy: "NetworkFirst",
  },

  // Image optimization cache (6 months)
  IMAGES: {
    name: STATIC_CACHE,
    maxAge: 6 * 30 * 24 * 60 * 60 * 1000, // 6 months
    strategy: "CacheFirst",
  },
};

// Define what to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/css/critical-inline.css",
  "/css/main.css",
  "/css/header.css",
  "/js/navigation.js",
  "/images/logo-optimized.png",
  "/images/hero.webp",
  "/site.webmanifest",
];

// Install event - cache critical resources
self.addEventListener("install", (event) => {
  console.log("Service Worker: Install event");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching critical assets");
        // Cache critical assets with error handling
        return Promise.allSettled(
          STATIC_ASSETS.map((asset) =>
            cache.add(asset).catch((err) => {
              console.warn(`Failed to cache ${asset}:`, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log("Service Worker: Critical assets cached");
        // Force activation of new service worker
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error("Service Worker: Install failed", err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate event");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old cache versions
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName.startsWith("eslfunonline-")
            ) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Cache cleanup complete");
        // Take control of all clients
        return self.clients.claim();
      })
      .catch((err) => {
        console.error("Service Worker: Activation failed", err);
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== "GET" || url.protocol === "chrome-extension:") {
    return;
  }

  // Determine caching strategy based on resource type
  if (isStaticAsset(url)) {
    event.respondWith(
      cacheFirstStrategy(request, CACHE_STRATEGIES.STATIC_ASSETS)
    );
  } else if (isStyleOrScript(url)) {
    event.respondWith(
      staleWhileRevalidateStrategy(request, CACHE_STRATEGIES.STYLES_SCRIPTS)
    );
  } else if (isImage(url)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_STRATEGIES.IMAGES));
  } else if (isPage(url)) {
    event.respondWith(networkFirstStrategy(request, CACHE_STRATEGIES.PAGES));
  } else {
    // Default strategy for other resources
    event.respondWith(networkFirstStrategy(request, CACHE_STRATEGIES.PAGES));
  }
});

// Cache-First Strategy (for static assets)
async function cacheFirstStrategy(request, cacheConfig) {
  try {
    const cache = await caches.open(cacheConfig.name);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Check if cache is still valid
      const cacheTime = await getCacheTime(cache, request);
      if (cacheTime && Date.now() - cacheTime < cacheConfig.maxAge) {
        return cachedResponse;
      }
    }

    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      await setCacheTime(cache, request);
    }

    return networkResponse;
  } catch (error) {
    console.error("Cache-First strategy failed:", error);
    // Try to return cached version even if expired
    const cache = await caches.open(cacheConfig.name);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Network-First Strategy (for HTML pages)
async function networkFirstStrategy(request, cacheConfig) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheConfig.name);
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      await setCacheTime(cache, request);
    }

    return networkResponse;
  } catch (error) {
    console.warn("Network failed, trying cache:", error);
    const cache = await caches.open(cacheConfig.name);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Stale-While-Revalidate Strategy (for CSS/JS)
async function staleWhileRevalidateStrategy(request, cacheConfig) {
  const cache = await caches.open(cacheConfig.name);
  const cachedResponse = await cache.match(request);

  // Start network request (don't await)
  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const responseClone = response.clone();
        cache.put(request, responseClone);
        setCacheTime(cache, request);
      }
      return response;
    })
    .catch((error) => {
      console.warn("Background fetch failed:", error);
      return null;
    });

  // Return cached version immediately if available
  if (cachedResponse) {
    // Don't block on network update
    networkResponsePromise.catch(() => {});
    return cachedResponse;
  }

  // If no cache, wait for network
  return networkResponsePromise;
}

// Utility functions for resource type detection
function isStaticAsset(url) {
  return (
    url.pathname.match(/\.(woff2?|ttf|eot|ico|manifest)$/i) ||
    url.pathname === "/site.webmanifest"
  );
}

function isStyleOrScript(url) {
  return (
    url.pathname.match(/\.(css|js)$/i) ||
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "cdnjs.cloudflare.com"
  );
}

function isImage(url) {
  return url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/i);
}

function isPage(url) {
  return (
    url.pathname.match(/\.(html?)$/i) ||
    (!url.pathname.includes(".") && url.pathname.endsWith("/")) ||
    url.pathname === "/"
  );
}

// Cache timestamp management
async function setCacheTime(cache, request) {
  const timeKey = `${request.url}_timestamp`;
  const timeResponse = new Response(Date.now().toString());
  await cache.put(timeKey, timeResponse);
}

async function getCacheTime(cache, request) {
  const timeKey = `${request.url}_timestamp`;
  const timeResponse = await cache.match(timeKey);
  if (timeResponse) {
    const timeText = await timeResponse.text();
    return parseInt(timeText, 10);
  }
  return null;
}

// Background sync for offline support
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync event");

  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Implement background synchronization logic here
    console.log("Service Worker: Performing background sync");

    // Example: Sync offline form submissions
    // const offlineData = await getOfflineData();
    // await syncOfflineData(offlineData);
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// Push notification support
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push event received");

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/images/logo-optimized.png",
      badge: "/images/logo-optimized.png",
      data: data.url ? { url: data.url } : null,
      actions: [
        {
          action: "open",
          title: "Open App",
        },
        {
          action: "close",
          title: "Close",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification click event");

  event.notification.close();

  if (event.action === "open" || !event.action) {
    const url = event.notification.data?.url || "/";

    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }

        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// Message handling for cache management
self.addEventListener("message", (event) => {
  console.log("Service Worker: Message received:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CACHE_UPDATE") {
    event.waitUntil(updateCache());
  }
});

// Force cache update
async function updateCache() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    await Promise.all(
      STATIC_ASSETS.map((asset) =>
        fetch(asset)
          .then((response) => {
            if (response.ok) {
              return cache.put(asset, response.clone());
            }
          })
          .catch((err) =>
            console.warn(`Failed to update cache for ${asset}:`, err)
          )
      )
    );
    console.log("Service Worker: Cache updated successfully");
  } catch (error) {
    console.error("Service Worker: Cache update failed:", error);
  }
}
