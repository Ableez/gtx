const version = "v1:";
const cacheNames = {
  assets: `${version}assets`,
  pages: `${version}pages}`,
  requests: `${version}requests`,
};

const cacheLimits = {
  pages: 150,
  requests: 150,
};

// Function to trim cache based on specified limit
async function trimCache(cacheName, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > limit) {
    for (let i = 0; i < keys.length - limit; i++) {
      if (keys[i]) await cache.delete(keys[i]);
    }
  }
}

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

// Install event: Cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheNames.assets).then((cache) => {
      console.log("Adding all caches");
      return cache.addAll([
        // Add more essential assets here
      ]);
    })
  );
});

// Activate event: Cleanup old caches
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(self.clients.claim());
});

// Fetch event: Serve assets from cache or network
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Determine cache strategy based on request destination
  if (url.origin === location.origin) {
    // Serve assets from cache
    if (url.pathname.startsWith("/images/")) {
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          return cachedResponse ?? fetch(request);
        })
      );
    }

    // Serve podcast episodes from cache with trimming
    else if (url.pathname.startsWith("/api")) {
      event.respondWith(
        caches.open(cacheNames.requests).then(async (cache) => {
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          } else {
            const networkResponse = await fetch(request);
            void cache.put(request, networkResponse.clone());
            void trimCache(cacheNames.requests, cacheLimits.requests);
            void cache.put(request, networkResponse);
            return networkResponse;
          }
        })
      );
    }
  }
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
    fetch("/api");
  } catch (error) {
    console.log("PUSH DATABASE TO SERVER FAILED", error);
  }
};
