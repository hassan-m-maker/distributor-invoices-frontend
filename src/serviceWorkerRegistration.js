// ✅ Service Worker Registration with Auto-Cleanup
// This prevents IndexedDB and cache issues after updates

const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

export function register(config) {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(swUrl)
        .then(async (registration) => {
          console.log("Service worker registered ✅");

          // ✅ Force update when a new version is found
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }

          // ✅ Clean old caches automatically
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map((name) => {
              if (!name.includes("invoices")) {
                return caches.delete(name);
              }
              return null;
            })
          );

          // ✅ Reload when new service worker takes control
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            window.location.reload();
          });
        })
        .catch((err) =>
          console.error("Service worker registration failed:", err)
        );
    });
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister().then(() => {
          console.log("Service worker unregistered ❌");
        });
      })
      .catch((error) => {
        console.error("Service worker unregister failed:", error);
      });
  }
}
