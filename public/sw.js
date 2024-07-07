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
});

self.addEventListener("push", function (event) {
  if (event.data) {
    console.log("This push event has data: ", event.data.text());
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: data.icon,
      data: data.data, // This allows you to access the data when the notification is clicked
    };

    console.log("[SW.JS registration", self.registration);

    return event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } else {
    console.log("This push event has no data.");
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click: ", event);

  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});
