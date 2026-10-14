// SELF-UNREGISTERING SERVICE WORKER
// This unregisters itself and clears all caches

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    Promise.all([
      // Clear all caches
      caches.keys().then((names) =>
        Promise.all(names.map((name) => caches.delete(name)))
      ),
      // Unregister self
      self.registration.unregister().then(() => {
        console.log("Service Worker unregistered");
      }),
    ]).then(() => {
      // Reload all clients
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.navigate(client.url));
      });
    })
  );
});

// Pass-through fetch (no interception)
self.addEventListener("fetch", (e) => {
  // Do nothing — let browser handle normally
});