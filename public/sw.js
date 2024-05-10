const version = "v1:";

// Define cache names
const staticCacheName = `${version}:appstatic`;
const dynamicCacheName = `${version}:appdynamic`;
const pagesCacheName = `${version}:apppages`;

const assets = [
  "/data/cards.new.ts",
  "/data/giftcards.ts",
  "/data/oldCards.ts",
  "logo.svg",
  "/data/transactions.ts",
];

// Install Service Worker
self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", async (event) => {
  // Remove old caches
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
  event.waitUntil(self.clients.claim());
});

// Fetch event
self.addEventListener("fetch", async (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Serve from cache or fetch from network
  event.respondWith(
    caches
      .match(request, {
        ignoreVary: true,
      })
      .then(async (cacheResponse) => {
        const fetchDirectly = async () => {
          // If not in cache, fetch from network
          try {
            const networkResponse = await fetch(request);

            // Cache dynamic assets
            if (url.pathname.startsWith("/api/")) {
              const dynamicCache = await caches.open(dynamicCacheName);
              dynamicCache.put(request, networkResponse.clone());
            }

            // Cache js assets
            if (
              url.pathname.includes(".png") ||
              url.pathname.includes(".jpg") ||
              url.pathname.includes(".svg") ||
              url.pathname.startsWith("/_next/image")
            ) {
              const staticCache = await caches.open(staticCacheName);
              staticCache.put(request, networkResponse.clone());
            }

            // // For pages, cache separately for offline navigation
            if (
              request.mode === "navigate" ||
              (request.method === "GET" &&
                request.headers.get("accept").includes("text/html"))
            ) {
              const pagesCache = await caches.open(pagesCacheName);
              pagesCache.put(request, networkResponse.clone());
            }

            return networkResponse;
          } catch (error) {
            // Handle fetch errors here
            console.log("COULD NOT CACHE REQUEST: ", error);
          }
        };

        // If cache hit, return cached response
        if (cacheResponse) {
          return cacheResponse;
        }
        await fetchDirectly();
      })
  );
});

self.addEventListener("push", (event) => {
  const title = event.data.title;
  const options = {
    body: event.data.body,
    icon: event.data.icon || "/greatexc.svg",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// for when a notification pops up user clicks it, it should take user to our app and open up the path we want them to access
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  var fullPath = self.location.origin + event.notification.data.path;
  clients.openWindow(fullPath);
});

// Add an event listener for the `sync` event in your service worker.
self.addEventListener("sync", (event) => {
  // Check for correct tag on the sync event.
  if (event.tag === "database-sync") {
    // Execute the desired behavior with waitUntil().
    event.waitUntil(
      // This is just a hypothetical function for the behavior we desire.
      pushLocalDataToDatabase()
    );
  }
});

const pushLocalDataToDatabase = async () => {
  try {
    console.log("REFRESH DATABASE SYNC");
  } catch (error) {
    console.log("PUSH DATABASE TO SERVER FAILED", error);
  }
};
